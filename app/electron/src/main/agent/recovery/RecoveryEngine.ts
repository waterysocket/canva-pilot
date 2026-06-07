import { ProviderManager } from '../../providers/ProviderManager.js';
import { AutomationEngine } from '../../automation/AutomationEngine.js';
import { Planner } from '../planner/Planner.js';
import { Plan } from '../../types/index.js';

export class RecoveryEngine {
  private providerManager: ProviderManager;
  private automationEngine: AutomationEngine;
  private planner: Planner;

  constructor() {
    this.providerManager = ProviderManager.getInstance();
    this.automationEngine = AutomationEngine.getInstance();
    this.planner = new Planner();
  }

  public async diagnoseAndRecover(failedPlan: Plan, errorMsg: string, providerId: string): Promise<Plan | null> {
    const screenshot = await this.automationEngine.capture();
    if (!screenshot) return null;

    const visionProvider = this.providerManager.getVisionProvider(providerId as any);
    const diagnosis = await visionProvider.diagnose(screenshot, errorMsg);

    return await this.planner.repairPlan(failedPlan, diagnosis.diagnosis, providerId);
  }
}
