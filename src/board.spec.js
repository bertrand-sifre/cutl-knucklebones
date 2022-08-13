const Board = require('./board')

describe('Board', () => {
  it('Basic points', () => {
    const board = new Board()
    board.board = [[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5, 6], [4, 5, 6], [4, 5, 6]]]

    const p1Points = board.getPlayer1Point()
    const p2Points = board.getPlayer2Point()
    expect(p1Points).toEqual(18)
    expect(p2Points).toEqual(45)
  })
  it('Double points', () => {
    const board = new Board()
    board.board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]

    const p1Points = board.getPlayer1Point()
    const p2Points = board.getPlayer2Point()
    expect(p2Points).toEqual(24)
    expect(p1Points).toEqual(42)
  })
})