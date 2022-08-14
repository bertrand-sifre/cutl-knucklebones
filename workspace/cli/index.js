const { program } = require('commander')
const inquirer = require('inquirer')
const Game = require('cutl-knucklebones-class')
const game = new Game()

const diceFace = [" ", "\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"]

const printDice = function (player, column, dice) {
  return diceFace[game.board[player][column][dice] || 0]
}

const printBoard = function () {
  let str = ""
  str += '+-+-+-+\n'
  for (let player = 0; player < 2; player++) {
    for (let dice = 2; dice >= 0; dice--) {
      str += '|'
      for (let column = 0; column < 3; column++) {
        str += printDice(player, column, dice) + '|'
      }
      str += '\n'
    }
    str += '+-+-+-+\n'
  }
  console.log(str)
}

program.action(async () => {
  let turn = -1
  while (!game.isFinish()) {
    const player = (turn++ % 2) + 1
    // roll dice
    const diceValue = Math.floor(Math.random() * 6) + 1
    // choose the column
    const column = await inquirer.prompt({
      type: 'list',
      message: `Player ${player} draw ${diceFace[diceValue]}, choose a column`,
      name: 'value',
      choices: [1, 2, 3]
    })
    // player
    game.play(player, diceValue, column.value)
    // print the gameboard
    printBoard()
  }
})

program.parse()