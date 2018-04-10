import { AnimatedEllipsisComponent } from './animated-ellipsis/animated-ellipsis.component';
import { CollapsiblePanelComponent } from './collapsible-panel/collapsible-panel.component';
import { ModalComponent } from './modal/modal.component';
import { SortableContainerComponent } from './sortable-container/sortable-container.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export {
  AnimatedEllipsisComponent,
  CollapsiblePanelComponent,
  ModalComponent,
  SortableContainerComponent
};

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    AnimatedEllipsisComponent,
    CollapsiblePanelComponent,
    ModalComponent,
    SortableContainerComponent
  ],
  exports: [
    AnimatedEllipsisComponent,
    CollapsiblePanelComponent,
    ModalComponent,
    SortableContainerComponent
  ],
})
export class SimpleComponentsModule { }
