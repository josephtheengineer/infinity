const electron = require('electron')
const url = require('url')
const path = require('path')

// Rembember the start command is 'npm start' ᕕ( ᐛ )ᕗ

const {app, BrowserWindow, Menu} = electron

let index
let game
let addWindow

var fs = require('fs')
var logger = require('winston')

logger.add(
  logger.transports.File, {
    filename: 'logs/' + new Date().getTime() + '.log',
    level: 'info',
    json: true,
    timestamp: true
  }
)

// Use this singleton instance of logger like:
// logger = require( 'Logger.js' );
// logger.error()
// logger.warn()
// logger.info()

// Listen for app to be ready
app.on('ready', function() {

    // Create new window
    index = new BrowserWindow ({});
    //load html into window
    index.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol:'file:',
        slashes: true
    }));

    // Quit app when closed
    index.on('closed', function(){
       app.quit();
    });

/*
    // Create new window
    game = new BrowserWindow ({});
    //load html into window
    game.loadURL(url.format({
        pathname: path.join(__dirname, 'JavaScript-Snake/index.html'),
        protocol:'file:',
        slashes: true
    }));

    // Quit app when closed
    game.on('closed', function(){
       app.quit();
    });
*/
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu)
});

// Handle add window
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow ({
        width: 300,
        height:200,
        title:'Add Item'
    });
    //load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'JavaScript-Snake/index.html'),
        protocol:'file:',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                 app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add devloper tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Devoloper Tools',
        submenu:[
        {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }
        ]
    });
}
