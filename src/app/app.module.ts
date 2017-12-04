import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { UploadFileService } from './services/upload-file.service';
import { ApiRootsService } from './services/api-roots.service';

import { DynamicHostDirective } from './directives/dynamic-host.directive';

import { AnimatedEllipsisComponent } from './components/animated-ellipsis/animated-ellipsis.component';
import { FileUploadButtonComponent } from './components/file-upload-button/file-upload-button.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageUploadButtonComponent } from './components/image-upload-button/image-upload-button.component';
import { ModalComponent } from './components/modal/modal.component';
import { SortableContainerComponent } from './components/sortable-container/sortable-container.component';
import { CollapsiblePanelComponent } from './components/collapsible-panel/collapsible-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AnimatedEllipsisComponent,
    FileUploadButtonComponent,
    ImageCropperComponent,
    ImageUploadButtonComponent,
    ModalComponent,
    SortableContainerComponent,
    CollapsiblePanelComponent,
    DynamicHostDirective
  ],
  entryComponents: [
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    UploadFileService,
    ApiRootsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
