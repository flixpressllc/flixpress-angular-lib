import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'flixpress-ordered-list',
  templateUrl: './ordered-list.component.html',
  styleUrls: ['./ordered-list.component.css']
})
export class OrderedListComponent implements OnInit {
  @Input() items: Array<any>;
  @ContentChild(TemplateRef) firstNgTemplatePassedIn;

  constructor() { }

  ngOnInit() {
  }

}
