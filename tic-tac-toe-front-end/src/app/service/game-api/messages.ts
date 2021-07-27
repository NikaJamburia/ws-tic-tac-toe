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

export enum DataType {
    GAME_DATA = "GAME_DATA",
    MSG_FROM_OPPONENT = "MSG_FROM_OPPONENT",
}

export interface MsgFromService {
    type: ServiceMsgType,
    dataType?: DataType
    payload: any
}

export enum ServiceMsgType {
    NOTIFICATION = "NOTIFICATION",
    ERROR = "ERROR",
    DATA = "DATA",
    EVENT = "EVENT",
}

export enum EventType {
    GAME_INITIATED = "GAME_INITIATED",
    GAME_OVER = "GAME_OVER"
}