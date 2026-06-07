import { contextBridge, ipcRenderer } from 'electron'

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  resizeWindow: (expanded: boolean) => ipcRenderer.send('resize-window', expanded),
  openDashboard: () => ipcRenderer.send('open-dashboard'),
  closeDashboard: () => ipcRenderer.send('close-dashboard'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  closeApp: () => ipcRenderer.send('close-app'),
  onDashboardOpened: (callback: () => void) => ipcRenderer.on('dashboard-opened', callback),
})
