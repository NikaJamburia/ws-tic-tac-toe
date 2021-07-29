import * as WebSocket from 'ws';
import { PlayerWebSocket } from "../../app";
import { TTTGameService } from '../../service/ttt-game-service';
import { IncomingMessage } from "../incoming-message";
import { eventMsg, EventType } from '../outgoing-message';
import { BaseMsgHandler } from "./base-msg-handler";

export class QuitGameHandler extends BaseMsgHandler {

    constructor(server: WebSocket.Server, private gameService: TTTGameService) {
        super(server)
    }

    handle(msg: IncomingMessage, player: PlayerWebSocket): void {
        this.gameService.cancelWaitingGames(player.playerId)
        let opponentId = this.gameService.cancelGame(player.playerId);
        if (opponentId) {
            this.getClientById(opponentId)?.send(eventMsg(EventType.GAME_OVER, "Opponent left"));
        }
    }

}