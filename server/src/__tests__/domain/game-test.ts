import { Game } from "../../domain/game"
import { MoveValue } from "../../domain/game-data"
import { GameStatus } from "../../domain/game-status"

const NIKA = "123"
const BEQA = "456"

describe('tic-tac-toe game', () => {

    it('should return empty game when instantiated', async () => {
        let gameView = new Game("1", NIKA, BEQA).view()

        expect(gameView.forX.moves.length).toBe(0)
        expect(gameView.forO.moves.length).toBe(0)
    })

    it('should be correctly viewed by both players', async () => {
        let gameView = new Game("1", NIKA, BEQA).view()

        expect(gameView.forX.canMove).toBe(true)
        expect(gameView.forO.canMove).toBe(false)

        expect(gameView.forX.status).toBe(GameStatus.IN_PROGRESS)
        expect(gameView.forO.status).toBe(GameStatus.IN_PROGRESS)

        expect(gameView.forX.id).toEqual("1")
        expect(gameView.forO.id).toEqual("1")

        expect(gameView.forX.playerId).toBe(NIKA)
        expect(gameView.forO.playerId).toBe(BEQA)
    })

    it('should not let player whos turn didnt come to move', async () => {
        let game = new Game("1", NIKA, BEQA)

        expect(() => { 
            game.makeAMove({ coordinateX: 1, coordinateY: 1, playerId: BEQA }) 
        }).toThrow("Not your turn!")
    })

    it('should not let you move on invalid coordinates', async () => {
        let game = new Game("1", NIKA, BEQA)

        expect(() => { 
            game.makeAMove({ coordinateX: 0, coordinateY: 1, playerId: NIKA }) 
        }).toThrow("Invalid cell coordinates!")

        expect(() => { 
            game.makeAMove({ coordinateX: 4, coordinateY: 1, playerId: NIKA }) 
        }).toThrow("Invalid cell coordinates!")

        expect(() => { 
            game.makeAMove({ coordinateX: 1, coordinateY: 0, playerId: NIKA }) 
        }).toThrow("Invalid cell coordinates!")

        expect(() => { 
            game.makeAMove({ coordinateX: 1, coordinateY: 4, playerId: NIKA }) 
        }).toThrow("Invalid cell coordinates!")
    })

    it('should not let you move on filled cell', async () => {
        let game = new Game("1", NIKA, BEQA)

        game.makeAMove({ coordinateX: 1, coordinateY: 1, playerId: NIKA })

        expect(() => { 
            game.makeAMove({ coordinateX: 1, coordinateY: 1, playerId: BEQA }) 
        }).toThrow("Cell already filled!")
    })

    it('should give correct views to players after moves', async () => {
        let game = new Game("1", NIKA, BEQA)

        let viewAfterMoveX = game.makeAMove({ coordinateX: 1, coordinateY: 1, playerId: NIKA })
        expect(viewAfterMoveX.forX.canMove).toBe(false)
        expect(viewAfterMoveX.forX.moves.length).toBe(1)
        expect(viewAfterMoveX.forX.moves[0].value).toBe(MoveValue.X)
        expect(viewAfterMoveX.forX.status).toBe(GameStatus.IN_PROGRESS)

        expect(viewAfterMoveX.forO.canMove).toBe(true)
        expect(viewAfterMoveX.forO.moves.length).toBe(1)
        expect(viewAfterMoveX.forO.moves[0].value).toBe(MoveValue.X)
        expect(viewAfterMoveX.forO.status).toBe(GameStatus.IN_PROGRESS)

        let viewAfterMoveO = game.makeAMove({ coordinateX: 1, coordinateY: 2, playerId: BEQA })
        expect(viewAfterMoveO.forX.canMove).toBe(true)
        expect(viewAfterMoveO.forX.moves.length).toBe(2)
        expect(viewAfterMoveO.forX.moves[1].value).toBe(MoveValue.O)
        expect(viewAfterMoveO.forX.status).toBe(GameStatus.IN_PROGRESS)

        expect(viewAfterMoveO.forO.canMove).toBe(false)
        expect(viewAfterMoveO.forO.moves.length).toBe(2)
        expect(viewAfterMoveO.forO.moves[1].value).toBe(MoveValue.O)
        expect(viewAfterMoveO.forO.status).toBe(GameStatus.IN_PROGRESS)
    })

    it('should give status of draw to both player when draw', async () => {
        let game = new Game("1", BEQA, NIKA)
        game.makeAMove({ coordinateX: 1, coordinateY: 1, playerId: BEQA })
        game.makeAMove({ coordinateX: 1, coordinateY: 2, playerId: NIKA })
        game.makeAMove({ coordinateX: 2, coordinateY: 3, playerId: BEQA })
        game.makeAMove({ coordinateX: 2, coordinateY: 2, playerId: NIKA })
        game.makeAMove({ coordinateX: 3, coordinateY: 2, playerId: BEQA })
        game.makeAMove({ coordinateX: 3, coordinateY: 3, playerId: NIKA })
        game.makeAMove({ coordinateX: 3, coordinateY: 1, playerId: BEQA })

        let beforeDraw = game.makeAMove({ coordinateX: 2, coordinateY: 1, playerId: NIKA })
        expect(beforeDraw.forX.status).toBe(GameStatus.IN_PROGRESS)
        expect(beforeDraw.forO.status).toBe(GameStatus.IN_PROGRESS)
        expect(beforeDraw.forX.moves.length).toBe(8)

        let drawView = game.makeAMove({ coordinateX: 1, coordinateY: 3, playerId: BEQA })
        expect(drawView.forX.status).toBe(GameStatus.DRAW)
        expect(drawView.forO.status).toBe(GameStatus.DRAW)
        expect(drawView.forX.moves.length).toBe(9)
    })

    it('should give players correct statuses when one of them wins', async () => {
        let game = new Game("1", NIKA, BEQA)
        game.makeAMove({ coordinateX: 1, coordinateY: 1, playerId: NIKA })
        game.makeAMove({ coordinateX: 2, coordinateY: 1, playerId: BEQA })
        game.makeAMove({ coordinateX: 1, coordinateY: 2, playerId: NIKA })
        game.makeAMove({ coordinateX: 2, coordinateY: 2, playerId: BEQA })
        let lastView = game.makeAMove({ coordinateX: 1, coordinateY: 3, playerId: NIKA })

        expect(lastView.forX.status).toBe(GameStatus.WON)
        expect(lastView.forO.status).toBe(GameStatus.LOST)
    })

    it('should correctly identify opponents', async () => {
        let game = new Game("1", NIKA, BEQA)

        expect(game.opponentFor(NIKA)).toBe(BEQA)
        expect(game.opponentFor(BEQA)).toBe(NIKA)
        expect(() => {
            game.opponentFor('vigaca')
        }).toThrow('This game doesnt have given player!')
    })
})