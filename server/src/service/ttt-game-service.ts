import { Game } from "../domain/game";
import { GameView, MoveData } from "../domain/game-data";
import { WaitingGame } from "../domain/waiting-game";
import { MoveRequest } from "../messaging/game-message";
import { TTTRepository } from "../repository/ttt-repository";
import * as uuid from 'uuid';

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

}