import { ProviderManager } from '../providers/ProviderManager.js';
import { AutomationEngine } from '../automation/AutomationEngine.js';
export class VisionExecutionLoop {
    providerManager;
    automationEngine;
    constructor() {
        this.providerManager = ProviderManager.getInstance();
        this.automationEngine = AutomationEngine.getInstance();
    }
    async observeState(providerId, instruction) {
        const screenshot = await this.automationEngine.capture();
        if (!screenshot)
            throw new Error("Failed to capture screenshot");
        const visionProvider = this.providerManager.getVisionProvider(providerId);
        return await visionProvider.observe(screenshot, instruction);
    }
    async verifyState(providerId, expectedState) {
        const screenshot = await this.automationEngine.capture();
        if (!screenshot)
            throw new Error("Failed to capture screenshot");
        const visionProvider = this.providerManager.getVisionProvider(providerId);
        const result = await visionProvider.verify(screenshot, expectedState);
        return result.isMatch;
    }
}
