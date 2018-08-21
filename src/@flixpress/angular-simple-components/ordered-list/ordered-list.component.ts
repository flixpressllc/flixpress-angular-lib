import { Component, OnInit, Input, ContentChild, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';

export type SortReturn = -1 | 0 | 1;

@Component({
  selector: 'flixpress-ordered-list', // tslint:disable-line component-selector
  templateUrl: './ordered-list.component.html',
  styleUrls: ['./ordered-list.component.css'],
})
export class OrderedListComponent implements OnInit, OnChanges {
  @Input() items: Array<object>;
  @Input() orderBy: string | null;
  @Input() direction: string;
  @ContentChild(TemplateRef) repeater;

  private _sorted: any[] = [];
  public get sorted(): any[] { return this._sorted; }
  private indexedItems: {index: number, item: object}[] = [];

  constructor() { }

  ngOnInit() {
    this.setup();
    this.sort();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const prop in changes) { // tslint:disable-line forin
      const change = changes[prop];
      const valuesDiffer = change.previousValue !== change.currentValue;

      if (prop === 'items' && valuesDiffer) {
        this.ngOnInit();
      } else {
        this.sort();
      }
    }
  }

  setup() {
    this._sorted = [].concat(this.items);
    this.indexedItems = this.items.map((item, index) => ({index, item}));
  }

  sort() {
    if (!this.orderBy || this.items.length < 1) return;

    const compare = this.getSortFunction(
      this.getSortableForItem(this.items[0]),
    );

    this.indexedItems.sort((a, b) => {
      const aSortable = this.getSortableForItem(a.item);
      const bSortable = this.getSortableForItem(b.item);
      return compare(aSortable, bSortable);
    });

    if (this.shouldReverse()) {
      this.indexedItems.reverse();
    }

    this._sorted = this.indexedItems.map(orig => orig.item);
  }

  shouldReverse(): boolean {
    if (!this.direction) return false;
    const descMatcher = /^desc/i;
    return descMatcher.test(this.direction);
  }

  getSortableForItem(item: object): any {
    return item[this.orderBy];
  }

  getSortFunction(item: any): (a, b) => SortReturn {
    if (item instanceof String && String.prototype.localeCompare) {
      return (a, b) => a.localeCompare(b);
    }

    return (a, b) => {
      if (a < b) {
        return -1;
      }
      if (a === b) {
        return 0;
      }
      if (a > b) {
        return 1;
      }
    };
  }
}
