
export interface RequestInteraction {
    requestId: string,
    userId: string,
    interactionType: P2PRequestInteractionType,
}

export enum P2PRequestInteractionType {
    APPROVE_REQUEST = "APPROVE_REQUEST",
    REJECT_REQUEST = "REJECT_REQUEST",
}

export interface MakeRequestToOpponent {
    gameId: string
}