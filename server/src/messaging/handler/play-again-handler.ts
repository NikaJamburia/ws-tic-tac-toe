import * as WebSocket from 'ws';
import { PlayerWebSocket } from "../../app";
import { P2PRequestService } from '../../service/p2p-request-service';
import { TTTGameService } from '../../service/ttt-game-service';
import { IncomingMessage, GameIdRequest } from "../incoming-message";
import { dataMsg, DataType } from '../outgoing-message';
import { BaseMsgHandler } from "./base-msg-handler";
import { IncomingMsgHandler } from "./incoming-msg-handler";

export class PlayAgainHandler extends BaseMsgHandler {

    constructor(server: WebSocket.Server, private requestService: P2PRequestService, private gameService: TTTGameService) {
        super(server)
    }

    handle(msg: IncomingMessage, player: PlayerWebSocket): void {
        let data = msg.data as GameIdRequest
        let opponent = this.gameService.getOpponentFor(player.playerId, data.gameId)
        
        this.requestService.makeRequest(player.playerId, opponent, () => {
            let gameView = this.gameService.playAgain(data.gameId)
            this.getClientById(gameView.forX.playerId)?.send(dataMsg(gameView.forX, DataType.GAME_DATA));
            this.getClientById(gameView.forO.playerId)?.send(dataMsg(gameView.forO, DataType.GAME_DATA));
        })
    }

}