import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../notifications/service/notification.service';
import { GameApiService } from '../service/game-api/game-api.service';
import { filter, tap } from 'rxjs/operators';
import { EventType, ServiceMsgType } from '../service/game-api/messages';
import { P2PRequestReceivedMsg } from '../service/game-api/data';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit, OnDestroy {

  gameInProgress = false

  gameSubscription$?: Subscription

  currentPlayerId = ""

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
          if(msg.payload.eventType === EventType.REQUEST_RECEIVED) {
            this.showReceivedRequest(msg.payload.additionalData as P2PRequestReceivedMsg)
          } else {
            if (msg.payload.eventType === EventType.GAME_INITIATED) {
              this.gameInProgress = true;
            }
            if (msg.payload.eventType === EventType.GAME_OVER) {
              this.quitGame()
            }
            if (msg.payload.additionalData) {
              this.notificationService.showStandardInfo(msg.payload.additionalData);
            }
          }
        },
        err => { this.quitGame(); },
        () => { this.quitGame(); }
      );
  }

  private showReceivedRequest(request: P2PRequestReceivedMsg) {
    this.notificationService.showStandardInfoWithOptions(request.text, [
      {
        color: "success",
        text: request.approveText,
        onClick: () => {
          this.gameApi.answerToRequest("APPROVE_REQUEST", request.requestId, this.currentPlayerId)
        }
      }, 
      {
        color: "secondary",
        text: request.rejectText,
        onClick: () => {
          this.gameApi.answerToRequest("REJECT_REQUEST", request.requestId, this.currentPlayerId)
        }
      }
    ])
  }

  setPlayerId(id: string) {
    this.currentPlayerId = id
  }

}
