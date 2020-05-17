// Understandable Code below
// Modules to control application life and create native browser window
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

// Define mainFiles
let mainWindow;
let mainWindowUrl = url.format({
  pathname: path.join(__dirname, "../../index.html"),
  protocol: "file:",
  slashes: true,
});
let mainMenu;

// Define AddWindow
let addWindow;
let addURL = url.format({
  pathname: path.join(__dirname, "../../addnew.html"),
  protocol: "file:",
  slashes: true,
});



app.on('ready', function() {
  // Create the main Window
  createMainWindow();

  mainWindow.on('closed', function() {
    app.quit();
  });

  // Create the menu
  mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});


// Jack's Code below

// Handle main window

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'assets/js/preload.js'),
    }
  });
  mainWindow.loadURL(mainWindowUrl);
}

// Handle adding window

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
  });

  addWindow.loadURL(addURL);

  addWindow.on('close', function() {
    addWindow = null;
  });
}

// Create the main template

const mainMenuTemplate = [
  {
    label: "File",
    submenu:[
      {
        label: "Create an item",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
      },
      {
        label: "Quit App",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      }
    ]
  }
]

// If mac, add empty object to menu

if(process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools is not in prod

if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload',
      }
    ]
  })
}





// Hard Understandable code below

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
});