import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-copy-container',
  templateUrl: './copy-container.component.html',
  styleUrls: ['./copy-container.component.scss'],
})
export class CopyContainerComponent implements OnChanges {
  @Input() copy = '';
  @Input() allCaps = false;
  paragraphs: string[][] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const {copy, allCaps} = changes;
    if ((allCaps && !allCaps.firstChange) || (copy && copy.currentValue !== copy.previousValue)) {
      this.processText();
    }
  }

  processText() {
    let workingCopy = this.copy;
    workingCopy = workingCopy.replace(/\n\n+/g, '\n\n');
    workingCopy = this.allCaps ? workingCopy.toUpperCase() : workingCopy;
    const workingParagraphs = workingCopy.split('\n\n');
    const workingLines: string[][] = workingParagraphs.map(t => t.split('\n'));
    this.paragraphs = workingLines;
  }
}
