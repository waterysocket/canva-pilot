import { contextBridge, ipcRenderer } from 'electron'

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  resizeWindow: (expanded: boolean) => ipcRenderer.send('resize-window', expanded),
  openDashboard: () => ipcRenderer.send('open-dashboard'),
  closeDashboard: () => ipcRenderer.send('close-dashboard'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  closeApp: () => ipcRenderer.send('close-app'),
  
  // Dropdown IPC
  showDropdown: (params: { type: string, x: number, y: number, width: number }) => ipcRenderer.send('show-dropdown', params),
  hideDropdown: () => ipcRenderer.send('hide-dropdown'),
  dropdownSelect: (params: { type: string, value: string }) => ipcRenderer.send('dropdown-select', params),
  onDropdownData: (callback: (event: any, data: { type: string }) => void) => ipcRenderer.on('on-dropdown-data', callback),
  onDropdownSelected: (callback: (event: any, data: { type: string, value: string }) => void) => ipcRenderer.on('on-dropdown-selected', callback),
  onDropdownClosed: (callback: () => void) => ipcRenderer.on('on-dropdown-closed', callback),

  onDashboardOpened: (callback: () => void) => ipcRenderer.on('dashboard-opened', callback),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // Backend Integration
  startTask: (goal: string, provider: string) => ipcRenderer.invoke('start-task', goal, provider),
  saveApiKey: (provider: string, key: string) => ipcRenderer.invoke('save-api-key', provider, key),
  getApiKey: (provider: string) => ipcRenderer.invoke('get-api-key', provider),
  getModels: (provider: string) => ipcRenderer.invoke('get-models', provider),
  onTaskEvent: (callback: (event: any, data: any) => void) => ipcRenderer.on('task-event', callback),

  // Generic invoke — bridges all ipcMain.handle channels to the renderer
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
})
