import { create } from 'zustand';

interface AppState {
  theme: 'dark' | 'light';
  currentProject: string;
  currentModel: string;
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrentProject: (project: string) => void;
  setCurrentModel: (model: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  currentProject: 'CanvaPilot Demo',
  currentModel: 'Gemini 3.1 Pro',
  setTheme: (theme) => set({ theme }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentModel: (model) => set({ currentModel: model }),
}));
