import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Circle,
  TrendingUp,
  Timer,
  Zap,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

interface TaskStep {
  name: string;
  index: number;
  total: number;
}

interface ActiveTask {
  id: string;
  goal: string;
  status: TaskStatus;
  step: TaskStep | null;
  progress: number;
  startedAt: number;
}

interface HistoryTask {
  id: string;
  goal: string;
  status: TaskStatus;
  timestamp: string;
  duration: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; dotColor: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-400',
    dotColor: 'bg-yellow-400',
    icon: Clock,
  },
  running: {
    label: 'Running',
    color: 'text-blue-400',
    dotColor: 'bg-blue-400',
    icon: Loader2,
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    color: 'text-red-400',
    dotColor: 'bg-red-400',
    icon: XCircle,
  },
};

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest',
        'border',
        status === 'completed' && 'border-emerald-500/20 bg-emerald-500/10',
        status === 'failed' && 'border-red-500/20 bg-red-500/10',
        status === 'running' && 'border-blue-500/20 bg-blue-500/10',
        status === 'pending' && 'border-yellow-500/20 bg-yellow-500/10',
        cfg.color,
      )}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full', cfg.dotColor, {
          'animate-pulse': status === 'running' || status === 'pending',
        })}
      />
      {cfg.label}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex-1 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:border-purple-500/20"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={12} className="text-purple-400/80" />
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-xl font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ExecutionMonitorView() {
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [history, setHistory] = useState<HistoryTask[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- Elapsed timer ---- */
  useEffect(() => {
    if (activeTask && activeTask.status === 'running') {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - activeTask.startedAt);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTask]);

  /* ---- Listen for real-time task events ---- */
  const handleTaskEvent = useCallback((_event: unknown, data: any) => {
    if (!data) return;
    const type: string = data.type ?? data.status ?? '';

    switch (type) {
      case 'started':
        setActiveTask({
          id: data.id ?? crypto.randomUUID(),
          goal: data.goal ?? 'Running task…',
          status: 'running',
          step: data.step ?? null,
          progress: 0,
          startedAt: Date.now(),
        });
        setElapsed(0);
        break;

      case 'updated':
        setActiveTask((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            step: data.step ?? prev.step,
            progress:
              typeof data.progress === 'number' ? data.progress : prev.progress,
          };
        });
        break;

      case 'completed':
        setActiveTask((prev) =>
          prev ? { ...prev, status: 'completed', progress: 100 } : prev,
        );
        if (timerRef.current) clearInterval(timerRef.current);
        break;

      case 'failed':
        setActiveTask((prev) =>
          prev ? { ...prev, status: 'failed' } : prev,
        );
        if (timerRef.current) clearInterval(timerRef.current);
        break;
    }
  }, []);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api?.onTaskEvent) {
      api.onTaskEvent(handleTaskEvent);
    }
    
    // Fetch history
    if (api) {
      api.invoke('get-tasks').then((tasks: any[]) => {
        if (tasks && tasks.length > 0) {
          const mapped: HistoryTask[] = tasks.map((t: any) => ({
            id: t.id.toString(),
            goal: t.goal,
            status: t.status,
            timestamp: new Date(t.startedAt).toLocaleString(),
            duration: t.durationMs ? formatElapsed(t.durationMs) : '--'
          }));
          setHistory(mapped.reverse());
        }
      }).catch(console.error);
    }
  }, [handleTaskEvent]);

  /* ---- Derived stats ---- */
  const tasksToday = history.filter((t) => {
    const d = new Date(t.timestamp);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  
  const completedToday = history.filter((t) => {
    const d = new Date(t.timestamp);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() && t.status === 'completed';
  }).length;

  const successRate =
    tasksToday > 0 ? `${Math.round((completedToday / tasksToday) * 100)}%` : '--';
  const avgDuration =
    tasksToday > 0 ? '--' : '--'; // We can calculate real avg duration if needed

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-1">
          Execution Monitor
        </h1>
        <p className="text-sm text-zinc-500">
          Real-time task tracking &amp; execution history
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <StatCard icon={Zap} label="Tasks Today" value={String(tasksToday)} />
        <StatCard icon={TrendingUp} label="Success Rate" value={successRate} />
        <StatCard icon={Timer} label="Avg Duration" value={avgDuration} />
      </motion.div>

      {/* Active task panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-purple-400" />
          <h2 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
            Active Task
          </h2>
        </div>

        <div
          className="rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-purple-500/20"
          style={{ background: 'rgba(255,255,255,0.025)' }}
        >
          <AnimatePresence mode="wait">
            {activeTask ? (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5"
              >
                {/* Goal + Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate mb-1">
                      {activeTask.goal}
                    </p>
                    {activeTask.step && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <ChevronRight size={10} className="text-purple-400" />
                        Step {activeTask.step.index}/{activeTask.step.total}:{' '}
                        <span className="text-zinc-400">
                          {activeTask.step.name}
                        </span>
                      </p>
                    )}
                  </div>
                  <StatusBadge status={activeTask.status} />
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="text-zinc-500 uppercase tracking-widest font-semibold">
                      Progress
                    </span>
                    <span className="text-zinc-400 tabular-nums font-bold">
                      {Math.round(activeTask.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{
                        background:
                          'linear-gradient(90deg, #7c3aed, #3b82f6)',
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(activeTask.progress, 100)}%`,
                      }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Elapsed timer */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock size={11} className="text-zinc-600" />
                  <span className="tabular-nums">
                    Elapsed: {formatElapsed(elapsed)}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 flex flex-col items-center justify-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <Activity size={20} className="text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">
                  No active tasks
                </p>
                <p className="text-xs text-zinc-700">
                  Tasks will appear here when you start an automation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Task history */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-purple-400" />
          <h2 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
            Task History
          </h2>
        </div>

        <div className="space-y-2">
          {history.map((task, i) => {
            const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['pending'];
            const StatusIcon = cfg.icon || Clock;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
                className={cn(
                  'group p-4 rounded-xl border border-white/5 flex items-center gap-4 transition-all duration-300',
                  'hover:border-purple-500/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.06)] cursor-default',
                )}
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                {/* Status icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border',
                    task.status === 'completed' &&
                      'border-emerald-500/20 bg-emerald-500/10',
                    task.status === 'failed' &&
                      'border-red-500/20 bg-red-500/10',
                  )}
                >
                  <StatusIcon
                    size={14}
                    className={cn(
                      cfg.color,
                      task.status === 'running' && 'animate-spin',
                    )}
                  />
                </div>

                {/* Goal */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate group-hover:text-purple-200 transition-colors">
                    {task.goal}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">
                    {task.timestamp}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 flex-shrink-0">
                  <Timer size={11} className="text-zinc-600" />
                  <span className="tabular-nums">{task.duration}</span>
                </div>

                {/* Status badge */}
                <StatusBadge status={task.status} />
              </motion.div>
            );
          })}
        </div>

        {history.length === 0 && (
          <div
            className="p-8 rounded-xl border border-white/5 text-center"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <AlertTriangle size={20} className="text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">No task history yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
