import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ComponentFactoryResolver, ComponentFactory, AfterViewInit, ViewContainerRef } from '@angular/core';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { BeforeUploadHandler } from '../file-upload-button/file-upload-button.component';
import { blobToDataURL } from '../../lib/fileManipulation';
import { DynamicHostDirective } from '../../dynamic-host.directive';

@Component({
  selector: 'app-image-upload-button',
  templateUrl: './image-upload-button.component.html',
  styleUrls: ['./image-upload-button.component.scss']
})
export class ImageUploadButtonComponent implements OnInit, AfterViewInit {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  defaultButtonText = 'Upload Image';
  @Input('button-text') buttonText: string
  @Input('crop-image') cropImage: boolean = true;
  @Output() uploadComplete = new EventEmitter();

  viewContainerRef: ViewContainerRef
  cropperFactory: ComponentFactory<ImageCropperComponent> =
    this.componentFactoryResolver
    .resolveComponentFactory(ImageCropperComponent);

  @ViewChild(DynamicHostDirective) cropperHost: DynamicHostDirective;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.viewContainerRef = this.cropperHost.viewContainerRef;
  }

  getHandleBeforeUploadFunction(): BeforeUploadHandler {
    return (file: File) => this.handleBeforeUpload(file);
  }

  getButtonText(): string {
    return this.buttonText ? this.buttonText : this.defaultButtonText;
  }

  private createLocalImageFromFile(file: File) {
    let image = new Image();
    return blobToDataURL(file).then(dataUrl => {
      image.src = <string>dataUrl;
      return image;
    });
  }

  private handleBeforeUpload (file: File): Promise<File> {
    if (!this.cropImage) { return Promise.resolve(file); }
    return new Promise(resolve => {
      this.createLocalImageFromFile(file).then(image => {

        this.viewContainerRef.clear();
        const cropperInstance = <ImageCropperComponent> this.viewContainerRef.createComponent(this.cropperFactory).instance;

        cropperInstance.imageSrc = image.src;
        cropperInstance.croppingComplete.subscribe(event => {
          if (event.type === 'crop') {
            resolve(event.data.croppedFile);
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  private handleUploadComplete(event: EmittedEvent): void {
    const {data} = event;
    let type;
    switch (event.type) {
      case 'file uploaded':
        type = 'image uploaded';
      break;
      case 'file upload failure':
        type = 'image upload failure';
      break;
      case 'upload cancelled':
        type = 'image upload cancelled';
      break;
    }
    this.uploadComplete.emit({type, data})
  }

}
