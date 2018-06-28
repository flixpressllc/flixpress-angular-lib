import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { UploadFileService } from './services/upload-file.service';

import { DynamicHostDirective } from './directives/dynamic-host.directive';

import { FlixpressTeleprompterModule} from '../modules/teleprompter';
import { SimpleComponentsModule } from '../modules/simple-components';

import { FileUploadButtonComponent } from './components/file-upload-button/file-upload-button.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageUploadButtonComponent } from './components/image-upload-button/image-upload-button.component';
import { RequestsService } from '../modules/requests';
import { LocalStorageService } from './dumb-services/local-storage.service';
import { TeleprompterRouteComponent } from './routes/teleprompter-route/teleprompter-route.component';
import { RouteNotFoundComponent } from './routes/route-not-found/route-not-found.component';
import { ExamplesComponent } from './examples/examples.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'examples',
    pathMatch: 'full',
  },
  {
    path: 'examples',
    component: ExamplesComponent,
  },
  {
    path: 'teleprompter',
    component: TeleprompterRouteComponent,
  },
  {
    path: '**',
    component: RouteNotFoundComponent,
  },
];

const declarations = [
  FileUploadButtonComponent,
  ImageCropperComponent,
  ImageUploadButtonComponent,
  DynamicHostDirective,
];
const imports = [
  FlixpressTeleprompterModule,
  SimpleComponentsModule,
];
const providers = [
  UploadFileService,
  RequestsService,
  LocalStorageService,
];

@NgModule({
  declarations: [
    AppComponent,
    TeleprompterRouteComponent,
    RouteNotFoundComponent,
    ExamplesComponent,
    ...declarations,
  ],
  entryComponents: [
    ImageCropperComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: false}),
    ...imports,
  ],
  providers: [
    ...providers,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

// Just the things we may need to test that
// the examples do not explode
export {
  declarations,
  imports,
  providers,
}
