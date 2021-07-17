import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  @Output() startGameEvent = new EventEmitter()
  @Output() joinGameEvent = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  startGame() {
    this.startGameEvent.emit();
  }

  joinGame() {
    this.joinGameEvent.emit();
  }

}
