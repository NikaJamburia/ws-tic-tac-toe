import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import { IncomingMessage, IncomingMessageType } from './messaging/incoming-message';
import {errorMsg} from './messaging/outgoing-message';
import { TTTInMemoryRepository } from './repository/ttt-in-memory-repository';
import { TTTGameService } from './service/ttt-game-service';
import { IncomingMsgHandler } from './messaging/handler/incoming-msg-handler';
import { MakeMovehandler } from './messaging/handler/make-move-handler';
import { QuitGameHandler } from './messaging/handler/quit-game-handler';
import { RestartGametHandler } from './messaging/handler/restart-game-handler';
import { PlayAgainHandler } from './messaging/handler/play-again-handler';
import { MsgToOpponentHandler } from './messaging/handler/msg-to-opponent-handler';
import { P2PRequestInMemoryRepository } from './repository/p2p-request-in-memory-repository';
import { P2PRequestService } from './service/p2p-request-service';
import { AnswerToP2PRequestHandler } from './messaging/handler/answer-to-p2p-request';
import { createOrJoinGame } from './on-connection';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let p2pRequestRepository = new P2PRequestInMemoryRepository()
let gameRepository = new TTTInMemoryRepository()

let p2pRequestService = new P2PRequestService(p2pRequestRepository)
let gameService = new TTTGameService(gameRepository)

const incomingMsgHandlers: Map<IncomingMessageType, IncomingMsgHandler> = registerIncomingMsgHandlers()

wss.on('connection', (ws: PlayerWebSocket, request) => {

    ws.playerId = uuid.v4()
    createOrJoinGame(request, ws, wss, gameService);
    
    ws.on('close', (code: number, reason: string) => {        
        incomingMsgHandlers.get(IncomingMessageType.QUIT)?.handle({ type: IncomingMessageType.QUIT, data: {} }, ws)
    })

    ws.on('message', message => {
        handleIncomingMessage(message, ws);
    })
})

server.listen(3000, () => {
    console.log(`Server started on port 3000`);
});

function handleIncomingMessage(message: WebSocket.Data, ws: PlayerWebSocket) {

    try {
        let incomingMessage = JSON.parse(message as string) as IncomingMessage;
        let msgHandler = incomingMsgHandlers.get(incomingMessage.type)
        
        if(msgHandler) {
            msgHandler.handle(incomingMessage, ws)
        } else {
            throw new Error("Message not recognized!")
        }
    } catch (error) {
        ws.send(errorMsg(error.message));
    }
}

function registerIncomingMsgHandlers(): Map<IncomingMessageType, IncomingMsgHandler> {
    let handlersMap = new Map()
    handlersMap.set(IncomingMessageType.MAKE_MOVE, new MakeMovehandler(wss, gameService)),
    handlersMap.set(IncomingMessageType.QUIT, new QuitGameHandler(wss, gameService)),
    handlersMap.set(IncomingMessageType.RESTART, new RestartGametHandler(wss, p2pRequestService, gameService)),
    handlersMap.set(IncomingMessageType.PLAY_AGAIN, new PlayAgainHandler(wss, p2pRequestService, gameService)),
    handlersMap.set(IncomingMessageType.MSG_TO_OPPONENT, new MsgToOpponentHandler(wss, gameService)),
    handlersMap.set(IncomingMessageType.ANSWER_TO_P2P_REQUEST, new AnswerToP2PRequestHandler(wss, p2pRequestService));
    return handlersMap
}

export declare class PlayerWebSocket extends WebSocket {
    playerId: string
}

