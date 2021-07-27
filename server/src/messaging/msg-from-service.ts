export interface MsgFromService {
    type: ServiceMsgType
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

export enum DataType {
    GAME_DATA = "GAME_DATA",
    MSG_FROM_OPPONENT = "MSG_FROM_OPPONENT",
}

export function dataMsg(dataPayload: any, dataType: DataType): string {
    return JSON.stringify({
        type: ServiceMsgType.DATA,
        dataType: dataType,
        payload: dataPayload
    })
}

export function errorMsg(errorMsg: string): string {
    return JSON.stringify({
        type: ServiceMsgType.ERROR,
        payload: errorMsg
    })
}

export function notificationMsg(msg: string): string {
    return JSON.stringify({
        type: ServiceMsgType.NOTIFICATION,
        payload: msg
    })
}

export function eventMsg(type: EventType, message: string | undefined) {
    return JSON.stringify({
        type: ServiceMsgType.EVENT,
        payload: { eventType: type, message: message }
    })
}