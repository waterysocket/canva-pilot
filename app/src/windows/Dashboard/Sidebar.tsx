import React from 'react';
import { 
  LayoutDashboard, Bot, Database, Network, 
  BookOpen, Activity, Cpu, ShoppingBag, 
  HardDrive, Settings, Zap, ArrowLeft 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agent', label: 'Agent Console', icon: Bot },
  { id: 'context', label: 'Context Engine', icon: Database },
  { id: 'workflows', label: 'Workflows', icon: Network },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'monitor', label: 'Execution Monitor', icon: Activity },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
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
