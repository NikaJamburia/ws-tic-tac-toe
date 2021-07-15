import { MoveData } from "./game-data";

export class TTTGrid {

    constructor(private moves: MoveData[]) {
        if (this.moves.length > 9) {            
            throw new Error("Grid cant have more than 9 moves!")
        }
    }

    private readonly rows: MoveData[][] = [1, 2, 3].map(rowNumber => 
        this.moves.filter(m => m.coordinateX === rowNumber))

    private readonly cols: MoveData[][] = [1, 2, 3].map(colNumber => 
        this.moves.filter(m => m.coordinateY === colNumber))

    private readonly diagonal: MoveData[] = this.moves.filter(m => m.coordinateX === m.coordinateY)

    public findWinningCombo(): MoveData[] | undefined {
       return [
            this.rows.find(row => this.isAWin(row)),
            this.cols.find(col => this.isAWin(col)),
            this.isAWin(this.diagonal) ? this.diagonal : undefined
        ].find(result => result !== undefined)
    }

    private isAWin(moves: MoveData[]): boolean {
        if(moves.length === 3) {
            return moves[0].value === moves[1].value
                && moves[0].value === moves[2].value
        }
        return false
        
    }
}