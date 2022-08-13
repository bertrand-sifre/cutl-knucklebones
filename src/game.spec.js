const game = require('./game')

describe('Board', () => {
  it('Basic points', () => {
    /** @type {import('./game').Board} */
    const board = [[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5, 6], [4, 5, 6], [4, 5, 6]]]

    const p1Points = game.getPlayer1Point(board)
    const p2Points = game.getPlayer2Point(board)
    expect(p1Points).toEqual(18)
    expect(p2Points).toEqual(45)
  })
  it('Double points', () => {
    /** @type {import('./game').Board} */
    const board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]

    const p1Points = game.getPlayer1Point(board)
    const p2Points = game.getPlayer2Point(board)
    expect(p2Points).toEqual(24)
    expect(p1Points).toEqual(42)
  })
  it('player 1 play', () => {
    /** @type {import('./game').Board} */
    const board = game.initBoard()
    game.playPlayer1(board, 1, 1)
    expect(game.getPlayer1Point(board)).toEqual(1)
    expect(game.getPlayer2Point(board)).toEqual(0)
  })
})