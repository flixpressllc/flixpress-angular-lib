import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UploadFileService, FileUploadData } from '../../services/upload-file.service';

export type BeforeUploadHandler = (file: File) => Promise<File>;

@Component({
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.scss']
})
export class FileUploadButtonComponent implements OnInit {

  constructor(private uploadFileService: UploadFileService) { }

  chosenFile?: File
  defaultButtonText = 'Upload File';
  awaitingResponse: boolean = false;

  @ViewChild('cropper') cropper;
  @Output() uploadComplete = new EventEmitter();
  @Input('button-text') buttonText: string
  @Input() accept?: string
  @Input() beforeUpload?: BeforeUploadHandler

  ngOnInit() {
  }

  onClick(e) {
    this.createAndInvokeFileSelector();
  }

  createAndInvokeFileSelector() {
    const input = <HTMLInputElement> document.createElement('input');
    input.type = 'file';
    if (this.accept) {
      input.accept = this.accept;
    }
    input.setAttribute('style', 'display:none;');
    input.onchange = (event) => {
      this.handleChosenFileChange(event);
      document.body.removeChild(input);
    };
    document.body.appendChild(input);
    input.click();
  }

  allowBeforeHook(file: File): Promise<File|false> {
    if (this.beforeUpload) {
      return this.beforeUpload(file);
    } else {
      return Promise.resolve(file);
    }
  }

  handleChosenFileChange(changeEvent) {
    this.setRequestPending();
    const chosenFile = changeEvent.target.files[0];
    const uploadPromise = this.allowBeforeHook(chosenFile)
    .then(file => {
      this.setRequestComplete();
      if (file) {
        this.uploadFile(file).then(this.handleUploadResponse.bind(this))
      } else {
        this.uploadComplete.emit({type: 'upload cancelled', data: null})
      }
    });
  }

  setRequestComplete(): void {
    this.awaitingResponse = false;
  }

  setRequestPending(): void {
    this.awaitingResponse = true;
  }

  uploadFile(file) {
    return this.uploadFileService.uploadFile(file);
  }

  handleUploadResponse(fileUploadResolved: FileUploadData|Error): void {
    if (fileUploadResolved instanceof Error) {
      this.uploadComplete.emit({type: 'file upload failure', data: fileUploadResolved })
    } else {
      this.uploadComplete.emit({type: 'file uploaded', data: fileUploadResolved})
    }
  }

  getButtonText(): string {
    return this.buttonText ? this.buttonText : this.defaultButtonText;
  }

}
