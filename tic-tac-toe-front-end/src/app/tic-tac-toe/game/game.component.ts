import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameData, GameStatus, MoveData, MoveValue } from 'src/app/service/game-api/data';
import { GameApiService } from 'src/app/service/game-api/game-api.service';
import { DataType, EventType, ServiceMsgType } from 'src/app/service/game-api/messages';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  @Input() gameService!: GameApiService
  @Output() quit = new EventEmitter()

  gameSubscription$?: Subscription
  game?: GameData
  gridCoordinates = [1, 2, 3]
  gameStatus = GameStatus

  constructor() { }

  ngOnDestroy(): void {
    this.gameSubscription$?.unsubscribe()
  }

  ngOnInit(): void {
    this.gameSubscription$ = this.gameService.messages
    .pipe(filter(msg => msg.type === ServiceMsgType.DATA && msg.dataType === DataType.GAME_DATA ))
    .subscribe(
      msg => {
        this.game = msg.payload as GameData
      },
      err => {  },
      () => {  }
    )
  }

  getMoveFor(x: number, y: number): MoveData | undefined {
    return this.game !== undefined 
      ? this.game.moves.find(move => move.coordinateX === x && move.coordinateY === y)
      : undefined
  }

  decorateCell(cell: HTMLElement, x: number, y: number): string {
    let move = this.getMoveFor(x, y)

    if(move) {
      cell.classList.remove("clickable")
      return move.value
    } else {
      cell.classList.add("clickable")
      return ""
    }
  }

  makeMove(x: number, y: number) {
    if(this.getMoveFor(x, y) === undefined && this.game!.status === GameStatus.IN_PROGRESS) {
      this.gameService.makeMove(x, y, this.game!.id)
    }
  }

  quitGame() {
    this.quit.emit()
  }

}
