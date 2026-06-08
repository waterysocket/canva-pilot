import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bot, Database, Network, 
  BookOpen, Activity, Cpu, ShoppingBag, 
  HardDrive, Settings, Zap, ArrowLeft,
  Brain, Eye, PlugZap, Link2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

interface ConnectedModel {
  id: string;
  name: string;
  provider: string;
  type: 'reasoning' | 'vision';
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agent', label: 'Agent Console', icon: Bot },
  { id: 'context', label: 'Context Engine', icon: Database },
  { id: 'workflows', label: 'Workflows', icon: Network },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'monitor', label: 'Execution Monitor', icon: Activity },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function ModelStatusIndicator({ model }: { model: ConnectedModel | null }) {
  if (!model) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-700/50">
        <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center">
          <PlugZap size={10} className="text-zinc-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] text-zinc-600 uppercase tracking-wider">Model</div>
          <div className="text-[10px] text-zinc-500 font-medium truncate">Not connected</div>
        </div>
      </div>
    );
  }

  const Icon = model.type === 'reasoning' ? Brain : Eye;
  const gradient = model.type === 'reasoning' 
    ? 'from-purple-500 to-blue-500' 
    : 'from-cyan-500 to-emerald-500';
  const label = model.type === 'reasoning' ? 'LLM' : 'Vision';

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
      <div className={cn('w-5 h-5 rounded-md bg-gradient-to-br flex items-center justify-center', gradient)}>
        <Icon size={10} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{label}</div>
        <div className="text-[10px] text-zinc-300 font-medium truncate" title={model.name}>
          {model.name}
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
    </div>
  );
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [configuredModels, setConfiguredModels] = useState<ConnectedModel[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const api = (window as any).electronAPI;
      if (!api?.invoke) return;
      try {
        const models = await api.invoke('get-configured-models');
        const mappedModels: ConnectedModel[] = Array.isArray(models) 
          ? models.map((m: any) => ({
              id: m.id,
              name: m.name,
              provider: m.provider,
              type: m.provider.toLowerCase().includes('ollama') ? 'vision' as const : 'reasoning' as const
            }))
          : [];
        setConfiguredModels(mappedModels);
      } catch (e) {
        console.error('Failed to fetch configured models', e);
      }
    };

    fetchModels();
    const interval = setInterval(fetchModels, 30000);
    return () => clearInterval(interval);
  }, []);

  const reasoningModel = configuredModels.find(m => m.type === 'reasoning') || null;
  const visionModel = configuredModels.find(m => m.type === 'vision') || null;
  return (
    <aside className="w-[280px] border-r border-white/5 flex flex-col h-full z-10" style={{ background: 'linear-gradient(180deg, #111118 0%, #0d0d14 50%, #0a0a12 100%)' }}>
      {/* Logo / Brand */}
      <div className="p-6 flex items-center gap-3" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">CanvaPilot</h1>
          <p className="text-[10px] uppercase tracking-wider text-purple-400/60 font-medium">Developer Edition</p>
        </div>
      </div>

      {/* Back to Chat */}
      <div className="px-4 pb-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button 
          onClick={() => (window as any).electronAPI?.closeDashboard()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-blue-300/80 hover:text-white transition-all border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10"
        >
          <ArrowLeft size={13} />
          Back to Command Bar
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              activeView === item.id 
                ? "bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white font-medium border border-purple-500/30 shadow-sm shadow-purple-900/30" 
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            )}
          >
            <item.icon 
              size={16} 
              className={activeView === item.id ? "text-purple-400" : "text-zinc-500"} 
            />
            {item.label}
            {activeView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
            )}
          </button>
        ))}
      </nav>
      
      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Model Status Indicators */}
      <div className="px-4 pb-3 space-y-2">
        <ModelStatusIndicator model={reasoningModel} />
        <ModelStatusIndicator model={visionModel} />
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* User */}
      <div className="p-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <div className="p-3 rounded-xl border border-white/5 hover:border-purple-500/20 flex items-center gap-3 cursor-pointer hover:bg-purple-500/5 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            <span className="text-white font-bold text-xs">HP</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Local User</div>
            <div className="text-xs text-zinc-500">Pro Plan</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
        </div>
      </div>
    </aside>
  );
}
