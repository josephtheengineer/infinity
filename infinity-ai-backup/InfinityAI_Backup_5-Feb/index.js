var chalk = require('chalk')
var fs = require('fs')
var Stopwatch = require("node-stopwatch").Stopwatch;
var logger = require('winston')

logger.add(
  logger.transports.File, {
    filename: 'logs/' + new Date().getTime() + '.log',
    level: 'info',
    json: true,
    timestamp: true
  }
)

// Settings

var goal = 11
var neuronWidth = 6
var neuronHeight = 3

// Brain builder variables

var parentArrayA = []
var neuronArrayB = []
var neuronArray = []
var totalNeurons = neuronWidth * neuronHeight
var fitness = 0
var creationTime

var offload = 100
var spark = 0
var active = 0

function main() {
  resetVar()
  generateNeurons()
  refreshScreen()
  calculateFitness()
  //saveNetwork()
  loadNetwork(1)
  loadNetwork(2)
  mergeParentNetworks()
  mutateChildNetwork()
  refreshScreen()
}

function resetVar() {
  start('Reseting temporary variables...')

  neuronArray = []

  finish()
}

function generateNeurons () {
  var xIndex = 0
  var yIndex = 0
  //creationTime = new Date().toLocaleString()
  creationTime = new Date().getTime()

  print('Network creation time set to ' + creationTime)

  print('BRAIN GENERATION STAGE I')
  start('Generating neurons for initial round...')

  for (var i = 0; i <= totalNeurons + 1; i++) {
    if (xIndex < neuronWidth) {
      neuronArray.push(xIndex + ' ' + yIndex + ' ' + offload + ' ' + spark + ' ' + active + ' ' + '|')
      print(neuronArray[neuronArray.length - 1])
      xIndex++
    } else {
      print()
      xIndex = 0
      yIndex++
    }
  }
  finish()
}

function mergeParentNetworks(){
  start('Merging parent networks...')
  print(parentArrayA)
  print(parentArrayB)
  for (var i = 0; i < totalNeurons; i++) {
    var chosenParent = Math.floor(Math.random() * 2)
    print('Chosen parent was ' + chosenParent)
    if (chosenParent == 0){
      neuronArray[i] = parentArrayA[i]

    } else if (chosenParent == 1){
      neuronArray[i] = parentArrayB[i]
    }
  }
  finish()
  print(neuronArray)
}

function mutateChildNetwork(){
  start('Mutating child network...')
  for (var i = 0; i < totalNeurons; i++){
    var mutate = Math.floor(Math.random() * 2)
    if (mutate == 1){
      mutateNeuron(i)
    }
  }
  finish()
}

function mutateNeuron (neuron) {
  start('Mutating neuron number ' + neuron + '...')
  // the x and y values is stored inside an array inside a array inside an array inside an array.

  var randomA = Math.floor(Math.random() * 8) // How many Neurons
  print('randomA is ' + randomA)
  var iX = neuronInfo(neuron)[0]
  var iY = neuronInfo(neuron)[1]

  print('Current x cords are ' + iX)
  print('Current y cords are ' + iY)
  var x = 0
  var y = 0
  for (var i = 0; i < randomA; i++) {
    var random = Math.floor(Math.random() * 8) // What Neuron

    if (random === 0) {
      x = Number(iX) - 1
      y = Number(iY) + 0
    } else if (random === 1) {
      x = Number(iX) + 0
      y = Number(iY) - 1
    } else if (random === 2) {
      x = Number(iX) + 1
      y = Number(iY) + 0
    } else if (random === 3) {
      x = Number(iX) + 0
      y = Number(iY) + 1
    } else if (random === 4) {
      x = Number(iX) + 1
      y = Number(iY) + 1
    } else if (random === 5) {
      x = Number(iX) - 1
      y = Number(iY) - 1
    } else if (random === 6) {
      x = Number(iX) - 1
      y = Number(iY) + 1
    } else if (random === 7) {
      x = Number(iX) + 1
      y = Number(iY) - 1
    }
    print('x is now ' + x)
    print('y is now ' + y)

    if (isNaN(x) || isNaN(y)){
      throw new Error('x and y are NaN');
    }

    print('Applying to neuron number ' + neuron)

    neuronArray[neuron] = (neuronInfo(neuron) + x + ',' + y + '|')

    print('Final neuron data is ' + neuronArray[neuron])
    print('Random var was ' + random)
  }
  finish()
}
