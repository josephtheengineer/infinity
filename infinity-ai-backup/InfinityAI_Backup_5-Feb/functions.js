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
  }
}

function neuronInfo (neuron) {
  var settings = neuronArray[neuron]

  return settings.split(' ')
}
function neuronInfoA (neuron) {
  var settings = parentArrayA[neuron]

  return settings.split(' ')
}
function neuronInfoB (neuron) {
  var settings = parentArrayB[neuron]

  return settings.split(' ')
}

function rowInfo (rowIndex, network) {
  var selectedNeuron = rowIndex * neuronWidth
  var neuronRow = []
  for (var i = 0; i < neuronWidth; i++) {
      neuronRow.push(neuronInfo(selectedNeuron))
      selectedNeuron++
  }
  return neuronRow
}

function calculateFitness () {
  print('Calculating fitness score...')

  print('Goal is ' + goal)

  var xGoal = neuronInfo(goal)[0]
  var yGoal = neuronInfo(goal)[1]

  var x = 1
  var y = 1

  print("Method: Distance from 'neuron' goal...")

  if (neuronInfo(goal)[4] === 1) {
    fitness = 10
    print("'Neuron' goal reached!")
  } else {
    for (var i = 0; i < 50; i++) {
      if (neuronArray[i] != null && neuronInfo(i)[4] === 1) {
        // Neuron is active

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
      }
    }
  }
  print('Fitness is ' + fitness)
}

function saveNetwork () {
  start('Saving network...')
  fs.writeFileSync('networks/' + creationTime + '.network', neuronArray)
  if (fs.existsSync('networks/index.txt')) {
      var index = fs.readFileSync('networks/' + 'index.txt', 'utf8')
      fs.writeFileSync('networks/' + 'index.txt', index + ',' + creationTime + "|" + fitness)
  } else {
    var index = ''
    fs.writeFileSync('networks/' + 'index.txt', index + creationTime + "|" + fitness)
  }
  finish()
}

function loadNetwork (option) {
  start('Loading network into slot ' + option + '...')
  var index = fs.readFileSync('networks/' + 'index.txt', 'utf8')
  var fileNames = index.split(',')

  print('Fetched latest networks: ' + fileNames)

  var lowestFitness = 0
  var potentialParent = []

  //Chose heighest one
  for (var i = 0; i < fileNames.length; i++) {
      if (fileNames[i].split('|')[1] >= lowestFitness) {
        potentialParent.push(fileNames[i].split('|')[0])
      }
  }
  print('Potential parents: ' + potentialParent)
  var chosenParent = Math.floor(Math.random() * fileNames.length)
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

function refreshScreen () {
  start('Refreshing screen...')
  document.getElementById('fitness').innerHTML = fitness
  drawTable('rawNeuron', 'rawNeuronTable')
  drawTable('neuron', 'neuronTable')

  finish()
}
function drawTable(data, tableName){
  document.getElementById("i" + tableName).innerHTML = ''
  var tableRef = document.getElementById(tableName).getElementsByTagName('tbody')[0]
  var row
  for (var i = 0; i < neuronHeight; i++) {
    newRow = tableRef.insertRow(tableRef.rows.length)
    if (data == 'rawNeuron') {
      row = rowInfo(i).reverse()
    } else if (data == 'neuron'){
      row = rowInfo(i).reverse()
    }
    for (var ii = 0; ii < neuronWidth; ii++) {
      var newCell = newRow.insertCell(0)
      var newText
      newText = document.createTextNode(row[ii])
      newCell.appendChild(newText)
    }
  }
}

function rowStuff (rowIndex, network) {
var selectedNeuron = rowIndex * neuronWidth
var neuronRow = []
for (var i = 0; i < neuronWidth; i++) {

  if (neuronArray[selectedNeuron] == null) {
    neuronRow.push('<div></div id="null">')
  } else {
    if (selectedNeuron !== goal) {
      if (neuronInfo(selectedNeuron)[4] === '1') {
        neuronRow.push('<div></div id="circleGreen">')
      } else if (neuronInfo(selectedNeuron)[4] === '0') {
        neuronRow.push('<div></div id="circle">')
      }
    } else {
      if (neuronInfo(selectedNeuron)[4] === '1') {
        neuronRow.push('<div></div id="circleBlue">')
      } else if (neuronInfo(selectedNeuron)[4] === '0') {
        neuronRow.push('<div></div id="circleGrey">')
      }
    }

    selectedNeuron++
}
return neuronRow
}
/*


  var i = 0
  var ii = 0
  while (i < totalNeurons) {
    logger.info('i is ' + i)
    ii = i + 1
    logger.info('ii is ' + ii)
    document.getElementById('rawNeuron' + ii).innerHTML = neuronArray[i]
    logger.info('rawNeuron' + ii + ' = ' + neuronArray[i])
    i++
  }
  i = 0
  ii = 0
  while (i < 50) {
    ii = i + 1
    if (neuronArray[i] == null) {
      document.getElementById('neuron' + ii).className = 'null'
    } else {
      if (i !== goal) {
        if (neuronArray[i].split(' ')[4] === '1') {
          document.getElementById('neuron' + ii).className = 'circleGreen'
        } else if (neuronArray[i].split(' ')[4] === '0') {
          document.getElementById('neuron' + ii).className = 'circle'
        }
      } else {
        if (neuronArray[i].split(' ')[4] === '1') {
          document.getElementById('neuron' + ii).className = 'circleBlue'
        } else if (neuronArray[i].split(' ')[4] === '0') {
          document.getElementById('neuron' + ii).className = 'circleGrey'
        }
      }
    }
    i++
  }
*/
function validateNeuron (neuron) {
  if(neuronArray[neuron] == null){
    return false
  } else {
    return true
  }
}
