import * as uuid from 'uuid'
import { P2PRequestRepository } from '../repository/p2p-request-repository'

export class P2PRequestService {

    constructor(private requestRepository: P2PRequestRepository) {  
    }

    public makeRequest(senderId: string, receiverId: string, onApprove: () => void): string {
        let request: P2PRequest = { 
            requestId: uuid.v4(),
            senderId: senderId,
            receiverId: receiverId,
            onApprove: onApprove
        }
        this.requestRepository.saveRequest(request)
        return request.requestId
    }

    public approveRequest(requestId: string, approverId: string): string {
        let request = this.requireRequest(requestId, approverId)
        request.onApprove()
        this.removeRequest(requestId)
        return request.senderId
    }

    public rejectRequest(requestId: string, rejecterId: string): string {
        let request = this.requireRequest(requestId, rejecterId)
        this.removeRequest(requestId)
        return request.senderId
    }

    private removeRequest(requestId: string) {
        this.requestRepository.removeRequest(requestId)
    }

    private requireRequest(requestId: string, requestReceiverId: string): P2PRequest {
        let request = this.requestRepository.getRequestById(requestId)

        if (request === undefined || request.receiverId !== requestReceiverId) {
            throw new Error("Request not found")
        }
        return request
    }
}

export interface P2PRequest {
    requestId: string,
    senderId: string,
    receiverId: string,
    onApprove: () => void
}