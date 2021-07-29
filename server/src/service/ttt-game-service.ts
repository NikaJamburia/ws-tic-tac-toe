import { Game } from "../domain/game";
import { GameView, MoveData } from "../domain/game-data";
import { WaitingGame } from "../domain/waiting-game";
import { MoveRequest } from "../messaging/incoming-message";
import { TTTRepository } from "../repository/ttt-repository";
import * as uuid from 'uuid';
import { SendMessageRequest } from "../messaging/send-message-request";

export class TTTGameService {

    constructor(private gameRepository: TTTRepository) {}

    makeMove(request: MoveRequest, moverId: string): GameView {
        let game = this.gameRepository.getGameById(request.gameId)

        if (game) {
            return game.makeAMove({ 
                coordinateX: request.coordinateX, 
                coordinateY: request.coordinateY, 
                playerId: moverId 
            })
        } else {
            throw new Error("Game not found!")
        }
    }

    initiateGame(playerId: string): WaitingGame {
        this.cancelWaitingGames(playerId)
        let waitingGame: WaitingGame = { initaiatorId: playerId }
        this.gameRepository.addWaitingGame(waitingGame)

        return waitingGame
    }

    joinGame(playerId: string): GameView {
        let waitingGame = this.gameRepository.getNextWaitingGame()

        if(waitingGame) {
            let game = new Game(uuid.v4(), waitingGame.initaiatorId, playerId)
            this.gameRepository.addGame(game)
            return game.view()
        } else {
            throw new Error("No pending games. Try createing new one!")
        }
    }

    cancelGame(playerId: string): string | undefined {
        let removedGame = this.gameRepository.removeGamesForPlayer(playerId)
        return removedGame === undefined 
            ? undefined
            : removedGame.opponentFor(playerId)
    }

    cancelWaitingGames(playerId: string): void {
        this.gameRepository.removeWaitingGamesForPlayer(playerId)
    }

    getOpponentFor(playerId: string, gameId: string): string {
        let game = this.gameRepository.getGameById(gameId)

        if(game) {
            return game.opponentFor(playerId)
        } else {
            throw new Error("Game not found!")
        }
    }

    restartGame(gameid: string): GameView {
        let game = this.gameRepository.getGameById(gameid)

        if(game) {
            this.gameRepository.removeGamesForPlayer(game.playerX)
            let newGame = new Game(uuid.v4(), game.playerX, game.playerO)
            this.gameRepository.addGame(newGame)
            return newGame.view()

        } else {
            throw new Error("Game not found!")
        }
    }

    playAgain(gameid: string): GameView {
        let game = this.gameRepository.getGameById(gameid)

        if(game) {
            this.gameRepository.removeGamesForPlayer(game.playerX)
            let newGame = new Game(uuid.v4(), game.playerO, game.playerX)
            this.gameRepository.addGame(newGame)
            return newGame.view()

        } else {
            throw new Error("Game not found!")
        }
    }

}