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
    // Dropdown IPC
    showDropdown: (params) => electron_1.ipcRenderer.send('show-dropdown', params),
    hideDropdown: () => electron_1.ipcRenderer.send('hide-dropdown'),
    dropdownSelect: (params) => electron_1.ipcRenderer.send('dropdown-select', params),
    onDropdownData: (callback) => electron_1.ipcRenderer.on('on-dropdown-data', callback),
    onDropdownSelected: (callback) => electron_1.ipcRenderer.on('on-dropdown-selected', callback),
    onDropdownClosed: (callback) => electron_1.ipcRenderer.on('on-dropdown-closed', callback),
    onDashboardOpened: (callback) => electron_1.ipcRenderer.on('dashboard-opened', callback),
    getSystemInfo: () => electron_1.ipcRenderer.invoke('get-system-info'),
    // Backend Integration
    startTask: (goal, provider) => electron_1.ipcRenderer.invoke('start-task', goal, provider),
    saveApiKey: (provider, key) => electron_1.ipcRenderer.invoke('save-api-key', provider, key),
    getApiKey: (provider) => electron_1.ipcRenderer.invoke('get-api-key', provider),
    getModels: (provider) => electron_1.ipcRenderer.invoke('get-models', provider),
    onTaskEvent: (callback) => electron_1.ipcRenderer.on('task-event', callback),
    // Generic invoke — bridges all ipcMain.handle channels to the renderer
    invoke: (channel, ...args) => electron_1.ipcRenderer.invoke(channel, ...args),
});
