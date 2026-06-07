import { ReasoningProvider, VisionProvider, ProviderType } from '../types/index.js';
import { GeminiProvider } from './gemini/GeminiProvider.js';
import { OpenAIProvider } from './openai/OpenAIProvider.js';
import { ClaudeProvider } from './claude/ClaudeProvider.js';
import { OllamaProvider } from './ollama/OllamaProvider.js';

export class ProviderManager {
  private static instance: ProviderManager;
  
  private reasoningProviders: Map<ProviderType, ReasoningProvider> = new Map();
  private visionProviders: Map<ProviderType, VisionProvider> = new Map();

  private constructor() {
    this.registerProviders();
  }

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  private registerProviders() {
    // Cloud Providers
    const gemini = new GeminiProvider();
    const openai = new OpenAIProvider();
    const claude = new ClaudeProvider();
    
    // Local Providers
    const ollama = new OllamaProvider();

    // Reasoning
    this.reasoningProviders.set('gemini', gemini);
    this.reasoningProviders.set('openai', openai);
    this.reasoningProviders.set('claude', claude);
    this.reasoningProviders.set('ollama', ollama);

    // Vision
    this.visionProviders.set('gemini', gemini);
    this.visionProviders.set('openai', openai);
    this.visionProviders.set('claude', claude);
    this.visionProviders.set('ollama', ollama);
  }

  public getReasoningProvider(type: ProviderType): ReasoningProvider {
    const provider = this.reasoningProviders.get(type);
    if (!provider) {
      throw new Error(`Reasoning provider ${type} not found`);
    }
    return provider;
  }

  public getVisionProvider(type: ProviderType): VisionProvider {
    const provider = this.visionProviders.get(type);
    if (!provider) {
      throw new Error(`Vision provider ${type} not found`);
    }
    return provider;
  }
}
