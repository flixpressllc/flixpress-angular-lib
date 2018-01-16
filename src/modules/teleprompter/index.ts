import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { TeleprompterComponent } from './teleprompter.component';


@NgModule({
  imports: [
    CommonModule,
    NgxPageScrollModule,
  ],
  declarations: [
    TeleprompterComponent,
  ],
  providers: [],
  exports: [
    TeleprompterComponent,
  ],
})
export class TeleprompterModule { }

export { TeleprompterComponent };
