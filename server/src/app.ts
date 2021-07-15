import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import { Game } from './domain/game';
import { GameMessage, GameMessageType } from './messaging/game-message';
import { MoveRequest } from './messaging/move-request';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let conCount = 0
let game: Game | undefined

wss.on('connection', (ws: PlayerWebSocket) => {
    ws.playerId = uuid.v4()
    conCount += 1

    console.log(conCount);
    

    if(conCount === 2 && game === undefined) {
        let client1 = Array.from(wss.clients)[0] as PlayerWebSocket
        game = new Game(uuid.v4(), client1.playerId, ws.playerId)
        let gameState = game.view()

        client1.send(JSON.stringify(gameState.forX))
        ws.send(JSON.stringify(gameState.forO))
    }

    if(conCount < 2) {
        ws.send("You are first. wait for opponent")
    }

    if(conCount > 2) {
        ws.send("Game in progress, wait for a while")
        ws.close(undefined, "Game in progress")
        conCount -= 1
    }

    console.log(game);

    ws.on('close', (code: number, reason: string) => {        
        conCount -= 1
        if (game) {
            let closedPlayerId = (ws as PlayerWebSocket).playerId
            if (game.playerO === closedPlayerId || game.playerX === closedPlayerId) {                
                game = undefined;
                wss.clients.forEach(c => c.send("Opponent left"))
            }
        }
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
                        
                        getClientById(wss, game.playerX)?.send(JSON.stringify(view.forX))
                        getClientById(wss, game.playerO)?.send(JSON.stringify(view.forO))
                    } catch(error) {
                        ws.send(error.message)
                    }
                    break;
                case GameMessageType.RESTART:
                    break;
                case GameMessageType.QUIT:
                    break;
            }
        } else {
            ws.send("Game does not exist!")
            ws.close(undefined, "Not found")
        }
    })
})

server.listen(3000, () => {
    console.log(`Server started on port 3000 :)`);
});

declare class PlayerWebSocket extends WebSocket {
    playerId: string
}

function getClientById(server: WebSocket.Server, id: string): WebSocket | undefined {
    return Array.from(server.clients).find(c => (c as PlayerWebSocket).playerId === id)
}
