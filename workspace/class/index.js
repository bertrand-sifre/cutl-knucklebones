const f = require('cult-knucklebones-functions')

/**
 * @typedef {object} GameOptions
 * @property {string=} p1Name
 * @property {string=} p2Name
 * @property {boolean=} p2Start
 */

class Game {

  /**
   * @param {GameOptions=} options 
   */
  constructor(options) {
    /** @type {import('cult-knucklebones-functions').Board} */
    this.board = f.emptyBoard()
    /** @type {[string, string]} */
    this.playersName = [options?.p1Name || 'P1', options?.p2Name || 'P2']
    /** @type {number} */
    this.turn = 0
    /** @type {import('cult-knucklebones-functions').Player} */
    this.player = options?.p2Start ? 1 : 0
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

  getWinner() {
    if (!this.isFinish()) {
      return null
    }
    const p1 = this.getPlayer1Point().total
    const p2 = this.getPlayer2Point().total
    if (p1 === p2) {
      return null
    }
    return p1 > p2 ? 0 : 1
  }

  getPlayableColumn() {
    return f.getPlayableColumn(this.board, this.getPlayer())
  }

  getDiceState() {
    return f.getDiceState(this.board)
  }

}

module.exports = Game