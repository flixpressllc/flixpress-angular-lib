import { Component, OnInit, ContentChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { ArraysService } from '../../services/arrays.service';

@Component({
  selector: 'app-sortable-container',
  templateUrl: './sortable-container.component.html',
  styleUrls: ['./sortable-container.component.scss']
})
export class SortableContainerComponent implements OnInit {

  @ContentChild(TemplateRef) firstNgTemplatePassedIn;
  @Input() items: Array<any> = [];
  @Input() directEdit: boolean = false;
  @Input() pluralName: string = "items";
  @Input() emptyMessage: string;
  @Input() allowDelete: boolean = false;
  @Input() allowSort: boolean = true;
  @Output() onSortChange = new EventEmitter<EmittedEvent>();
  @Output() onDeleteItem = new EventEmitter<EmittedEvent>();

  constructor(private arraysService: ArraysService) {}

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
    return this.items.concat([])
  }

  sortItemUp(item:any) {
    let newArray = this.getSafeToEditData();
    this.arraysService.moveUp(item, newArray);
    this.onSortChange.emit({type: 'ItemSort', data: {newArray} })
  }

  sortItemDown(item: any) {
    let newArray = this.getSafeToEditData();
    this.arraysService.moveDown(item, newArray);
    this.onSortChange.emit({type: 'ItemSort', data: {newArray} })
  }

  canMoveUp(item: any) {
    return this.allowSort && this.arraysService.canMoveUp(item, this.items);
  }

  canMoveDown(item: any) {
    return this.allowSort && this.arraysService.canMoveDown(item, this.items);
  }

  deleteItem(item: any) {
    let newArray = this.getSafeToEditData();
    this.arraysService.delete(item, newArray);
    this.onDeleteItem.emit({type: 'ItemDelete', data: {newArray} })
  }
}
