import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { UploadFileService } from './services/upload-file.service';

import { DynamicHostDirective } from './directives/dynamic-host.directive';

import { TeleprompterModule} from '../modules/teleprompter';
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

@NgModule({
  declarations: [
    AppComponent,
    FileUploadButtonComponent,
    ImageCropperComponent,
    ImageUploadButtonComponent,
    DynamicHostDirective,
    TeleprompterRouteComponent,
    RouteNotFoundComponent,
    ExamplesComponent,
  ],
  entryComponents: [
    ImageCropperComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TeleprompterModule,
    SimpleComponentsModule,
    RouterModule.forRoot(routes, {useHash: false}),
  ],
  providers: [
    UploadFileService,
    RequestsService,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
