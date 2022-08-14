const game = require('./index')

describe('Board', () => {
  it('Remove adversary dice when play same value on same column', () => {
    /** @type {import('./index').Board} */
    const board = [[[1, 2, 3], [], []], [[], [], []]]
    game.playPlayer2(board, 1, 1)
    // check dice is remove
    expect(board[1][0]).toHaveLength(1)
    expect(board[0][0]).toHaveLength(2)

  })
  it('Basic points', () => {
    /** @type {import('./index').Board} */
    const board = [[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5, 6], [4, 5, 6], [4, 5, 6]]]

    const p1Points = game.getPlayer1Point(board)
    const p2Points = game.getPlayer2Point(board)
    expect(p1Points).toEqual(18)
    expect(p2Points).toEqual(45)
  })
  it('Double points', () => {
    /** @type {import('./index').Board} */
    const board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]

    const p1Points = game.getPlayer1Point(board)
    const p2Points = game.getPlayer2Point(board)
    expect(p2Points).toEqual(24)
    expect(p1Points).toEqual(42)
  })
  it('player 1 play', () => {
    /** @type {import('./index').Board} */
    const board = game.initBoard()
    game.playPlayer1(board, 1, 1)
    expect(game.getPlayer1Point(board)).toEqual(1)
    expect(game.getPlayer2Point(board)).toEqual(0)
  })
})