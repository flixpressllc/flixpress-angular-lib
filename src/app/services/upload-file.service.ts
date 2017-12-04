import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiRootsService } from './api-roots.service';
// import { resizeImageSourceToDataUrl } from './clientComponents/ImageCropper';
import { dataURLtoFile, blobToDataURL, DATA_URL_MIME_MATCHER } from '../lib/fileManipulation';

interface ImageOptions {
  withoutThumbnail: boolean;
}

// Once we are sure what the server responds with every time, we can
// add some real type information here
export type FileUploadData = {
  original: string,
  thumbnail?: string
};

export type FileUploadResponse = [FileUploadData];

@Injectable()
export class UploadFileService {

  uploadImageApiEndpoint: string = `http://localhost:4200/uploads-that-are-not-there`

  constructor(private http: HttpClient) { }

  uploadImageBlob(imageBlob: Blob, options: ImageOptions = {withoutThumbnail: false}): Promise<FileUploadData> {
    return this.prepAndUploadImage(imageBlob)
  }

  private postForm(formData: FormData): Promise<FileUploadData> {
    return new Promise((resolve, reject) => {
      this.http.post(this.uploadImageApiEndpoint, formData)
      .subscribe((data: FileUploadResponse) => {
        resolve(data[0]);
      }, error => {
        reject(error);
      })
    })
  }

  uploadFile(file, optionalFormKey?): Promise<FileUploadData> {
    let formKey = optionalFormKey || 'userfile';
    let fd = new FormData();
    fd.append(formKey, file);
    return this.postForm(fd);
  }

  private prepAndUploadImage (imageBlob) {
    return this.restrictImageUploadSize(imageBlob)
    .then(imageBlob => this.uploadFile(imageBlob, 'originalImage'));
  }

  private restrictImageUploadSize (imageBlob) {
    return blobToDataURL(imageBlob)
      .then(dataUrl => this.resizeImageSourceToDataUrl(dataUrl, 1000))
      .then(smallerDataUrl => {
        if (smallerDataUrl !== false) {
          return dataURLtoFile(smallerDataUrl, imageBlob.name)
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

      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        if (img.naturalWidth <= desiredWidth) {
          resolve(false);
          return;
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = desiredWidth;
        canvas.height = canvas.width * (img.naturalHeight / img.naturalWidth);

        /// step 1
        var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');

        oc.width = img.naturalWidth * 0.5;
        oc.height = img.naturalHeight * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        /// step 2
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
        0, 0, canvas.width, canvas.height);

        mimeTypePromise.then(mimeType => resolve(canvas.toDataURL(mimeType)));
      }
      img.src = src;
    });
  }

  private  discoverImageMimeTypeFromSrc (fileNameOrDataUrl) {
    return new Promise( (resolve, reject) => {
      const firstSeveralChars = fileNameOrDataUrl.slice(0,16);
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
