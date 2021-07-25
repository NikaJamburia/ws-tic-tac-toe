import { Game } from "../domain/game";
import { WaitingGame } from "../domain/waiting-game";

export interface TTTRepository {
    addGame(game: Game): void
    addWaitingGame(waiting: WaitingGame): void
    getGameById(id: string): Game | undefined
    getNextWaitingGame(): WaitingGame | undefined
    removeGamesForPlayer(playerId: string): Game | undefined
    removeWaitingGamesForPlayer(playerId: string): void
}