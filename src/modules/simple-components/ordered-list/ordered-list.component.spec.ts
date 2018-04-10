import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedListComponent } from './ordered-list.component';

describe('OrderedListComponent', () => {
  let component: OrderedListComponent;
  let fixture: ComponentFixture<OrderedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
