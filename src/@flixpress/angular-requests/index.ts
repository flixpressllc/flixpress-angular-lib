import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RequestsService, createApiConfig, API_CONFIG, ApiConfig} from './requests.service';

export { createApiConfig };

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [],
})
export class RequestsModule {
  static forRoot(apiConfig: ApiConfig): ModuleWithProviders {
    return {
      ngModule: RequestsModule,
      providers: [
        {provide: API_CONFIG, useValue: apiConfig},
        RequestsService,
      ],
    };
  }
}

export * from './requests.service';
