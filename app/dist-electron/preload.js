import { contextBridge, ipcRenderer } from 'electron';
// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    resizeWindow: (expanded) => ipcRenderer.send('resize-window', expanded),
    openDashboard: () => ipcRenderer.send('open-dashboard'),
    onDashboardOpened: (callback) => ipcRenderer.on('dashboard-opened', callback),
});
