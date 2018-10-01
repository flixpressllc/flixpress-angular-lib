import { Injectable, InjectionToken, isDevMode, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, /*HttpObserve,*/ HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export type CallType = 'get' | 'put' | 'post' | 'delete';
export type ServerResponse = any;
export enum LogLevel {
  Silent = 1,
  Normal,
  Verbose,
}

export interface ApiConfig {
  apiRoot: string;
  tokenEndpoint: string;
  localStorageKeys: {
    accessToken: string;
    [x: string]: string;
  };
  logLevel?: LogLevel;
}

export interface ILocalStorageService {
  setString: (key: string, value: string) => any;
  remove: (key: string) => any;
  resolveString: (key: string) => string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('config.ts');

export const LocalStorageService = new InjectionToken<ILocalStorageService>('any compatible local storage service provider');

export function createApiConfig(
  apiRoot: string,
  tokenEndpoint: string,
  localStorageKeys?: ApiConfig['localStorageKeys'],
): ApiConfig {
  localStorageKeys = localStorageKeys ? localStorageKeys : {accessToken: 'access_token'};

  return {apiRoot, tokenEndpoint, localStorageKeys};
}

interface HttpClientRequestOptions {
  headers?: HttpHeaders;
  // observe?: HttpObserve,
  params?: HttpParams;
  reportProgress?: boolean;
  // responseType?: 'arraybuffer'|'blob'|'json'|'text',
  withCredentials?: boolean;
}

interface AccessTokenResponse {
  access_token: string;
  roles: string[];
}

type RawApiResult = any;

@Injectable()
export class RequestsService {

  private credentialsString: string;
  private _accessToken: string;
  private baseHeaders: HttpHeaders;
  public logLevel: LogLevel = isDevMode() ? LogLevel.Normal : LogLevel.Silent;

  private handleRequestError(err: HttpErrorResponse) {
    if (this.logLevel === LogLevel.Silent) { return; }
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', err.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Server returned code ${err.status}, body was: ${err.error}. See following logged object for more info:`);
      console.error(err);
    }
  }

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private apiConfig: ApiConfig,
    @Optional() @Inject(LocalStorageService) private ls?: ILocalStorageService,
  ) {
    this.setLogLevel(apiConfig.logLevel);
    this.clearLocalToken();
    this.setBaseHeaders();
  }

  setLogLevel(level?: LogLevel) {
    if (level) {
      this.logLevel = level;
    }
  }

  clearLocalToken() {
    this._accessToken = null;
  }

  setCredentials({username, password}) {
    this.credentialsString = `username=${username}&password=${password}&grant_type=password`;
  }

  setBaseHeaders(input?: { label: string, value: string }[]) {
    let baseHeaders = new HttpHeaders();
    if (input) {
      input.forEach(h => baseHeaders = baseHeaders.set(h.label, h.value));
    }
    this.baseHeaders = baseHeaders;
  }

  private getBaseHeaders() {
    return this.baseHeaders;
  }

  clearCredentials() {
    this.setCredentials({username: '', password: ''});
    this.accessToken = null;
  }

  private set accessToken(token: string | null) {
    this._accessToken = token;
    this.updateStoredToken(token);
  }

  private updateStoredToken(token) {
    if (!this.ls) return;
    if (token) {
      this.ls.setString(this.apiConfig.localStorageKeys.accessToken, token);
    } else {
      this.ls.remove(this.apiConfig.localStorageKeys.accessToken);
    }
  }

  private get accessToken(): string | null {
    if (this._accessToken) return this._accessToken;
    this._accessToken = this.getStoredAccessToken();
  }

  private getStoredAccessToken(): string | null {
    if (!this.ls) return null;
    const storedToken = this.ls.resolveString(this.apiConfig.localStorageKeys.accessToken);
    return storedToken === '' ? null : storedToken;
  }

  private getTokenLocallyOrFromServer(): Promise<string> {
    if (this.accessToken) return Promise.resolve(this.accessToken);

    return new Promise((resolve, reject) => {
      if (!this.credentialsString) throw new Error('No credentials were set before requesting token.');
      this.makeFormApiCall('post', this.apiConfig.tokenEndpoint, this.credentialsString).then((res: AccessTokenResponse) => {
        resolve(this.accessToken = res.access_token);
      }, (err) => {
        this.handleRequestError(err);
        reject(err);
      });
    });
  }

  private async getAuthorizedRequestOptions () {
    const accessToken = await this.getTokenLocallyOrFromServer();
    return {
      headers: this.getBaseHeaders()
        .set('Authorization', `Bearer ${accessToken}`),
    };
  }

  private resolveServerCallWithinPromise(serverCall: Observable<any>, resolve, reject, callType, url) {
    const subscription = serverCall.subscribe(
      (data) => {
        if (this.logLevel === LogLevel.Verbose) {
          console.log(`${callType.toUpperCase()} call to ${url} successfully returned:`);
          console.log(data);
        }
        resolve(data);
        subscription.unsubscribe();
      },
      (error) => {
        this.handleRequestError(error);
        reject(error);
        subscription.unsubscribe();
      },
    );
  }

  private makeApiCall(callType: CallType, fullUrl: string, requestData?: any, options: HttpClientRequestOptions = {}) {
    if (!options.headers) {
      options.headers = this.getBaseHeaders();
    }

    switch (callType) {
      case 'get':
        return this.http.get(fullUrl, options);
      case 'put':
        return this.http.put(fullUrl, requestData, options);
      case 'post':
        return this.http.post(fullUrl, requestData, options);
      case 'delete':
        return this.http.delete(fullUrl, options);
    }
  }

  makePublicApiCall(callType: CallType, fullUrl: string, requestData?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall(callType, fullUrl, requestData);
      this.resolveServerCallWithinPromise(observable, resolve, reject, callType, fullUrl);
    });
  }

  makeFormApiCall(callType: CallType, fullUrl: string, requestData?: any): Promise<any> {
    const options = {headers: this.getBaseHeaders().set('Content-Type', 'application/x-www-form-urlencoded')};
    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall(callType, fullUrl, requestData, options);
      this.resolveServerCallWithinPromise(observable, resolve, reject, callType, fullUrl);
    });
  }

  async makeAuthorizedApiCall(callType: CallType, urlRoute: string, requestData?: any): Promise<ServerResponse> {
    const urlRouteIsFullUrl = /^(https?:\/\/|\/)/.test(urlRoute);
    const finalUrl = urlRouteIsFullUrl ? urlRoute : `${this.apiConfig.apiRoot}/${urlRoute}`;
    const options = await this.getAuthorizedRequestOptions();
    options.headers = options.headers.set('Content-Type', 'application/json;charset=utf-8');

    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall(callType, finalUrl, requestData, options);
      this.resolveServerCallWithinPromise(observable, resolve, reject, callType, urlRoute);
    }) as Promise<ServerResponse>;
  }

  async multipartApiCall(settings: {urlRoute: string, requestData: FormData, apiRoot?: string}): Promise<ServerResponse> {
    const root = settings.apiRoot || this.apiConfig.apiRoot;
    const finalUrl = `${root}/${settings.urlRoute}`;
    const options = await this.getAuthorizedRequestOptions();

    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall('post', finalUrl, settings.requestData, options);
      this.resolveServerCallWithinPromise(observable, resolve, reject, 'post', settings.urlRoute);
    }) as Promise<ServerResponse>;
  }
}
