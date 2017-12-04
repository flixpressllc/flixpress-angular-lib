import { Component, OnInit } from '@angular/core';
import * as arraysService from './utils/arrayHelpers';
// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { fadeInAnimation, scaleAnimation } from '../animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // animations: [
  //   fadeInAnimation, scaleAnimation
  // ],
  // host: { '[@fadeInAnimation]': ''}
})
export class AppComponent implements OnInit {

  animateState: string = "smaller";

  canMoveUp:boolean;
  canMoveDown:boolean;

  localStorageValue:string;

  players:any[];

  deletableTags:any[];

  fakeSearchResults:any[];

  autoCompleteSearchResults:any[];

  toggleButtonItems:Array<string>;

  constructor() { }

  ngOnInit() {
    this.canMoveUp = false;
    this.canMoveDown = true;

    this.players = [
      { name: "Tom Brady", number: 12, position: "QB"},
      { name: "Malcolm Butler", number: 25, position: "CB"},
      { name: "Steve Gostkowski", number: 3, position: "K"},
      { name: "Ryan Allen", number: 6, position: "P"},
      { name: "Danny Amendola", number: 80, position: "WR"}
    ];

    this.deletableTags = [
      { name: "candy", id: 3 },
      { name: "radio", id: 23 },
      { name: "annoyance", id: 39180 }
    ];

    this.fakeSearchResults = [
      { name: "apple", id: 2 },
      { name: "banana", id: 3 },
      { name: "cabbage", id: 32 },
      { name: "pineapple", id: 1 },
      { name: "pen", id: 6 },
      { name: "hat", id: 7 },
      { name: "cheese", id: 4 },
      { name: "ring", id: 5 },
      { name: "zebra", id: 8 },
      { name: "orange", id: 12 }
    ];

    this.autoCompleteSearchResults = [];

    this.localStorageValue = localStorage.getItem("localStorageValue") || "";

    this.toggleButtonItems = ["Apple","Orange", "Onion", "Liquid Smoke", "Ketchup"];
  }

  onDeleteRequestHandler(player){
    arraysService.remove(player, this.players);
  }

  onMoveUpRequestHandler(player){
    arraysService.moveUp(player, this.players);
  }

  onMoveDownRequestHandler(player){
    arraysService.moveDown(player, this.players);
  }

  commitLocalStorageValue(){
    localStorage.setItem("localStorageValue", this.localStorageValue);
  }

  clearLocalStorageValue(){
    localStorage.setItem("localStorageValue", null);
    this.localStorageValue = null;
  }

  log(any:any){
    console.log(any)
  }

  animate() {
    this.animateState = this.animateState == 'larger' ? 'smaller' : 'larger';
  }

  onSearchTypeHandler(newText){
    //console.log("@host component: " + newText);
    //this.autoCompleteSearchResults = [];
    this.autoCompleteSearchResults = this.fakeSearchResults.filter((item) => {
      return item.name.indexOf(newText) !== -1;
    });

    //console.log(JSON.stringify(this.autoCompleteSearchResults));
  }

  onSelectHandler(selectedItem){
    console.log("@host handler selected: " + JSON.stringify(selectedItem));
  }

  onToggleButtonItemSelected(item){
    console.log("Toggle Button selected item was: " + item);
  }
}
