import { Game } from "../../domain/game"
import { WaitingGame } from "../../domain/waiting-game"
import { TTTInMemoryRepository } from "../../repository/ttt-in-memory-repository"

describe('tic-tac-toe game in memory repository', () => {

    it('should correctly add and find games', async () => {

        let repository = new TTTInMemoryRepository()
        repository.addGame(new Game('game1', 'player1', 'player2'))
        repository.addGame(new Game('game2', 'player3', 'player4'))

        expect(repository.getGameById('game1')).toBeDefined()
        expect(repository.getGameById('game1')!.id).toBe('game1')

        expect(repository.getGameById('game2')).toBeDefined()
        expect(repository.getGameById('game2')!.id).toBe('game2')
    })

    it('should delete players games', async () => {
        let repository = new TTTInMemoryRepository()
        repository.addGame(new Game('game1', 'player1', 'player2'))
        repository.addGame(new Game('game2', 'player3', 'player4'))
        repository.addGame(new Game('game3', 'player1', 'player5'))

        repository.removeGamesForPlayer('player1')

        expect(repository.getGameById('game1')).toBeUndefined()
        expect(repository.getGameById('game2')).toBeDefined()
        expect(repository.getGameById('game3')).toBeUndefined()
    })

    it('waiting games should be ordered as a FIFO queue', async () => {
        let repository = new TTTInMemoryRepository()
        let game1: WaitingGame = { initaiatorId: 'player1' }
        let game2: WaitingGame = { initaiatorId: 'player2' }
        let game3: WaitingGame = { initaiatorId: 'player3' }

        repository.addWaitingGame(game1)
        repository.addWaitingGame(game2)
        repository.addWaitingGame(game3)

        expect(repository.getNextWaitingGame()).toBe(game1)
        expect(repository.getNextWaitingGame()).toBe(game2)
        expect(repository.getNextWaitingGame()).toBe(game3)
        expect(repository.getNextWaitingGame()).toBeUndefined()
    })

    it('should remove players waiting game from queue', async () => {
        let repository = new TTTInMemoryRepository()
        repository.addWaitingGame({ initaiatorId: 'player1' })
        repository.addWaitingGame({ initaiatorId: 'player2' })

        repository.removeWaitingGamesForPlayer('player1')
        expect(repository.getNextWaitingGame()!.initaiatorId).toBe('player2')
        expect(repository.getNextWaitingGame()).toBeUndefined()
    })

})