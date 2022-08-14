const f = require('cutl-knucklebones-functions')

class Game {
  constructor() {
    /** @type {import('cutl-knucklebones-functions').Board} */
    this.board = f.initBoard()
  }

  getPlayer1Point() {
    return f.getPlayer1Point(this.board)
  }

  getPlayer2Point() {
    return f.getPlayer2Point(this.board)
  }

  playPlayer1(diceValue, column) {
    return f.playPlayer1(this.board, diceValue, column)
  }

  playPlayer2(diceValue, column) {
    return f.playPlayer2(this.board, diceValue, column)
  }

  play(player, diceValue, column) {
    return f.play(this.board, player, diceValue, column)
  }

  isFinish() {
    return f.isFinish(this.board)
  }
}

module.exports = Game