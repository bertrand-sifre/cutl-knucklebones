const Game = require('./game')

describe('Board', () => {
  it('Basic points', () => {
    const game = new Game()
    game.board = [[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5, 6], [4, 5, 6], [4, 5, 6]]]

    const p1Points = game.getPlayer1Point()
    const p2Points = game.getPlayer2Point()
    expect(p1Points).toEqual(18)
    expect(p2Points).toEqual(45)
  })
  it('Double points', () => {
    const game = new Game()
    game.board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]

    const p1Points = game.getPlayer1Point()
    const p2Points = game.getPlayer2Point()
    expect(p2Points).toEqual(24)
    expect(p1Points).toEqual(42)
  })
  it('player 1 play', () => {
    const game = new Game()
    game.playPlayer1(1, 1)
    expect(game.getPlayer1Point()).toEqual(1)
    expect(game.getPlayer2Point()).toEqual(0)
  })
})