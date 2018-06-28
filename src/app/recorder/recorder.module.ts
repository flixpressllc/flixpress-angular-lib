import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecorderModule as FlixRecorderModule } from '../../@flixpress/angular-recorder/recorder.module';

import { RecorderRoutingModule } from './recorder-routing.module';
import { IndexComponent } from './index/index.component';
import { VideoComponent } from './video/video.component';
import { AudioComponent } from './audio/audio.component';

@NgModule({
  imports: [
    CommonModule,
    RecorderRoutingModule,
    FlixRecorderModule.forRoot(),
  ],
  declarations: [
    IndexComponent,
    VideoComponent,
    AudioComponent,
  ],
})
export class RecorderModule { }
