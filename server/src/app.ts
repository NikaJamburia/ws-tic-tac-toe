import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import { Game } from './domain/game';

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
        let gameState = game.state()

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

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        setTimeout(() => {
            ws.send(`You sent => ${message} from ${ws}`)
        }, 2000);
    })

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
})

server.listen(3000, () => {
    console.log(`Server started on port 3000 :)`);
});

declare class PlayerWebSocket extends WebSocket {
    playerId: string
}