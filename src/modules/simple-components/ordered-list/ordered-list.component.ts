import { Component, OnInit, Input, ContentChild, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';

const SORT_BY_SELF = '-self-';

@Component({
  selector: 'flixpress-ordered-list',
  templateUrl: './ordered-list.component.html',
  styleUrls: ['./ordered-list.component.css']
})
export class OrderedListComponent implements OnInit, OnChanges {
  @Input() items: Array<any>;
  @Input() orderBy: string | null;
  @ContentChild('repeater') repeater;

  private sorted = [];
  private indexedItems: {index: number, item: any}[] = [];

  constructor() { }

  ngOnInit() {
    this.setup();
    this.sort();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let prop in changes) {
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
    this.sorted = [].concat(this.items)
    this.indexedItems = this.items.map((item, index) => ({index, item}));
  }

  sort() {
    if (!this.orderBy) return;

    this.indexedItems.sort((a, b) => {
      const aSortable = this.getSortableForItem(a.item);
      const bSortable = this.getSortableForItem(b.item);
      return this.minisort([aSortable, bSortable]);
    })

    this.sorted = this.indexedItems.map(orig => orig.item)
  }

  getSortableForItem(item: any): any {
    if (this.orderBy === SORT_BY_SELF) return item;
    return item[this.orderBy];
  }

  minisort(arr: [any, any]): -1 | 0 | 1 {
    const [first, second] = arr;

    arr.sort();

    if (arr[0] === first) {
      return 0;
    } else {
      return 1;
    }
  }
}
