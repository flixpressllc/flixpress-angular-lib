import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleprompterRouteComponent } from './teleprompter-route.component';

describe('TeleprompterRouteComponent', () => {
  let component: TeleprompterRouteComponent;
  let fixture: ComponentFixture<TeleprompterRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleprompterRouteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleprompterRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
