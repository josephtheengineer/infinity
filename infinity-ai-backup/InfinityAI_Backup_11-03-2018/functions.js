// Title          : functions.js
// Project        : InfinityAI
// Usage          : Everything that the main brain generator calls A LOT, use little if no logging.
// Author         : Joseph The Engineer
// Date Created   : --
// Date Updated   : 26-02-2018

// Log Manager ------------------------------------

function print(msg){
  logManager(msg, 0)
}

function start(msg){
  for (var i = msg.length; i < 40; i++){
    msg = msg + ' '
  }
    logManager(msg, 1)
}

function finish(){
    logManager('                         Done!', 2)
}

function error(msg){
  logManager(msg, 3)
}

var started = false
var pending = []

function logManager(msg, type){
  if (type == 0){
    if (started){
      pending.push(msg)
    } else {
      logger.info(msg)
    }
  } else if (type == 1){
    process.stdout.write(chalk.blue(msg))
    started = true
  } else if (type == 2 && started) {
    process.stdout.write(chalk.green(msg + '\n'))
    console.log('')
    started = false
    for (var i = 0; i < pending.length; i++) {
      if (pending[i] != '') {
        logger.info(pending[i])
        pending[i] = ''
      }
    }
  } else if (type == 3){
    process.stdout.write(chalk.red('                       Failed!' + '\n'))
    console.log('')
    started = false
    for (var i = 0; i < pending.length; i++) {
      if (pending[i] != '') {
        logger.info(pending[i])
        pending[i] = ''
      }
    }
    process.stdout.write(chalk.red(msg + '\n'))
    console.log('')
    started = true
  }
}

// Neuron Fetchers ------------------------------------

function neuronInfo (neuron, array) {
  try {
    if (array == null) {
      return neuronArray[neuron].split(' ')
    } else if (array == A) {
      return neuronArrayA[neuron].split(' ')
    } else if (array == B) {
      return neuronArrayB[neuron].split(' ')
    }
  } catch (e) {
      logger.info('error on split of neuron ' + neuron + ' on array ' + array)
      logger.info(neuronArray)
      logger.info(e)
  }
}

function validateNeuron (neuron) {
  if(neuronArray[neuron] == null){
    return false
  } else {
    return true
  }
}

function isActive(neuron){
  if (neuronInfo(neuron)[4] === '1') {
    return true
  } else {
    return false
  }
}

function fetchIndex(x, y) {
  return Number(y) * neuronWidth + Number(x)
}

function setActive(x, y){
    var n = fetchIndex(x, y)
  if (neuronArray[n] != null) {
    print(neuronInfo(n))
    neuronArray[n] = (neuronInfo(n)[0] + ' ' + neuronInfo(n)[1] + ' ' + neuronInfo(n)[2] + ' ' + neuronInfo(n)[3] + ' 1 ' + neuronInfo(n)[5])
  }
}

function reset(){
  const path = require('path');

  const directory = 'networks';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

// Generation Savers ------------------------------------

function saveNetwork () {
  start('Saving network...')
  print(neuronArray)
  fs.writeFileSync('networks/' + creationTime + '.network', neuronArray)
  if (fs.existsSync('networks/index.txt')) {
      var index = fs.readFileSync('networks/' + 'index.txt', 'utf8')
      fs.writeFileSync('networks/' + 'index.txt', index + ',' + creationTime + '|' + fitness)
  } else {
    var index = ''
    fs.writeFileSync('networks/' + 'index.txt', index + creationTime + '|' + fitness)
  }
  finish()
}

function loadNetwork (option) {
  //start('Loading network into slot ' + option + '...')
  var index = fs.readFileSync('networks/' + 'index.txt', 'utf8')
  var fileNames = index.split(',')

  print('Fetched latest networks: ' + fileNames)

  var heighestFitness = 0
  var potentialParent = []

  for (var i = 0; i < fileNames.length; i++) {
      if (fileNames[i].split('|')[1] >= heighestFitness) {
        heighestFitness = fileNames[i].split('|')[1]
      }
  }

  //Chose heighest one
  for (var i = 0; i < fileNames.length; i++) {
      if (fileNames[i].split('|')[1] >= (heighestFitness)) {
        potentialParent.push(fileNames[i].split('|')[0])
      }
  }
  print('Potential parents: ' + potentialParent)
  var chosenParent = Math.floor(Math.random() * potentialParent.length)
  print('Number is ' + chosenParent)
  print('Chosen network is ' + potentialParent[chosenParent])

  if (option == 0){
   neuronArray = fs.readFileSync('networks/' + potentialParent[chosenParent] + '.network', 'utf8').split(',')
 } else if (option == 1) {
    parentArrayA = fs.readFileSync('networks/' + potentialParent[chosenParent] + '.network', 'utf8').split(',')
  } else if (option == 2) {
    parentArrayB = fs.readFileSync('networks/' + potentialParent[chosenParent] + '.network', 'utf8').split(',')
  }
  finish()
}

// Render Stuff ------------------------------------

function refreshScreen () {
  start('Refreshing screen...')
  document.getElementById('fitness').innerHTML = fitness
  table()
  //tableRaw()
  graph()
  finish()
}

function graph(){
  var numberArray = []
  for (var i = 0; i < fitnessArray.length; i++) {
    numberArray.push(i)
  }
  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      maintainAspectRatio: false,
      data: {
          labels: numberArray,
          datasets: [{
              label: 'Fitness',
              data: fitnessArray,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        animation: false,
      }
  });
}

function table(){
  var html
  var circleRed = '<td><div class="circleRed"></div></td>'
  var circleGreen = '<td><div class="circleGreen"></div></td>'
  var circleBlue = '<td><div class="circleBlue"></div></td>'
  var circleGrey = '<td><div class="circleGrey"></div></td>'

  var selectedNeuron = 0

  html = ' '
  html = html + '<table>'
  for (var a = 0; a < neuronHeight; a++){
    html = html + '<tr>'
    for (var b = 0; b < neuronWidth; b++) {
      if (selectedNeuron !== goal) {
        if (neuronInfo(selectedNeuron)[4] === '1') {
          html = html + circleGreen
          selectedNeuron++
        } else {
          html = html + circleRed
          selectedNeuron++
        }
      } else {
        if (neuronInfo(selectedNeuron)[4] === '1') {
          html = html + circleBlue
          selectedNeuron++
        } else {
          html = html + circleGrey
          selectedNeuron++
        }
      }
    }
    html = html + '</tr>'
  }
  html = html + '</table>'

  document.getElementById('neuronTable').innerHTML=html
}

function tableRaw(){
  var html

  var selectedNeuron = 0

  html = ' '
  html = html + '<table>'
  for (var a = 0; a < neuronHeight; a++){
    html = html + '<tr>'
    for (var b = 0; b < neuronWidth; b++) {
      html = html + '<td>' + neuronArray[selectedNeuron] + '</td>'
    }
    html = html + '</tr>'
  }
  html = html + '</table>'

  document.getElementById('rawNeuronTable').innerHTML=html
}

/*
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
*/
