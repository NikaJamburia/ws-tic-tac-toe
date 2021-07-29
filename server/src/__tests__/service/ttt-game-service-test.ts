import { Game } from "../../domain/game"
import { GameStatus } from "../../domain/game-status"
import { TTTInMemoryRepository } from "../../repository/ttt-in-memory-repository"
import { TTTGameService } from "../../service/ttt-game-service"

describe('tic-tac-toe game service', () => {

    it('can make a move in a game', async () => {
        let repository = new TTTInMemoryRepository()
        repository.addGame(new Game('game1', 'player1', 'player2'))

        let service = new TTTGameService(repository)
        let view = service.makeMove({ gameId: 'game1', coordinateX: 1, coordinateY: 2 }, 'player1')

        expect(view.forX.moves.length).toBe(1)
        expect(view.forX.canMove).toBe(false)
        expect(view.forX.playerId).toBe('player1')
        expect(view.forX.status).toBe(GameStatus.IN_PROGRESS)
        expect(view.forO.canMove).toBe(true)
        expect(view.forO.playerId).toBe('player2')
    })

    it('throws error when game does not exist', async () => {
        let service = new TTTGameService(new TTTInMemoryRepository())

        expect(() => {
            service.makeMove({ gameId: 'game1', coordinateX: 1, coordinateY: 2 }, 'player1')
        }).toThrow("Game not found!")
    })

    it('correctly rethrows errors from game', async () => {
        let repository = new TTTInMemoryRepository()
        repository.addGame(new Game('game1', 'player1', 'player2'))
        let service = new TTTGameService(repository)
        
        expect(() => {
            service.makeMove({ gameId: 'game1', coordinateX: 10, coordinateY: 2 }, 'player1')
        }).toThrow('Invalid cell coordinates!')
    })

    it('correctly initiates new game', async () => {
        let repository = new TTTInMemoryRepository()
        let service = new TTTGameService(repository)

        let waitingGame = service.initiateGame('player1')

        expect(waitingGame.initaiatorId).toBe('player1')
        expect(waitingGame).toBe(repository.getNextWaitingGame())
    })

    it('correctly joins an existing waiting game', async () => {
        let repository = new TTTInMemoryRepository()
        let service = new TTTGameService(repository)

        service.initiateGame('player1')
        let gameView = service.joinGame('player2')

        expect(gameView.forX.playerId).toBe('player1')
        expect(gameView.forO.playerId).toBe('player2')
        expect(gameView.forX.status).toBe(GameStatus.IN_PROGRESS)
        expect(gameView.forX.moves.length).toBe(0)
        expect(repository.getNextWaitingGame()).toBeUndefined()

    })

    it('cancels players game and returns his opponents id', async () => {
        let repository = new TTTInMemoryRepository()
        repository.addGame(new Game('game1', 'player1', 'player2'))
        let service = new TTTGameService(repository)

        let opponentId = service.cancelGame('player1')
        expect(opponentId).toBe("player2")
        expect(repository.getGameById('game1')).toBeUndefined()
    })

    it('restarts game', async () => {
        let repository = new TTTInMemoryRepository()
        repository.addGame(new Game('game1', 'player1', 'player2'))
        let service = new TTTGameService(repository)

        let restartedGame = service.restartGame('game1')

        expect(restartedGame.forX.id === 'game1').toBeFalsy()
        expect(restartedGame.forX.moves.length).toBe(0)
        expect(restartedGame.forX.canMove).toBeTruthy()
        expect(restartedGame.forO.canMove).toBeFalsy()
        expect(repository.getGameById('game1')).toBeUndefined()
    })
})