import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardWindow() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1><p className="text-muted-foreground">Global overview and active automations.</p></div>;
      case 'agent':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold text-primary mb-6">Agent Console</h1><p className="text-muted-foreground">Interact with the agent directly here.</p></div>;
      case 'context':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold text-secondary mb-6">Context Engine</h1><p className="text-muted-foreground">Manage Canva, Figma, and Notion context packs.</p></div>;
      case 'workflows':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold text-purple-400 mb-6">Workflows</h1><p className="text-muted-foreground">Node-based visual workflow builder.</p></div>;
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
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar - 280px */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto relative bg-black/20">
        {/* Custom title bar drag region for MacOS/Windows frameless */}
        <div className="absolute top-0 left-0 w-full h-10" style={{ WebkitAppRegion: 'drag' } as any} />
        <div className="pt-10 h-full">
          {renderView()}
        </div>
      </main>

      {/* Context Panel (Collapsible placeholder) */}
      <aside className="w-80 border-l border-white/5 bg-card/30 p-6 flex flex-col hidden lg:flex">
        <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground mb-4">System Health</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs text-muted-foreground mb-1">RAM Usage</div>
            <div className="text-lg font-medium text-white">4.2 GB / 32 GB</div>
            <div className="w-full bg-white/10 rounded-full h-1 mt-2">
              <div className="bg-secondary h-1 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs text-muted-foreground mb-1">GPU VRAM</div>
            <div className="text-lg font-medium text-white">8.5 GB / 12 GB</div>
            <div className="w-full bg-white/10 rounded-full h-1 mt-2">
              <div className="bg-primary h-1 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
