import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyContainerComponent } from './copy-container.component';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-host',
  template: `
    <app-copy-container
      [copy]="copy"
    ></app-copy-container>
  `,
})
class HostComponent {
  copy: string;

  @ViewChild(CopyContainerComponent) copyContainer: CopyContainerComponent;
}

describe('TeleprompterComponent', () => {
  let host: HostComponent;
  let component: CopyContainerComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        CopyContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    component = host.copyContainer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the copy', async(() => {
    host.copy = 'This is the copy.';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('This is the copy.');
  }));

  it('should convert double line breaks to `p` tags', async(() => {
    host.copy = 'This is a paragraph.\n\nThis is another.';
    fixture.detectChanges();
    const paragraphs = fixture.nativeElement.querySelectorAll('p');
    expect(paragraphs.length).toEqual(2);
    expect(paragraphs[0].textContent).toContain('This is a paragraph.');
    expect(paragraphs[1].textContent).toContain('This is another.');
  }));
});
