"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose safe APIs to the renderer process
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    resizeWindow: (expanded) => electron_1.ipcRenderer.send('resize-window', expanded),
    openDashboard: () => electron_1.ipcRenderer.send('open-dashboard'),
    closeDashboard: () => electron_1.ipcRenderer.send('close-dashboard'),
    minimizeApp: () => electron_1.ipcRenderer.send('minimize-app'),
    closeApp: () => electron_1.ipcRenderer.send('close-app'),
    expandForDropdown: () => electron_1.ipcRenderer.send('expand-for-dropdown'),
    collapseDropdown: () => electron_1.ipcRenderer.send('collapse-dropdown'),
    onDashboardOpened: (callback) => electron_1.ipcRenderer.on('dashboard-opened', callback),
    getSystemInfo: () => electron_1.ipcRenderer.invoke('get-system-info'),
});
