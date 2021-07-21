export interface GameMessage {
    type: GameMessageType
    gameId: string
    data: any
}

export enum GameMessageType {
    MAKE_MOVE = "MAKE_MOVE",
    QUIT = "QUIT",
    RESTART = "RESTART"
}

export interface MoveRequest {
    coordinateX: number
    coordinateY: number
}