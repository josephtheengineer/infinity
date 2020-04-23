// Title          : index.js
// Project        : InfinityAI
// Usage          : Everything that is directly realated to brain generation, use exstensive logging.
// Author         : Joseph The Engineer
// Date Created   : --
// Date Updated   : 26-02-2018

// ----------------------------------------------------------------------------------------------------

var inputArray = [1, 0, 1, 1]
var goal = [1, 0, 1, 1]

var neuronWidth = 3, neuronHeight = 4;

var fitness  = 0
var fitnessA = 0
var fitnessB = 0

var parentArrayA = [], parentArrayB = [], neuronArray = [], screenArray = [], fitnessArray = []

var outputArray = [0, 0, 0, 0]

// ----------------------------------------------------------------------------------------------------

var repeat = 200;
var wait = 200;
var snakeLength = 0

function dev(){ // dev is run before run()

}

function run(){
  loadNetwork(1)
  loadNetwork(2)
  mergeParentNetworks()
  mutateChildNetwork()
  bindNeuron(2, 0, 'inputA')
  bindNeuron(2, 1, 'inputB')
  bindNeuron(2, 2, 'inputC')
  bindNeuron(2, 3, 'inputD')
  traceConnections()
  refreshScreen()
  saveNetwork()
}

// ----------------------------------------------------------------------------------------------------

function updateFitness(){

  // Load network index file.
  var fileNames = (fs.readFileSync('networks/' + 'index.txt', 'utf8')).split(',')
  console.log(fileNames)

  // Erase the old index file.
  fs.writeFileSync('networks/' + 'index.txt', '')

  for (var i = 0; i < fileNames.length; i++){

    // Load outdated network.
    neuronArray = fs.readFileSync('networks/' + fileNames[i].split('|')[0] + '.network', 'utf8').split(',')

    // Set creationTime to match above.
    creationTime = fileNames[i].split('|')[0]

    // Update fitness.
    traceConnections()

    // Update the file.
    saveNetwork()
  }
}

function manualOverride(){
  process.stdout.write(chalk.red('=== INFINITY AI - MANUAL ANALOG OVERRIDE ENGAGED  ===' + '\n'))
  console.log('')
  print('manual override called')
  print('Autonomous mode disabled')
  stop()
}

function eStop(){
  process.stdout.write(chalk.red('=== INFINITY AI - EMERGENCY SHUTDOWN INITIATED ===' + '\n'))
  console.log('')
  print('e-stop called')
  print('Shutdown procedure commencing...')
  process.exit()
}

function graphXY(height, width, msg, breakline){
  for(var i = 1, x = ''; i <= height * width; i++) {
      var tmp = new Function(msg);
      x = x + tmp()
      if(i % width == 0){
          var x = x + breakline
      }
  }
  return x
}

function neuralConvert(){
  for (var i = 0; i < screenArray.length; i++) {
  (xIndex + ' ' + yIndex + ' ' + 100 + ' ' + 0 + ' ' + active + ' ' + '|')
  }
}

function loadScreen(){
  start('Loading screen...')
  screenArray = []

  var xIndex = startPixX // Pixel index
  var yIndex = startPixY // Pixel index

  for (var a = 0; a < pixWidth; a++){
    for (var b = 0; b < pixHeight; b++) {
      //robot.moveMouse(xIndex, yIndex)
      var color = convert.hex.hsl(robot.getPixelColor(xIndex, yIndex))
      //print(xIndex + "||" + yIndex)
      if (color[2] > 50) {
        setActive(a + 10, b + 10)
        //print('SET ACTIVE')
      } else {
        setIdle(a + 10, b + 10)
        //print('SET IDLE')
      }
      bindNeuron(a, b, 'pixel')

      //print(a + '||' + b)
      xIndex++;
    }
    xIndex = 230;
    yIndex++;
  }
  print(screenArray.length + ' pixels imported.')
  finish()
}

function generateNeurons () {
  neuronArray = []
  var offload = 100
  var type = 0
  var active = 0

  creationTime = new Date().getTime()

  print('Network creation time set to ' + creationTime)

  print('BRAIN GENERATION STAGE I')

  start('Generating neurons for initial round...')

  var xIndex = 0
  var yIndex = 0

  for (var a = 0; a < neuronWidth; a++){
    for (var b = 0; b < neuronHeight; b++) {
      neuronArray.push(xIndex + ' ' + yIndex + ' ' + offload + ' ' + type + ' ' + active + ' ' + '|')
      //print(neuronArray[neuronArray.length - 1])
      xIndex++;
    }
    xIndex = 0;
    yIndex++;
  }

  print (neuronArray.length + ' neurons created.')
  finish()
}

function mergeParentNetworks(){
  start('Merging parent networks...')
  creationTime = new Date().getTime()

  print('Network creation time set to ' + creationTime)
  for (var i = 0; i < parentArrayA.length; i++) {
    var chosenParent = Math.floor(Math.random() * 2)
    //print('Chosen parent was ' + chosenParent)
    if (chosenParent == 0){
      neuronArray[i] = parentArrayA[i]

    } else if (chosenParent == 1){
      neuronArray[i] = parentArrayB[i]
    }
  }
  finish()
}

function mutateChildNetwork(){
  start('Mutating child network...')
  var done = 0
  do {
    for (var i = 0; i < neuronArray.length; i++){
      var mutate = Math.floor(Math.random() * 7)
      if (mutate == 1){
        done++
        mutateNeuron(i)
      }
    }
  } while (done == 0) // Minimum amout of changes :P
  finish()
}

function mutateNeuron (neuron) {
  //start('Mutating neuron number ' + neuron + '...')
  // the x and y values is stored inside an array inside a array inside an array inside an array.
  //print(neuronArray[neuron])
  var randomA = Math.floor(Math.random() * 3) // How many Neurons
  //print('randomA is ' + randomA)
  var iX = neuronInfo(neuron)[0]
  var iY = neuronInfo(neuron)[1]

  //print('Current x cords are ' + iX)
  //print('Current y cords are ' + iY)
  var x = 0
  var y = 0
  for (var i = 0; i < randomA; i++) {
    var random = Math.floor(Math.random() * 9) // What Neuron

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

    var n = neuron

    if (random === 8) { // Reset
      neuronArray[n] = (neuronInfo(n)[0] + ' ' + neuronInfo(n)[1] + ' ' + neuronInfo(n)[2] + ' ' + neuronInfo(n)[3] + ' ' + neuronInfo(n)[4])
    } else {
      //print('x is now ' + x)
      //print('y is now ' + y)

      if (isNaN(x) || isNaN(y)){
        //print('x and y are NaN');
      }
      var number = neuronWidth * y + x

      if (validateNeuron(number)) {
        //print('Applying to neuron number ' + neuron)

        neuronArray[n] = (neuronInfo(n)[0] + ' ' + neuronInfo(n)[1] + ' ' + neuronInfo(n)[2] + ' ' + neuronInfo(n)[3] + ' ' + neuronInfo(n)[4] + ' |' +  x + '.' + y + '|')

        //print('Final neuron data is ' + neuronArray[neuron])
        //print('Random var was ' + random)
      }
    }
  }
  //finish()
}

function traceConnections(){
  start('Tracing neural connections...')
  var neuronsActive = 0

  //print('Starting network chain at index 0,0 (0)')

  for (var i = 0; i < 4; i++){
    if(inputArray[i] == 1){
      setActive(0, i)
    }
  }

  outputArray = [0, 0, 0, 0]

  //print('Goal is ' + goal)

  //var xGoal = neuronInfo(goal)[0]
  //var yGoal = neuronInfo(goal)[1]
  var distance
  var xNow
  var yNow

  for (var i = 0; i < neuronArray.length; i++){
    try {
      //print('Checking neuron ' + i)

      if (isActive(i)){
        // Are we closer to the goal?
  //      xNow = neuronInfo(i)[0]
  //      yNow = neuronInfo(i)[1]

//        var abc = Math.pow((xGoal-xNow), 2) // x
//        var bcd = Math.pow((yGoal-yNow), 2) // y
//        distance = Math.sqrt (abc + bcd)


        //print('                         Neuron ' + i + ' is active!')

        if (neuronInfo(i)[3] != 0) {
          //robot.keyTap(neuronInfo(i)[3])

          if (neuronInfo(i)[3] == 'inputA'){
            outputArray[0] = 1
            print("WAP")
          } else if (neuronInfo(i)[3] == 'inputB'){
            outputArray[1] = 1
            print("WAP")
          } else if (neuronInfo(i)[3] == 'inputC'){
            outputArray[2] = 1
            print("WAP")
          } else if (neuronInfo(i)[3] == 'inputD'){
            outputArray[3] = 1
            print("WAP")
          }
          document.getElementById('pressedKey').innerHTML = 'pressed ' + neuronInfo(i)[3]
        }

        neuronsActive++
        //print('IT WORKED')
        var info = neuronInfo(i)[5].split('|')

        for (var c = 1; c < (info.length - 1); c++) {
          //print('Activating neuron ' + c)
          var connection = neuronInfo(i)[5].split('|')[c].split('.')
          setActive(connection[0], connection[1])
        }
      }
    } catch (e){

    }
  }
/*
  //print('Distance from goal is now ' + distance)
  var array = []
  for (var i = 0; i < neuronArray.length; i++){
      array.push('0')
  }
  bbh = Math.round(distance)
  array[bbh] = '1'
  array = array.reverse()

  for (var i = 0; i < array.length; i++){
    if (array[i] == '1'){
      fitness = i - (neuronsActive / 3) // PENTALY FOR AMOUNT OF NEURONS ACTIVE
    }
  }
  if (fitness < 50) {
    fitness = 50
  }
  if (isActive(goal)) {
    fitness = fitness + 10 // REWARD FOR ACTIVATING THE GOAL
    document.getElementById('isActive').innerHTML = '+ 10 points // Goal reached'
    print('GOAL REACHED!')
  }
*/

  fitness = 0

  for (var i = 0; i < inputArray.length; i++) {
    if (goal[i] == outputArray[i]) {
      fitness = fitness + 1
    }
  }

  fitnessArray.push(fitness)
  print('Fitness is ' + fitness)
  finish()
}
