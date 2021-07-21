import { GameData, GameView, MoveData, MoveValue } from "./game-data";
import { GameMove } from "./game-move";
import { GameStatus } from "./game-status";
import { TTTGrid } from "./grid";

export class Game {

    private moves: GameMove[] = []
    private lastStatus: GameStatus = GameStatus.IN_PROGRESS

    constructor(
        public readonly id: string,
        public readonly playerX: string,
        public readonly playerO: string,
    ) {}

    public makeAMove(move: GameMove): GameView {
        this.validateMove(move)
        this.moves.push(move)
        let view = this.view()
        this.lastStatus = view.forX.status
        return view
    }

    public view(): GameView {
        return {
            forX: this.gameDataFor(this.playerX),
            forO: this.gameDataFor(this.playerO)
        }
    }

    private validateMove(move: GameMove) {

        let error = ""

        if(this.lastStatus !== GameStatus.IN_PROGRESS) {
            error += "Game Finished!"
        }
        if(!this.canMove(move.playerId)) {
            error += "Not your turn!"
        }
        if(!this.cellIsFree(move)) {
            error += "Cell already filled!"
        }
        if(!this.coordinatesAreValid(move)) {
            error += "Invalid cell coordinates!"
        }

        if(error !== "") {
            throw new Error(error)
        }
    }

    private coordinatesAreValid(move: GameMove): boolean {
        return (move.coordinateX >= 1 && move.coordinateX <= 3)
            && (move.coordinateY >= 1 && move.coordinateY <= 3)
    }

    private gameDataFor(player: string): GameData {
        return {
            id: this.id,
            moves: this.moveData(),
            canMove: this.canMove(player),
            status: this.gameStatusFor(player)
        }
    }

    private gameStatusFor(playerId: string): GameStatus {
        let winner = this.winner()
        if(winner) {
            return winner === playerId ? GameStatus.WON : GameStatus.LOST
        }
        return this.moves.length < 9 ? GameStatus.IN_PROGRESS : GameStatus.DRAW
    }

    private winner(): string | undefined {
        let winningCombo = new TTTGrid(this.moveData()).findWinningCombo()

        return winningCombo 
            ? winningCombo[0].value === MoveValue.X ? this.playerX : this.playerO
            : undefined
    }

    private moveData(): MoveData[] {
        return this.moves
            .map(move => ({
                    coordinateX: move.coordinateX, 
                    coordinateY: move.coordinateY, 
                    value: move.playerId === this.playerX ? MoveValue.X : MoveValue.O 
                })
            )
    }

    private canMove(playerId: string): boolean {
        return this.moves.length === 0 
            ? playerId === this.playerX 
            : this.moves[this.moves.length-1].playerId !== playerId
    }

    private cellIsFree(move: GameMove): boolean {
        return this.moves.find(m => 
            m.coordinateX === move.coordinateX 
                && m.coordinateY === move.coordinateY) === undefined
    }
    
}