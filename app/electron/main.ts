import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let commandBarWindow: BrowserWindow | null = null;
let dashboardWindow: BrowserWindow | null = null;

function createCommandBar() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  commandBarWindow = new BrowserWindow({
    width: 700,
    height: 95, // Initial small size
    x: Math.round(width / 2 - 350),
    y: Math.round(height / 4), // Top center
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  commandBarWindow.loadURL(startUrl);

  // commandBarWindow.webContents.openDevTools({ mode: 'detach' });
}

function createDashboard() {
  if (dashboardWindow) {
    dashboardWindow.focus();
    return;
  }

  dashboardWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    backgroundColor: '#09090b', // Force opaque dark background
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#111118',
      symbolColor: '#7c3aed',
      height: 40
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev 
    ? 'http://localhost:5173#/dashboard' 
    : `file://${path.join(__dirname, '../dist/index.html')}#/dashboard`;

  dashboardWindow.loadURL(startUrl);

  dashboardWindow.once('ready-to-show', () => {
    dashboardWindow?.maximize();
    dashboardWindow?.show();
  });
  
  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
    if (commandBarWindow) {
      commandBarWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createCommandBar();

  ipcMain.on('resize-window', (event, expanded: boolean) => {
    if (commandBarWindow) {
      if (expanded) {
        commandBarWindow.setSize(700, 500, true);
      } else {
        commandBarWindow.setSize(700, 95, true);
      }
    }
  });

  // Temporarily expand the window so dropdowns aren't clipped
  ipcMain.on('expand-for-dropdown', () => {
    if (commandBarWindow) {
      const [, currentH] = commandBarWindow.getSize();
      if (currentH <= 95) {
        // Store base size and expand down
        const { y } = commandBarWindow.getBounds();
        commandBarWindow.setBounds({ y, height: 290 }, true);
      }
    }
  });

  ipcMain.on('collapse-dropdown', () => {
    if (commandBarWindow) {
      const [, currentH] = commandBarWindow.getSize();
      if (currentH <= 290) {
        commandBarWindow.setSize(700, 95, true);
      }
    }
  });

  ipcMain.on('open-dashboard', () => {
    createDashboard();
    if (commandBarWindow) {
      commandBarWindow.hide();
      commandBarWindow.webContents.send('dashboard-opened');
    }
  });

  ipcMain.on('close-dashboard', () => {
    if (dashboardWindow) {
      dashboardWindow.close();
      // the 'closed' event handler will show the command bar
    } else if (commandBarWindow) {
      commandBarWindow.show();
      commandBarWindow.focus();
    }
  });

  ipcMain.on('minimize-app', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
  });

  ipcMain.on('close-app', () => {
    app.quit();
  });

  // System hardware info handler
  ipcMain.handle('get-system-info', async () => {
    const require = createRequire(import.meta.url);
    const si = require('systeminformation');

    // RAM
    const totalRamBytes = os.totalmem();
    const freeRamBytes = os.freemem();
    const totalRamGB = totalRamBytes / (1024 ** 3);
    const usedRamGB = (totalRamBytes - freeRamBytes) / (1024 ** 3);

    // CPU
    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model ?? 'Unknown CPU';
    const cpuCores = cpus.length;
    let cpuLoad = 0;
    try {
      const load = await si.currentLoad();
      cpuLoad = Math.round(load.currentLoad);
    } catch {}

    // VRAM (GPU)
    let vramUsedGB = 0;
    let vramTotalGB = 0;
    let gpuName = 'Unknown GPU';
    try {
      const gpuData = await si.graphics();
      const gpu = gpuData.controllers?.[0];
      if (gpu) {
        gpuName = gpu.model ?? gpuName;
        vramTotalGB = (gpu.vram ?? 0) / 1024; // si returns MB
        vramUsedGB = (gpu.memoryUsed ?? 0) / 1024;
        // fallback: if memoryUsed not available
        if (!vramUsedGB && gpu.vram) {
          vramUsedGB = 0;
        }
      }
    } catch {}

    // Disk
    let diskUsedGB = 0;
    let diskTotalGB = 0;
    let diskFreeGB = 0;
    try {
      const fsData = await si.fsSize();
      // Primary drive (largest)
      const primary = fsData
        .filter((f: any) => f.size > 0)
        .sort((a: any, b: any) => b.size - a.size)[0];
      if (primary) {
        diskTotalGB = primary.size / (1024 ** 3);
        diskUsedGB = primary.used / (1024 ** 3);
        diskFreeGB = diskTotalGB - diskUsedGB;
      }
    } catch {}

    return {
      ram: {
        used: parseFloat(usedRamGB.toFixed(1)),
        total: parseFloat(totalRamGB.toFixed(1)),
        percent: Math.round((usedRamGB / totalRamGB) * 100),
      },
      vram: {
        used: parseFloat(vramUsedGB.toFixed(1)),
        total: parseFloat(vramTotalGB.toFixed(1)),
        percent: vramTotalGB > 0 ? Math.round((vramUsedGB / vramTotalGB) * 100) : 0,
        gpuName,
      },
      cpu: {
        model: cpuModel,
        cores: cpuCores,
        load: cpuLoad,
      },
      disk: {
        used: parseFloat(diskUsedGB.toFixed(1)),
        total: parseFloat(diskTotalGB.toFixed(1)),
        free: parseFloat(diskFreeGB.toFixed(1)),
        percent: diskTotalGB > 0 ? Math.round((diskUsedGB / diskTotalGB) * 100) : 0,
      },
    };
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createCommandBar();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
