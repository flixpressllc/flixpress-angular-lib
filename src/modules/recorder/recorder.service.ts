import { Injectable, isDevMode, Optional, Inject, InjectionToken } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import RecordRTC from 'recordrtc/RecordRTC.min';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

enum RecordingState {
  awaitingPermission,
  idle,
  recording,
  recordingError,
  permissionRevoked,
  permissionGranted,
}

export interface RecordSettings {
  recordVideo: boolean;
  recordAudio: boolean;
}

const defaultRecordSettings: RecordSettings = {
  recordVideo: true,
  recordAudio: true,
};

export const RECORD_SETTINGS = new InjectionToken<Partial<RecordSettings>>('optional recorder.service settings');

type DataUrl = string;
export interface RecordingData { url: SafeUrl; blob: Blob; dataUrl: DataUrl; }

@Injectable()
export class RecorderService {
  private videoConstraints: MediaStreamConstraints['video'] = {
    width: 1920,
    height: 1080,
    // frameRate: { max: 30 }, // this line kills the quality in Chrome...
  };
  private audioConstraints: MediaStreamConstraints['audio'] = true;
  private stream: MediaStream = null;
  private recorder: RecordRTC;
  private recordingState = new BehaviorSubject(RecordingState.awaitingPermission);
  private recordSettings: RecordSettings;

  public lastSuccessfulRecording: RecordingData | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    @Optional() @Inject(RECORD_SETTINGS) private partialRecordSettings: Partial<RecordSettings> = {},
  ) {
    this.recordSettings = Object.assign({}, defaultRecordSettings, partialRecordSettings);
  }

  async setup(): Promise<MediaStream | false> {
    if (await this.setStream()) {
      this.prepRecorder();
      return this.stream;
    } else {
      return false;
    }
  }

  startRecording(): Promise<RecordingData> {
    if (this.recordingState.value === RecordingState.permissionRevoked) {
      return Promise.reject(new Error('Recording permission NOT granted. Cannot start recording.'));
    }
    if (this.recordingState.value === RecordingState.awaitingPermission) {
      if (isDevMode()) {
        console.warn('The recording was started without first being setup. This could cause a bad user experience. Better to call `setup()` at the first opportunity that makes sense in your ui.');
      }
      return new Promise(resolve => {
        const watch = this.recordingState.subscribe(state => {
          if (state === RecordingState.idle) {
            resolve(this.startRecording());
            watch.unsubscribe();
          }
        });
      });
    }
    return new Promise((resolve, reject) => {
      this.recordingState.next(RecordingState.recording);
      this.recorder.startRecording();
      const watch = this.recordingState.subscribe(state => {
        if (state === RecordingState.idle) {
          resolve(this.lastSuccessfulRecording);
          watch.unsubscribe();
        } else if (state === RecordingState.recordingError) {
          reject(new Error('Recording failed'));
          watch.unsubscribe();
        }
      });
    });
  }

  stopRecording(): Promise<RecordingData> {
    return new Promise(resolve => {
      this.recorder.stopRecording((webmUrl: DataUrl) => {
        this.recordingState.next(RecordingState.idle);
        this.recorder.getDataURL((dataUrl) => {
          const recordingData = { url: this.sanitizer.bypassSecurityTrustUrl(webmUrl), blob: this.recorder.getBlob(), dataUrl };
          resolve(recordingData);
          this.lastSuccessfulRecording = recordingData;
        });
      });
    });
  }

  killStream(): void {
    const stream = this.stream;
    if (!stream) { return; }
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    this.stream = null;
  }

  download(): void {
    if (this.recordSettings.recordVideo) {
      this.recorder.save('video.webm');
    } else {
      this.recorder.save('audio.wav');
    }
  }

  private prepRecorder() {
    if (this.recordingState.value === RecordingState.idle) { return; }
    const generalOptions = {
      disableLogs: !isDevMode(),
      audioBitsPerSecond: 128000, // max allowable
    };
    const videoOptions = {
      mimeType: 'video/webm\;codecs=h264',
      videoBitsPerSecond: 15000000,
    };
    const audioOptions = {
      recorderType: RecordRTC.StereoAudioRecorder,
      mimeType: 'audio/ogg',
      bufferSize: 4096, // buffer only used with StereoAudioRecorder
      audioBitsPerSecond: 128000,
      sampleRate: 48000,
    };
    const specificOptions = (this.recordSettings.recordVideo) ? videoOptions : audioOptions;
    const settings = Object.assign(generalOptions, specificOptions);
    this.recorder = new RecordRTC(this.stream, settings);
  }

  private async setStream(): Promise<boolean> {
    if (!!this.stream) { return true; }
    const mediaConstraints: MediaStreamConstraints = {
      video: this.recordSettings.recordVideo ? this.videoConstraints : false,
      audio: this.recordSettings.recordAudio ? this.audioConstraints : false,
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      this.recordingState.next(RecordingState.permissionGranted);
      return true;
    } catch (e) {
      window.alert('You\'ll need to allow access to the camera and microphone to use the recorder. Please Refresh the page and/or adjust your browser settings.');
      this.recordingState.next(RecordingState.permissionRevoked);
      return false;
    }
  }
}
