import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './local-storage.service';

export { LocalStorageService };

@NgModule({
  imports: [ CommonModule ],
  declarations: [],
  providers: [],
})
export class SimpleServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SimpleServicesModule,
      providers: [
        LocalStorageService,
      ],
    };
  }
}
