import { ProviderManager } from '../providers/ProviderManager.js';
import { AutomationEngine } from '../automation/AutomationEngine.js';
import { VisionResult } from '../types/index.js';

export class VisionExecutionLoop {
  private providerManager: ProviderManager;
  private automationEngine: AutomationEngine;

  constructor() {
    this.providerManager = ProviderManager.getInstance();
    this.automationEngine = AutomationEngine.getInstance();
  }

  public async observeState(providerId: string, instruction: string): Promise<VisionResult> {
    const screenshot = await this.automationEngine.capture();
    if (!screenshot) throw new Error("Failed to capture screenshot");

    const visionProvider = this.providerManager.getVisionProvider(providerId as any);
    return await visionProvider.observe(screenshot, instruction);
  }

  public async verifyState(providerId: string, expectedState: string): Promise<boolean> {
    const screenshot = await this.automationEngine.capture();
    if (!screenshot) throw new Error("Failed to capture screenshot");

    const visionProvider = this.providerManager.getVisionProvider(providerId as any);
    const result = await visionProvider.verify(screenshot, expectedState);
    return result.isMatch;
  }
}
