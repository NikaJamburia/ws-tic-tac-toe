export interface GameState {
    forX: GameData,
    forO: GameData
}

export interface GameData {
    id: string,
    moves: MoveData[],
    canMove: boolean,
    won: boolean
}

export interface MoveData {
    coordinateX: number,
    coordinateY: number,
    value: MoveValue,
}

export enum MoveValue {
    X = "X",
    O = "O"
}