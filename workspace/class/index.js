const f = require('cult-knucklebones-functions')

/**
 * @typedef {{
 *   p1Name: string,
 *   p2Name: string,
 * }} GameOptions
 */

class Game {

  /**
   * @param {GameOptions} options 
   */
  constructor(options) {
    /** @type {import('cult-knucklebones-functions').Board} */
    this.board = f.emptyBoard
    /** @type {string} */
    this.p1Name = options?.p1Name || 'P1'
    /** @type {string} */
    this.p2Name = options?.p2Name || 'P2'
    /** @type {number} */
    this.turn = 0
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
    this.turn++
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