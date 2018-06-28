import { AnimatedEllipsisComponent } from './animated-ellipsis/animated-ellipsis.component';
import { CollapsiblePanelComponent } from './collapsible-panel/collapsible-panel.component';
import { ModalComponent } from './modal/modal.component';
import { SortableContainerComponent } from './sortable-container/sortable-container.component';
import { OrderedListComponent } from './ordered-list/ordered-list.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export {
  AnimatedEllipsisComponent,
  CollapsiblePanelComponent,
  ModalComponent,
  SortableContainerComponent,
  OrderedListComponent,
};

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    AnimatedEllipsisComponent,
    CollapsiblePanelComponent,
    ModalComponent,
    SortableContainerComponent,
    OrderedListComponent,
  ],
  exports: [
    AnimatedEllipsisComponent,
    CollapsiblePanelComponent,
    ModalComponent,
    SortableContainerComponent,
    OrderedListComponent,
  ],
})
export class SimpleComponentsModule { }
