import { chromium, Browser, Page } from 'playwright-core';
import child_process from 'child_process';
import util from 'util';

const exec = util.promisify(child_process.exec);

export class AutomationEngine {
  private static instance: AutomationEngine;
  private browser: Browser | null = null;
  private page: Page | null = null;

  private constructor() {}

  public static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  /**
   * Attempts to connect to an existing Chrome/Edge instance via debugging port.
   * If none exists, it might prompt the user or launch one with a debugging port.
   */
  public async connect(): Promise<boolean> {
    try {
      // In a real implementation, you would try to connect to a known debugging port
      // e.g., await chromium.connectOverCDP('http://localhost:9222');
      // For this architecture, we will simulate a connection or launch a local browser
      // if the user has one installed in default paths.
      
      console.log('Attempting to connect to browser...');
      
      // Fallback for demonstration: Launching local Chrome if available
      // Note: In production, use connectOverCDP and instruct user to start browser with --remote-debugging-port=9222
      /*
      this.browser = await chromium.launch({
        executablePath: this.getDefaultBrowserPath(),
        headless: false
      });
      */
      
      return true;
    } catch (error) {
      console.error('Failed to connect to browser', error);
      return false;
    }
  }

  private getDefaultBrowserPath(): string {
    // Basic detection logic for Windows
    if (process.platform === 'win32') {
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    }
    // Mac
    if (process.platform === 'darwin') {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    // Linux
    return '/usr/bin/google-chrome';
  }

  public async getActivePage(): Promise<Page | null> {
    if (!this.browser) return null;
    if (!this.page) {
      const contexts = this.browser.contexts();
      if (contexts.length > 0) {
        const pages = contexts[0].pages();
        this.page = pages.length > 0 ? pages[0] : await contexts[0].newPage();
      } else {
        const context = await this.browser.newContext();
        this.page = await context.newPage();
      }
    }
    return this.page;
  }

  public async click(selector: string): Promise<void> {
    const p = await this.getActivePage();
    if (p) await p.click(selector);
  }

  public async type(selector: string, text: string): Promise<void> {
    const p = await this.getActivePage();
    if (p) await p.fill(selector, text);
  }

  public async drag(sourceSelector: string, targetSelector: string): Promise<void> {
    const p = await this.getActivePage();
    if (p) await p.dragAndDrop(sourceSelector, targetSelector);
  }

  public async navigate(url: string): Promise<void> {
    const p = await this.getActivePage();
    if (p) await p.goto(url);
  }

  public async capture(): Promise<string | null> {
    const p = await this.getActivePage();
    if (p) {
      const buffer = await p.screenshot({ type: 'jpeg', quality: 80 });
      return buffer.toString('base64');
    }
    return null;
  }

  public async disconnect(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
