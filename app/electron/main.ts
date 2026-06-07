import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { AgentOrchestrator } from './src/main/agent/AgentOrchestrator.js'
import { KeyManager } from './src/main/security/KeyManager.js'
import { ProviderManager } from './src/main/providers/ProviderManager.js'
import { ProviderType } from './src/main/types/index.js'
import { ExecutionMonitor } from './src/main/events/ExecutionMonitor.js'
import { KnowledgeEngine } from './src/main/knowledge/KnowledgeEngine.js'
import { DatabaseManager } from './src/main/database/DatabaseManager.js'
import { TaskRepository } from './src/main/database/repositories/TaskRepository.js'
import { chromium } from 'playwright-core'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let agentOrchestrator: AgentOrchestrator;

let commandBarWindow: BrowserWindow | null = null;
let dashboardWindow: BrowserWindow | null = null;
let dropdownWindow: BrowserWindow | null = null;

function createDropdownWindow() {
  dropdownWindow = new BrowserWindow({
    width: 250,
    height: 300,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev 
    ? 'http://localhost:5173#/dropdown' 
    : `file://${path.join(__dirname, '../dist/index.html')}#/dropdown`;

  dropdownWindow.loadURL(startUrl);

  dropdownWindow.on('hide', () => {
    if (commandBarWindow) {
      commandBarWindow.webContents.send('on-dropdown-closed');
    }
  });

  dropdownWindow.on('blur', () => {
    dropdownWindow?.hide();
  });
}

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
  agentOrchestrator = new AgentOrchestrator();

  createCommandBar();
  createDropdownWindow();

  ipcMain.on('resize-window', (event, expanded: boolean) => {
    if (commandBarWindow) {
      if (expanded) {
        commandBarWindow.setSize(700, 500, true);
      } else {
        commandBarWindow.setSize(700, 95, true);
      }
    }
  });

  // Secondary window dropdown logic
  ipcMain.on('show-dropdown', (event, { type, x, y, width }) => {
    if (dropdownWindow && commandBarWindow) {
      const cbBounds = commandBarWindow.getBounds();
      // x and y are relative to the command bar window's top-left corner
      dropdownWindow.setBounds({
        x: cbBounds.x + x,
        y: cbBounds.y + y,
        width: width,
        height: 300 // Max height for dropdown
      });
      dropdownWindow.showInactive(); // Show without taking focus from command bar
      dropdownWindow.webContents.send('on-dropdown-data', { type });
    }
  });

  ipcMain.on('hide-dropdown', () => {
    if (dropdownWindow) {
      dropdownWindow.hide();
    }
  });

  ipcMain.on('dropdown-select', (event, { type, value }) => {
    if (commandBarWindow) {
      commandBarWindow.webContents.send('on-dropdown-selected', { type, value });
    }
    if (dropdownWindow) dropdownWindow.hide();
  });

  ipcMain.on('open-dashboard', () => {
    createDashboard();
    if (commandBarWindow) {
      commandBarWindow.hide();
      commandBarWindow.webContents.send('dashboard-opened');
    }
    if (dropdownWindow) {
      dropdownWindow.hide();
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
    if (dropdownWindow) {
      dropdownWindow.hide();
    }
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

  // Backend Integration Handlers
  ipcMain.handle('start-task', async (event, goal: string, provider: string) => {
    return await agentOrchestrator.startTask(goal, provider as ProviderType);
  });

  ipcMain.handle('save-api-key', async (event, provider: string, key: string) => {
    await KeyManager.setApiKey(provider, key);
    return true;
  });

  ipcMain.handle('get-api-key', async (event, provider: string) => {
    return await KeyManager.getApiKey(provider);
  });

  ipcMain.handle('get-models', async (event, provider: string) => {
    const providerManager = ProviderManager.getInstance();
    const p = providerManager.getReasoningProvider(provider as ProviderType);
    return await p.getModels();
  });

  ipcMain.handle('get-configured-models', async () => {
    const providerManager = ProviderManager.getInstance();
    const types: ProviderType[] = ['gemini', 'openai', 'claude', 'openrouter', 'ollama', 'groq'];
    const configured = [];
    for (const t of types) {
      try {
        const p = providerManager.getReasoningProvider(t);
        if (await p.isConfigured()) {
          const models = await p.getModels();
          configured.push(...models);
        }
      } catch (e) {}
    }
    return configured;
  });

  ipcMain.handle('get-hardware-recommendations', async (event, sysInfo) => {
    // Basic logic mapping sysInfo to models
    const vramGB = sysInfo.vram.total;
    const isLowEnd = sysInfo.ram.total < 16 && vramGB < 4;
    
    // Default standard set
    let recommendations = [
      { id: 'groq-llama3', name: 'Groq Llama 3 (Fastest)', type: 'reasoning', reason: 'Ultra-fast inference, perfect for planning.' },
      { id: 'gpt-4o', name: 'GPT-4o (Vision)', type: 'vision', reason: 'Industry standard for visual UI analysis.' }
    ];

    if (vramGB >= 8) {
      recommendations.push({ id: 'ollama-qwen2-vl', name: 'Local Qwen2-VL (Vision)', type: 'vision', reason: 'Detected 8GB+ VRAM. Excellent for local UI analysis.' });
      recommendations.push({ id: 'ollama-llama3', name: 'Local Llama 3 (Reasoning)', type: 'reasoning', reason: 'Enough RAM/VRAM to run locally securely.' });
    } else if (isLowEnd) {
      recommendations.push({ id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Multimodal)', type: 'vision', reason: 'Cloud offloading recommended due to low system specs.' });
    }

    return recommendations;
  });

  ipcMain.handle('scrape-knowledge-source', async (event, url: string, collection: string) => {
    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Basic text extraction
      const content = await page.evaluate(() => document.body.innerText);
      await browser.close();

      const ke = KnowledgeEngine.getInstance();
      const docId = uuidv4();
      
      await ke.ingestDocument(collection, {
        id: docId,
        contextPackId: 'canva-web',
        title: await page.title() || url,
        sourceUrl: url,
        content: content.slice(0, 10000) // Truncate for simplicity
      });

      return { success: true, docId };
    } catch (e: any) {
      throw new Error(`Scraping failed: ${e.message}`);
    }
  });

  ipcMain.handle('get-db-stats', async () => {
    const dbPath = path.join(app.getPath('userData'), 'canvapilot.db');
    const chromaPath = path.join(app.getPath('userData'), 'chroma');
    
    const dbManager = DatabaseManager.getInstance();
    const taskRepo = new TaskRepository();
    
    // We would ideally count all tasks, for now we simulate returning total rows
    const tasks = taskRepo.getAllTasks();
    
    const ke = KnowledgeEngine.getInstance();
    const chromaStats = await ke.getCollectionStats('docs');

    return {
      sqlite: {
        path: dbPath,
        tasksCount: tasks.length
      },
      chroma: {
        path: chromaPath,
        vectorsCount: chromaStats.count
      }
    };
  });

  ipcMain.handle('get-tasks', async () => {
    const taskRepo = new TaskRepository();
    return taskRepo.getAllTasks();
  });

  ipcMain.handle('delete-document', async (event, collection: string, docId: string) => {
    const ke = KnowledgeEngine.getInstance();
    await ke.deleteDocument(collection, docId);
    return true;
  });

  ipcMain.handle('get-documents', async (event, collection: string) => {
    const ke = KnowledgeEngine.getInstance();
    const docs = await ke.getAllDocuments(collection);
    
    // Map ChromaDB response to our frontend interface
    const mappedDocs = [];
    if (docs.ids && docs.ids.length > 0) {
      for (let i = 0; i < docs.ids.length; i++) {
        mappedDocs.push({
          id: docs.ids[i],
          title: docs.metadatas[i]?.title || 'Untitled',
          source: docs.metadatas[i]?.sourceUrl || 'Unknown source',
          chunkCount: 1,
          dateAdded: new Date().toLocaleDateString(),
          collection: collection
        });
      }
    }
    return mappedDocs;
  });

  // Bind ExecutionMonitor events to Window
  const monitor = ExecutionMonitor.getInstance();
  
  monitor.on('taskStarted', (task: any) => {
    dashboardWindow?.webContents.send('task-event', { type: 'started', task });
    commandBarWindow?.webContents.send('task-event', { type: 'started', task });
  });
  
  monitor.on('taskUpdated', ({ task, currentStep }: any) => {
    dashboardWindow?.webContents.send('task-event', { type: 'updated', task, currentStep });
    commandBarWindow?.webContents.send('task-event', { type: 'updated', task, currentStep });
  });

  monitor.on('taskCompleted', (task: any) => {
    dashboardWindow?.webContents.send('task-event', { type: 'completed', task });
    commandBarWindow?.webContents.send('task-event', { type: 'completed', task });
  });

  monitor.on('taskFailed', ({ task, error }: any) => {
    dashboardWindow?.webContents.send('task-event', { type: 'failed', task, error });
    commandBarWindow?.webContents.send('task-event', { type: 'failed', task, error });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createCommandBar();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
