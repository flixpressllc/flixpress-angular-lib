import { Component, OnInit } from '@angular/core';
import * as arraysService from '../utils/arrayHelpers';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css'],
})
export class ExamplesComponent implements OnInit {

  animateState = 'smaller';

  canMoveUp: boolean;
  canMoveDown: boolean;

  localStorageValue: string;

  players: any[];

  deletableTags: any[];

  fakeSearchResults: any[];

  autoCompleteSearchResults: any[];

  toggleButtonItems: Array<string>;

  constructor() { }

  ngOnInit() {
    this.canMoveUp = false;
    this.canMoveDown = true;

    this.players = [
      { name: 'Tom Brady', number: 12, position: 'QB'},
      { name: 'Malcolm Butler', number: 25, position: 'CB'},
      { name: 'Steve Gostkowski', number: 3, position: 'K'},
      { name: 'Ryan Allen', number: 6, position: 'P'},
      { name: 'Danny Amendola', number: 80, position: 'WR'},
    ];

    this.deletableTags = [
      { name: 'candy', id: 3 },
      { name: 'radio', id: 23 },
      { name: 'annoyance', id: 39180 },
    ];

    this.fakeSearchResults = [
      { name: 'apple', id: 2 },
      { name: 'banana', id: 3 },
      { name: 'cabbage', id: 32 },
      { name: 'pineapple', id: 1 },
      { name: 'pen', id: 6 },
      { name: 'hat', id: 7 },
      { name: 'cheese', id: 4 },
      { name: 'ring', id: 5 },
      { name: 'zebra', id: 8 },
      { name: 'orange', id: 12 },
    ];

    this.autoCompleteSearchResults = [];

    this.localStorageValue = localStorage.getItem('localStorageValue') || '';

    this.toggleButtonItems = ['Apple', 'Orange', 'Onion', 'Liquid Smoke', 'Ketchup'];
  }


  log(any: any) {
    console.log(any);
  }
}
