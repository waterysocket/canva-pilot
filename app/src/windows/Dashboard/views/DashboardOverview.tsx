import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Cpu,
  Clock,
  Plus,
  RefreshCw,
  Eye,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Key,
  Zap,
  Layers,
  Brain,
  Sparkles,
  Plug,
  PlugZap,
  Link,
  Link2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { direction: 'up' | 'down'; value: string };
  accentFrom: string;
  accentTo: string;
}

interface ActivityItem {
  id: number;
  icon: React.ElementType;
  description: string;
  timestamp: string;
  status: 'success' | 'info' | 'warning';
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_STATS: StatCard[] = [
  {
    label: 'Tasks Completed',
    value: 0,
    icon: CheckCircle2,
    trend: { direction: 'up', value: '+0%' },
    accentFrom: 'from-purple-500',
    accentTo: 'to-blue-500',
  },
  {
    label: 'Knowledge Vectors',
    value: 0,
    icon: Package,
    accentFrom: 'from-blue-500',
    accentTo: 'to-cyan-500',
  },
  {
    label: 'Models Available',
    value: 0,
    icon: Cpu,
    accentFrom: 'from-purple-500',
    accentTo: 'to-pink-500',
  },
  {
    label: 'Uptime',
    value: '...',
    icon: Clock,
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-500',
  },
];

const statusColors: Record<ActivityItem['status'], string> = {
  success: 'bg-emerald-400',
  info: 'bg-blue-400',
  warning: 'bg-amber-400',
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCardComponent({ stat, index }: { stat: StatCard; index: number }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.015, borderColor: 'rgba(168,85,247,0.25)' }}
      className={cn(
        'group relative p-5 rounded-2xl border border-white/5',
        'transition-all duration-300 cursor-default overflow-hidden',
      )}
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br',
              stat.accentFrom,
              stat.accentTo,
              'shadow-lg',
            )}
          >
            <stat.icon size={16} className="text-white" />
          </div>
          {stat.trend && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-semibold tabular-nums',
                stat.trend.direction === 'up'
                  ? 'text-emerald-400'
                  : 'text-red-400',
              )}
            >
              {stat.trend.direction === 'up' ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              {stat.trend.value}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
          {stat.value}
        </div>
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-1">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

interface QuickAction {
  label: string;
  icon: React.ElementType;
  primary?: boolean;
  viewId: string;
}

const quickActions: QuickAction[] = [
  { label: 'New Task', icon: Plus, primary: true, viewId: 'agent' },
  { label: 'Refresh Context', icon: RefreshCw, viewId: 'context' },
  { label: 'View Models', icon: Eye, viewId: 'models' },
  { label: 'Open Monitor', icon: Activity, viewId: 'monitor' },
];

function QuickActionButton({ action }: { action: QuickAction }) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => console.log(`[QuickAction] Navigate to: ${action.viewId}`)}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        action.primary
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50'
          : 'border border-white/10 text-zinc-300 hover:border-purple-500/30 hover:bg-purple-500/5 hover:text-white',
      )}
    >
      <action.icon size={15} />
      {action.label}
    </motion.button>
  );
}

function ActivityRow({ item, index }: { item: ActivityItem; index: number }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 4 }}
      className={cn(
        'group flex items-center gap-3 px-4 py-3 rounded-xl',
        'transition-all duration-200 cursor-default',
        'hover:bg-white/[0.025] border border-transparent hover:border-white/5',
      )}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.04] group-hover:bg-purple-500/10 transition-colors">
        <item.icon
          size={14}
          className="text-zinc-500 group-hover:text-purple-400 transition-colors"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-300 truncate">{item.description}</div>
        <div className="text-[10px] text-zinc-600 mt-0.5">{item.timestamp}</div>
      </div>
      <div
        className={cn(
          'w-2 h-2 rounded-full flex-shrink-0 shadow-sm',
          statusColors[item.status],
        )}
        style={{
          boxShadow: `0 0 6px ${
            item.status === 'success'
              ? 'rgba(52,211,153,0.4)'
              : item.status === 'info'
              ? 'rgba(96,165,250,0.4)'
              : 'rgba(251,191,36,0.4)'
          }`,
        }}
      />
    </motion.div>
  );
}

interface ConnectedModel {
  id: string;
  name: string;
  provider: string;
  type: 'reasoning' | 'vision';
}

function ModelStatusBadge({ model }: { model: ConnectedModel }) {
  const Icon = model.type === 'reasoning' ? Brain : Eye;
  const gradient = model.type === 'reasoning' 
    ? 'from-purple-500 to-blue-500' 
    : 'from-cyan-500 to-emerald-500';
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 transition-all hover:border-purple-500/30 hover:bg-purple-500/5">
      <div className={cn('w-6 h-6 rounded-md bg-gradient-to-br flex items-center justify-center', gradient)}>
        <Icon size={12} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{model.provider}</div>
        <div className="text-xs text-zinc-300 font-medium truncate">{model.name}</div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
    </div>
  );
}

function EmptyModelBadge({ type }: { type: 'reasoning' | 'vision' }) {
  const Icon = type === 'reasoning' ? Brain : Eye;
  const label = type === 'reasoning' ? 'LLM' : 'Vision';
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-700/50 transition-all hover:border-purple-500/30 hover:bg-purple-500/5">
      <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
        <Icon size={12} className="text-zinc-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</div>
        <div className="text-xs text-zinc-500 font-medium">Connect a model</div>
      </div>
      <PlugZap size={12} className="text-zinc-600" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState<StatCard[]>(DEFAULT_STATS);
  const [liveActivities, setLiveActivities] = useState<ActivityItem[]>([]);
  const [configuredModels, setConfiguredModels] = useState<ConnectedModel[]>([]);
  const startTime = React.useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const api = (window as any).electronAPI;
      if (!api) return;
      try {
        const results = await Promise.allSettled([
          api.invoke('get-tasks'),
          api.invoke('get-db-stats'),
          api.invoke('get-configured-models')
        ]);
        
        const tasks = results[0].status === 'fulfilled' ? (results[0].value || []) : [];
        const dbStats = results[1].status === 'fulfilled' ? results[1].value : null;
        const models = results[2].status === 'fulfilled' ? (results[2].value || []) : [];

        // Compute uptime
        const uptimeMs = Date.now() - startTime.current;
        const uptimeMins = Math.floor(uptimeMs / 60000);
        const uptimeHrs = Math.floor(uptimeMins / 60);
        const uptimeStr = uptimeHrs > 0 ? `${uptimeHrs}h ${uptimeMins % 60}m` : `${uptimeMins}m`;

        const completedTasks = Array.isArray(tasks) ? tasks.filter((t: any) => t.status === 'completed').length : 0;
        
        setLiveStats([
          { ...DEFAULT_STATS[0], value: completedTasks },
          { ...DEFAULT_STATS[1], value: dbStats?.chroma?.vectorsCount || 0 },
          { ...DEFAULT_STATS[2], value: Array.isArray(models) ? models.length : 0 },
          { ...DEFAULT_STATS[3], value: uptimeStr }
        ]);

        // Map configured models for display
        const mappedModels: ConnectedModel[] = Array.isArray(models) 
          ? models.map((m: any) => ({
              id: m.id,
              name: m.name,
              provider: m.provider,
              type: m.provider.toLowerCase().includes('ollama') ? 'vision' as const : 'reasoning' as const
            }))
          : [];
        setConfiguredModels(mappedModels);

        const taskArr = Array.isArray(tasks) ? tasks : [];
        const recentTasks = taskArr.slice(0, 5).map((t: any) => ({
          id: t.id,
          icon: t.status === 'completed' ? CheckCircle2 : (t.status === 'failed' ? Zap : Activity),
          description: `Task ${t.status}: ${t.goal}`,
          timestamp: new Date(t.startedAt).toLocaleString(),
          status: t.status === 'completed' ? 'success' : (t.status === 'failed' ? 'warning' : 'info')
        }));
        
        setLiveActivities(recentTasks);
      } catch(e) {
        console.error(e);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const greeting = (() => {
    const h = currentTime.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 max-w-5xl mx-auto space-y-8"
    >
      {/* ── Welcome Header ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-300">
            {greeting}
          </span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5">
          {formattedDate} · {formattedTime}
        </p>
      </motion.div>

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStats.map((stat, i) => (
          <StatCardComponent key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ── Connected Models Status ────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
          Connected Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LLM / Reasoning Models */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={12} className="text-purple-400" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">LLM Reasoning</span>
            </div>
            {configuredModels.filter(m => m.type === 'reasoning').length > 0 ? (
              configuredModels
                .filter(m => m.type === 'reasoning')
                .slice(0, 2)
                .map(model => <ModelStatusBadge key={model.id} model={model} />)
            ) : (
              <EmptyModelBadge type="reasoning" />
            )}
          </div>

          {/* Vision Models */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={12} className="text-cyan-400" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Visual Analysis</span>
            </div>
            {configuredModels.filter(m => m.type === 'vision').length > 0 ? (
              configuredModels
                .filter(m => m.type === 'vision')
                .slice(0, 2)
                .map(model => <ModelStatusBadge key={model.id} model={model} />)
            ) : (
              <EmptyModelBadge type="vision" />
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <QuickActionButton key={action.label} action={action} />
          ))}
        </div>
      </motion.div>

      {/* ── Recent Activity ────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
          Recent Activity
        </h2>
        <div
          className="rounded-2xl border border-white/5 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.015)' }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/[0.03]"
          >
            {liveActivities.length > 0 ? (
              liveActivities.map((item, i) => (
                <ActivityRow key={item.id} item={item} index={i} />
              ))
            ) : (
              <div className="p-6 text-center text-zinc-500 text-sm">No recent activity</div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
