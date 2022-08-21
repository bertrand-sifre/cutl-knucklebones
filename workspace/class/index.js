const f = require('cult-knucklebones-functions')

/**
 * @typedef {object} GameOptions
 * @property {string=} p1Name
 * @property {string=} p2Name
 */

class Game {

  /**
   * @param {GameOptions=} options 
   */
  constructor(options) {
    /** @type {import('cult-knucklebones-functions').Board} */
    this.board = f.emptyBoard
    /** @type {[string, string]} */
    this.playersName = [options?.p1Name || 'P1', options?.p2Name || 'P2']
    /** @type {number} */
    this.turn = 0
    /** @type {import('cult-knucklebones-functions').Player} */
    this.player = 0
    /** @type {import('cult-knucklebones-functions').DiceValue} */
    this.dice = this.#roll()
  }

  getPlayer1Point() {
    return f.getPlayer1Point(this.board)
  }

  getPlayer2Point() {
    return f.getPlayer2Point(this.board)
  }

  getPlayer() {
    return this.player
  }

  getPlayerName() {
    return this.playersName[this.player]
  }

  /**
   * @param {import('cult-knucklebones-functions').ColumnIndex} column 
   */
  play(column) {
    f.play(this.board, this.getPlayer(), this.dice, column)
    // @ts-ignore
    this.player = (this.player + 1) % 2
    this.turn++
    this.dice = this.#roll()
  }

  /**
   * @return {import('cult-knucklebones-functions').DiceValue}
   */
  #roll() {
    // @ts-ignore
    return Math.floor(Math.random() * 6) + 1
  }

  isFinish() {
    return f.isFinish(this.board)
  }

  getPlayableColumn() {
    return f.getPlayableColumn(this.board, this.getPlayer())
  }

  getDiceState() {
    return f.getDiceState(this.board)
  }

}

module.exports = Game