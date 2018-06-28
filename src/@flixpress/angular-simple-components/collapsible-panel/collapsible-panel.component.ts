import { Component, OnInit, Input } from '@angular/core';

// import { heightAnimation } from '../../animations/animations';

@Component({
  selector: 'flixpress-collapsible-panel',
  templateUrl: './collapsible-panel.component.html',
  styleUrls: ['./collapsible-panel.component.scss'],
  // animations: [heightAnimation]
})
export class CollapsiblePanelComponent implements OnInit {

  @Input() isExpanded = true;
  @Input() forceOpen = false;
  @Input() title: string;

  expandedIndicator: string;
  private _indicateIsExpanded = ' - ';
  private _indicateIsClosed = ' + ';

  constructor() { }

  setIndicator() {
    if (this.forceOpen) {
      this.expandedIndicator = '';
      return;
    }
    this.expandedIndicator = this.isExpanded ? this._indicateIsExpanded : this._indicateIsClosed;
  }

  ngOnInit() {
    if (this.forceOpen) {this.isExpanded = true; }
    this.setIndicator();
  }

  toggleExpanded() {
    if (!this.forceOpen) {
      this.doToggleExpanded();
    }
  }

  doToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.setIndicator();
  }

}
