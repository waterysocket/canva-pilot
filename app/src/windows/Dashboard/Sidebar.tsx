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
    <aside className="w-[280px] bg-card/50 border-r border-white/5 flex flex-col h-full z-10 backdrop-blur-xl">
      <div className="p-6 flex items-center gap-3" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">CanvasOS</h1>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Developer Edition</p>
        </div>
      </div>

      <div className="px-4 pb-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button 
          onClick={() => (window as any).electronAPI?.closeDashboard()}
          className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors shadow-sm"
        >
          <ArrowLeft size={14} />
          Back to Command Bar
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              activeView === item.id 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={18} className={activeView === item.id ? "text-primary" : "text-muted-foreground"} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/5" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
            <span className="text-secondary font-medium text-xs">HP</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Local User</div>
            <div className="text-xs text-muted-foreground">Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
