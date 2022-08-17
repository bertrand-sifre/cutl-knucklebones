const { program, Option } = require('commander')
const inquirer = require('inquirer')
const Game = require('cutl-knucklebones-class')
const Table = require('cli-table3')

// change implementation of stylizeLigne for a cell in lib cli-table-3
const Cell = require('cli-table3/src/cell')
Cell.prototype.stylizeLine = function (left, content, right) {
  left = this.wrapWithStyleColors('border', left);
  right = this.wrapWithStyleColors('border', right);
  content = this.wrapWithStyleColors('head', content);
  return left + content + right;
}

const game = new Game()

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
 * @param {'utf8' | 'number' | 'zoom'} displayType
 */
const getDiceSymbol = function (player, column, dice, displayType) {
  const diceFace = diceFaces[displayType]
  const die = game.board[player][column][dice]
  const value = diceFace[die?.value || 0]
  return value
}

const getDiceStyle = function (player, column, dice) {
  const die = game.board[player][column][dice]
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
 * @param {'utf8' | 'number' | 'zoom'} displayType
 */
const printBoard = function (displayType, whoPlay, diceValue) {
  const p1Points = game.getPlayer1Point()
  const p2Points = game.getPlayer2Point()
  const table = new Table({
    style: { border: [] },
    colWidths: displayType === 'zoom' ? [7, 7, 7, 7, 7, 7, 7, 7, 7] : [3, 3, 3, 3, 3, 3, 3, 3, 3]
  }) // table is 9x9 
  table.push([
    { content: '', rowSpan: 3, colSpan: 3, },      // empty
    { content: getDiceSymbol(1, 0, 2, displayType), style: getDiceStyle(1, 0, 2) }, // P2 column1 dice 3
    { content: getDiceSymbol(1, 1, 2, displayType), style: getDiceStyle(1, 1, 2) }, // P2 column2 dice 3
    { content: getDiceSymbol(1, 2, 2, displayType), style: getDiceStyle(1, 2, 2) }, // P2 column3 dice 3
  ], [
    { content: getDiceSymbol(1, 0, 1, displayType), style: getDiceStyle(1, 0, 1), chars: { 'mid': ' ' } }, // P2 column1 dice 2
    { content: getDiceSymbol(1, 1, 1, displayType), style: getDiceStyle(1, 1, 1), chars: { 'mid': ' ' } }, // P2 column2 dice 2
    { content: getDiceSymbol(1, 2, 1, displayType), style: getDiceStyle(1, 2, 1), chars: { 'mid': ' ' } }, // P2 column3 dice 2
    { content: '', chars: { 'mid': ' ', 'mid-mid': '┤' } }, // empty
    { content: whoPlay === 1 ? diceFaces[displayType][diceValue] : '', vAlign: 'center', hAlign: 'center', chars: { 'mid': ' ', 'middle': ' ', 'top-mid': ' ' } }, // P2 draw
    { content: '', chars: { 'mid': ' ', 'middle': ' ', 'top-mid': ' ', 'right-mid': '│' } }, // empty
  ], [
    { content: getDiceSymbol(1, 0, 0, displayType), style: getDiceStyle(1, 0, 0), chars: { 'mid': ' ' } }, // P2 column1 dice 1
    { content: getDiceSymbol(1, 1, 0, displayType), style: getDiceStyle(1, 1, 0), chars: { 'mid': ' ' } }, // P2 column2 dice 1
    { content: getDiceSymbol(1, 2, 0, displayType), style: getDiceStyle(1, 2, 0), chars: { 'mid': ' ' } },  // P2 column3 dice 1
    { content: '', chars: { 'mid': ' ', 'mid-mid': '┤' } }, // empty
    { content: '', chars: { 'mid': ' ', 'middle': ' ', 'mid-mid': ' ' } }, // empty
    { content: '', chars: { 'mid': ' ', 'middle': ' ', 'mid-mid': ' ', 'right-mid': '│' } }, // empty
  ], [
    { content: 'P1', rowSpan: 2, colSpan: 3, hAlign: 'center', vAlign: 'bottom' }, // P1 name
    { content: p2Points.column[0] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P2 column 1 point
    { content: p2Points.column[1] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P2 column 2 point
    { content: p2Points.column[2] || '', style: { 'padding-left': 0, 'padding-right': 0 }, hAlign: 'center' }, // P2 column 3 point
    { content: 'P2', rowSpan: 2, colSpan: 3, hAlign: 'center', vAlign: 'bottom', chars: { 'bottom-mid': '─' } }, // P2 name
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
    { content: getDiceSymbol(0, 0, 0, displayType), style: getDiceStyle(0, 0, 0) }, // P1 column1 dice 1
    { content: getDiceSymbol(0, 1, 0, displayType), style: getDiceStyle(0, 1, 0) }, // P1 column2 dice 1
    { content: getDiceSymbol(0, 2, 0, displayType), style: getDiceStyle(0, 2, 0) }, // P1 column3 dice 1
    { content: '', rowSpan: 3, colSpan: 3 },      // empty
  ], [
    { content: '', chars: { 'left-mid': '│', 'mid': ' ' } }, //empty
    { content: whoPlay === 0 ? diceFaces[displayType][diceValue] : '', hAlign: 'center', vAlign: 'center', chars: { 'top-mid': ' ', 'mid': ' ', 'middle': ' ' } }, // P1 draw
    { content: '', chars: { 'top-mid': ' ', 'mid': ' ', 'middle': ' ' } }, //empty
    { content: getDiceSymbol(0, 0, 1, displayType), style: getDiceStyle(0, 0, 1), chars: { 'mid': ' ', 'mid-mid': '├' } }, // P1 column1 dice 2
    { content: getDiceSymbol(0, 1, 1, displayType), style: getDiceStyle(0, 1, 1), chars: { 'mid': ' ' } }, // P1 column2 dice 2
    { content: getDiceSymbol(0, 2, 1, displayType), style: getDiceStyle(0, 2, 1), chars: { 'mid': ' ' } }, // P1 column3 dice 2
  ], [
    { content: '', chars: { 'left-mid': '│', 'mid': ' ' } }, //empty
    { content: '', chars: { 'mid': ' ', 'mid-mid': ' ', 'middle': ' ', 'bottom-mid': '─' } }, //empty
    { content: '', chars: { 'bottom-mid': '─', 'mid': ' ', 'mid-mid': ' ', 'middle': ' ' } }, //empty
    { content: getDiceSymbol(0, 0, 2, displayType), style: getDiceStyle(0, 0, 2), chars: { 'mid': ' ', 'mid-mid': '├' } }, // P1 column1 dice 3
    { content: getDiceSymbol(0, 1, 2, displayType), style: getDiceStyle(0, 1, 2), chars: { 'mid': ' ' } }, // P1 column2 dice 3
    { content: getDiceSymbol(0, 2, 2, displayType), style: getDiceStyle(0, 2, 2), chars: { 'mid': ' ' } }, // P1 column3 dice 3
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
  .action(async (options) => {
    const displayType = options.diceDisplay
    const diceFace = promptFaces[displayType]
    let turn = -1
    while (!game.isFinish()) {
      const player = (++turn % 2) + 1
      // roll dice
      const diceValue = Math.floor(Math.random() * 6) + 1
      // print the gameboard
      printBoard(displayType, player - 1, diceValue)
      // choose the column
      const column = await inquirer.prompt({
        type: 'list',
        message: `Player ${player} draw ${diceFace[diceValue]}, choose a column`,
        name: 'value',
        choices: game.getPlayableColumn(player)
      })
      // player
      game.play(player, diceValue, column.value)
    }
    printBoard(displayType, -1, -1)
  })

program.parse()