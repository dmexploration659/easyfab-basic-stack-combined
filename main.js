const { app, BrowserWindow, Menu, MenuItem, ipcMain} = require('electron');
const { spawn } = require("child_process");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const existingMenu = Menu.getApplicationMenu();
  // Modify the existing File menu
  const fileMenu = existingMenu.items.find(item => item.label === 'File');
  // Insert new items at the beginning of the File menu (before Exit)
  if (fileMenu && fileMenu.submenu) {
    // Add separator before the Exit item
    fileMenu.submenu.insert(0, new MenuItem({ type: 'separator' }));
    
    // Add the new items before the separator
    fileMenu.submenu.insert(0, new MenuItem({
      label: 'Send svg (dev)',
      accelerator: 'CmdOrCtrl+SV',
      click: () => {
        broadcast({
          type: 'menu-action',
          action: 'send-svg',
          data: { message: 'SVG export triggered from menu' }
        });
      }
    }));
    fileMenu.submenu.insert(0, new MenuItem({
      label: 'Save',
      accelerator: 'CmdOrCtrl+S',
      click: () => { /*function to save product*/ }
    }));
    
    fileMenu.submenu.insert(0, new MenuItem({
      label: 'Open',
      accelerator: 'CmdOrCtrl+O',
      click: () => { /*function to open existing product*/ }
    }));
    
    fileMenu.submenu.insert(0, new MenuItem({
      label: 'New',
      accelerator: 'CmdOrCtrl+N',
      click: () => { /*function to create new product new action */ }
    }));
  }
  Menu.setApplicationMenu(existingMenu);

  // Maximize the window immediately after creation
  mainWindow.maximize();

  mainWindow.loadURL('file://' + path.join(__dirname, 'front-end', 'index.html'));
  //mainWindow.webContents.openDevTools();

  const pythonProcess = spawn("python", ["-u", path.join(__dirname, "python_scripts", "executive.py")]);
  
  pythonProcess.stdout.on("data", (data) => {
        console.log(`Python Output: ${data}`);
      });
    
      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
      });
    
      pythonProcess.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);
      });


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// wss.on('connection', (ws) => {
//   console.log('A new client connected!');
//   ws.send('connected to easyFab1');
//   ws.on('message', (message) => {
//       console.log(`Received: ${message}`);
//       ws.send(`You said: ${message}`);
//   });

//   ws.on('close', () => {
//       console.log('client disconnected.');
//   });
// });

const clients = new Map();
wss.on('connection', (ws) => {
    console.log('new client connected.');
    ws.on('message', (message) => {
      console.log(`received message: ${message}`);
        try {
            const data = JSON.parse(message);
            if (data.type === 'register' && data.name) {
                const name = data.name.trim();
                registerClient(ws, name);
            }

            if (data.type === 'private-message' && data.to) {
                console.log(`going to send pv to ${data.to} and ws is ${ws} and data is ${data}`);
                  sendPrivateMessage(ws, data);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        if (ws.name) {
            clients.delete(ws.name);
            broadcast({
                type: 'user-left',
                name: ws.name,
            });
            console.log(`Client "${ws.name}" disconnected.`);
        }
    });
});



function broadcast(message) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

function registerClient(ws, name) {
    if (clients.has(name)) {
      ws.send(JSON.stringify({
        type: 'register-response',
        success: false,
        message: `Name "${name}" is already taken`,
      }));
    } 
    else {
      clients.set(name, ws);
      ws.name = name; 
      ws.send(JSON.stringify({
          type: 'register-response',
          success: true,
          message: `You are now registered as "${name}".`,
      }));
      console.log(`Client registered as "${name}".`);
      broadcast({
          type: 'user-joined',
          name: name,
      });
  }
}

function sendPrivateMessage(ws, data) {
  console.log(`sending pv to ${data.to} and ws is ${ws} and data is ${data}`);
 if (clients.has(data.to)){
    const message = data.message;
    const targetClient = clients.get(data.to); 
    console.log('from the sender****:',ws.name);
    if (targetClient && targetClient.readyState === WebSocket.OPEN) {
      targetClient.send(JSON.stringify({
          type: 'private-message',
          from: ws.name, 
          message: message,
          title: data.title,
      }));
      console.log(`Message forwarded from "${ws.name}" to "${targetClient.name}". g-codes message is ${JSON.stringify(message)}`);
    } 

  }
  else {
    console.log(`Target client "${data.to}" not found or not connected.`);
    ws.send(JSON.stringify({
      type: 'private-message-response',
      success: false,
      message: `Target client "${data.to}" not found or not connected.`,
    }));
  }

}
    
console.log('WebSocket server is running on ws://localhost:8080');