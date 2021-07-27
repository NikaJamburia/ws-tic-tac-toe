import { P2PRequest } from "../service/p2p-request-service";

export interface P2PRequestRepository {
    saveRequest(request: P2PRequest): void
    getRequestById(id: string): P2PRequest | undefined
    removeRequest(id: string): void
}