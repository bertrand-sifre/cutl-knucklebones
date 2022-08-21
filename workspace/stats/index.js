const Game = require('cult-knucklebones-class')
const Progress = require('cli-progress')

// simulate more game and print stats

const turns = {}
const wins = [0, 0]
let ties = 0

const nbSim = +process.argv[2] || 100

const bar = new Progress.SingleBar({})
bar.start(nbSim, 0)

for (let sim = 0; sim < nbSim; sim++) {
  const game = new Game()
  while (!game.isFinish()) {
    const columns = game.getPlayableColumn()
    const choose = Math.floor(Math.random() * columns.length)
    game.play(columns[choose])
  }
  const winner = game.getWinner()
  if (winner != null) {
    wins[winner]++
  } else {
    ties++
  }
  turns[game.turn] = (turns[game.turn] | 0) + 1
  bar.increment()
}

bar.stop()

console.log('turns', turns)
console.log('wins', wins, 'ties', ties)