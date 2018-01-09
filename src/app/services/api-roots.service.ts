import { Injectable } from '@angular/core';

@Injectable()
export class ApiRootsService {

  constructor() { }

  makeAuthorizedApiCall(callType?: any, urlRoute?: any, requestData?: any): Promise<any> {
    return Promise.resolve('you made a call');
  }


}
