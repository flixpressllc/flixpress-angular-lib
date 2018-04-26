import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FlixpressTeleprompterComponent } from './teleprompter.component';

export { FlixpressTeleprompterComponent };

@NgModule({
  imports: [
    CommonModule,
    NgxPageScrollModule,
  ],
  declarations: [
    FlixpressTeleprompterComponent,
  ],
  providers: [],
  exports: [
    FlixpressTeleprompterComponent,
  ],
})
export class FlixpressTeleprompterModule { }
