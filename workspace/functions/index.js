const { countBy, pull } = require('lodash')

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} DiceValue
 */

/**
 * @typedef {[DiceValue, DiceValue, DiceValue] | [DiceValue, DiceValue] | [DiceValue] | []} Column
 */

/**
 * @typedef {[Column, Column, Column]} PlayerBoard
 */

/**
 * @typedef {[PlayerBoard, PlayerBoard]} Board
 */

/**
 * @returns {Board}
 */
const initBoard = function () {
  return [[[], [], []], [[], [], []]]
}

/**
 * @param {Board} board
 * @param {number} player 
 * @param {DiceValue} diceValue 
 * @param {number} column 
 */
const play = function (board, player, diceValue, column) {
  if (player < 1 || player > 2) {
    throw new Error('Player must be 1 or 2')
  }
  if (diceValue < 1 || diceValue > 6) {
    throw new Error('The dice is a D6')
  }
  if (column < 1 || column > 3) {
    throw new Error('The column is 1, 2 or 3')
  }
  const boardPlayer = board[player - 1]
  const boardAdversary = board[player % 2]
  if (boardPlayer[column - 1].length === 3) {
    throw new Error('You cannot play here')
  }
  //@ts-ignore
  boardPlayer[column - 1].push(diceValue)
  pull(boardAdversary[column - 1], diceValue)
}

/**
 * @param {Board} board
 * @param {DiceValue} diceValue 
 * @param {number} column 
 */
const playPlayer1 = function (board, diceValue, column) {
  play(board, 1, diceValue, column)
}

/**
 * @param {Board} board
 * @param {DiceValue} diceValue 
 * @param {number} column 
 */
const playPlayer2 = function (board, diceValue, column) {
  play(board, 2, diceValue, column)
}

/**
 * @param {number[][]} playerBoard 
 */
const getPoint = function (playerBoard) {
  return playerBoard.reduce((totalPoint, column) => {
    const groupBy = countBy(column)
    return totalPoint + Object.keys(groupBy).reduce((columnPoint, key) => {
      const pt = Number.parseInt(key)
      return columnPoint + pt * groupBy[key] * Math.pow(2, groupBy[key] - 1)
    }, 0)
  }, 0)
}

/**
 * @param { Board } board
 */
const getPlayer1Point = function (board) {
  return getPoint(board[0])
}

/**
 * @param { Board } board
 */
const getPlayer2Point = function (board) {
  return getPoint(board[1])
}

/**
 * @param {Board} board
 */
const isFinish = function (board) {
  return getPlayableColumn(board, 1).length === 0 || getPlayableColumn(board, 2).length === 0
}

/**
 * @param {Board} board
 * @param {number} player
 * @return {number[]}
 */
const getPlayableColumn = function (board, player) {
  return [0, 1, 2].filter(columnIndex => {
    return board[player - 1][columnIndex].length < 3
  }).map(a => a + 1)
}

module.exports = {
  initBoard,
  getPlayer1Point,
  getPlayer2Point,
  playPlayer1,
  playPlayer2,
  play,
  isFinish,
  getPlayableColumn,
}