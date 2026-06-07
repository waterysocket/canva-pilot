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
})
