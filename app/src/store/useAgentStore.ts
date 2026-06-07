import { create } from 'zustand';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export type ThoughtStage = 'idle' | 'observe' | 'plan' | 'execute' | 'verify' | 'complete';

export interface TaskEvent {
  type: 'started' | 'updated' | 'completed' | 'failed';
  task?: any;
  currentStep?: any;
  error?: string;
}

interface AgentState {
  // Chat
  messages: AgentMessage[];
  isProcessing: boolean;
  currentStage: ThoughtStage;
  progress: number;

  // Task tracking
  activeTaskId: string | null;
  activeTaskGoal: string | null;
  taskHistory: TaskEvent[];

  // Provider
  selectedProvider: string;

  // Actions
  addMessage: (message: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
  setProcessing: (isProcessing: boolean) => void;
  setStage: (stage: ThoughtStage) => void;
  setProgress: (progress: number) => void;
  setActiveTask: (id: string | null, goal?: string | null) => void;
  addTaskEvent: (event: TaskEvent) => void;
  setSelectedProvider: (provider: string) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  messages: [],
  isProcessing: false,
  currentStage: 'idle',
  progress: 0,
  activeTaskId: null,
  activeTaskGoal: null,
  taskHistory: [],
  selectedProvider: 'gemini',

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7), timestamp: new Date() }]
  })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setStage: (currentStage) => set({ currentStage }),
  setProgress: (progress) => set({ progress }),
  setActiveTask: (id, goal = null) => set({ activeTaskId: id, activeTaskGoal: goal }),
  addTaskEvent: (event) => set((state) => ({
    taskHistory: [...state.taskHistory, event]
  })),
  setSelectedProvider: (selectedProvider) => set({ selectedProvider }),
  reset: () => set({ messages: [], isProcessing: false, currentStage: 'idle', progress: 0, activeTaskId: null, activeTaskGoal: null }),
}));
