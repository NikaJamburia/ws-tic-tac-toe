import { P2PRequestInMemoryRepository } from "../../repository/p2p-request-in-memory-repository"

describe('p2p request in memory repository', () => {

    it('should correctly save and get requests', async () => {
        let repository = new P2PRequestInMemoryRepository()
        repository.saveRequest({ requestId: "r1", senderId: "p1", receiverId: "p2", onApprove: () => console.log("aaa") })

        let request = repository.getRequestById("r1")
        expect(request).toBeDefined()
        expect(request?.requestId).toBe("r1")
    })

    it('should be able to delete requests', async () => {
        let repository = new P2PRequestInMemoryRepository()
        repository.saveRequest({ requestId: "r1", senderId: "p1", receiverId: "p2", onApprove: () => console.log("aaa") })
        repository.removeRequest("r1")

        expect(repository.getRequestById("r1")).toBeUndefined()

    })
    
})