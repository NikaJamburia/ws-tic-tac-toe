export interface GameMessage {
    type: GameMessageType
    data: any
}

export enum GameMessageType {
    MAKE_MOVE = "MAKE_MOVE",
    QUIT = "QUIT",
    RESTART = "RESTART",
    MSG_TO_OPPONENT="MSG_TO_OPPONENT"
}

export interface MoveRequest {
    gameId: string
    coordinateX: number
    coordinateY: number
}