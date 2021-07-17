import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../notifications/service/notification.service';
import { GameApiService } from '../service/game-api/game-api.service';
import { filter, tap } from 'rxjs/operators';
import { EventType, ServiceMsgType } from '../service/game-api/messages';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit, OnDestroy {

  gameInProgress = false

  gameSubscription$?: Subscription

  constructor(private notificationService: NotificationService, private gameApi: GameApiService) { }

  ngOnDestroy(): void {
    this.gameSubscription$?.unsubscribe()
  }

  ngOnInit(): void {
  }

  startGame() {
    console.log("Game started");

    this.gameApi.startGame()
    this.gameSubscription$ = this.gameApi.messages
      .pipe(filter(msg => msg.type === ServiceMsgType.EVENT))
      .subscribe(
        msg => {
          if(msg.payload.eventType === EventType.GAME_INITIATED) {
            this.gameInProgress = true
          }
          if(msg.payload.eventType === EventType.GAME_OVER) {
            this.gameInProgress = false
          }
          if(msg.payload.message) {
            this.notificationService.showStandardInfo(msg.payload.message)
          }
        },
        err => { this.gameInProgress = false },
        () => { this.gameInProgress = false }
      )
        
    
  }

  joinGame() {
    this.notificationService.showStandardInfo("Game Joined!")
    console.log("joined game");
  }

}
