export interface ServiceResponse {
    type: ServiceResponseType
    payload: any
}

export enum ServiceResponseType {
    NOTIFICATION = "NOTIFICATION",
    ERROR = "ERROR",
    DATA = "DATA"
}

export function dataResponseJson(dataPayload: any): string {
    return JSON.stringify({
        type: ServiceResponseType.DATA,
        payload: dataPayload
    })
}

export function errorResponseJson(errorMsg: string): string {
    return JSON.stringify({
        type: ServiceResponseType.ERROR,
        payload: errorMsg
    })
}