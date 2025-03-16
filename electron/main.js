const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');
const axios = require('axios');

process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let mainWindow;
const PYTHON_API_URL = 'http://localhost:8080';


function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
ipcMain.handle('get-user-data', async () => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/api/user-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data from Python backend:', error);
    return {
      name: 'Offline User',
      email: 'offline@example.com',
      lastLogin: new Date().toISOString()
    };
  }
});

ipcMain.handle('navigate-to-screen', async (event, screenName) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/navigate`, {
      screen: screenName
    });
    return response.data;
  } catch (error) {
    console.error('Error connecting to Python backend for navigation:', error);
    return { success: true, screen: screenName };
  }
});
