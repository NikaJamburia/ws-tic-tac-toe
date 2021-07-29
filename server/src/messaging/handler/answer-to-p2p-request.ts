import * as WebSocket from 'ws';
import { PlayerWebSocket } from "../../app";
import { P2PRequestService } from '../../service/p2p-request-service';
import { IncomingMessage } from "../incoming-message";
import { eventMsg, EventType } from '../outgoing-message';
import { P2PRequestInteractionType, RequestInteraction } from '../request-interaction';
import { BaseMsgHandler } from "./base-msg-handler";

export class AnswerToP2PRequestHandler extends BaseMsgHandler {

    constructor(server: WebSocket.Server, private requestService: P2PRequestService) {
        super(server)
    }

    handle(msg: IncomingMessage, player: PlayerWebSocket): void {
        let data = msg.data as RequestInteraction

        if(data.interactionType === P2PRequestInteractionType.APPROVE_REQUEST) {
            let senderId = this.requestService.approveRequest(data.requestId, data.userId)
            this.getClientById(senderId)?.send(eventMsg(EventType.REQUEST_APPROVED, "Opponent accepted your request!"))
        }

        if(data.interactionType === P2PRequestInteractionType.REJECT_REQUEST) {
            let requestSender = this.requestService.rejectRequest(data.requestId, data.userId)
            this.getClientById(requestSender)?.send(eventMsg(EventType.REQUEST_REJECTED, "Opponent rejected your request"))
        }
    
    }

}