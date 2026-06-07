import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let commandBarWindow = null;
let dashboardWindow = null;
function createCommandBar() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    commandBarWindow = new BrowserWindow({
        width: 700,
        height: 80, // Initial small size
        x: Math.round(width / 2 - 350),
        y: Math.round(height / 4), // Top center
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0f0f13',
            symbolColor: '#74b1be',
            height: 40
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const startUrl = isDev
        ? 'http://localhost:5173#/dashboard'
        : `file://${path.join(__dirname, '../dist/index.html')}#/dashboard`;
    dashboardWindow.loadURL(startUrl);
    dashboardWindow.on('closed', () => {
        dashboardWindow = null;
    });
}
app.whenReady().then(() => {
    createCommandBar();
    ipcMain.on('resize-window', (event, expanded) => {
        if (commandBarWindow) {
            if (expanded) {
                commandBarWindow.setSize(700, 500, true);
            }
            else {
                commandBarWindow.setSize(700, 80, true);
            }
        }
    });
    ipcMain.on('open-dashboard', () => {
        createDashboard();
        if (commandBarWindow) {
            commandBarWindow.webContents.send('dashboard-opened');
        }
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createCommandBar();
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
