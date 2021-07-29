export interface IncomingMessage {
    type: IncomingMessageType
    data: any
}

export enum IncomingMessageType {
    MAKE_MOVE = "MAKE_MOVE",
    QUIT = "QUIT",
    RESTART = "RESTART",
    PLAY_AGAIN = "PLAY_AGAIN",
    MSG_TO_OPPONENT = "MSG_TO_OPPONENT",
    ANSWER_TO_P2P_REQUEST = "ANSWER_TO_P2P_REQUEST",
}

export interface MoveRequest {
    gameId: string
    coordinateX: number
    coordinateY: number
}

export interface GameIdRequest {
    gameId: string
}