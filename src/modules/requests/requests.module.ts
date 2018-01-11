import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RequestsService, createApiConfig, API_CONFIG, ApiConfig} from './requests.service';



@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [],
})
export class RequestsModule {
  static forRoot(options: {
    apiRoot,
    tokenEndpoint,
    localStorageKeys?: ApiConfig['localStorageKeys'],
  }) {
    const GIVEN_API_CONFIG = createApiConfig(
      options.apiRoot,
      options.tokenEndpoint,
      options.localStorageKeys,
    );
    return {
      ngModule: RequestsModule,
      providers: [
        {provide: API_CONFIG, useValue: GIVEN_API_CONFIG},
        RequestsService,
      ],
    };
  }
}

export * from './requests.service';
