const { countBy, pullAllWith } = require('lodash')
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
 * @typedef {'simple' | 'double' | 'triple'} DiceState
 */

/**
 * @typedef {{value: DiceValue, state: DiceState} | DiceValue} Dice
 */

/**
 * @typedef {Dice[]} Column
 */

/**
 * @typedef {[Column, Column, Column]} PlayerBoard
 */

/**
 * @typedef {[PlayerBoard, PlayerBoard]} Board
 */

/** @type {DiceState[]} */
const states = ['simple', 'simple', 'double', 'triple']

/**
 * @returns {Board}
 */
const initBoard = function (diceValueBoard) {
  if (diceValueBoard) {
    // @ts-ignore
    return diceValueBoard.map(diceValuePlayerBoard => {
      return diceValuePlayerBoard.map(diceValueColumn => {
        const groupBy = countBy(diceValueColumn)
        return diceValueColumn.map(diceValue => {
          return {
            value: getDiceValue(diceValue),
            state: states[groupBy[diceValue]]
          }
        })
      })
    })
  }
  return [[[], [], []], [[], [], []]]
}

/**
 * @param {Dice} dice 
 * @return {DiceValue}
 */
const getDiceValue = function (dice) {
  if (typeof dice === 'number') {
    return dice
  }
  return dice?.value
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
  // push dice on player board
  boardPlayer[column - 1].push({ value: diceValue, state: 'simple' })
  // update dice state
  const state = states[boardPlayer[column - 1].filter(dice => getDiceValue(dice) === diceValue).length]
  boardPlayer[column - 1].forEach((dice, index) => {
    if (getDiceValue(dice) === diceValue) {
      boardPlayer[column - 1][index] = {
        state: state,
        value: getDiceValue(dice)
      }
    }
  })
  // remove all dice with same value on adersary board
  pullAllWith(boardAdversary[column - 1], [{ value: diceValue }], (a, b) => getDiceValue(a) === getDiceValue(b))
}

/**
 * 
 * @param {Column} column 
 * @return {number}
 */
const getColumnPoint = function (column) {
  const groupBy = countBy(column, getDiceValue)
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
  getColumnPoint,
}