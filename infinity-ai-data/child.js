console.log('hello from Node.js')

// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");

/*// Speed up the mouse.
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

for (var x = 0; x < width; x++)
{
    y = height * Math.sin((twoPI * x) / width) + height;
    robot.moveMouse(x, y);
}

// ------------------------------------------------

// Type "Hello World" then press enter.
var robot = require("robotjs");

// Type "Hello World".
robot.typeString("Hello World");

// Press enter.
robot.keyTap("enter");

// ------------------------------------------------

// Get pixel color under the mouse.
var robot = require("robotjs");

// Get mouse position.
var mouse = robot.getMousePos();

// Get pixel color in hex format.
var hex = robot.getPixelColor(mouse.x, mouse.y);
console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);*/

var size = 100;
var img = robot.screen.capture(0, 0, size, size);
// Support for higher density screens.
var multi = img.width / size;
// Get color at 2, 3.
var color = img.colorAt(40 * multi, 40 * multi)
console.log(color)

// -----------------------------------------------------------
try{
  var spawn = require('child_process').spawn

  if (process.argv[2] === 'child') {
    var net = require('net')
    var pipe = new net.Socket({ fd: 3 })
    pipe.write('killme')
    //console.log('child', bears)
  } else {
    var child = spawn(process.execPath, ['~/InfinityAI/main.js', 'child'], {
      stdio: [null, null, null, 'pipe']
    })
    child.stdio[3].on('data', function (data) {
      if (data.toString() === 'killme') {
        console.log('RIP')
        child.kill()
      }
    })
  }
} catch(e){
  console.log(e)
}

// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");

// Speed up the mouse.
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

for (var x = 0; x < width; x++)
{
    y = height * Math.sin((twoPI * x) / width) + height;
    robot.moveMouse(x, y);
}
