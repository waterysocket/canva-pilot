import { GeminiProvider } from './gemini/GeminiProvider.js';
import { OpenAIProvider } from './openai/OpenAIProvider.js';
import { ClaudeProvider } from './claude/ClaudeProvider.js';
import { OllamaProvider } from './ollama/OllamaProvider.js';
import { GroqProvider } from './groq/GroqProvider.js';
export class ProviderManager {
    static instance;
    reasoningProviders = new Map();
    visionProviders = new Map();
    constructor() {
        this.registerProviders();
    }
    static getInstance() {
        if (!ProviderManager.instance) {
            ProviderManager.instance = new ProviderManager();
        }
        return ProviderManager.instance;
    }
    registerProviders() {
        // Cloud Providers
        const gemini = new GeminiProvider();
        const openai = new OpenAIProvider();
        const claude = new ClaudeProvider();
        // Local Providers
        const ollama = new OllamaProvider();
        // Cloud Providers (Reasoning only)
        const groq = new GroqProvider();
        // Reasoning
        this.reasoningProviders.set('gemini', gemini);
        this.reasoningProviders.set('openai', openai);
        this.reasoningProviders.set('claude', claude);
        this.reasoningProviders.set('ollama', ollama);
        this.reasoningProviders.set('groq', groq);
        // Vision
        this.visionProviders.set('gemini', gemini);
        this.visionProviders.set('openai', openai);
        this.visionProviders.set('claude', claude);
        this.visionProviders.set('ollama', ollama);
    }
    getReasoningProvider(type) {
        const provider = this.reasoningProviders.get(type);
        if (!provider) {
            throw new Error(`Reasoning provider ${type} not found`);
        }
        return provider;
    }
    getVisionProvider(type) {
        const provider = this.visionProviders.get(type);
        if (!provider) {
            throw new Error(`Vision provider ${type} not found`);
        }
        return provider;
    }
}
