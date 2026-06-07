import { ContextPack, ActionDefinition, Workflow, UIMap } from '../types/index.js';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

export class ContextEngine {
  private static instance: ContextEngine;
  private activeContextPack: ContextPack | null = null;
  private actions: Map<string, ActionDefinition> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private uiMaps: Map<string, UIMap> = new Map();

  private constructor() {}

  public static getInstance(): ContextEngine {
    if (!ContextEngine.instance) {
      ContextEngine.instance = new ContextEngine();
    }
    return ContextEngine.instance;
  }

  public async loadContext(packName: string): Promise<void> {
    // Simulated loading of a context pack from disk
    const packsPath = path.join(app.getAppPath(), 'contexts', packName.toLowerCase());
    
    // In a full implementation, you would read these JSON files:
    // actions.json, workflows.json, ui_maps.json
    console.log(`Loading context pack: ${packName} from ${packsPath}`);
    
    this.activeContextPack = {
      id: packName.toLowerCase(),
      name: packName,
      version: '1.0.0',
      description: `${packName} Automation Context`
    };

    // Load mock actions
    this.actions.set('click', { id: 'click', name: 'Click', description: 'Click an element', playwrightMethod: 'click', requiresTarget: true, requiresValue: false });
    this.actions.set('type', { id: 'type', name: 'Type', description: 'Type text into an element', playwrightMethod: 'fill', requiresTarget: true, requiresValue: true });
  }

  public getAction(id: string): ActionDefinition | undefined {
    return this.actions.get(id);
  }

  public getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  public getUIMap(elementName: string): UIMap | undefined {
    for (const [_, map] of this.uiMaps) {
      if (map.elementName === elementName) {
        return map;
      }
    }
    return undefined;
  }

  public getActiveContext(): ContextPack | null {
    return this.activeContextPack;
  }
}
