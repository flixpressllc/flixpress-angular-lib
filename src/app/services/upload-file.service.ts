import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadFileService {

  uploadImageApiEndpoint = `http://localhost:4200/uploads-that-are-not-there`;

  constructor(private http: HttpClient) {
  }

  private postForm(formData: FormData): Observable<any> {
    return this.http.post(this.uploadImageApiEndpoint, formData);
  }

  uploadFile(file: Blob | File, optionalFormKey?): Observable<any> {
    const formKey = optionalFormKey || 'userfile';
    const fd = new FormData();
    fd.append(formKey, file);
    return this.postForm(fd);
  }
}


