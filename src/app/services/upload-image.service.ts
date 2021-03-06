import { Injectable } from '@angular/core';
import { UploadFileService } from './upload-file.service';
import { dataURLtoFile, blobToDataURL, DATA_URL_MIME_MATCHER } from '../lib/fileManipulation';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

interface ImageOptions {
  withoutThumbnail: boolean;
}

@Injectable()
export class UploadImageService {

  constructor(private uf: UploadFileService) { }

  uploadImageBlob(imageBlob: Blob | File, options: ImageOptions = {withoutThumbnail: false}): Observable<any> {
    return this.prepAndUploadImage(imageBlob);
  }

  private prepAndUploadImage (imageBlob: Blob | File) {
    return Observable.fromPromise(
      this.restrictImageUploadSize(imageBlob)
      .then(imageBlob2 => this.uf.uploadFile(imageBlob2, 'originalImage')),
    );
  }

  private restrictImageUploadSize (imageBlob: Blob | File) {
    return blobToDataURL(imageBlob)
      .then(dataUrl => this.resizeImageSourceToDataUrl(dataUrl, 1000))
      .then(smallerDataUrl => {
        if (smallerDataUrl !== false) {
          const name: string | undefined = (imageBlob as File).name;
          return dataURLtoFile(smallerDataUrl, name);
        } else {
          return imageBlob;
        }
      });
  }

  private resizeImageSourceToDataUrl (src, desiredWidth, optionalMime?) {
    return new Promise( resolve => {
      let mimeTypePromise;
      if (optionalMime) {
        mimeTypePromise = Promise.resolve(optionalMime);
      } else {
        mimeTypePromise = this.discoverImageMimeTypeFromSrc(src);
      }

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        if (img.naturalWidth <= desiredWidth) {
          resolve(false);
          return;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = desiredWidth;
        canvas.height = canvas.width * (img.naturalHeight / img.naturalWidth);

        /// step 1
        const oc = document.createElement('canvas'),
            octx = oc.getContext('2d');

        oc.width = img.naturalWidth * 0.5;
        oc.height = img.naturalHeight * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        /// step 2
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
        0, 0, canvas.width, canvas.height);

        mimeTypePromise.then(mimeType => resolve(canvas.toDataURL(mimeType)));
      };
      img.src = src;
    });
  }

  private  discoverImageMimeTypeFromSrc (fileNameOrDataUrl) {
    return new Promise( (resolve, reject) => {
      const firstSeveralChars = fileNameOrDataUrl.slice(0, 16);
      const dataUrlMatch = firstSeveralChars.match(DATA_URL_MIME_MATCHER);
      if ( dataUrlMatch !== null ) {
        resolve(dataUrlMatch[1]);
        return;
      }

      const extensionMatch = fileNameOrDataUrl.match(/\.(jpg|jpeg|png)$/);
      if (extensionMatch !== null) {
        const mime = extensionMatch[1] === 'png' ? 'image/png' : 'image/jpeg';
        resolve(mime);
        return;
      }

      reject(new Error(`no discoverable image mime type in string beginning with ${firstSeveralChars}`));
    });
  }

}
