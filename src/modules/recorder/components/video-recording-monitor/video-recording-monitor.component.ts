import { Component, ViewChild, AfterViewInit, OnDestroy, isDevMode } from '@angular/core';
import { RecorderService } from '../../recorder.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'flix-video-recording-monitor', // tslint:disable-line component-selector
  templateUrl: './video-recording-monitor.component.html',
  styleUrls: ['./video-recording-monitor.component.scss'],
})
export class VideoRecordingMonitorComponent implements AfterViewInit, OnDestroy {

  private stream: MediaStream;

  @ViewChild('video') _video;
  get video(): HTMLVideoElement {
    return this._video.nativeElement;
  }

  constructor(
    private recorder: RecorderService,
  ) { }

  ngAfterViewInit() {
    this.setup();
  }

  async setup() {
    const stream = await this.recorder.setup();
    if (stream) {
      this.stream = stream;
      this.setPlayerToMonitorMode();
    }
  }

  ngOnDestroy() {
    this.killStream();
  }

  setPlayerToMonitorMode() {
    Object.assign(this.video, {
      muted: true,
      controls: false,
      autoplay: true,
      src: null,
      srcObject: this.stream,
    });
  }

  setPlayerToReviewMode(url: string | SafeUrl) {
    Object.assign(this.video, {
      muted: false,
      controls: true,
      autoplay: false,
      srcObject: null,
      src: url,
    });
  }

  reset() {
    this.setPlayerToMonitorMode();
  }

  startRecording() {
    this.setPlayerToMonitorMode();
    this.recorder.startRecording();
  }

  async stopRecording() {
    await this.recorder.stopRecording();
    this.setPlayerToReviewMode(this.recorder.lastSuccessfulRecording.url);
  }

  killStream() {
    this.recorder.killStream();
  }

  download() {
    this.recorder.download();
  }
}
