import { create } from 'zustand';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export type ThoughtStage = 'idle' | 'observe' | 'plan' | 'execute' | 'verify' | 'complete';

interface AgentState {
  messages: AgentMessage[];
  isProcessing: boolean;
  currentStage: ThoughtStage;
  progress: number; // 0-100
  addMessage: (message: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
  setProcessing: (isProcessing: boolean) => void;
  setStage: (stage: ThoughtStage) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  messages: [],
  isProcessing: false,
  currentStage: 'idle',
  progress: 0,
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7), timestamp: new Date() }]
  })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setStage: (currentStage) => set({ currentStage }),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ messages: [], isProcessing: false, currentStage: 'idle', progress: 0 }),
}));
