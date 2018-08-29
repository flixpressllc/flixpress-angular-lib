import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-copy-container',
  templateUrl: './copy-container.component.html',
  styleUrls: ['./copy-container.component.scss'],
})
export class CopyContainerComponent implements OnChanges {
  @Input() copy = '';
  paragraphs: string[][] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const {copy} = changes;
    if (copy && copy.currentValue !== copy.previousValue) {
      this.processText();
    }
  }

  processText() {
    let workingCopy = this.copy;
    workingCopy = workingCopy.replace(/\n\n+/g, '\n\n');
    const workingParagraphs = workingCopy.split('\n\n');
    const workingLines: string[][] = workingParagraphs.map(t => t.split('\n'));
    this.paragraphs = workingLines;
  }
}
