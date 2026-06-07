import { ProviderManager } from '../../providers/ProviderManager.js';
import { AutomationEngine } from '../../automation/AutomationEngine.js';
import { Planner } from '../planner/Planner.js';
export class RecoveryEngine {
    providerManager;
    automationEngine;
    planner;
    constructor() {
        this.providerManager = ProviderManager.getInstance();
        this.automationEngine = AutomationEngine.getInstance();
        this.planner = new Planner();
    }
    async diagnoseAndRecover(failedPlan, errorMsg, providerId) {
        const screenshot = await this.automationEngine.capture();
        if (!screenshot)
            return null;
        const visionProvider = this.providerManager.getVisionProvider(providerId);
        const diagnosis = await visionProvider.diagnose(screenshot, errorMsg);
        return await this.planner.repairPlan(failedPlan, diagnosis.diagnosis, providerId);
    }
}
