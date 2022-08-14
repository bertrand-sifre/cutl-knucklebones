const { program, Option } = require('commander')
const inquirer = require('inquirer')
const Game = require('cutl-knucklebones-class')
const chalk = require('chalk')

const game = new Game()

const diceFaceUtf8 = [" ", "\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"]
const diceFaceNumber = [" ", "1", "2", "3", "4", "5", "6"]

/**
 * @param {'utf8' | 'number'} displayType
 */
const printDice = function (player, column, dice, displayType) {
  const diceFace = displayType === 'number' ? diceFaceNumber : diceFaceUtf8
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
  let str = ""
  str += '+-+-+-+\n'
  for (let player = 0; player < 2; player++) {
    for (let dice = player === 0 ? 2 : 0; player === 0 ? dice >= 0 : dice < 3; player === 0 ? dice-- : dice++) {
      str += '|'
      for (let column = 0; column < 3; column++) {
        str += printDice(player, column, dice, displayType) + '|'
      }
      str += '\n'
    }
    str += '+-+-+-+\n'
  }
  console.log(str)
}

program
  .addOption(new Option('--dice-display <type>', 'Chosse utf-8 to display the dice').default('utf-8').choices(['utf8', 'number']))
  .action(async (options) => {
    const displayType = options.diceDisplay
    const diceFace = displayType === 'number' ? diceFaceNumber : diceFaceUtf8
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