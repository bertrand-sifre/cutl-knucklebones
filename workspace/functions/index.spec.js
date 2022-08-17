const game = require('./index')

describe('Functions', () => {
  describe('Exception', () => {
    it('player must be 0 or 1', () => {
      const fct = () => {
        const board = game.emptyBoard
        // @ts-ignore
        game.play(board, -1, null, null)
      }

      expect(fct).toThrow('Player must be 0 or 1')
    })
    it('player must be 1 or 2', () => {
      const fct = () => {
        const board = game.emptyBoard
        // @ts-ignore
        game.play(board, 2, null, null)
      }

      expect(fct).toThrow('Player must be 0 or 1')
    })
    it('dice value', () => {
      const fct = () => {
        const board = game.emptyBoard
        // @ts-ignore
        game.play(board, 1, 0, null)
      }

      expect(fct).toThrow('The dice is a D6')
    })
    it('dice value', () => {
      const fct = () => {
        const board = game.emptyBoard
        // @ts-ignore
        game.play(board, 1, 7, null)
      }

      expect(fct).toThrow('The dice is a D6')
    })

    it('column index value', () => {
      const fct = () => {
        const board = game.emptyBoard
        // @ts-ignore
        game.play(board, 1, 3, -1)
      }

      expect(fct).toThrow('The column is 0, 1 or 2')
    })

    it('you cannot play here', () => {
      const fct = () => {
        const board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]
        // @ts-ignore
        game.play(board, 0, 4, 0)
      }

      expect(fct).toThrow('You cannot play here')
    })
  })
})