const game = require('./index')

describe('Exceptions', () => {
  it('player must be 1 or 2', () => {
    const fct = () => {
      const board = game.initBoard()
      // @ts-ignore
      game.play(board, 0, null, null)
    }

    expect(fct).toThrow()
  })
  it('player must be 1 or 2', () => {
    const fct = () => {
      const board = game.initBoard()
      // @ts-ignore
      game.play(board, 3, null, null)
    }

    expect(fct).toThrow()
  })
  it('dice value', () => {
    const fct = () => {
      const board = game.initBoard()
      // @ts-ignore
      game.play(board, 1, 0, null)
    }

    expect(fct).toThrow()
  })
  it('dice value', () => {
    const fct = () => {
      const board = game.initBoard()
      // @ts-ignore
      game.play(board, 1, 7, null)
    }

    expect(fct).toThrow()
  })

  it('column index value', () => {
    const fct = () => {
      const board = game.initBoard()
      // @ts-ignore
      game.play(board, 1, 4, 0)
    }

    expect(fct).toThrow()
  })

  it('you cannot plya here', () => {
    const fct = () => {
      const board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]
      // @ts-ignore
      game.play(board, 1, 4, 1)
    }

    expect(fct).toThrow()
  })
})