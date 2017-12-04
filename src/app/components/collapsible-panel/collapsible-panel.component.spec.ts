import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsiblePanelComponent } from './collapsible-panel.component';

describe('CollapsiblePanelComponent', () => {
  let component: CollapsiblePanelComponent;
  let fixture: ComponentFixture<CollapsiblePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsiblePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsiblePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
