import {
  Component,
  Inject,
  OnInit,
  Input,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  OnChanges,
  SimpleChanges,
  HostBinding,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { PageScrollService, PageScrollInstance, PageScrollOptions} from 'ngx-page-scroll';
import { DOCUMENT } from '@angular/common';

export type PrompterState = 'done' | 'prompting' | 'ready' | 'interrupted';

function distanceAsScaleBetweenTwoPoints(minPoint: number, maxPoint: number, currentPoint: number) {
  const totalDistance = maxPoint - minPoint;
  const currentDistance = currentPoint - minPoint;
  const scale = currentDistance / totalDistance;
  return scale;
}

function scaleToPointBetweenTwoPoints(minPoint: number, maxPoint: number, scale: number) {
  const totalDistance = maxPoint - minPoint;
  const currentDistance = totalDistance * scale;
  return currentDistance + minPoint;
}

@Component({
  selector: 'flix-teleprompter', // tslint:disable-line component-selector
  templateUrl: './teleprompter.component.html',
  styleUrls: ['./teleprompter.component.scss'],
})
export class FlixpressTeleprompterComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() copy = 'You\'ll want to provide some text here so that you can test scrolling. Do so by passing it in as [copy] to this component. You will also need to pass in [scrollTime] as milliseconds';
  @Input() scrollDuration = 8000;
  @Input() mirror = false;
  @Input() devMode = false;
  @Output() events = new EventEmitter();

  @HostBinding('class.mirror')
  public get isMirrored(): boolean {
    return this.mirror;
  }

  // tslint:disable member-ordering
  @HostBinding('class.guides') public get showGuides(): boolean {
    return this.devMode;
  }
  get devTimeStamp(): number { return window.performance.now(); }
  devTimeAtStart = this.devTimeStamp;
  devTimeAtEnd = this.devTimeStamp;
  devWasInterrupted = false;
  devCurrentTime = '0';
  devCurrentTimeAdjust(time) {
    const isTiming = this.devTimeAtEnd === -1;
    const newTime = isTiming ?
      time - this.devTimeAtStart
      : this.devTimeAtEnd - this.devTimeAtStart;
    this.devCurrentTime = (newTime / 1000).toFixed(3);
    if (isTiming) window.requestAnimationFrame((t) => this.devCurrentTimeAdjust(t));
  }
  devStartTimer() {
    this.devTimeAtEnd = -1;
    this.devTimeAtStart = this.devTimeStamp;
    this.devCurrentTimeAdjust(this.devTimeStamp);
  }
  devStopTimer() {
    this.devTimeAtEnd = this.devTimeStamp;
  }
  devSubscriptions: { unsubscribe }[] = [];
  devModeSubscribe() {
    this.devSubscriptions.push(
      this.events.subscribe(state => {
        switch (state.newValue) {
          case 'ready':
            break;
          case 'prompting':
            this.devWasInterrupted = false;
            this.devStartTimer();
            break;
          case 'interrupted':
            this.devWasInterrupted = true;
          case 'done': // tslint:disable-line
            this.devStopTimer();
            break;
          default:
            break;
        }
      }),
    );
  }
  devModeUnsubscribe() {
    this.devSubscriptions.forEach(s => s.unsubscribe());
  }

  @ViewChild('copyEl') _copyEl: ElementRef;
  private get copyEl(): HTMLElement { return this._copyEl.nativeElement; }
  @ViewChild('end') _endEl: ElementRef;
  private get endEl(): HTMLElement { return this._endEl.nativeElement; }
  @ViewChild('oneEm') _oneEm: ElementRef;
  private get emHeight(): number { return (this._oneEm.nativeElement as HTMLElement).clientHeight; }

  public endElStyle = {'margin-top.em': 1};

  private scrollTopListener = new EventEmitter<boolean>(); // This is what pageScrollFinishListener expects, otherwise, we would use RxJs

  private scrollBottomListener = new EventEmitter<boolean>(); // This is what pageScrollFinishListener expects, otherwise, we would use RxJs

  private scrollToTop: PageScrollInstance = undefined;
  private scrollToBottom: PageScrollInstance = undefined;
  private get pageScrollOffset(): number { return this.copyEl.offsetTop; }

  private _promptingState: PrompterState = 'ready';
  private subscriptions: {unsubscribe}[] = [];

  // tslint:enable member-ordering
  constructor(
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any,
  ) { }

  ngOnInit() {
    this.subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.devSubscriptions.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit() {
    this.calculateHeights();
    this.jumpToBeginning();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.devMode) {
      if (changes.devMode.currentValue) {
        this.devModeSubscribe();
      } else {
        this.devModeUnsubscribe();
      }
    }
    if (
      (changes.copy && !changes.copy.isFirstChange()) ||
      (changes.scrollDuration && !changes.scrollDuration.isFirstChange()) ||
      changes.devMode
    ) {
      this.calculateHeights();
    }
  }

  get promptingState() {
    return this._promptingState;
  }

  set promptingState(newState: PrompterState) {
    const oldState = this._promptingState;
    if (oldState === newState) return;
    const event = {
      type: 'state_change',
      oldValue: oldState,
      newValue: newState,
    };
    this._promptingState = newState;
    this.events.emit(event);
  }

  subscribe() {
    this.subscriptions.push(
      this.scrollBottomListener.subscribe((madeIt) => this.promptingState = madeIt ? 'done' : 'interrupted'),
      this.scrollTopListener.subscribe(() => this.promptingState = 'ready'),
    );
  }

  calculateEmPadding(distance: number): number {
    const maxEms = 1;
    const minEms = 0.1;
    const slowestSpeedForAdjustmentRange = 0.12;
    const fastestSpeedForAdjustmentRange = 0.25;
    const time = this.scrollDuration;
    let speed = distance / time;
    speed =
      Math.max(
        Math.min(speed, fastestSpeedForAdjustmentRange),
        slowestSpeedForAdjustmentRange,
      );
    const scaleAdjustment =
      distanceAsScaleBetweenTwoPoints(
        slowestSpeedForAdjustmentRange,
        fastestSpeedForAdjustmentRange,
        speed,
      );
    const ems = scaleToPointBetweenTwoPoints(minEms, maxEms, scaleAdjustment);
    console.log({distance, speed, scaleAdjustment, ems});
    return ems;
  }

  public beginPrompting() {
    const subscription = this.scrollTopListener.subscribe(() => {
      subscription.unsubscribe();
      this.promptingState = 'prompting';
      this.scrollToEnd();
    });

    this.jumpToBeginning();
  }

  public scrollToEnd(): void {
    if (!this.scrollToBottom) {
      setTimeout(() => this.scrollToEnd(), 100);
      return;
    }
    this.pageScrollService.start(this.scrollToBottom);
  }

  public jumpToBeginning(): void {
    if (!this.scrollToTop) {
      setTimeout(() => this.jumpToBeginning(), 100);
      return;
    }
    this.pageScrollService.start(this.scrollToTop);
  }

  public takeAction() {
    switch (this.promptingState) {
      case 'ready':
        this.beginPrompting();
        break;
      case 'prompting':
      case 'interrupted':
        this.pageScrollService.stopAll();
        this.promptingState = 'done';
        break;
      case 'done':
      default:
        this.jumpToBeginning();
        break;
    }
  }

  private calculateHeights() {
    const currentEms = this.endElStyle['margin-top.em'];
    const appliedOffset = currentEms * this.emHeight;
    const distanceWithoutPadding = this.endEl.offsetTop - this.copyEl.offsetTop - appliedOffset;

    console.log({distanceWithoutPadding, currentEms, appliedOffset});
    const newEms = this.calculateEmPadding(distanceWithoutPadding);

    if (newEms === currentEms) {
      this.createScrollInstances();
    } else {
      this.endElStyle['margin-top.em'] = newEms;
      setTimeout(() => this.createScrollInstances());
    }
  }

  private createScrollInstances() {
    const scrollDownOptions: PageScrollOptions = {
      document: this.document,
      scrollTarget: '#end',
      pageScrollDuration: this.scrollDuration,
      pageScrollFinishListener: this.scrollBottomListener,
      pageScrollOffset: this.pageScrollOffset,
    };

    const scrollUpOptions: PageScrollOptions = {
      document: this.document,
      scrollTarget: '#beginning',
      pageScrollDuration: 100, // Durations much shorter than this won't jump properly
      pageScrollFinishListener: this.scrollTopListener,
      pageScrollOffset: this.pageScrollOffset,
    };

    this.scrollToTop = PageScrollInstance.newInstance(scrollUpOptions);
    this.scrollToBottom = PageScrollInstance.newInstance(scrollDownOptions);
  }
}
