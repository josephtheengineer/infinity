// Title          : index.js
// Project        : InfinityAI
// Usage          : Everything that is directly realated to brain generation, use exstensive logging.
// Author         : Joseph The Engineer
// Date Created   : --
// Date Updated   : 26-02-2018

var chalk = require('chalk')
var fs = require('fs')
var Stopwatch = require('node-stopwatch').Stopwatch;
var logger = require('winston')
var Chart = require('chart.js');

logger.add(
  logger.transports.File, {
    filename: 'logs/' + new Date().getTime() + '.log',
    level: 'info',
    json: true,
    timestamp: true
  }
)

// Settings

var goal = 99
var neuronWidth = 10
var neuronHeight = 10

// Brain builder variables

var parentArrayA = []
var neuronArrayB = []
var neuronArray = []
var fitnessArray = []
var totalNeurons = neuronWidth * neuronHeight
var fitness = 0
var creationTime
var neuronsActive = 0

var i = 0, howManyTimes = 10000;
function main() {
    //try {
      process.stdout.write(chalk.red('=== INFINITY AI - BOOT UP SEQUENCE INITIATED ===' + '\n'))
      console.log('')
      print(i + '////////////////////////////////////////////////')

      generateNeurons()
      //refreshScreen()
      loadNetwork(1)
      loadNetwork(2)
      mergeParentNetworks()
      mutateChildNetwork()
      traceConnections()
      saveNetwork()
      refreshScreen()
      print(neuronArray)

      i++;
      if( i < howManyTimes ){
          setTimeout( main, 100 )
          //main()
      }
    //} catch (e){
    //  print(neuronArray)
    //  error(e + '\n' + new Error().stack)
    //}
}

function generateNeurons () {
  neuronArray = []
  var offload = 100
  var spark = 0
  var active = 0

  var xIndex = 0
  var yIndex = 0

  creationTime = new Date().getTime()

  print('Network creation time set to ' + creationTime)

  print('BRAIN GENERATION STAGE I')
  print(totalNeurons)
  start('Generating neurons for initial round...')

  xIndex = 0
  yIndex = 0

  for (var a = 0; a < neuronWidth; a++){
    for (var b = 0; b < neuronHeight; b++) {
      neuronArray.push(xIndex + ' ' + yIndex + ' ' + offload + ' ' + spark + ' ' + active + ' ' + '|')
      print(neuronArray[neuronArray.length - 1])
      xIndex++;
    }
    xIndex = 0;
    yIndex++;
  }

  print (neuronArray.length + ' neurons created.')
  totalNeurons = neuronArray.length
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
  for (var i = 0; i < totalNeurons - 1; i++){
    var mutate = Math.floor(Math.random() * 7)
    if (mutate == 1){
      mutateNeuron(i)
    }
  }
  print('mutated network: ' + neuronArray)
  finish()
  logger.info(i)
}

function mutateNeuron (neuron) {
  start('Mutating neuron number ' + neuron + '...')
  // the x and y values is stored inside an array inside a array inside an array inside an array.
  print(neuronArray[neuron])
  var randomA = Math.floor(Math.random() * 3) // How many Neurons
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

    var number = neuronWidth * y + x
    print (number + 'IS THIS THING ON???? ////////////////////')

    if (validateNeuron(number)) {
      print('Applying to neuron number ' + neuron)

      neuronArray[neuron] = (neuronArray[neuron] + x + '.' + y + '|')

      print('Final neuron data is ' + neuronArray[neuron])
      print('Random var was ' + random)
    }
  }
  finish()
}

function traceConnections(){
  neuronsActive = 0
  //start('Tracing neural connections...')

  print('Starting network chain at index 0,0 (0)')
  setActive(0, 0)

  print('Goal is ' + goal)

  var xGoal = neuronInfo(goal)[0]
  var yGoal = neuronInfo(goal)[1]
  var distance
  var xNow
  var yNow

  for (var i = 0; i < totalNeurons; i++){
    print(i)
    if (isActive(i)){
      // Are we closer to the goal?
      xNow = neuronInfo(i)[0]
      yNow = neuronInfo(i)[1]

      var abc = Math.pow((xGoal-xNow), 2) // x
      var bcd = Math.pow((yGoal-yNow), 2) // y
      distance = Math.sqrt (abc + bcd)
      print(distance + '////////////////////////////////////////////////////////////')


      print(i + ' is active!')
      neuronsActive++

      var info = neuronInfo(i)[5].split('|')

      for (var c = 1; c < (info.length - 1); c++) {
        print('Activating neuron ' + c)
        var connection = neuronInfo(i)[5].split('|')[c].split('.')
        setActive(connection[0], connection[1])
      }
    }
  }

  print(distance + ' pie')
  print('LOOK ////////////////////////////////')
  var array = []
  for (var i = 0; i < neuronArray.length; i++){
      array.push('0')
  }
  bbh = Math.round(distance)
  array[bbh] = '1'
  print(array)
  array = array.reverse()
  print(array)
  print('LOOK HERE o o')

  for (var i = 0; i < array.length; i++){
    if (array[i] == '1'){
      fitness = i - (neuronsActive / 3)
    }
  }
  if (fitness < 50) {
    fitness = 50
  }
  if (isActive(goal)) {
    fitness = fitness + 10
    document.getElementById('isActive').innerHTML = 'GOAL REACHED!'
    print('GOAL REACHED!')
  }
  print(fitness)

  fitnessArray.push(fitness)
  print('Fitness is ' + fitness)
  finish()
}

function calculateFitness () {
  start('Calculating fitness score...')

  print('Goal is ' + goal)

  var xGoal = neuronInfo(goal)[0]
  var yGoal = neuronInfo(goal)[1]

  var x = 0
  var y = 0

  print("Method: Distance from 'neuron' goal...")

  if (isActive(goal)) {
    fitnessX = 0
    print("'Neuron' goal reached!")
  } else {
    for (var i = 0; i < 50; i++) {
      if (neuronArray[i] != null && isActive(i)) {
        // Neuron is active
        print('Neuron is active wowowowo')

        print(Math.abs(neuronInfo(i)[0] - xGoal) < Math.abs(x - xGoal))
        if (Math.abs(neuronInfo(i)[0] - xGoal) < Math.abs(x - xGoal)) {
          x = neuronInfo(i)[0]
          print('new x is ' + x)
        }
        print(Math.abs(neuronInfo(i)[1] - yGoal) < Math.abs(y - yGoal))
        if (Math.abs(neuronInfo(i)[1] - yGoal) < Math.abs(y - yGoal)) {
          y = neuronInfo(i)[0]
          print('new y is ' + y)
        }
        fitnessX = xGoal - x
      }
    }
  }

  print(fitnessX + ' pie')
  print('LOOK ////////////////////////////////')
  var array = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
  array[fitnessX] = '1'
  array = array.reverse()
  print(array)
  print('LOOK HERE o o')

  for (var i = 0; i < array.length; i++){
    if (array[i] == '1'){
      fitness = i
    }
  }
  print(fitness)

  fitnessArray.push(fitness)
  print('Fitness is ' + fitness)
  finish()
}

function calcuateFitnessHMM () {
  start('Calculating fitness score...')

  print('Goal is ' + goal)

  var xGoal = neuronInfo(goal)[0]
  var yGoal = neuronInfo(goal)[1]


  finish()
}
