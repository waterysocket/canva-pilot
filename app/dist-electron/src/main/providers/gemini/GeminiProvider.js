import { KeyManager } from '../../security/KeyManager.js';
export class GeminiProvider {
    id = 'gemini';
    name = 'Google Gemini';
    async isConfigured() {
        const key = await KeyManager.getApiKey(this.id);
        return !!key;
    }
    async getModels() {
        return [
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] }
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
