import {Input, Output, EventEmitter, OnDestroy, AfterViewInit, OnInit, OnChanges, SimpleChanges} from '@angular/core';

const MODAL_OPEN_CLASS = ' __ModalOpen';

export abstract class ModalBase implements OnDestroy, AfterViewInit, OnChanges {
  @Input() title: string;
  @Input() fullScreen: boolean | string = false;
  @Input() isOpen: boolean;

  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  private _isOpen: boolean;
  classes: Object;

  ngAfterViewInit() {
    this.updateClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateOpenState();
  }

  updateOpenState() {
    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  isFullScreen() {
    // Typescript isn't super helpful when dealing with angular html templates,
    // so let's be flexible
    const shouldBeFullScreen = false;
    switch (this.fullScreen) {
      case true:
      case 'true':
      case 'True':
      case 'fullscreen':
      case 'fullScreen':
      case 'full-screen':
        return true;
      default:
        return false;
    }
  }

  updateClasses() {
    this.classes = {
      'full-screen': this.isFullScreen(),
      'partial-screen': !this.isFullScreen(),
    };
  }

  open() {
    this._isOpen = true;
    this.indicateOpenOnBody();
    this.onOpen.emit();
  }

  close() {
    this._isOpen = false;
    this.indicateClosedOnBody();
    this.onClose.emit();
  }

  ngOnDestroy() {
    this.indicateClosedOnBody();
  }

  indicateOpenOnBody() {
    if (document.body.className.indexOf(MODAL_OPEN_CLASS) > 0) return;
    document.body.className = document.body.className + MODAL_OPEN_CLASS;
  }

  indicateClosedOnBody() {
    if (document.body.className.indexOf(MODAL_OPEN_CLASS) < 0) return;
    const str = document.body.className;
    document.body.className = str.replace(MODAL_OPEN_CLASS, '');
  }
}

export abstract class ModalSelectBase<T> extends ModalBase implements OnInit {
  protected _selectedItem: T;
  items: Array<T>;
  protected selectedCallback: (selectedItem: T)  => void;

  constructor() {
    super();
  }

  ngOnInit() {
    this.items = [];
  }

  protected select(selectedItem: T) {
    this._selectedItem = selectedItem;
    this.selectedCallback(this._selectedItem);
    this.close();
  }
  /*
  onSelected(callback: {(selectedItem:T):void}){
    callback(this._selectedItem);
    this.close();
  }
  */
  openModal(callback: (selectedItem: T) => void) {
    super.open();
    this.selectedCallback = callback;
  }
}
