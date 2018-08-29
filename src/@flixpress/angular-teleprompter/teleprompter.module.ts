import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FlixpressTeleprompterComponent } from './teleprompter/teleprompter.component';
import { CopyContainerComponent } from './copy-container/copy-container.component';

export { FlixpressTeleprompterComponent };

@NgModule({
  imports: [
    CommonModule,
    NgxPageScrollModule,
  ],
  declarations: [
    FlixpressTeleprompterComponent,
    CopyContainerComponent,
  ],
  providers: [],
  exports: [
    FlixpressTeleprompterComponent,
  ],
})
export class FlixpressTeleprompterModule { }
