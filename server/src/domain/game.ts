import { GameData, GameState, MoveData, MoveValue } from "./game-data";
import { GameMove } from "./game-move";

export class Game {

    private moves: Set<GameMove> = new Set()

    constructor(
        private readonly id: string,
        public readonly playerX: string,
        public readonly playerO: string,
    ) {}

    public makeAMove(move: GameMove): GameState {
        console.log(`Making move on cell ${move.coordinateX}, ${move.coordinateY}`);
        this.moves.add(move)
        return this.state()
    }

    private gameDataFor(player: string): GameData {
        return {
            id: this.id,
            moves: this.moveData(),
            canMove: this.moves.size === 0 ? player === this.playerX : this.lastMove().playerId !== player,
            won: false
        }
    }

    private moveData(): MoveData[] {
        return Array.from(this.moves)
            .map(move => ({
                    coordinateX: move.coordinateX, 
                    coordinateY: move.coordinateY, 
                    value: move.playerId === this.playerX ? MoveValue.X : MoveValue.O 
                })
            )
    }

    private lastMove(): GameMove {
        return Array.from(this.moves).pop()!;
    }

    public state(): GameState {
        return {
            forX: this.gameDataFor(this.playerX),
            forO: this.gameDataFor(this.playerO)
        }
    }
    
}