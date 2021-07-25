import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import * as url from 'url'
import { GameMessage, GameMessageType } from './messaging/game-message';
import { MoveRequest } from './messaging/game-message';
import { dataMsg, errorMsg, eventMsg, EventType, notificationMsg } from './messaging/msg-from-service';
import { TTTInMemoryRepository } from './repository/ttt-in-memory-repository';
import { TTTGameService } from './service/ttt-game-service';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameRepository = new TTTInMemoryRepository()
let gameService = new TTTGameService(gameRepository)

wss.on('connection', (ws: PlayerWebSocket, request) => {

    ws.playerId = uuid.v4()
    createOrJoinGame(request, ws);
    
    ws.on('close', (code: number, reason: string) => {        
        handleClose(ws);
    })

    ws.on('message', message => {
        handleGameMessage(message, ws);
    })
})

server.listen(3000, () => {
    console.log(`Server started on port 3000`);
});

function handleGameMessage(message: WebSocket.Data, ws: PlayerWebSocket) {

    try {

        let gameMessage = JSON.parse(message as string) as GameMessage;

        switch (gameMessage.type) {
            case GameMessageType.MAKE_MOVE:
                let request = gameMessage.data as MoveRequest;
                let gameView = gameService.makeMove(request, ws.playerId);
                getClientById(wss, gameView.forX.playerId)?.send(dataMsg(gameView.forX));
                getClientById(wss, gameView.forO.playerId)?.send(dataMsg(gameView.forO));
                break;
            case GameMessageType.RESTART:
                break;
            case GameMessageType.QUIT:
                cancelInProgressGame(ws);
                break;
        }

    } catch (error) {
        ws.send(errorMsg(error.message));
    }
}

function createOrJoinGame(request: http.IncomingMessage, ws: PlayerWebSocket) {
    try {
        switch (url.parse(request.url!, true).query.action) {
            case 'NEW':
                initGame(ws);
                break;
            case 'JOIN':
                joinExistingGame(ws);
                break;
            case undefined:
                closeWithError(ws, "Please provide action in query params. NEW or JOIN");
                break;
        }
    } catch (e) {
        closeWithError(ws, e.message)
    }
}

function joinExistingGame(ws: PlayerWebSocket) {
    let gameView = gameService.joinGame(ws.playerId);
    let opponent = getClientById(wss, gameView.forX.playerId);

    if (opponent) {
        ws.send(eventMsg(EventType.GAME_INITIATED, "Game found! joining..."));
        ws.send(dataMsg(gameView.forO));
        opponent.send(dataMsg(gameView.forX));
    } else {
        closeWithError(ws, "Opponent left. Try joining another game!");
    }
}

function initGame(ws: PlayerWebSocket) {
    gameService.initiateGame(ws.playerId);
    ws.send(eventMsg(EventType.GAME_INITIATED, "You are first. wait for opponent"));
}

function getClientById(server: WebSocket.Server, id: string): WebSocket | undefined {
    return Array.from(server.clients).find(c => (c as PlayerWebSocket).playerId === id)
}

function closeWithError(client: PlayerWebSocket, msg: string) {
    client.send(errorMsg(msg))
    client.close()
}

function handleClose(ws: PlayerWebSocket) {
    gameService.cancelWaitingGames(ws.playerId)
    cancelInProgressGame(ws);
}

function cancelInProgressGame(ws: PlayerWebSocket) {
    let opponentId = gameService.cancelGame(ws.playerId);
    if (opponentId) {
        getClientById(wss, opponentId)?.send(eventMsg(EventType.GAME_OVER, "Opponent left"));
    }
}

declare class PlayerWebSocket extends WebSocket {
    playerId: string
}

