import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import { Cpu, MemoryStick, MonitorDot, HardDrive, RefreshCw } from 'lucide-react';

// View components
import DashboardOverview from './views/DashboardOverview';
import AgentConsoleView from './views/AgentConsoleView';
import ContextEngineView from './views/ContextEngineView';
import ExecutionMonitorView from './views/ExecutionMonitorView';
import KnowledgeBaseView from './views/KnowledgeBaseView';
import ModelsView from './views/ModelsView';
import SettingsView from './views/SettingsView';

interface SystemInfo {
  ram: { used: number; total: number; percent: number };
  vram: { used: number; total: number; percent: number; gpuName: string };
  cpu: { model: string; cores: number; load: number };
  disk: { used: number; total: number; free: number; percent: number };
}

function getBarColor(percent: number) {
  if (percent < 50) return 'linear-gradient(90deg, #2563eb, #7c3aed)';
  if (percent < 80) return 'linear-gradient(90deg, #7c3aed, #ec4899)';
  return 'linear-gradient(90deg, #ef4444, #f97316)';
}

function getStatusColor(percent: number) {
  if (percent < 50) return '#818cf8';
  if (percent < 80) return '#ec4899';
  return '#f97316';
}

function truncateModel(model: string, max = 26) {
  return model.length > max ? model.slice(0, max) + '…' : model;
}

function HardwareCard({
  icon: Icon,
  label,
  subtitle,
  used,
  total,
  unit = 'GB',
  percent,
  extra,
}: {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  used: number;
  total: number;
  unit?: string;
  percent: number;
  extra?: React.ReactNode;
}) {
  return (
    <div
      className="p-4 rounded-xl border border-white/5 transition-all duration-300 hover:border-purple-500/20"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={12} className="text-purple-400/80" />
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{label}</span>
      </div>
      {subtitle && (
        <div className="text-[10px] text-zinc-600 mb-2 truncate leading-tight" title={subtitle}>
          {subtitle}
        </div>
      )}
      <div className="flex items-baseline gap-1 mb-2.5">
        <span className="text-xl font-bold text-white tabular-nums">{used}</span>
        <span className="text-xs text-zinc-500">/ {total} {unit}</span>
        <span
          className="ml-auto text-xs font-bold tabular-nums"
          style={{ color: getStatusColor(percent) }}
        >
          {percent}%
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(percent, 100)}%`, background: getBarColor(percent) }}
        />
      </div>
      {extra}
    </div>
  );
}

export default function DashboardWindow() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchInfo = useCallback(async (showSpinner = false) => {
    const api = (window as any).electronAPI;
    if (!api?.getSystemInfo) return;
    if (showSpinner) setRefreshing(true);
    try {
      const data = await api.getSystemInfo();
      setSysInfo(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to fetch system info', e);
    } finally {
      if (showSpinner) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
    const interval = setInterval(() => fetchInfo(), 4000);
    return () => clearInterval(interval);
  }, [fetchInfo]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'agent':
        return <AgentConsoleView />;
      case 'context':
        return <ContextEngineView />;
      case 'workflows':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-6">Workflows</h1><p className="text-muted-foreground">Node-based visual workflow builder.</p></div>;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'monitor':
        return <ExecutionMonitorView />;
      case 'models':
        return <ModelsView />;
      case 'marketplace':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Marketplace</h1><p className="text-zinc-500">Coming soon — share and discover Context Packs, Workflows, and Automation Templates.</p></div>;
      case 'storage':
        return <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-6">Storage</h1><p className="text-zinc-500">SQLite database browser and ChromaDB collection manager.</p></div>;
      case 'settings':
        return <SettingsView />;
      default:
        return <div className="p-8">Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/15 via-[#09090b] to-blue-900/10 text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto relative bg-transparent backdrop-blur-[2px]">
        <div className="absolute top-0 left-0 w-full h-10" style={{ WebkitAppRegion: 'drag' } as any} />
        <div className="pt-10 h-full">
          {renderView()}
        </div>
      </main>

      {/* System Configurations Panel */}
      <aside
        className="w-80 border-l border-white/5 flex flex-col hidden lg:flex"
        style={{ background: 'linear-gradient(180deg, #0e0e18 0%, #0a0a12 100%)' }}
      >
        <div className="p-5 flex-1 overflow-y-auto">

          {/* Panel Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[10px] tracking-[0.15em] uppercase text-purple-400/70">
              System Configurations
            </h3>
            <button
              onClick={() => fetchInfo(true)}
              title="Refresh"
              className="p-1 rounded-md text-zinc-600 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
            >
              <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {!sysInfo ? (
            /* Loading skeleton */
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-white/5 animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="h-2 w-16 bg-white/8 rounded mb-3" />
                  <div className="h-5 w-24 bg-white/8 rounded mb-3" />
                  <div className="h-1.5 w-full bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">

              {/* RAM */}
              <HardwareCard
                icon={MemoryStick}
                label="RAM"
                used={sysInfo.ram.used}
                total={sysInfo.ram.total}
                percent={sysInfo.ram.percent}
              />

              {/* VRAM */}
              <HardwareCard
                icon={MonitorDot}
                label="GPU VRAM"
                subtitle={truncateModel(sysInfo.vram.gpuName)}
                used={sysInfo.vram.used}
                total={sysInfo.vram.total}
                percent={sysInfo.vram.percent}
                extra={
                  sysInfo.vram.total === 0 ? (
                    <div className="text-[10px] text-zinc-600 mt-1.5">No dedicated VRAM detected</div>
                  ) : null
                }
              />

              {/* CPU */}
              <div
                className="p-4 rounded-xl border border-white/5 transition-all duration-300 hover:border-purple-500/20"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cpu size={12} className="text-purple-400/80" />
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">CPU</span>
                </div>
                <div className="text-[10px] text-zinc-600 mb-2 truncate leading-tight" title={sysInfo.cpu.model}>
                  {truncateModel(sysInfo.cpu.model)} · {sysInfo.cpu.cores} cores
                </div>
                <div className="flex items-baseline gap-1 mb-2.5">
                  <span className="text-xl font-bold text-white tabular-nums">{sysInfo.cpu.load}</span>
                  <span className="text-xs text-zinc-500">% load</span>
                  <span
                    className="ml-auto text-xs font-bold"
                    style={{ color: getStatusColor(sysInfo.cpu.load) }}
                  >
                    {sysInfo.cpu.load < 50 ? 'Healthy' : sysInfo.cpu.load < 80 ? 'Moderate' : 'High'}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(sysInfo.cpu.load, 100)}%`,
                      background: getBarColor(sysInfo.cpu.load),
                    }}
                  />
                </div>
              </div>

              {/* Disk */}
              <HardwareCard
                icon={HardDrive}
                label="Disk"
                used={sysInfo.disk.used}
                total={sysInfo.disk.total}
                percent={sysInfo.disk.percent}
                extra={
                  <div className="text-[10px] text-zinc-600 mt-1.5">
                    {sysInfo.disk.free.toFixed(1)} GB free
                  </div>
                }
              />

            </div>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <div className="mt-4 text-[10px] text-zinc-700 text-center">
              Live · {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
