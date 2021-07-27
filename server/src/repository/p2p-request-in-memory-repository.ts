import { P2PRequest } from "../service/p2p-request-service";
import { P2PRequestRepository } from "./p2p-request-repository";

export class P2PRequestInMemoryRepository implements P2PRequestRepository {

    private requests: P2PRequest[] = []
    
    saveRequest(request: P2PRequest): void {
        this.requests.push(request)
    }

    getRequestById(id: string): P2PRequest | undefined {
        return this.requests.find(r => r.requestId === id)
    }

    removeRequest(id: string): void {
        this.requests = this.requests.filter(r => r.requestId !== id)
    }
    
}