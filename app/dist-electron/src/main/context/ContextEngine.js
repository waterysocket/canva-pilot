import path from 'path';
import { app } from 'electron';
export class ContextEngine {
    static instance;
    activeContextPack = null;
    actions = new Map();
    workflows = new Map();
    uiMaps = new Map();
    constructor() { }
    static getInstance() {
        if (!ContextEngine.instance) {
            ContextEngine.instance = new ContextEngine();
        }
        return ContextEngine.instance;
    }
    async loadContext(packName) {
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
    getAction(id) {
        return this.actions.get(id);
    }
    getWorkflow(id) {
        return this.workflows.get(id);
    }
    getUIMap(elementName) {
        for (const [_, map] of this.uiMaps) {
            if (map.elementName === elementName) {
                return map;
            }
        }
        return undefined;
    }
    getActiveContext() {
        return this.activeContextPack;
    }
}
