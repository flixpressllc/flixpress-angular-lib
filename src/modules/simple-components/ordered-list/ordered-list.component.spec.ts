import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { OrderedListComponent } from './ordered-list.component';

@Component({
  selector: 'app-host',
  template:`
    <flixpress-ordered-list #underTest
      [items]="items"
      [orderBy]="orderBy"
    >
      <ng-template let-character>
        {{ character.name }}
      </ng-template>
    </flixpress-ordered-list>
  `,
})
class HostComponent {
  @ViewChild('underTest') underTest: OrderedListComponent
  items: any[] = [
    {name: "Mario", status: "hero"},
    {name: "Bowser", status: "villain"},
  ];
  orderBy: string = "name"
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

  it('should display each item passed in through a template', () => {
    expect(element.textContent).toContain("Mario")
    expect(element.textContent).toContain("Bowser")
  })

  it('should display each item sorted by the given field (name, as string)', () => {
    expect(element.textContent).toMatch(/Bowser[\s\S]*Mario/)
  })

  it('should re-sort when the property changes', () => {
    host.orderBy = "status"
    fixture.detectChanges();
    expect(element.textContent).toMatch(/Mario[\s\S]*Bowser/)
  })

  it('should re-sort when the items change', () => {
    host.items = [{name: 'Peach'}].concat(host.items)
    fixture.detectChanges();
    expect(element.textContent).toMatch(/Bowser[\s\S]*Mario[\s\S]*Peach/)
  })

  it('should sort dates properly', () => {
    host.items = [
      {name: 'Second', date: new Date(2001)},
      {name: 'First', date: new Date(2000)},
    ]
    host.orderBy = 'date';
    fixture.detectChanges();
    expect(element.textContent).toMatch(/First[\s\S]*Second/)
  })

  it('should sort numbers properly', () => {
    host.items = [
      {name: 'Second', num: 2001},
      {name: 'First', num: 2000},
    ]
    host.orderBy = 'num';
    fixture.detectChanges();
    expect(element.textContent).toMatch(/First[\s\S]*Second/)
  })
});
