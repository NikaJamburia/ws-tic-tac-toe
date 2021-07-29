import { PlayerWebSocket } from "../../app";
import { IncomingMessage, IncomingMessageType } from "../incoming-message";

export interface IncomingMsgHandler {
    handle(msg: IncomingMessage, player: PlayerWebSocket): void
}