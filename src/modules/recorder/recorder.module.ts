import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecorderService, RecordingOptions, RECORD_SETTINGS } from './recorder.service';
import { VideoRecordingMonitorComponent } from './components/video-recording-monitor/video-recording-monitor.component';
import { AudioRecordingMonitorComponent } from './components/audio-recording-monitor/audio-recording-monitor.component';

export {
  VideoRecordingMonitorComponent,
  RecordingOptions,
};

export * from './recorder.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    VideoRecordingMonitorComponent,
    AudioRecordingMonitorComponent,
  ],
  exports: [
    VideoRecordingMonitorComponent,
    AudioRecordingMonitorComponent,
  ],
})
export class RecorderModule {
  static forRoot(recordSettings?: RecordingOptions): ModuleWithProviders {
    return {
      ngModule: RecorderModule,
      providers: [
        {provide: RECORD_SETTINGS, useValue: recordSettings},
        RecorderService,
      ],
    };
  }
}
