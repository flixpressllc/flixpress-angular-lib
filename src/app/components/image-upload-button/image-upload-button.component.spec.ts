import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadButtonComponent } from './image-upload-button.component';

describe('ImageUploadButtonComponent', () => {
  let component: ImageUploadButtonComponent;
  let fixture: ComponentFixture<ImageUploadButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
