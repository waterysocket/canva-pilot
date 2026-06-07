import { KeyManager } from '../../security/KeyManager.js';
export class OpenAIProvider {
    id = 'openai';
    name = 'OpenAI';
    async isConfigured() {
        const key = await KeyManager.getApiKey(this.id);
        return !!key;
    }
    async getModels() {
        return [
            { id: 'gpt-4o', name: 'GPT-4o', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] }
        ];
    }
    // ReasoningProvider Implementation
    async plan(prompt, context) {
        throw new Error('Not implemented');
    }
    async reason(prompt, context) {
        throw new Error('Not implemented');
    }
    async replan(currentPlan, failureReason, state) {
        throw new Error('Not implemented');
    }
    // VisionProvider Implementation
    async observe(screenshotBase64, instruction) {
        throw new Error('Not implemented');
    }
    async locate(screenshotBase64, elementDescription) {
        throw new Error('Not implemented');
    }
    async verify(screenshotBase64, expectedState) {
        throw new Error('Not implemented');
    }
    async diagnose(screenshotBase64, failureContext) {
        throw new Error('Not implemented');
    }
}
