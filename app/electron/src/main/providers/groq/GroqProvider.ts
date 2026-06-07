import { ReasoningProvider, Model, Plan } from '../../types/index.js';
import { KeyManager } from '../../security/KeyManager.js';

export class GroqProvider implements ReasoningProvider {
  id = 'groq' as const;
  name = 'Groq';

  async isConfigured(): Promise<boolean> {
    const key = await KeyManager.getApiKey(this.id);
    return !!key;
  }

  async getModels(): Promise<Model[]> {
    return [
      { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: this.id, capabilities: ['reasoning'] },
      { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: this.id, capabilities: ['reasoning'] },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: this.id, capabilities: ['reasoning'] },
      { id: 'gemma-7b-it', name: 'Gemma 7B', provider: this.id, capabilities: ['reasoning'] }
    ];
  }

  async plan(prompt: string, context?: any): Promise<Plan> {
    throw new Error('Not implemented');
  }

  async reason(prompt: string, context?: any): Promise<string> {
    throw new Error('Not implemented');
  }

  async replan(currentPlan: Plan, failureReason: string, state: any): Promise<Plan> {
    throw new Error('Not implemented');
  }
}
