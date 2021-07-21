import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { multicast, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { NotificationService } from 'src/app/notifications/service/notification.service';
import { GameMessage, GameMessageType, MsgFromService, ServiceMsgType } from './messages';

@Injectable({
  providedIn: 'root'
})
export class GameApiService {

  private GAME_SERVER_URL = "ws://localhost:3000/"
  private socket?: WebSocketSubject<any>
  public messages: Observable<MsgFromService> = new Observable();

  constructor() { }

  startGame() {
      this.socket = webSocket({
        url: this.GAME_SERVER_URL,
        closeObserver: {
          next: (event: CloseEvent) => { console.log(event) }
        }
      })

      this.messages = this.socket.pipe(multicast(this.socket))
  }


  makeMove(x: number, y: number, gameId: string) {
    let msg: GameMessage = {
      type: GameMessageType.MAKE_MOVE,
      gameId: gameId,
      data: {
        coordinateX: x,
        coordinateY: y
      }
    }
    this.socket?.next(msg)
  }

}


