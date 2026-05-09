// Main process: main.js
// This example shows how to use SerialPilot in an Electron main process.

const { SerialPilot } = require('serialpilot')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  mainWindow.loadFile('index.html')
}

ipcMain.handle('list-ports', async () => {
  return SerialPilot.list()
})

ipcMain.on('open-port', (event, { path, baudRate }) => {
  const port = new SerialPilot({ path, baudRate })
  port.on('data', (data) => {
    mainWindow.webContents.send('serial-data', data.toString())
  })
  port.on('close', () => {
    mainWindow.webContents.send('serial-closed')
  })
})

app.whenReady().then(createWindow)