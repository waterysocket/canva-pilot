import { ReasoningProvider, VisionProvider, Model, Plan, VisionResult } from '../../types/index.js';

export class OllamaProvider implements ReasoningProvider, VisionProvider {
  id = 'ollama' as const;
  name = 'Ollama Local AI';
  private baseUrl = 'http://localhost:11434';

  async isConfigured(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<Model[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return data.models.map((m: any) => ({
        id: m.name,
        name: m.name,
        provider: this.id,
        capabilities: ['reasoning'] // Could check name for 'vision' like 'llava'
      }));
    } catch {
      return [];
    }
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
