import {Component, Inject, OnInit, Input, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import { PageScrollService, PageScrollInstance, PageScrollOptions} from 'ngx-page-scroll';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

type PrompterState = 'done' | 'prompting' | 'ready' | 'interrupted';

@Component({
  selector: 'app-teleprompter',
  templateUrl: './teleprompter.component.html',
  styleUrls: ['./teleprompter.component.scss'],
})
export class TeleprompterComponent implements OnInit, OnDestroy {
  @Input() copy = 'You\'ll want to provide some text here so that you can test scrolling. Do so by passing it in as [copy] to this component. You will also need to pass in [scrollTime] as milliseconds';
  @Input() manualScrollButtonText = 'Start Scrolling';
  @Input() scrollDuration = 8000;
  @Input() maxHeight = undefined;

  private scrollTopListener = new EventEmitter<boolean>(); // This is what pageScrollFinishListener expects, otherwise, we would use RxJs

  private scrollBottomListener = new EventEmitter<boolean>(); // This is what pageScrollFinishListener expects, otherwise, we would use RxJs

  private scrollToTop: PageScrollInstance = undefined;
  private scrollToBottom: PageScrollInstance = undefined;

  private promptingState: PrompterState = 'ready';
  private subscriptions: Subscription[] = [];

  constructor(
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any,
    private host: ElementRef,
  ) { }

  ngOnInit() {
    this.calculateHeights();
    this.subscribe();
    this.jumpToBeginning();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  subscribe() {
    this.subscriptions.push(
      this.scrollBottomListener.subscribe((madeIt) => this.promptingState = madeIt ? 'done' : 'interrupted'),
      this.scrollTopListener.subscribe(() => this.promptingState = 'ready'),
    );
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
    this.pageScrollService.start(this.scrollToBottom);
  }

  public jumpToBeginning() {
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
    const hostEl = this.host.nativeElement;
    const endEl = hostEl.querySelector('#end');
    const copyEl = hostEl.querySelector('.copy');

    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    endEl.style.height = viewportHeight + 'px';

    this.createScrollInstances(copyEl.offsetTop);
  }

  private createScrollInstances(offset: number) {
    const scrollDownOptions: PageScrollOptions = {
      document: this.document,
      scrollTarget: '#end',
      pageScrollDuration: this.scrollDuration,
      pageScrollFinishListener: this.scrollBottomListener,
      pageScrollOffset: offset,
    };

    const scrollUpOptions: PageScrollOptions = {
      document: this.document,
      scrollTarget: '#beginning',
      pageScrollDuration: 100, // Durations much shorter than this won't jump properly
      pageScrollFinishListener: this.scrollTopListener,
      pageScrollOffset: offset,
    };

    this.scrollToTop = PageScrollInstance.newInstance(scrollUpOptions);
    this.scrollToBottom = PageScrollInstance.newInstance(scrollDownOptions);
  }
}
