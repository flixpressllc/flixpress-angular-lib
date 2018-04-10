import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { OrderedListComponent } from './ordered-list.component';

@Component({
  selector: 'app-host',
  template:`
    <flixpress-ordered-list #underTest
    ></flixpress-ordered-list>
  `,
})
class HostComponent {
  @ViewChild('underTest') underTest: OrderedListComponent
}

describe('OrderedListComponent', () => {
  let component: OrderedListComponent;
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderedListComponent,
        HostComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.componentInstance;
    component = host.underTest;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof OrderedListComponent).toBe(true);
    expect(host instanceof HostComponent).toBe(true);
  });
});
