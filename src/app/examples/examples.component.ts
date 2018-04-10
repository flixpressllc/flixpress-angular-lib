import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css'],
})
export class ExamplesComponent implements OnInit {
  players = [
    { name: 'Tom Brady', number: 12, position: 'QB'},
    { name: 'Malcolm Butler', number: 25, position: 'CB'},
    { name: 'Steve Gostkowski', number: 3, position: 'K'},
    { name: 'Ryan Allen', number: 6, position: 'P'},
    { name: 'Danny Amendola', number: 80, position: 'WR'},
  ];

  modalIsOpen = false;

  constructor() { }

  ngOnInit() { }

  openModal() {
    this.modalIsOpen = true;
  }

  closeModal() {
    this.modalIsOpen = false;
  }
}
