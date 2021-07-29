import * as WebSocket from 'ws';
import { PlayerWebSocket } from '../../app';
import { IncomingMessage } from "../incoming-message";
import { errorMsg } from '../outgoing-message';
import { IncomingMsgHandler } from "./incoming-msg-handler";

export abstract class BaseMsgHandler implements IncomingMsgHandler {

    constructor(private server: WebSocket.Server) {
        
    }

    abstract handle(msg: IncomingMessage, player: PlayerWebSocket): void

    protected getClientById(id: string): WebSocket | undefined {
        return Array.from(this.server.clients).find(c => (c as PlayerWebSocket).playerId === id)
    }

    protected closeWithError(client: PlayerWebSocket, msg: string) {
        client.send(errorMsg(msg))
        client.close()
    }
    
}