const Game = require('./index')
const { initBoard } = require('cutl-knucklebones-functions')

describe('Board', () => {
  describe('With init board', () => {
    it('Basic points', () => {
      const game = new Game()
      game.board = initBoard([[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5, 6], [4, 5, 6], [4, 5, 6]]])

      const p1Points = game.getPlayer1Point()
      const p2Points = game.getPlayer2Point()
      expect(p1Points.total).toEqual(18)
      expect(p1Points.column).toEqual([6, 6, 6])
      expect(p2Points.total).toEqual(45)
      expect(p2Points.column).toEqual([15, 15, 15])
    })
    it('Double points', () => {
      const game = new Game()
      game.board = initBoard([[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]])

      const p1Points = game.getPlayer1Point()
      const p2Points = game.getPlayer2Point()
      expect(p1Points.total).toEqual(42)
      expect(p1Points.column).toEqual([12, 11, 19])
      expect(p2Points.total).toEqual(24)
      expect(p2Points.column).toEqual([10, 10, 4])
    })
    it('state dice', () => {
      const game = new Game()
      game.board = initBoard([[[1, 1, 1], [2, 3], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]])

      game.playPlayer1(2, 2)

      //@ts-ignore
      expect(game.board[0][0][0].state).toEqual('triple')
      //@ts-ignore
      expect(game.board[0][1][0].state).toEqual('double')
    })
    it('player 1 play', () => {
      const game = new Game()
      game.playPlayer1(1, 1)
      expect(game.getPlayer1Point().total).toEqual(1)
      expect(game.getPlayer2Point().total).toEqual(0)
    })
    it('Remove adversary dice when play same value on same column', () => {
      const game = new Game()
      game.board = initBoard([[[1, 2, 3], [], []], [[], [], []]])
      game.playPlayer2(1, 1)
      // check dice is remove
      expect(game.board[1][0]).toHaveLength(1)
      expect(game.board[0][0]).toHaveLength(2)
    })
    it('isFinish', () => {
      const game = new Game()
      game.board = initBoard([[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5], [4, 5, 6], [4, 5, 6]]])
      expect(game.isFinish()).toEqual(true)
    })
    it('not isFinish', () => {
      const game = new Game()
      game.board = initBoard([[[1, 2], [1, 2, 3], [1, 2, 3]], [[4, 5], [4, 5, 6], [4, 5, 6]]])
      expect(game.isFinish()).toEqual(false)
    })
    it('playable column', () => {
      const game = new Game()
      game.board = initBoard([[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]])
      const playableColumns1 = game.getPlayableColumn(1)
      expect(playableColumns1).toHaveLength(0)
      const playableColumns2 = game.getPlayableColumn(2)
      expect(playableColumns2).toHaveLength(2)
      expect(playableColumns2).toEqual([2, 3])
    })
  })
  describe('Without init board', () => {
    it('Basic points', () => {
      const game = new Game()
      game.board = [[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5, 6], [4, 5, 6], [4, 5, 6]]]

      const p1Points = game.getPlayer1Point()
      const p2Points = game.getPlayer2Point()
      expect(p1Points.total).toEqual(18)
      expect(p1Points.column).toEqual([6, 6, 6])
      expect(p2Points.total).toEqual(45)
      expect(p2Points.column).toEqual([15, 15, 15])
    })
    it('Double points', () => {
      const game = new Game()
      game.board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]

      const p1Points = game.getPlayer1Point()
      const p2Points = game.getPlayer2Point()
      expect(p1Points.total).toEqual(42)
      expect(p1Points.column).toEqual([12, 11, 19])
      expect(p2Points.total).toEqual(24)
      expect(p2Points.column).toEqual([10, 10, 4])
    })
    it('player 1 play', () => {
      const game = new Game()
      game.playPlayer1(1, 1)
      expect(game.getPlayer1Point().total).toEqual(1)
      expect(game.getPlayer2Point().total).toEqual(0)
    })
    it('Remove adversary dice when play same value on same column', () => {
      const game = new Game()
      game.board = [[[1, 2, 3], [], []], [[], [], []]]
      game.playPlayer2(1, 1)
      // check dice is remove
      expect(game.board[1][0]).toHaveLength(1)
      expect(game.board[0][0]).toHaveLength(2)
    })
    it('isFinish', () => {
      const game = new Game()
      game.board = [[[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[4, 5], [4, 5, 6], [4, 5, 6]]]
      expect(game.isFinish()).toEqual(true)
    })
    it('not isFinish', () => {
      const game = new Game()
      game.board = [[[1, 2], [1, 2, 3], [1, 2, 3]], [[4, 5], [4, 5, 6], [4, 5, 6]]]
      expect(game.isFinish()).toEqual(false)
    })
    it('playable column', () => {
      const game = new Game()
      game.board = [[[1, 1, 1], [2, 3, 2], [4, 4, 3]], [[4, 5, 1], [4, 6], [4]]]
      const playableColumns1 = game.getPlayableColumn(1)
      expect(playableColumns1).toHaveLength(0)
      const playableColumns2 = game.getPlayableColumn(2)
      expect(playableColumns2).toHaveLength(2)
      expect(playableColumns2).toEqual([2, 3])
    })
  })
})