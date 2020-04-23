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

  var x = 0
  var y = 0

  print("Method: Distance from 'neuron' goal...")

  if (isActive(goal)) {
    fitness = 0
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
        fitness = xGoal - x
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
  //drawTable('neuron', 'neuronTable')
  writeHtml()
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
      row = rowStuff(i).reverse()
    }
    for (var ii = 0; ii < neuronWidth; ii++) {
      var newCell = newRow.insertCell(0)
      var newText
      newText = document.createTextNode(row[ii])
      newCell.appendChild(newText)
    }
  }
}
function writeHtml(){
  var html
  var circleRed = '<td><div class="circleRed"></div></td>'
  var circleGreen = '<td><div class="circleGreen"></div></td>'
  var circleBlue = '<td><div class="circleBlue"></div></td>'
  var circleGrey = '<td><div class="circleGrey"></div></td>'

  var selectedNeuron = 0

  html = '<br>'
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

  document.getElementById("node-id").innerHTML=html
}

/*
function rowStuff (rowIndex, network) {
  var selectedNeuron = rowIndex * neuronWidth
  var neuronRow = []
  for (var i = 0; i < neuronWidth; i++) {
      neuronRow.push(neuronInfo(selectedNeuron))
      selectedNeuron++
  }
  return neuronRow
}*/

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
