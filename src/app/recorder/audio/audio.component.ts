import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css'],
})
export class AudioComponent implements OnInit {
  @ViewChild('audio') audio;

  constructor() { }

  ngOnInit() {
  }

}
