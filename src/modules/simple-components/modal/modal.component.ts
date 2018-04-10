import { Component, OnInit, Input, Output } from '@angular/core';

import { ModalBase } from './modalbase';

// import { fadeInAnimation, fadeOutAnimation } from '../../animations/animations';

@Component({
  selector: 'flixpress-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  // animations: [fadeInAnimation, fadeOutAnimation]
})
export class ModalComponent extends ModalBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.title == null) {
      this.title = 'Window';
    }
  }
}
