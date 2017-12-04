import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadButtonComponent } from './file-upload-button.component';

describe('FileUploadButtonComponent', () => {
  let component: FileUploadButtonComponent;
  let fixture: ComponentFixture<FileUploadButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
