import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  RefreshCw,
  Lock,
  Palette,
  PenTool,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  GitBranch,
  ShieldCheck,
  ArrowDownToLine,
  Layers,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContextPack {
  id: string;
  name: string;
  icon: React.ElementType;
  active: boolean;
  version: string;
  stats: { actions: number; workflows: number; uiMaps: number };
  lastRefreshed: string;
}

interface KnowledgeItem {
  id: string;
  name: string;
  icon: React.ElementType;
  docCount: number;
  ingesting: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const CONTEXT_PACKS: ContextPack[] = [
  {
    id: 'canva',
    name: 'Canva',
    icon: Palette,
    active: true,
    version: 'v2.4.1',
    stats: { actions: 147, workflows: 32, uiMaps: 89 },
    lastRefreshed: '2 min ago',
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: PenTool,
    active: false,
    version: '--',
    stats: { actions: 0, workflows: 0, uiMaps: 0 },
    lastRefreshed: '--',
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: BookOpen,
    active: false,
    version: '--',
    stats: { actions: 0, workflows: 0, uiMaps: 0 },
    lastRefreshed: '--',
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: ClipboardList,
    active: false,
    version: '--',
    stats: { actions: 0, workflows: 0, uiMaps: 0 },
    lastRefreshed: '--',
  },
];

const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  { id: 'docs', name: 'Documentation', icon: FileText, docCount: 234, ingesting: false },
  { id: 'tutorials', name: 'Tutorials', icon: GraduationCap, docCount: 58, ingesting: false },
  { id: 'workflows', name: 'Workflows', icon: GitBranch, docCount: 32, ingesting: false },
  { id: 'rules', name: 'Review Rules', icon: ShieldCheck, docCount: 12, ingesting: false },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PackStatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
        {label}
      </span>
      <span className="text-xs font-bold text-white tabular-nums">{value}</span>
    </div>
  );
}

function ActivePackCard({
  pack,
  onRefresh,
  refreshing,
}: {
  pack: ContextPack;
  onRefresh: (id: string) => void;
  refreshing: boolean;
}) {
  const Icon = pack.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-xl border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] relative overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      {/* Subtle gradient glow in bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{pack.name}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">
              {pack.version}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={9} />
          Active
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4 relative z-10">
        <PackStatRow label="Actions loaded" value={pack.stats.actions} />
        <PackStatRow label="Workflows loaded" value={pack.stats.workflows} />
        <PackStatRow label="UI Maps loaded" value={pack.stats.uiMaps} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Refresh button + timestamp */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] text-zinc-600">
          Last refreshed: {pack.lastRefreshed}
        </span>
        <button
          onClick={() => onRefresh(pack.id)}
          disabled={refreshing}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all duration-300',
            'border border-purple-500/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <RefreshCw
            size={10}
            className={cn(refreshing && 'animate-spin')}
          />
          {refreshing ? 'Refreshing…' : 'Refresh Context'}
        </button>
      </div>
    </motion.div>
  );
}

function ComingSoonCard({
  pack,
  index,
}: {
  pack: ContextPack;
  index: number;
}) {
  const Icon = pack.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      className="p-5 rounded-xl border border-white/5 relative overflow-hidden group cursor-default"
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      {/* Lock overlay */}
      <div className="absolute inset-0 bg-[#09090b]/40 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Lock size={24} className="text-zinc-600" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 opacity-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
            <Icon size={18} className="text-zinc-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-400">{pack.name}</h3>
            <span className="text-[10px] text-zinc-600">--</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-white/5 text-zinc-500 border border-white/5">
          <Lock size={8} />
          Coming Soon
        </span>
      </div>

      {/* Placeholder stats */}
      <div className="space-y-2 mb-4 opacity-20">
        <div className="flex justify-between">
          <span className="text-[10px] text-zinc-600">Actions loaded</span>
          <span className="text-xs text-zinc-600">--</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-zinc-600">Workflows loaded</span>
          <span className="text-xs text-zinc-600">--</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-zinc-600">UI Maps loaded</span>
          <span className="text-xs text-zinc-600">--</span>
        </div>
      </div>

      <div className="h-px bg-white/5 mb-4" />

      <div className="flex items-center justify-between opacity-30">
        <span className="text-[10px] text-zinc-700">Last refreshed: --</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-zinc-600 border border-white/5 cursor-not-allowed">
          <Lock size={9} />
          Locked
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ContextEngineView() {
  const [packs] = useState<ContextPack[]>(CONTEXT_PACKS);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);

  const handleRefresh = useCallback((id: string) => {
    setRefreshingId(id);
    // Simulate async refresh
    setTimeout(() => {
      setRefreshingId(null);
    }, 2200);
  }, []);

  const handleIngest = useCallback((id: string) => {
    setKnowledge((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ingesting: true } : k)),
    );
    // Simulate async ingest
    setTimeout(() => {
      setKnowledge((prev) =>
        prev.map((k) => (k.id === id ? { ...k, ingesting: false } : k)),
      );
    }, 2500);
  }, []);

  const activePacks = packs.filter((p) => p.active);
  const comingSoonPacks = packs.filter((p) => !p.active);

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 mb-1">
          Context Engine
        </h1>
        <p className="text-sm text-zinc-500">
          Manage context packs &amp; knowledge bundles for software-specific AI awareness
        </p>
      </motion.div>

      {/* Context Packs heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-4"
      >
        <Database size={14} className="text-purple-400" />
        <h2 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
          Context Packs
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/5 to-transparent ml-2" />
      </motion.div>

      {/* Pack grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-10">
        {activePacks.map((pack) => (
          <ActivePackCard
            key={pack.id}
            pack={pack}
            onRefresh={handleRefresh}
            refreshing={refreshingId === pack.id}
          />
        ))}
        {comingSoonPacks.map((pack, i) => (
          <ComingSoonCard key={pack.id} pack={pack} index={i} />
        ))}
      </div>

      {/* Knowledge Collections */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} className="text-purple-400" />
          <h2 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
            Knowledge Collections
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/5 to-transparent ml-2" />
        </div>

        <div className="space-y-2">
          {knowledge.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                className="group p-4 rounded-xl border border-white/5 flex items-center gap-4 transition-all duration-300 hover:border-purple-500/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.06)]"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/10 bg-purple-500/5">
                  <Icon size={16} className="text-purple-400/80" />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    {item.docCount} documents indexed
                  </p>
                </div>

                {/* Ingest button */}
                <button
                  onClick={() => handleIngest(item.id)}
                  disabled={item.ingesting}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all duration-300',
                    'border border-white/10 text-zinc-400 hover:border-purple-500/30 hover:text-purple-300 hover:bg-purple-500/10',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  {item.ingesting ? (
                    <>
                      <Sparkles size={10} className="animate-pulse text-purple-400" />
                      Ingesting…
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine size={10} />
                      Ingest
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
