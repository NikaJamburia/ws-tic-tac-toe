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

export enum GameStatus {
    IN_PROGRESS = "IN_PROGRESS",
    WON = "WON",
    LOST = "LOST",
    CANCELED = "CANCELED",
    DRAW = "DRAW",
}

export interface P2PRequestReceivedMsg {
    requestId: string,
    text: string,
    approveText: string,
    rejectText: string
}