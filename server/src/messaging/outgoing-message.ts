export interface OutgoingMessage {
    type: OutgoingMsgType
    payload: any
}

export enum OutgoingMsgType {
    NOTIFICATION = "NOTIFICATION",
    ERROR = "ERROR",
    DATA = "DATA",
    EVENT = "EVENT",
}

export enum EventType {
    GAME_INITIATED = "GAME_INITIATED",
    GAME_OVER = "GAME_OVER",
    REQUEST_RECEIVED = "REQUEST_RECEIVED",
    REQUEST_APPROVED = "REQUEST_APPROVED",
    REQUEST_REJECTED = "REQUEST_REJECTED",
}

export enum DataType {
    GAME_DATA = "GAME_DATA",
    MSG_FROM_OPPONENT = "MSG_FROM_OPPONENT",
}

export function dataMsg(dataPayload: any, dataType: DataType): string {
    return JSON.stringify({
        type: OutgoingMsgType.DATA,
        dataType: dataType,
        payload: dataPayload
    })
}

export function errorMsg(errorMsg: string): string {
    return JSON.stringify({
        type: OutgoingMsgType.ERROR,
        payload: errorMsg
    })
}

export function notificationMsg(msg: string): string {
    return JSON.stringify({
        type: OutgoingMsgType.NOTIFICATION,
        payload: msg
    })
}

export function eventMsg(type: EventType, additionalData: any | undefined) {
    return JSON.stringify({
        type: OutgoingMsgType.EVENT,
        payload: { eventType: type, additionalData: additionalData }
    })
}