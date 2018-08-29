import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { FlixpressTeleprompterComponent } from './teleprompter.component';
import { PageScrollService } from 'ngx-page-scroll';

@Component({
  selector: 'app-host',
  template: `
    <flix-teleprompter
      [copy]="copy"
      [devMode]="devMode"
      [scrollDuration]="scrollDuration"
    ></flix-teleprompter>
  `,
})
class HostComponent {
  copy: string;
  devMode = false;
  scrollDuration: number;

  @ViewChild(FlixpressTeleprompterComponent) teleprompter: FlixpressTeleprompterComponent;
}

describe('TeleprompterComponent', () => {
  let host: HostComponent;
  let component: FlixpressTeleprompterComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        FlixpressTeleprompterComponent,
      ],
      providers: [
        PageScrollService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    component = host.teleprompter;
    fixture.detectChanges();
  });

  it('should create the component', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should convert double line breaks to `p` tags', async(() => {
    host.copy = 'This is a paragraph.\n\nThis is another.';
    fixture.detectChanges();
  expect(fixture.nativeElement.innerHTML).toContain(/<p>This is a paragraph<\/p>\s*<p>This is another<\/p>/);
  }));
});
