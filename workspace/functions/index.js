const { countBy, pull } = require('lodash')
/**
 * @typedef {1 | 2} Player
 */

/**
 * @typedef {1 | 2 | 3} ColumnIndex
 */

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
 * @param {Player} player 
 * @param {DiceValue} diceValue 
 * @param {ColumnIndex} column 
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
 * @param {PlayerBoard} playerBoard 
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
 * @param {Player} player
 * @return {ColumnIndex[]}
 */
const getPlayableColumn = function (board, player) {
  /** @type {ColumnIndex[]} */
  const columnIndex = [1, 2, 3]
  return columnIndex.filter(columnIndex => {
    return board[player - 1][columnIndex - 1].length < 3
  })
}

module.exports = {
  initBoard,
  getPlayer1Point,
  getPlayer2Point,
  play,
  isFinish,
  getPlayableColumn,
}