import { P2PRequestInMemoryRepository } from "../../repository/p2p-request-in-memory-repository"
import { P2PRequestService } from "../../service/p2p-request-service"

describe('p2p request service', () => {

    const NIKA = 'nika'
    const BEQA = 'beqa'

    it('creates request and saves it to repository', async () => {
        let repo = new P2PRequestInMemoryRepository()
        let service = new P2PRequestService(repo)

        let requestId = service.makeRequest(NIKA, BEQA, () => console.log('aaa'))

        let request = repo.getRequestById(requestId)
        expect(request).toBeDefined()
        expect(request?.requestId).toBe(requestId)
        expect(request?.senderId).toBe(NIKA)
        expect(request?.receiverId).toBe(BEQA)
    })

    it('executes requests on approve callback and removes request from repository', async () => {
        let someState = 1
        let repo = new P2PRequestInMemoryRepository()
        let service = new P2PRequestService(repo)
        let requestId = service.makeRequest(NIKA, BEQA, () => someState += 1)

        service.approveRequest(requestId, BEQA)

        expect(someState).toBe(2)
        expect(repo.getRequestById(requestId)).toBeUndefined()
    })

    it('throws error if user tries to approve non existing request', async () => {
        let repo = new P2PRequestInMemoryRepository()
        let service = new P2PRequestService(repo)

        expect(() =>
            service.approveRequest("r10", BEQA)
        ).toThrow("Request not found")
    })

    it('throws error if user tries to interact with request thats not intended for him', async () => {
        let repo = new P2PRequestInMemoryRepository()
        let service = new P2PRequestService(repo)
        let requestId = service.makeRequest(NIKA, BEQA, () => console.log("aaa"))

        expect(() =>
            service.approveRequest(requestId, NIKA)
        ).toThrow("Request not found")

        expect(() =>
            service.rejectRequest(requestId, NIKA)
        ).toThrow("Request not found")

        expect(() =>
            service.approveRequest(requestId, "Some user")
        ).toThrow("Request not found")
    })

    it('returns senders id and removes request whe its rejected', async () => {
        let someState = 1
        let repo = new P2PRequestInMemoryRepository()
        let service = new P2PRequestService(repo)
        let requestId = service.makeRequest(NIKA, BEQA, () => someState += 1)

        service.rejectRequest(requestId, BEQA)

        expect(someState).toBe(1)
        expect(repo.getRequestById(requestId)).toBeUndefined()
    })

})