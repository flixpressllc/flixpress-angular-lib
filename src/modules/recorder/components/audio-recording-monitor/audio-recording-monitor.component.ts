import { Component, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { RecorderService } from '../../recorder.service';
import { SafeUrl } from '@angular/platform-browser';
import { timeout } from '../../timeout';

@Component({
  selector: 'flix-audio-recording-monitor', // tslint:disable-line component-selector
  templateUrl: './audio-recording-monitor.component.html',
  styleUrls: ['./audio-recording-monitor.component.scss'],
})
export class AudioRecordingMonitorComponent implements AfterViewInit, OnDestroy {
  @Input() width = 100;
  @Input() height = 50;

  private stream: MediaStream;
  private isMonitoring = true;
  private reviewUrl: string | SafeUrl = null;

  @ViewChild('audio') _audio;
  get audio(): HTMLAudioElement {
    return this._audio.nativeElement;
  }

  @ViewChild('canvas') _canvas;
  get canvas(): HTMLCanvasElement {
    return this._canvas.nativeElement;
  }

  constructor(
    private recorder: RecorderService,
  ) { }

  ngAfterViewInit() {
    this.setup();
  }

  async setup() {
    const stream = await this.recorder.setup({recordVideo: false, recordAudio: true});
    if (stream) {
      this.stream = stream;
      this.setPlayerToMonitorMode();
    }
  }

  ngOnDestroy() {
    this.killStream();
  }

  setPlayerToMonitorMode() {
    this.isMonitoring = true;
    this.createWaveform(this.stream);
    this.reviewUrl = null;
  }

  setPlayerToReviewMode(url: string | SafeUrl) {
    this.isMonitoring = false;
    this.reviewUrl = url;
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

  private async getCanvas(): Promise<HTMLCanvasElement> {
    if (this.canvas) return this.canvas;
    await timeout(50);
    return this.getCanvas();
  }

  private async createWaveform(stream: MediaStream) {
    // see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = await this.getCanvas();
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, this.width, this.height);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const drawVisual = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, width, height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();
      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }
}
