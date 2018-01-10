import { Injectable, isDevMode } from '@angular/core';
import { LocalStorageService, localStorageKeys as keys } from './local-storage.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, /*HttpObserve,*/ HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment as env } from '../../environments/environment';

type CallType = 'get' | 'put' | 'post' | 'delete';

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

@Injectable()
export class RequestsService {

  private readonly apiRoot: string = env.resourceServerRoot;
  private readonly tokenEndpoint = env.authServerRoot + '/token';
  private readonly credentialsString = 'username=User1&password=Aaa000$&grant_type=password';

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
  ) {
    this.localStorageService.remove(keys.accessToken);
  }

  private getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const existingAccessToken = this.localStorageService.resolveString(keys.accessToken);

      if (!existingAccessToken || existingAccessToken === '') {
        this.makeFormApiCall('post', this.tokenEndpoint, this.credentialsString).then((res: AccessTokenResponse) => {
          this.localStorageService.setString(keys.accessToken, res.access_token);
          resolve(res.access_token);
        }, (err) => {
          this.handleRequestError(err);
          reject(err);
        });
      } else {
        resolve(existingAccessToken);
      }
    });
  }

  private async getAuthorizedRequestOptions () {
    const accessToken = await this.getAccessToken();
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${accessToken}`),
    };
  }

  private handleRequestError(err: HttpErrorResponse) {
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

  private resolveServerCallWithinPromise(serverCall: Observable<any>, resolve, reject, callType, url) {
    const subscription = serverCall.subscribe(
      (data) => {
        if (isDevMode()) {
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
      options.headers = new HttpHeaders();
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
    const options = {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')};
    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall(callType, fullUrl, requestData, options);
      this.resolveServerCallWithinPromise(observable, resolve, reject, callType, fullUrl);
    });
  }

  async makeAuthorizedApiCall(callType: CallType, urlRoute: string, requestData?: RawApiEntityRequest): Promise<RawApiResult> {
    const finalUrl = `${this.apiRoot}/${urlRoute}`;
    const options = await this.getAuthorizedRequestOptions();
    options.headers = options.headers.set('Content-Type', 'application/json;charset=utf-8');

    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall(callType, finalUrl, requestData, options);
      this.resolveServerCallWithinPromise(observable, resolve, reject, callType, urlRoute);
    }) as Promise<RawApiResult>;
  }

  async multipartApiCall(urlRoute: string, requestData: FormData): Promise<RawApiResult> {
    const finalUrl = `${this.apiRoot}/${urlRoute}`;
    const options = await this.getAuthorizedRequestOptions();

    return new Promise((resolve, reject) => {
      const observable = this.makeApiCall('post', finalUrl, requestData, options);
      this.resolveServerCallWithinPromise(observable, resolve, reject, 'post', urlRoute);
    }) as Promise<RawApiResult>;
  }
}
