import * as http from 'http';
import * as WebSocket from 'ws';
import * as url from 'url'
import { dataMsg, DataType, errorMsg, eventMsg, EventType } from './messaging/outgoing-message';
import { PlayerWebSocket } from './app';
import { TTTGameService } from './service/ttt-game-service';

export function createOrJoinGame(request: http.IncomingMessage, ws: PlayerWebSocket, server: WebSocket.Server, gameService: TTTGameService) {
    try {
        switch (url.parse(request.url!, true).query.action) {
            case 'NEW':
                initGame(ws, gameService);
                break;
            case 'JOIN':
                joinExistingGame(ws, gameService, server);
                break;
            case undefined:
                closeWithError(ws, "Please provide action in query params. NEW or JOIN");
                break;
        }
    } catch (e) {
        closeWithError(ws, e.message)
    }
}

function joinExistingGame(ws: PlayerWebSocket, gameService: TTTGameService, server: WebSocket.Server) {
    let gameView = gameService.joinGame(ws.playerId);
    let opponent = Array.from(server.clients).find(c => (c as PlayerWebSocket).playerId === gameView.forX.playerId)

    if (opponent) {
        ws.send(eventMsg(EventType.GAME_INITIATED, "Game found! joining..."));
        ws.send(dataMsg(gameView.forO, DataType.GAME_DATA));
        opponent.send(dataMsg(gameView.forX, DataType.GAME_DATA));
    } else {
        closeWithError(ws, "Opponent left. Try joining another game!");
    }
}

function initGame(ws: PlayerWebSocket, gameService: TTTGameService) {
    gameService.initiateGame(ws.playerId);
    ws.send(eventMsg(EventType.GAME_INITIATED, "Game created. Wait for opponent"));
}

function closeWithError(client: PlayerWebSocket, msg: string) {
    client.send(errorMsg(msg))
    client.close()
}