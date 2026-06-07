export type ProviderType = 'gemini' | 'openai' | 'claude' | 'openrouter' | 'ollama' | 'groq';
export type ModelCapability = 'reasoning' | 'vision' | 'multimodal';

export interface Model {
  id: string;
  name: string;
  provider: ProviderType;
  capabilities: ModelCapability[];
  contextWindow?: number;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string; // For Ollama
}

export interface Provider {
  id: ProviderType;
  name: string;
  isConfigured(): Promise<boolean>;
  getModels(): Promise<Model[]>;
}

export interface ReasoningProvider extends Provider {
  plan(prompt: string, context?: any): Promise<Plan>;
  reason(prompt: string, context?: any): Promise<string>;
  replan(currentPlan: Plan, failureReason: string, state: any): Promise<Plan>;
}

export interface VisionResult {
  diagnosis: string;
  elementsFound: any[];
  isMatch: boolean;
  rawResponse?: any;
}

export interface VisionProvider extends Provider {
  observe(screenshotBase64: string, instruction: string): Promise<VisionResult>;
  locate(screenshotBase64: string, elementDescription: string): Promise<VisionResult>;
  verify(screenshotBase64: string, expectedState: string): Promise<VisionResult>;
  diagnose(screenshotBase64: string, failureContext: string): Promise<VisionResult>;
}

export interface Task {
  id: string;
  goal: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  contextPackId?: string;
}

export interface PlanStep {
  id: string;
  action: string;
  target?: string;
  value?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  retryCount: number;
}

export interface Plan {
  id: string;
  taskId: string;
  steps: PlanStep[];
  createdAt: Date;
}

export interface TaskStep {
  id: string;
  taskId: string;
  planStepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  errorMessage?: string;
  screenshotBefore?: string;
  screenshotAfter?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Execution {
  id: string;
  taskId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  endedAt?: Date;
  log?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'action' | 'condition' | 'loop';
  actionId?: string;
  nextNodeId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  contextPackId: string;
}

export interface ActionDefinition {
  id: string;
  name: string;
  description: string;
  playwrightMethod: string;
  requiresTarget: boolean;
  requiresValue: boolean;
}

export interface UIMap {
  id: string;
  contextPackId: string;
  elementName: string;
  selector: string;
  description: string;
}

export interface ContextPack {
  id: string;
  name: string; // e.g., "Canva", "Figma"
  version: string;
  description: string;
}

export interface KnowledgeDocument {
  id: string;
  contextPackId: string;
  title: string;
  sourceUrl?: string;
  content: string;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
}

export interface AgentState {
  currentTask?: Task;
  currentPlan?: Plan;
  status: 'idle' | 'planning' | 'executing' | 'recovering' | 'paused';
}

export interface ExecutionState {
  browserConnected: boolean;
  currentPageUrl?: string;
  activeContextPack?: ContextPack;
}
