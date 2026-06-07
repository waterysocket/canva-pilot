import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Sparkles, Folder, ChevronDown, Monitor, Minus, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAgentStore } from '../../store/useAgentStore';
import AgentChat from './AgentChat';

export default function CommandBarWindow() {
  const { currentProject, currentModel, setCurrentProject, setCurrentModel } = useAppStore();
  const { isProcessing, setProcessing, setStage, setProgress, addMessage } = useAgentStore();
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const api = () => (window as any).electronAPI;

  const toggleDropdown = (open: boolean) => {
    if (open) {
      api()?.expandForDropdown();
    } else {
      // Only collapse if chat isn't expanded
      if (!expanded) api()?.collapseDropdown();
    }
  };

  const models = ['Gemini 3.1 Pro', 'Qwen2.5-VL-7B', 'Claude 3.5 Sonnet', 'GPT-4o'];
  const projects = ['CanvaPilot Demo', 'Figma Automation', 'Notion Sync', 'Jira Triage'];

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      // Let Electron know to resize the window
      if ((window as any).electronAPI) {
        (window as any).electronAPI.resizeWindow(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    handleExpand();
    addMessage({ role: 'user', content: input });
    setInput('');
    setProcessing(true);
    setStage('observe');
    setProgress(10);
    
    // Mock simulation
    setTimeout(() => { setStage('plan'); setProgress(30); }, 2000);
    setTimeout(() => { setStage('execute'); setProgress(60); }, 4000);
    setTimeout(() => { setStage('verify'); setProgress(90); }, 6000);
    setTimeout(() => { 
      setStage('complete'); 
      setProgress(100); 
      setProcessing(false);
      addMessage({ role: 'agent', content: 'Task completed successfully. Exported Canva presentation to PPT.' });
    }, 8000);
  };

  const openDashboard = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.openDashboard();
    } else {
      window.location.hash = '#/dashboard'; // Fallback for dev without electron
    }
  };

  return (
    <div
      className="flex flex-col h-screen w-full rounded-xl p-[1px] shadow-2xl"
      style={{ 
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #7c3aed 100%)',
        boxShadow: '0 0 30px rgba(124, 58, 237, 0.25), 0 0 60px rgba(37, 99, 235, 0.15)'
      }}
    >
    <div className="flex flex-col h-full w-full bg-black rounded-[11px]">
      {/* Top Row: Input and Window Controls */}
      <div className="flex items-center px-4 py-3 gap-3 border-b border-white/5" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Command size={18} className="text-primary" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CanvaPilot to do something..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </form>
        </div>
        <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button 
            onClick={openDashboard}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground transition-colors mr-1"
            title="Open CanvaPilot Dashboard"
          >
            <Monitor size={14} />
          </button>
          <button 
            onClick={() => (window as any).electronAPI?.minimizeApp()}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground transition-colors"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={() => (window as any).electronAPI?.closeApp()}
            className="p-1.5 rounded-md hover:bg-red-500/80 hover:text-white text-muted-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Project (left) + Model highlighted pill (right) */}
      <div className="flex items-center py-1.5 px-3 gap-3 border-t border-white/5" style={{ WebkitAppRegion: 'drag' } as any}>
        {/* Project selector — left */}
        <div className="flex-1 flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="relative">
            <button 
              onClick={() => { const next = !showProjects; setShowProjects(next); setShowModels(false); toggleDropdown(next); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 text-xs text-zinc-500 transition-colors"
            >
              <Folder size={11} className="text-purple-500/70" />
              {currentProject}
              <ChevronDown size={10} />
            </button>
            <AnimatePresence>
              {showProjects && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  {projects.map(p => (
                    <button key={p} onClick={() => { setCurrentProject(p); setShowProjects(false); toggleDropdown(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 text-zinc-300 transition-colors">
                      {p}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model selector — right, highlighted pill with coding font */}
        <div className="relative" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button 
            onClick={() => { const next = !showModels; setShowModels(next); setShowProjects(false); toggleDropdown(next); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10"
            style={{ 
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(37,99,235,0.08) 100%)'
            }}
          >
            <Sparkles size={10} className="text-blue-400" />
            <span 
              className="text-[11px] font-medium text-purple-300"
              style={{ fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace' }}
            >
              {currentModel}
            </span>
            <ChevronDown size={10} className="text-purple-400/60" />
          </button>
          <AnimatePresence>
            {showModels && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="absolute top-full right-0 mt-1 w-52 bg-zinc-900 border border-purple-500/20 rounded-lg shadow-xl z-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 border-b border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600">Select Model</span>
                </div>
                {models.map(m => (
                  <button 
                    key={m} 
                    onClick={() => { setCurrentModel(m); setShowModels(false); toggleDropdown(false); }} 
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      m === currentModel 
                        ? 'text-purple-300 bg-purple-500/10' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                    style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
                  >
                    {m === currentModel && <span className="mr-1.5 text-purple-400">›</span>}
                    {m}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 overflow-hidden border-t border-white/5"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <AgentChat />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
