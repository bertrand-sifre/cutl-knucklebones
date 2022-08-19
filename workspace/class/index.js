const f = require('cult-knucklebones-functions')

class Game {
  constructor() {
    /** @type {import('cult-knucklebones-functions').Board} */
    this.board = f.emptyBoard
  }

  getPlayer1Point() {
    return f.getPlayer1Point(this.board)
  }

  getPlayer2Point() {
    return f.getPlayer2Point(this.board)
  }

  /**
   * @param {import('cult-knucklebones-functions').DiceValue} diceValue 
   * @param {import('cult-knucklebones-functions').ColumnIndex} column 
   */
  playPlayer1(diceValue, column) {
    return this.play(0, diceValue, column)
  }

  /**
   * @param {import('cult-knucklebones-functions').DiceValue} diceValue 
   * @param {import('cult-knucklebones-functions').ColumnIndex} column 
   */
  playPlayer2(diceValue, column) {
    return this.play(1, diceValue, column)
  }

  /**
   * @param {import('cult-knucklebones-functions').Player} player 
   * @param {import('cult-knucklebones-functions').DiceValue} diceValue 
   * @param {import('cult-knucklebones-functions').ColumnIndex} column 
   */
  play(player, diceValue, column) {
    return f.play(this.board, player, diceValue, column)
  }

  isFinish() {
    return f.isFinish(this.board)
  }

  /**
   * @param {import('cult-knucklebones-functions').Player} player 
   */
  getPlayableColumn(player) {
    return f.getPlayableColumn(this.board, player)
  }

  getDiceState() {
    return f.getDiceState(this.board)
  }
}

module.exports = Game