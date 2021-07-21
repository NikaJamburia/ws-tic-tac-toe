import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import { Game } from './domain/game';
import { GameMessage, GameMessageType } from './messaging/game-message';
import { MoveRequest } from './messaging/game-message';
import { dataMsg, errorMsg, eventMsg, EventType, notificationMsg } from './messaging/msg-from-service';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let conCount = 0
let game: Game | undefined

wss.on('connection', (ws: PlayerWebSocket) => {
    ws.playerId = uuid.v4()
    initGame(ws)

    ws.on('close', (code: number, reason: string) => {        
        handleClose(ws);
    })

    ws.on('message', message => {
        let gameMessage = JSON.parse(message as string) as GameMessage
        let playerId = (ws as PlayerWebSocket).playerId

        if(game && game.id === gameMessage.gameId) {
            switch(gameMessage.type) {
                case GameMessageType.MAKE_MOVE:
                    try {
                        let request = gameMessage.data as MoveRequest
                        let view = game.makeAMove( { coordinateX: request.coordinateX, coordinateY: request.coordinateY, playerId } )
                        
                        getClientById(wss, game.playerX)?.send(dataMsg(view.forX))
                        getClientById(wss, game.playerO)?.send(dataMsg(view.forO))
                    } catch(error) {
                        ws.send(errorMsg(error.message))
                    }
                    break;
                case GameMessageType.RESTART:
                    break;
                case GameMessageType.QUIT:
                    break;
            }
        } else {
            ws.send(errorMsg("Game does not exist!"))
            ws.close(undefined, "Not found")
        }
    })
})

server.listen(3000, () => {
    console.log(`Server started on port 3000`);
});

declare class PlayerWebSocket extends WebSocket {
    playerId: string
}

function getClientById(server: WebSocket.Server, id: string): WebSocket | undefined {
    return Array.from(server.clients).find(c => (c as PlayerWebSocket).playerId === id)
}

function initGame(ws: PlayerWebSocket) {
    conCount += 1

    console.log(conCount);
    

    if(conCount === 2 && game === undefined) {
        let client1 = Array.from(wss.clients)[0] as PlayerWebSocket
        game = new Game(uuid.v4(), client1.playerId, ws.playerId)
        let gameState = game.view()

        ws.send(eventMsg(EventType.GAME_INITIATED, "Game found!"))
        client1.send(dataMsg(gameState.forX))
        ws.send(dataMsg(gameState.forO))
    }

    if(conCount < 2) {
        ws.send(eventMsg(EventType.GAME_INITIATED, "You are first. wait for opponent"))
    }

    if(conCount > 2) {
        ws.send(eventMsg(EventType.GAME_OVER, "Game in progress, wait for a while"))
        ws.close(undefined, "Game in progress")
    }

    console.log(game);
}

function handleClose(ws: PlayerWebSocket) {
    conCount -= 1;
    if (game) {
        let closedPlayerId = (ws as PlayerWebSocket).playerId;
        if (game.playerO === closedPlayerId || game.playerX === closedPlayerId) {
            game = undefined;
            wss.clients.forEach(c => c.send(eventMsg(EventType.GAME_OVER, "Opponent left")));
            wss.clients.forEach(c => c.close())
        }
    }
}
