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

export function dataMsg(dataPayload: any): string {
    return JSON.stringify({
        type: ServiceMsgType.DATA,
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