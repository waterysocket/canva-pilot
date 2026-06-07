import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardWindow() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">Dashboard</h1><p className="text-muted-foreground">Global overview and active automations.</p></div>;
      case 'agent':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-6">Agent Console</h1><p className="text-muted-foreground">Interact with the agent directly here.</p></div>;
      case 'context':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">Context Engine</h1><p className="text-muted-foreground">Manage Canva, Figma, and Notion context packs.</p></div>;
      case 'workflows':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-6">Workflows</h1><p className="text-muted-foreground">Node-based visual workflow builder.</p></div>;
      case 'knowledge':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Knowledge Base</h1></div>;
      case 'monitor':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Execution Monitor</h1></div>;
      case 'models':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Models</h1></div>;
      case 'marketplace':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Marketplace</h1></div>;
      case 'storage':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Storage</h1></div>;
      case 'settings':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Settings</h1></div>;
      default:
        return <div className="p-8">Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/15 via-[#09090b] to-blue-900/10 text-foreground overflow-hidden">
      {/* Sidebar - 280px */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto relative bg-transparent backdrop-blur-[2px]">
        {/* Custom title bar drag region for MacOS/Windows frameless */}
        <div className="absolute top-0 left-0 w-full h-10" style={{ WebkitAppRegion: 'drag' } as any} />
        <div className="pt-10 h-full">
          {renderView()}
        </div>
      </main>

      {/* Context Panel */}
      <aside className="w-80 border-l border-white/5 flex flex-col hidden lg:flex" style={{ background: 'linear-gradient(180deg, #0e0e18 0%, #0a0a12 100%)' }}>
        <div className="p-6 border-b border-white/5">
          <h3 className="font-semibold text-sm tracking-wider uppercase text-purple-400/70 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="text-xs text-zinc-500 mb-1">RAM Usage</div>
              <div className="text-lg font-semibold text-white">4.2 <span className="text-sm font-normal text-zinc-500">/ 32 GB</span></div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                <div className="h-1.5 rounded-full" style={{ width: '15%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="text-xs text-zinc-500 mb-1">GPU VRAM</div>
              <div className="text-lg font-semibold text-white">8.5 <span className="text-sm font-normal text-zinc-500">/ 12 GB</span></div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                <div className="h-1.5 rounded-full" style={{ width: '70%', background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }} />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="text-xs text-zinc-500 mb-1">Active Tasks</div>
              <div className="text-lg font-semibold text-white">3 <span className="text-sm font-normal text-zinc-500">running</span></div>
              <div className="mt-2 flex gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 h-1.5 rounded-full bg-purple-500/60" />
                ))}
                {[1,2].map(i => (
                  <div key={i} className="flex-1 h-1.5 rounded-full bg-white/5" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
