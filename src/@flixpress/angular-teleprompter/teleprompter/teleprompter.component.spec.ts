import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { FlixpressTeleprompterComponent } from './teleprompter.component';
import { PageScrollService } from 'ngx-page-scroll';
import { CopyContainerComponent } from '../copy-container/copy-container.component';

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
        CopyContainerComponent,
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

  it('should display the copy', async(() => {
    host.copy = 'This is the copy.';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('This is the copy.');
  }));
});
