/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} DiceValue
 */

/**
 * @typedef {[DiceValue, DiceValue, DiceValue] | [DiceValue, DiceValue] | [DiceValue] | []} Column
 */

/**
 * @typedef {[Column, Column, Column]} PlayerBoard
 */

class Board {
  constructor() {
    /** @type {[PlayerBoard, PlayerBoard]} */
    this.board = [[[], [], []], [[], [], []]]
  }

  /**
   * @param {number} player 
   * @param {DiceValue} diceValue 
   * @param {number} column 
   */
  #play(player, diceValue, column) {
    if (player < 1 || player > 2) {
      throw new Error('Player must be 1 or 2')
    }
    if (diceValue < 1 || diceValue > 6) {
      throw new Error('The dice is a D6')
    }
    if (column < 1 || column > 3) {
      throw new Error('The column is 1, 2 or 3')
    }
    const boardPlayer = this.board[player - 1]
    if (boardPlayer[column - 1].length === 3) {
      throw new Error('You cannot play here')
    }
    boardPlayer[column - 1].push(diceValue)
  }

  /**
   * @param {DiceValue} diceValue 
   * @param {number} column 
   */
  playPlayer1(diceValue, column) {
    this.#play(1, diceValue, column)
  }

  /**
   * @param {DiceValue} diceValue 
   * @param {number} column 
   */
  playPlayer2(diceValue, column) {
    this.#play(2, diceValue, column)
  }

  /**
   * @param {number[][]} playerBoard 
   */
  #getPoint(playerBoard) {
    return playerBoard.reduce((totalPoint, column) => {
      return totalPoint + column.reduce((ColumnPoint, value) => {
        return ColumnPoint + value
      }, 0)
    }, 0)
  }

  getPlayer1Point() {
    return this.#getPoint(this.board[0])
  }

  getPlayer2Point() {
    return this.#getPoint(this.board[1])
  }
}

module.exports = Board