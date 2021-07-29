import * as WebSocket from 'ws';
import { PlayerWebSocket } from '../../app';
import { TTTGameService } from '../../service/ttt-game-service';
import { IncomingMessage, MoveRequest } from '../incoming-message';
import { dataMsg, DataType } from '../outgoing-message';
import { SendMessageRequest } from '../send-message-request';
import { BaseMsgHandler } from "./base-msg-handler";
import { IncomingMsgHandler } from "./incoming-msg-handler";

export class MsgToOpponentHandler extends BaseMsgHandler implements IncomingMsgHandler {

    constructor(server: WebSocket.Server, private gameService: TTTGameService) {
        super(server)
    }

    handle(msg: IncomingMessage, player: PlayerWebSocket): void {
        let msgRequest = msg.data as SendMessageRequest
        let receiverId = this.gameService.getOpponentFor(player.playerId, msgRequest.gameId)
        this.getClientById(receiverId)?.send(dataMsg({ sendTime: msgRequest.sendTime, text: msgRequest.text }, DataType.MSG_FROM_OPPONENT))
    }
    
}