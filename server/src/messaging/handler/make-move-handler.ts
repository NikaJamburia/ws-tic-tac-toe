import * as WebSocket from 'ws';
import { PlayerWebSocket } from '../../app';
import { TTTGameService } from '../../service/ttt-game-service';
import { IncomingMessage, MoveRequest } from "../incoming-message";
import { dataMsg, DataType } from '../outgoing-message';
import { BaseMsgHandler } from "./base-msg-handler";
import { IncomingMsgHandler } from "./incoming-msg-handler";

export class MakeMovehandler extends BaseMsgHandler {

    constructor(server: WebSocket.Server, private gameService: TTTGameService) {
        super(server)
    }

    handle(msg: IncomingMessage, player: PlayerWebSocket): void {
        let request = msg.data as MoveRequest;
        let gameView = this.gameService.makeMove(request, player.playerId);
        this.getClientById(gameView.forX.playerId)?.send(dataMsg(gameView.forX, DataType.GAME_DATA));
        this.getClientById(gameView.forO.playerId)?.send(dataMsg(gameView.forO, DataType.GAME_DATA));
    }
    
}