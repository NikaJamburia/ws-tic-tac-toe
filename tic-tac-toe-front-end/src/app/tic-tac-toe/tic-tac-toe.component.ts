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

  constructor(private notificationService: NotificationService, public gameApi: GameApiService) { }

  ngOnDestroy(): void {
    this.gameSubscription$?.unsubscribe()
  }

  ngOnInit(): void {
  }

  startGame() {
    this.gameApi.startGame()
    this.subscribeToGame();
        
  }

  joinGame() {
    this.gameApi.joinGame()
    this.subscribeToGame();
  }

  quitGame() {
    this.gameSubscription$?.unsubscribe()
    this.gameInProgress = false;
  }

  private subscribeToGame() {
    this.gameSubscription$ = this.gameApi.messages
      .pipe(tap(msg => {
        if (msg.type === ServiceMsgType.ERROR) {
          this.notificationService.showStandardError(msg.payload);
        }
      }))
      .pipe(filter(msg => msg.type === ServiceMsgType.EVENT))
      .subscribe(
        msg => {
          if (msg.payload.eventType === EventType.GAME_INITIATED) {
            this.gameInProgress = true;
          }
          if (msg.payload.eventType === EventType.GAME_OVER) {
            this.quitGame()
          }
          if (msg.payload.message) {
            this.notificationService.showStandardInfo(msg.payload.message);
          }
        },
        err => { this.quitGame(); },
        () => { this.quitGame(); }
      );
  }

}
