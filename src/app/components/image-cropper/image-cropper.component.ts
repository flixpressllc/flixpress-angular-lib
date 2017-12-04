import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import CroppingImplementation from '../../lib/wrappers/CroppingImplementation';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {

  visible: boolean = false;
  croppingImplementation: CroppingImplementation

  @Input('image-source') imageSrc: string
  @Output() croppingComplete = new EventEmitter();

  @ViewChild('image') image: ElementRef

  constructor() { }

  ngOnInit() {
    if (this.imageSrc != undefined) {
      this.show();
    }
    this.temporarilyAddStylesUntilCssFilesExist();
  }

  ngAfterViewInit() {
    const image = this.image.nativeElement;
    image.onload = this.handleImageLoaded.bind(this);
  }

  show(): void {
    this.visible = true;
    document.body.className += ' __cropModalOpen';
  }

  hide(): void {
    document.body.className = document.body.className.replace(' __cropModalOpen', '');
    this.visible = false;
  }

  handleImageLoaded(e: Event){
    this.croppingImplementation = new CroppingImplementation(this.image.nativeElement, {aspectRatio: 16/9});
  }

  handleCancel() {
    this.croppingComplete.emit({
      type: 'cancel'
    });
    this.hide();
  }

  handleCrop() {
    const cropData = this.croppingImplementation.getCropData();
    const thumbnailDataUrl = this.croppingImplementation.getCroppedDataUrl({width: 300});
    const thumbnailBlob = this.croppingImplementation.getCroppedBlob({width: 300});
    const thumbnailFile = this.croppingImplementation.getCroppedFile({width: 300});
    const croppedFile = this.croppingImplementation.getCroppedFile();
    this.croppingComplete.emit({
      type: 'crop',
      data: {cropData, thumbnailDataUrl, thumbnailBlob, thumbnailFile, croppedFile}
    });
    this.hide();
  }

  temporarilyAddStylesUntilCssFilesExist () {
    const styleId = 'temporaryImageCropperStyles';
    if (document.querySelector(`#${styleId}`)) return;
    const styles = document.createElement('style');
    styles.setAttribute('id', styleId);
    styles.innerHTML = `
      body.__cropModalOpen {
        overflow: hidden;
      }
    `;

    document.body.appendChild(styles);
    const linkToCropperCss = document.createElement('link');
    linkToCropperCss.setAttribute('rel', 'stylesheet');
    linkToCropperCss.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.min.css');
    document.head.appendChild(linkToCropperCss);
  }


}
