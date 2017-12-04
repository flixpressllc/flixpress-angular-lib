import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortableContainerComponent } from './sortable-container.component';

describe('SortableContainerComponent', () => {
  let component: SortableContainerComponent;
  let fixture: ComponentFixture<SortableContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortableContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
