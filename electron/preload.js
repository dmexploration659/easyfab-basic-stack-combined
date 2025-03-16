const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getUserData: () => ipcRenderer.invoke('get-user-data'),
  navigateToScreen: (screenName) => ipcRenderer.invoke('navigate-to-screen', screenName)
});