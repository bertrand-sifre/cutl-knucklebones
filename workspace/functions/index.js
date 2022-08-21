const { countBy, pull } = require('lodash')
/**
 * @typedef {0 | 1} Player
 * @typedef {0 | 1 | 2} ColumnIndex
 * @typedef {0 | 1 | 2} DiceIndex
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} DiceValue
 * @typedef {'simple' | 'double' | 'triple'} DiceState
 * @typedef {'object' | 'number'} DiceType
 * @typedef {{value: DiceValue, state: DiceState}} Dice
 * @typedef {DiceValue[]} Column
 * @typedef {[Column, Column, Column]} PlayerBoard
 * @typedef {[PlayerBoard, PlayerBoard]} Board
 */

/** @type {DiceValue[]} */
const diceValue = [1, 2, 3, 4, 5, 6]
/** @type {ColumnIndex[]} */
const columnIndex = [0, 1, 2]
/** @type {Board} */
const emptyBoard = [[[], [], []], [[], [], []]]
/** @type {DiceState[]} */
const states = ['simple', 'simple', 'double', 'triple']

/**
 * @param {Board} diceValueBoard 
 */
const getDiceState = function (diceValueBoard) {
  return diceValueBoard.map(diceValuePlayerBoard => {
    return diceValuePlayerBoard.map(diceValueColumn => {
      const groupBy = countBy(diceValueColumn)
      return diceValueColumn.map(diceValue => {
        return {
          value: diceValue,
          state: states[groupBy[diceValue]]
        }
      })
    })
  })
}

/**
 * @param {Board} board
 * @param {Player} player 
 * @param {DiceValue} diceValue 
 * @param {ColumnIndex} column 
 */
const play = function (board, player, diceValue, column) {
  if (player < 0 || player > 1) {
    throw new Error('Player must be 0 or 1')
  }
  if (diceValue < 1 || diceValue > 6) {
    throw new Error('The dice is a D6')
  }
  if (column < 0 || column > 2) {
    throw new Error('The column is 0, 1 or 2')
  }
  const boardPlayer = board[player]
  const boardAdversary = board[(player + 1) % 2]
  if (boardPlayer[column].length === 3) {
    throw new Error('You cannot play here')
  }
  // push dice on player board
  boardPlayer[column].push(diceValue)
  // remove all dice with same value on adversary board
  pull(boardAdversary[column], diceValue)
}

/**
 * 
 * @param {Column} column 
 * @return {number}
 */
const getColumnPoint = function (column) {
  const groupBy = countBy(column)
  return Object.keys(groupBy).reduce((columnPoint, key) => {
    const pt = Number.parseInt(key)
    return columnPoint + pt * groupBy[key] * Math.pow(2, groupBy[key] - 1)
  }, 0)
}

/**
 * @param {PlayerBoard} playerBoard
 * @return {{total: number, column:[number, number, number]}}
 */
const getPoint = function (playerBoard) {
  return playerBoard.reduce((acc, column, index) => {
    acc.column[index] = getColumnPoint(column)
    acc.total += acc.column[index]
    return acc
  }, { total: 0, column: [0, 0, 0] })
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
  return getPlayableColumn(board, 0).length === 0 || getPlayableColumn(board, 1).length === 0
}

/**
 * @param {Board} board
 * @param {Player} player
 * @return {ColumnIndex[]}
 */
const getPlayableColumn = function (board, player) {
  /** @type {ColumnIndex[]} */
  return columnIndex.filter(columnIndex => {
    return board[player][columnIndex].length < 3
  })
}

module.exports = {
  getDiceState,
  getPlayer1Point,
  getPlayer2Point,
  play,
  isFinish,
  getPlayableColumn,
  getColumnPoint,
  diceValue,
  columnIndex,
  emptyBoard,
}