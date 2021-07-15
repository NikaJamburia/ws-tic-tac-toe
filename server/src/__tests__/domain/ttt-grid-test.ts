import { MoveData, MoveValue } from "../../domain/game-data"
import { TTTGrid } from "../../domain/grid"

describe('tic tac toe grid', () => {

    it('should not return winner on empty grid', async () => {
      let grid = new TTTGrid([])
      expect(grid.findWinningCombo()).toBeUndefined()
    })

    it('should return winning row', async () => {
      let moves: MoveData[] = [
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 3, value: MoveValue.X }
      ]
      let grid = new TTTGrid(moves)

      let win = grid.findWinningCombo()
      expect(win).toBeDefined()
      expect(win?.length).toEqual(3)
      expect(win!.every(w => w.value === MoveValue.X)).toBe(true)
    })

    it('should not return winner on incomplete row', async () => {
      let moves: MoveData[] = [
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.X }      
      ]

      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()

    })

    
    it('should not return winner on row containing different values', async () => {
      let moves: MoveData[] = [
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.O }
      ]

      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()

    })

    it('should return winner from diagonal row', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.O },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.O },
        { coordinateX: 3, coordinateY: 3, value: MoveValue.O }
      ]

      let grid = new TTTGrid(moves)
      let win = grid.findWinningCombo()
      expect(win).toBeDefined()
      expect(win?.length).toEqual(3)
      expect(win!.every(w => w.value === MoveValue.O)).toBe(true)
      expect(win!.find(w => w.coordinateY === 1 && w.coordinateX === 1)).toBeDefined()
      expect(win!.find(w => w.coordinateY === 2 && w.coordinateX === 2)).toBeDefined()
      expect(win!.find(w => w.coordinateY === 3 && w.coordinateX === 3)).toBeDefined()

    })

    it('should not return winner on diagonal row containing different values', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.O },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 3, value: MoveValue.O }
      ]

      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()

    })

    it('should not return winner on incomplete diagonal row', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.O },
        { coordinateX: 3, coordinateY: 3, value: MoveValue.O }
      ]

      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()

    })

    it('should return winning col', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 1, value: MoveValue.X }
      ]
      let grid = new TTTGrid(moves)

      let win = grid.findWinningCombo()
      expect(win).toBeDefined()
      expect(win?.length).toEqual(3)
      expect(win!.every(w => w.value === MoveValue.X)).toBe(true)
      expect(win!.every(w => w.coordinateY === 1)).toBe(true)
    })

    it('should not return winner on incomplete col', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X }
      ]
      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()
    })

    it('should not return winner on col containing different values', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 1, value: MoveValue.O }
      ]
      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()
    })

    it('should not return winner on draw', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.O },
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 1, value: MoveValue.O },

        { coordinateX: 1, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 2, value: MoveValue.O },

        { coordinateX: 1, coordinateY: 3, value: MoveValue.O },
        { coordinateX: 2, coordinateY: 3, value: MoveValue.O },
        { coordinateX: 3, coordinateY: 3, value: MoveValue.X }
      ]
      let grid = new TTTGrid(moves)
      expect(grid.findWinningCombo()).toBeUndefined()
    })

    it('should return winner on full game', async () => {
      let moves: MoveData[] = [
        { coordinateX: 1, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 1, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 1, value: MoveValue.O },

        { coordinateX: 1, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 2, coordinateY: 2, value: MoveValue.X },
        { coordinateX: 3, coordinateY: 2, value: MoveValue.O },

        { coordinateX: 1, coordinateY: 3, value: MoveValue.O },
        { coordinateX: 2, coordinateY: 3, value: MoveValue.O },
        { coordinateX: 3, coordinateY: 3, value: MoveValue.X }
      ]
      let grid = new TTTGrid(moves)
      let win = grid.findWinningCombo()
      expect(win).toBeDefined()
      expect(win!.length).toEqual(3)
      expect(win!.every(w => w.value === MoveValue.X)).toBe(true)
      expect(win!.every(w => w.coordinateY === w.coordinateX)).toBe(true)
    })
  
  })