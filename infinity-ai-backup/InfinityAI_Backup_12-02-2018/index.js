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
  process.stdout.write(chalk.red('=== INFINITY AI - BOOT UP SEQUENCE INITIATED ===' + '\n'))
  console.log('')
  resetVar()
  generateNeurons()
  refreshScreen()
  //saveNetwork()
  loadNetwork(1)
  loadNetwork(2)
  mergeParentNetworks()
  mutateChildNetwork()
  traceConnections()
  calculateFitness()
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
  print('mutated network: ' + neuronArray)
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
      print('x and y are NaN');
    }

    print('Applying to neuron number ' + neuron)

    neuronArray[neuron] = (neuronArray[neuron] + x + ',' + y + '|')

    print('Final neuron data is ' + neuronArray[neuron])
    print('Random var was ' + random)
  }
  finish()
}

function traceConnections(){
  //start('Tracing neural connections...')

  print('Starting network chain at index 0,0 (0)')
  setActive(0, 0)

  for (var i = 0; i < totalNeurons; i++){
    print(i)
    if (isActive(i)){
      print(i + ' is active!')
      print(neuronInfo(i))
      var aa = neuronInfo(i)
      print(aa[5])
      var bb = aa[5]
      print(bb.split('|'))
      bb = bb.split('|')
      print(bb[1])
      var cc = bb[1]
      print(bb.length + 'wow')
      print('Activating ' + cc.split(',')[0])
      print('Activating ' + cc.split(',')[1])
      for (var c = 1; c < (bb.length - 1); c++) {
        print('Activating neuron ' + c)
        var connection = neuronInfo(i)[5].split('|')[c].split(',')
        setActive(connection[0], connection[1])
      }
    }
  }
  finish()
}

/* BROKEN CODE
function traceConnections () {
  // traces the connections bettween the neurons
  start('Tracing neural connections...')

  var selectedNeuron = 0

  logger.info('Starting network chain at index 0,0 (0)')
  neuronArray[0] = (neuronInfo(0)[0] + ' ' + neuronInfo(0)[1] + ' ' + neuronInfo(0)[2] + ' ' + neuronInfo(0)[3] + ' 1 ' + neuronInfo(0)[5])
  //neuronArray[1] = (neuronInfo(1)[0] + ' ' + neuronInfo(1)[1] + ' ' + neuronInfo(1)[2] + ' ' + neuronInfo(1)[3] + ' 1 ' + neuronInfo(1)[5])
  logger.info(neuronArray[0])

  logger.info(selectedNeuron + '||' + (Number(totalNeurons) - 1))
  while (selectedNeuron <= (Number(totalNeurons) - 1)) {
    logger.info(selectedNeuron + '||' + (Number(totalNeurons) - 1))
    if (neuronInfo(selectedNeuron)[4] === '1' && neuronInfo(selectedNeuron)[5].split('|') != null) {
      logger.info('Neuron ' + selectedNeuron + ' has returned positive')
      logger.info(totalNeurons)
      logger.info('//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////')

      var connections = neuronInfo(selectedNeuron)[5].split('|')

      for (var i = 0; i < 5; i++) {
        var location = connections[i].split(',')
        var connectionNumber = (Number(location[0]) + neuronWidth * (Number(location[1]) - 1) - 1)

        logger.info(connections)
        logger.info(connectionNumber + ' STAGE II')

        if (connectionNumber > 0 && connectionNumber < totalNeurons && location[1] > 0 && location[0] > 0) {
          neuronArray[connectionNumber] = (neuronInfo(connectionNumber)[0] + ' ' + neuronInfo(connectionNumber)[1] + ' ' + neuronInfo(connectionNumber)[2] + ' ' + neuronInfo(connectionNumber)[3] + ' 1 ' + neuronInfo(connectionNumber)[5])
        }
      }
    }
    selectedNeuron++
  }
  finish()
}*/
