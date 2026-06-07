export class OllamaProvider {
    id = 'ollama';
    name = 'Ollama Local AI';
    baseUrl = 'http://localhost:11434';
    async isConfigured() {
        try {
            const response = await fetch(`${this.baseUrl}/api/version`);
            return response.ok;
        }
        catch {
            return false;
        }
    }
    async getModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            const data = await response.json();
            return data.models.map((m) => ({
                id: m.name,
                name: m.name,
                provider: this.id,
                capabilities: ['reasoning'] // Could check name for 'vision' like 'llava'
            }));
        }
        catch {
            return [];
        }
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
