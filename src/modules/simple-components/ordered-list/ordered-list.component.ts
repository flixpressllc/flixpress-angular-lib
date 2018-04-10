import { Component, OnInit, Input, ContentChild, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';

type sortReturn = -1 | 0 | 1;

@Component({
  selector: 'flixpress-ordered-list',
  templateUrl: './ordered-list.component.html',
  styleUrls: ['./ordered-list.component.css']
})
export class OrderedListComponent implements OnInit, OnChanges {
  @Input() items: Array<object>;
  @Input() orderBy: string | null;
  @ContentChild('repeater') repeater;

  private sorted = [];
  private indexedItems: {index: number, item: object}[] = [];

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

  getSortableForItem(item: object): any {
    return item[this.orderBy];
  }

  minisort(arr: [any, any]): sortReturn {
    const [first, second] = arr;
    let sortFn = this.getSortFunction(first);


    arr.sort(sortFn);

    if (arr[0] === first) {
      return 0;
    } else {
      return 1;
    }
  }

  getSortFunction(item: any): (a, b) => sortReturn | undefined  {
    if (item instanceof Date) {
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
      }
    }

    return undefined;
  }
}
