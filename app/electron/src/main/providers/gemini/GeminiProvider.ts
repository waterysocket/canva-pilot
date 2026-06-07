import { ReasoningProvider, VisionProvider, Model, Plan, VisionResult } from '../../types/index.js';
import { KeyManager } from '../../security/KeyManager.js';

export class GeminiProvider implements ReasoningProvider, VisionProvider {
  id = 'gemini' as const;
  name = 'Google Gemini';

  async isConfigured(): Promise<boolean> {
    const key = await KeyManager.getApiKey(this.id);
    return !!key;
  }

  async getModels(): Promise<Model[]> {
    return [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] }
    ];
  }

  // ReasoningProvider Implementation
  async plan(prompt: string, context?: any): Promise<Plan> {
    throw new Error('Not implemented');
  }

  async reason(prompt: string, context?: any): Promise<string> {
    throw new Error('Not implemented');
  }

  async replan(currentPlan: Plan, failureReason: string, state: any): Promise<Plan> {
    throw new Error('Not implemented');
  }

  // VisionProvider Implementation
  async observe(screenshotBase64: string, instruction: string): Promise<VisionResult> {
    throw new Error('Not implemented');
  }

  async locate(screenshotBase64: string, elementDescription: string): Promise<VisionResult> {
    throw new Error('Not implemented');
  }

  async verify(screenshotBase64: string, expectedState: string): Promise<VisionResult> {
    throw new Error('Not implemented');
  }

  async diagnose(screenshotBase64: string, failureContext: string): Promise<VisionResult> {
    throw new Error('Not implemented');
  }
}
