import { Component, OnInit, ContentChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import * as arraysService from '../arrayHelpers';

export interface IEmittedEvent {
  data: any;
  type: string;
}

@Component({
  selector: 'flixpress-sortable-container', // tslint:disable-line component-selector
  templateUrl: './sortable-container.component.html',
  styleUrls: ['./sortable-container.component.scss'],
})
export class SortableContainerComponent implements OnInit {

  @ContentChild(TemplateRef) firstNgTemplatePassedIn;
  @Input() items: Array<any> = [];
  @Input() directEdit = false;
  @Input() pluralName = 'items';
  @Input() emptyMessage: string;
  @Input() allowDelete = false;
  @Input() allowSort = true;
  @Output() onSortChange = new EventEmitter<IEmittedEvent>();
  @Output() onDeleteItem = new EventEmitter<IEmittedEvent>();

  constructor() {}

  ngOnInit() {
    if (!this.items) {
      this.items = [];
    } else if (!Array.isArray(this.items)) {
      console.error('[items] was:', this.items);
      throw new Error(`The SortableContainerComponent expects [items] to be an array. ${typeof this.items} given.`);
    }
  }

  getSafeToEditData(): Array<any> {
    if (this.directEdit) {
      return this.items;
    }
    return this.items.concat([]);
  }

  sortItemUp(item: any) {
    const newArray = this.getSafeToEditData();
    arraysService.moveUp(item, newArray);
    this.onSortChange.emit({type: 'ItemSort', data: {newArray} });
  }

  sortItemDown(item: any) {
    const newArray = this.getSafeToEditData();
    arraysService.moveDown(item, newArray);
    this.onSortChange.emit({type: 'ItemSort', data: {newArray} });
  }

  canMoveUp(item: any) {
    return this.allowSort && arraysService.canMoveUp(item, this.items);
  }

  canMoveDown(item: any) {
    return this.allowSort && arraysService.canMoveDown(item, this.items);
  }

  deleteItem(item: any) {
    const newArray = this.getSafeToEditData();
    arraysService.remove(item, newArray);
    this.onDeleteItem.emit({type: 'ItemDelete', data: {newArray} });
  }
}
