import { KeyManager } from '../../security/KeyManager.js';
export class ClaudeProvider {
    id = 'claude';
    name = 'Anthropic Claude';
    async isConfigured() {
        const key = await KeyManager.getApiKey(this.id);
        return !!key;
    }
    async getModels() {
        return [
            { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] },
            { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: this.id, capabilities: ['reasoning', 'vision', 'multimodal'] }
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
