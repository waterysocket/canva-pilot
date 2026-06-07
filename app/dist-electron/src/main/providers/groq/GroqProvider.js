import { KeyManager } from '../../security/KeyManager.js';
export class GroqProvider {
    id = 'groq';
    name = 'Groq';
    async isConfigured() {
        const key = await KeyManager.getApiKey(this.id);
        return !!key;
    }
    async getModels() {
        return [
            { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: this.id, capabilities: ['reasoning'] },
            { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: this.id, capabilities: ['reasoning'] },
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: this.id, capabilities: ['reasoning'] },
            { id: 'gemma-7b-it', name: 'Gemma 7B', provider: this.id, capabilities: ['reasoning'] }
        ];
    }
    async plan(prompt, context) {
        throw new Error('Not implemented');
    }
    async reason(prompt, context) {
        throw new Error('Not implemented');
    }
    async replan(currentPlan, failureReason, state) {
        throw new Error('Not implemented');
    }
}
