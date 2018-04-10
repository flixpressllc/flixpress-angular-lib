import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { declarations, imports, providers } from '../app.module';
import { ExamplesComponent } from './examples.component'

describe('ExamplesComponent', () => {
  let component: ExamplesComponent;
  let fixture: ComponentFixture<ExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamplesComponent, ...declarations ],
      imports,
      providers,
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not explode', () => {
    expect(component).toBeTruthy();
  });
});
