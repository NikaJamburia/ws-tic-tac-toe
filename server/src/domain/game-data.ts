import { GameStatus } from "./game-status";

export interface GameView {
    forX: GameData,
    forO: GameData
}

export interface GameData {
    id: string,
    playerId: string
    moves: MoveData[],
    canMove: boolean,
    status: GameStatus
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