const { program, Option } = require('commander')
const inquirer = require('inquirer')
const Game = require('cutl-knucklebones-class')
const chalk = require('chalk')
const Table = require('cli-table3')

const game = new Game()

const diceFaces = {
  utf8: [" ", "\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"],
  number: [" ", "1", "2", "3", "4", "5", "6"],
  zoom: [
    "     \n     \n     ",
    "     \n  ●  \n     ",
    "    ●\n     \n●    ",
    "    ●\n  ●  \n●    ",
    "●   ●\n     \n●   ●",
    "●   ●\n  ●  \n●   ●",
    "●   ●\n●   ●\n●   ●"
  ],
}

const promptFaces = {
  utf8: diceFaces.utf8,
  number: diceFaces.number,
  zoom: diceFaces.number,
}

/**
 * @param {'utf8' | 'number'} displayType
 */
const printDice = function (player, column, dice, displayType) {
  const diceFace = diceFaces[displayType]
  const die = game.board[player][column][dice]
  const value = diceFace[die?.value || 0]
  if (die?.state === 'double') {
    return chalk.yellow(value)
  }
  if (die?.state === 'triple') {
    return chalk.blue(value)
  }
  return value
}

/**
 * @param {'utf8' | 'number'} displayType
 */
const printBoard = function (displayType) {
  const table = new Table({})
  for (let player = 0; player < 2; player++) {
    for (let dice = player === 0 ? 2 : 0; player === 0 ? dice >= 0 : dice < 3; player === 0 ? dice-- : dice++) {
      const line = []
      for (let column = 0; column < 3; column++) {
        line.push({
          content: printDice(player, column, dice, displayType),
          chars: { mid: player === 1 && dice === 0 ? "─" : " " }
        })
      }
      table.push(line)
    }
  }
  console.log(table.toString())
}

program
  .addOption(new Option('--dice-display <type>', 'Chosse utf-8 to display the dice').default('utf-8').choices(['utf8', 'number', 'zoom']))
  .action(async (options) => {
    const displayType = options.diceDisplay
    const diceFace = promptFaces[displayType]
    let turn = -1
    while (!game.isFinish()) {
      const player = (++turn % 2) + 1
      // roll dice
      const diceValue = Math.floor(Math.random() * 6) + 1
      // choose the column
      const column = await inquirer.prompt({
        type: 'list',
        message: `Player ${player} draw ${diceFace[diceValue]}, choose a column`,
        name: 'value',
        choices: game.getPlayableColumn(player)
      })
      // player
      game.play(player, diceValue, column.value)
      // print the gameboard
      printBoard(displayType)
    }
  })

program.parse()