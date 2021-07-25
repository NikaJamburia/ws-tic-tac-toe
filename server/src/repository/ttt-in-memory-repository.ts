import { Game } from "../domain/game";
import { WaitingGame } from "../domain/waiting-game";
import { TTTRepository } from "./ttt-repository";

export class TTTInMemoryRepository implements TTTRepository {

    private games: Game[] = []
    private waitingGames: WaitingGame[] = []

    addGame(game: Game): void {
        this.games.push(game)
    }

    addWaitingGame(waiting: WaitingGame): void {
        this.waitingGames.push(waiting)
    }

    getGameById(id: string): Game | undefined {
        return this.games.find(g => g.id === id)        
    }

    getNextWaitingGame(): WaitingGame | undefined {
        return this.waitingGames.shift()
    }

    removeGamesForPlayer(playerId: string): Game | undefined {
        let game = this.games
            .find(g => g.playerX === playerId || g.playerO === playerId)
        this.games = this.games.filter(g => g.playerX !== playerId && g.playerO !== playerId)
        return game
    }

    removeWaitingGamesForPlayer(playerId: string): void {
        this.waitingGames = this.waitingGames.filter(g => g.initaiatorId !== playerId)
    }

}