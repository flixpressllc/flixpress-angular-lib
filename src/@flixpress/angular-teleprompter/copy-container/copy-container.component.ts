import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-copy-container',
  templateUrl: './copy-container.component.html',
  styleUrls: ['./copy-container.component.scss'],
})
export class CopyContainerComponent implements OnChanges {
  @Input() copy = '';
  paragraphs: string[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const {copy} = changes;
    if (copy && copy.currentValue !== copy.previousValue) {
      this.paragraphs = copy.currentValue.split('\n\n');
    }
  }

}
