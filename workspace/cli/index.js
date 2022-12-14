const { program, Option } = require('commander')
const inquirer = require('inquirer')
const Game = require('cult-knucklebones-class')
const Table = require('cli-table3')

// change implementation of stylizeLigne for a cell in lib cli-table-3
const Cell = require('cli-table3/src/cell')
Cell.prototype.stylizeLine = function (left, content, right) {
  left = this.wrapWithStyleColors('border', left);
  right = this.wrapWithStyleColors('border', right);
  content = this.wrapWithStyleColors('head', content);
  return left + content + right;
}

const diceFaces = {
  utf8: ['', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'],
  number: ['', '1', '2', '3', '4', '5', '6'],
  zoom: [
    '     \n     \n     ',
    '     \n  ●  \n     ',
    '    ●\n     \n●    ',
    '    ●\n  ●  \n●    ',
    '●   ●\n     \n●   ●',
    '●   ●\n  ●  \n●   ●',
    '●   ●\n●   ●\n●   ●'
  ],
}

const promptFaces = {
  utf8: diceFaces.utf8,
  number: diceFaces.number,
  zoom: diceFaces.number,
}

/**
 * @param {Game} game
 * @param {import('cult-knucklebones-functions').Player} player
 * @param {import('cult-knucklebones-functions').ColumnIndex} column
 * @param {import('cult-knucklebones-functions').DiceIndex} dice
 * @param {'utf8' | 'number' | 'zoom'} displayType
 */
const getDiceSymbol = function (game, player, column, dice, displayType) {
  const diceFace = diceFaces[displayType]
  const die = game.getDiceState()[player][column][dice]
  const value = diceFace[die?.value || 0]
  return value
}

/**
 * @param {Game} game 
 * @param {import('cult-knucklebones-functions').Player} player 
 * @param {import('cult-knucklebones-functions').ColumnIndex} column 
 * @param {import('cult-knucklebones-functions').DiceIndex} dice 
 * @returns 
 */
const getDiceStyle = function (game, player, column, dice) {
  const die = game.getDiceState()[player][column][dice]
  /** @type {{border:string[], head:string[]}} */
  const rst = { border: [], head: [] }
  if (die?.state === 'double') {
    rst.head.push('yellow')
  }
  if (die?.state === 'triple') {
    rst.head.push('cyan')
  }
  return rst
}

/**
 * @param {Game} game
 * @param {'utf8' | 'number' | 'zoom'} displayType
 * @param {import('cult-knucklebones-functions').Player} whoPlay
 */
const printBoard = function (game, displayType, whoPlay) {
  const p1Points = game.getPlayer1Point()
  const p2Points = game.getPlayer2Point()
  const table = new Table({
    style: { border: [] },
    colWidths: displayType === 'zoom' ? [7, 7, 7, 7, 7, 7, 7, 7, 7] : [3, 3, 3, 3, 3, 3, 3, 3, 3]
  }) // table is 9x9 
  table.push([
    { content: '', rowSpan: 3, colSpan: 3, },      // empty
    { content: getDiceSymbol(game, 1, 0, 2, displayType), style: getDiceStyle(game, 1, 0, 2) }, // P2 column1 dice 3
    { content: getDiceSymbol(game, 1, 1, 2, displayType), style: getDiceStyle(game, 1, 1, 2) }, // P2 column2 dice 3
    { content: getDiceSymbol(game, 1, 2, 2, displayType), style: getDiceStyle(game, 1, 2, 2) }, // P2 column3 dice 3
  ], [
    { content: getDiceSymbol(game, 1, 0, 1, displayType), style: getDiceStyle(game, 1, 0, 1), chars: { 'mid': ' ' } }, // P2 column1 dice 2
    { content: getDiceSymbol(game, 1, 1, 1, displayType), style: getDiceStyle(game, 1, 1, 1), chars: { 'mid': ' ' } }, // P2 column2 dice 2
    { content: getDiceSymbol(game, 1, 2, 1, displayType), style: getDiceStyle(game, 1, 2, 1), chars: { 'mid': ' ' } }, // P2 column3 dice 2
    { content: '', chars: { 'mid': ' ', 'mid-mid': '┤' } }, // empty
    { content: whoPlay === 1 ? diceFaces[displayType][game.dice] : '', vAlign: 'center', hAlign: 'center', chars: { 'mid': ' ', 'middle': ' ', 'top-mid': ' ' } }, // P2 draw
    { content: '', chars: { 'mid': ' ', 'middle': ' ', 'top-mid': ' ', 'right-mid': '│' } }, // empty
  ], [
    { content: getDiceSymbol(game, 1, 0, 0, displayType), style: getDiceStyle(game, 1, 0, 0), chars: { 'mid': ' ' } }, // P2 column1 dice 1
    { content: getDiceSymbol(game, 1, 1, 0, displayType), style: getDiceStyle(game, 1, 1, 0), chars: { 'mid': ' ' } }, // P2 column2 dice 1
    { content: getDiceSymbol(game, 1, 2, 0, displayType), style: getDiceStyle(game, 1, 2, 0), chars: { 'mid': ' ' } },  // P2 column3 dice 1
    { content: '', chars: { 'mid': ' ', 'mid-mid': '┤' } }, // empty
    { content: '', chars: { 'mid': ' ', 'middle': ' ', 'mid-mid': ' ' } }, // empty
    { content: '', chars: { 'mid': ' ', 'middle': ' ', 'mid-mid': ' ', 'right-mid': '│' } }, // empty
  ], [
    { content: game.playersName[0], rowSpan: 2, colSpan: 3, hAlign: 'center', vAlign: 'bottom' }, // P1 name
    { content: p2Points.column[0] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P2 column 1 point
    { content: p2Points.column[1] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P2 column 2 point
    { content: p2Points.column[2] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P2 column 3 point
    { content: game.playersName[1], rowSpan: 2, colSpan: 3, hAlign: 'center', vAlign: 'bottom', chars: { 'bottom-mid': '─' } }, // P2 name
  ], [
    { content: '', colSpan: 3 } // empty
  ], [
    { content: p1Points.total, colSpan: 3, hAlign: 'center', vAlign: 'bottom', chars: { 'mid': ' ', 'left-mid': '│' } }, // P1 total points
    { content: p1Points.column[0] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center', chars: { 'mid-mid': '├' } }, // P1 column 1 point
    { content: p1Points.column[1] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P1 column 2 point
    { content: p1Points.column[2] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P1 column 3 point
    { content: p2Points.total, colSpan: 3, hAlign: 'center', vAlign: 'bottom', chars: { 'mid': ' ', 'right-mid': '│', 'mid-mid': '┤' } }, // P2 total points
  ], [
    { content: '', colSpan: 3 }, //empty
    { content: getDiceSymbol(game, 0, 0, 0, displayType), style: getDiceStyle(game, 0, 0, 0) }, // P1 column1 dice 1
    { content: getDiceSymbol(game, 0, 1, 0, displayType), style: getDiceStyle(game, 0, 1, 0) }, // P1 column2 dice 1
    { content: getDiceSymbol(game, 0, 2, 0, displayType), style: getDiceStyle(game, 0, 2, 0) }, // P1 column3 dice 1
    { content: '', rowSpan: 3, colSpan: 3 },      // empty
  ], [
    { content: '', chars: { 'left-mid': '│', 'mid': ' ' } }, //empty
    { content: whoPlay === 0 ? diceFaces[displayType][game.dice] : '', hAlign: 'center', vAlign: 'center', chars: { 'top-mid': ' ', 'mid': ' ', 'middle': ' ' } }, // P1 draw
    { content: '', chars: { 'top-mid': ' ', 'mid': ' ', 'middle': ' ' } }, //empty
    { content: getDiceSymbol(game, 0, 0, 1, displayType), style: getDiceStyle(game, 0, 0, 1), chars: { 'mid': ' ', 'mid-mid': '├' } }, // P1 column1 dice 2
    { content: getDiceSymbol(game, 0, 1, 1, displayType), style: getDiceStyle(game, 0, 1, 1), chars: { 'mid': ' ' } }, // P1 column2 dice 2
    { content: getDiceSymbol(game, 0, 2, 1, displayType), style: getDiceStyle(game, 0, 2, 1), chars: { 'mid': ' ' } }, // P1 column3 dice 2
  ], [
    { content: '', chars: { 'left-mid': '│', 'mid': ' ' } }, //empty
    { content: '', chars: { 'mid': ' ', 'mid-mid': ' ', 'middle': ' ', 'bottom-mid': '─' } }, //empty
    { content: '', chars: { 'bottom-mid': '─', 'mid': ' ', 'mid-mid': ' ', 'middle': ' ' } }, //empty
    { content: getDiceSymbol(game, 0, 0, 2, displayType), style: getDiceStyle(game, 0, 0, 2), chars: { 'mid': ' ', 'mid-mid': '├' } }, // P1 column1 dice 3
    { content: getDiceSymbol(game, 0, 1, 2, displayType), style: getDiceStyle(game, 0, 1, 2), chars: { 'mid': ' ' } }, // P1 column2 dice 3
    { content: getDiceSymbol(game, 0, 2, 2, displayType), style: getDiceStyle(game, 0, 2, 2), chars: { 'mid': ' ' } }, // P1 column3 dice 3
  ])
  // if zoom is enable show the square of drawed die
  if (displayType === 'zoom') {
    if (whoPlay === 0) {
      const cell_7_1 = table[7][1]
      cell_7_1.chars['top-mid'] = '┌'
      cell_7_1.chars['mid'] = '─'
      cell_7_1.chars['middle'] = '│'
      const cell_7_2 = table[7][2]
      cell_7_2.chars['top-mid'] = '┐'
      cell_7_2.chars['middle'] = '│'
      const cell_8_1 = table[8][1]
      cell_8_1.chars['mid'] = '─'
      cell_8_1.chars['mid-mid'] = '└'
      const cell_8_2 = table[8][2]
      cell_8_2.chars['mid-mid'] = '┘'
    }
    if (whoPlay === 1) {
      const cell_1_4 = table[1][4]
      cell_1_4.chars.mid = '─'
      cell_1_4.chars.middle = '│'
      cell_1_4.chars['top-mid'] = '┌'
      const cell_1_5 = table[1][5]
      cell_1_5.chars.middle = '│'
      cell_1_5.chars['top-mid'] = '┐'
      const cell_2_4 = table[2][4]
      cell_2_4.chars.mid = '─'
      cell_2_4.chars['mid-mid'] = '└'
      const cell_2_5 = table[2][5]
      cell_2_5.chars['mid-mid'] = '┘'
    }
  }
  console.log(table.toString())
}

program
  .addOption(new Option('--dice-display <type>', 'Chosse utf-8 to display the dice').default('utf8').choices(['utf8', 'number', 'zoom']))
  .addOption(new Option('--p1-name <name>', 'Change the name of player 1'))
  .addOption(new Option('--p2-name <name>', 'Change the name of player 2'))
  .addOption(new Option('--p2-start', 'Player 2 start the game'))
  .action(async (options) => {
    const displayType = options.diceDisplay
    const diceFace = promptFaces[displayType]
    const game = new Game({
      p1Name: options.p1Name,
      p2Name: options.p2Name,
      p2Start: options.p2Start,
    })
    while (!game.isFinish()) {
      /** @type {import('cult-knucklebones-functions').Player} */
      // @ts-ignore
      const player = game.getPlayer()
      // roll dice
      // print the gameboard
      printBoard(game, displayType, player)
      // choose the column
      const column = await inquirer.prompt({
        type: 'list',
        message: `${game.getPlayerName()} draw ${diceFace[game.dice]}, choose a column`,
        name: 'value',
        choices: game.getPlayableColumn().map(a => ({ value: a, name: a + 1 }))
      })
      // player
      game.play(column.value)
    }
    printBoard(game, displayType, 0)
  })

program.parse()