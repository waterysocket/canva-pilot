import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  MessageSquare,
  Globe,
  Server,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Zap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProviderConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  isLocal?: boolean;
  apiKeyUrl?: string;
  type: 'vision' | 'reasoning';
  description: string;
}

interface ProviderState {
  configured: boolean;
  keyInput: string;
  showKey: boolean;
  saving: boolean;
  models: string[];
  loadingModels: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

/* ------------------------------------------------------------------ */
/*  Provider definitions                                               */
/* ------------------------------------------------------------------ */

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: Brain,
    gradient: 'from-green-400 to-emerald-500',
    glowColor: 'shadow-green-500/20',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    type: 'reasoning',
    description: 'LLM Reasoning: Excels at complex logic, text inference, and broad knowledge queries.'
  },
  {
    id: 'claude',
    name: 'Anthropic',
    icon: MessageSquare,
    gradient: 'from-orange-400 to-amber-500',
    glowColor: 'shadow-orange-500/20',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    type: 'reasoning',
    description: 'LLM Reasoning: Top tier for reading code, debugging, and analyzing complex logical systems.'
  },
  {
    id: 'gemini',
    name: 'Google',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-400',
    glowColor: 'shadow-blue-500/20',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    type: 'reasoning',
    description: 'LLM Reasoning: Very fast at processing massive contexts and generating long-form outputs.'
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: Zap,
    gradient: 'from-red-500 to-orange-500',
    glowColor: 'shadow-red-500/20',
    apiKeyUrl: 'https://console.groq.com/keys',
    type: 'reasoning',
    description: 'LLM Reasoning: Ultra-fast text inference. Perfect for planning and thinking steps.'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: Globe,
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/20',
    apiKeyUrl: 'https://openrouter.ai/keys',
    type: 'reasoning',
    description: 'LLM Reasoning: Provides access to hundreds of reasoning models via one API.'
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: Server,
    gradient: 'from-indigo-400 to-violet-500',
    glowColor: 'shadow-indigo-500/20',
    isLocal: true,
    type: 'vision',
    description: 'Local Visual Analysis: Run multimodal models like LLaVA directly on your hardware securely. No cloud needed.'
  },
];

/* ------------------------------------------------------------------ */
/*  Toast Component                                                    */
/* ------------------------------------------------------------------ */

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg',
        toast.type === 'success'
          ? 'border-green-500/30 bg-green-950/60 text-green-300'
          : 'border-red-500/30 bg-red-950/60 text-red-300',
      )}
    >
      {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provider Card                                                      */
/* ------------------------------------------------------------------ */

function ProviderCard({
  provider,
  state,
  onKeyChange,
  onToggleShow,
  onSave,
  onRefreshModels,
}: {
  provider: ProviderConfig;
  state: ProviderState;
  onKeyChange: (value: string) => void;
  onToggleShow: () => void;
  onSave: () => void;
  onRefreshModels: () => void;
}) {
  const Icon = provider.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative rounded-2xl border border-white/5 hover:border-purple-500/25 transition-all duration-500"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      {/* Gradient hover border glow */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                provider.gradient,
                provider.glowColor,
              )}
            >
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                {provider.name}
                {provider.apiKeyUrl && (
                  <a href={provider.apiKeyUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 underline font-normal tracking-wide">
                    Get API Key
                  </a>
                )}
              </h3>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-300',
                state.configured
                  ? 'bg-green-400 shadow-sm shadow-green-400/50'
                  : 'bg-zinc-600',
              )}
            />
            <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500">
              {state.configured ? 'Connected' : 'Not configured'}
            </span>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
            {provider.isLocal ? 'Endpoint URL' : 'API Key'}
          </label>
          <div className="relative flex items-center">
            <input
              type={state.showKey ? 'text' : 'password'}
              value={state.keyInput}
              onChange={(e) => onKeyChange(e.target.value)}
              placeholder={provider.isLocal ? 'http://localhost:11434' : `Enter ${provider.name} API key…`}
              className="w-full px-3 py-2.5 pr-20 rounded-lg text-sm text-white placeholder:text-zinc-600 border border-white/5 focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                onClick={onToggleShow}
                className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
                title={state.showKey ? 'Hide' : 'Show'}
              >
                {state.showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={onSave}
                disabled={state.saving || !state.keyInput.trim()}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  state.keyInput.trim()
                    ? 'text-purple-400 hover:bg-purple-500/15 hover:text-purple-300'
                    : 'text-zinc-700 cursor-not-allowed',
                )}
                title="Save"
              >
                {state.saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Models section */}
        {state.configured && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
                Available Models
              </span>
              <button
                onClick={onRefreshModels}
                disabled={state.loadingModels}
                className="p-1 rounded-md text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                title="Refresh models"
              >
                <RefreshCw size={11} className={state.loadingModels ? 'animate-spin' : ''} />
              </button>
            </div>

            {state.loadingModels ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={12} className="text-purple-400 animate-spin" />
                <span className="text-xs text-zinc-500">Loading models…</span>
              </div>
            ) : state.models.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {state.models.slice(0, 8).map((model) => (
                  <span
                    key={model}
                    className="px-2 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-white/5 truncate max-w-[140px]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    title={model}
                  >
                    {model}
                  </span>
                ))}
                {state.models.length > 8 && (
                  <span className="px-2 py-1 text-[10px] text-zinc-600">
                    +{state.models.length - 8} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-zinc-600">No models found. Try refreshing.</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ModelsView                                                    */
/* ------------------------------------------------------------------ */

export default function ModelsView() {
  const [providerStates, setProviderStates] = useState<Record<string, ProviderState>>(() => {
    const initial: Record<string, ProviderState> = {};
    PROVIDERS.forEach((p) => {
      initial[p.id] = {
        configured: false,
        keyInput: '',
        showKey: false,
        saving: false,
        models: [],
        loadingModels: false,
      };
    });
    return initial;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [refreshingAll, setRefreshingAll] = useState(false);
  let toastCounter = React.useRef(0);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* Update a single provider's state */
  const updateProvider = useCallback((providerId: string, updates: Partial<ProviderState>) => {
    setProviderStates((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], ...updates },
    }));
  }, []);

  /* Check configured status for all providers on mount */
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (!api) return;

    PROVIDERS.forEach(async (provider) => {
      try {
        const key = await api.getApiKey(provider.id);
        if (key) {
          updateProvider(provider.id, { configured: true, keyInput: key });
        }
      } catch {
        // Provider not configured — ignore
      }
    });
  }, [updateProvider]);

  /* Save API key for a provider */
  const handleSaveKey = useCallback(
    async (providerId: string) => {
      const api = (window as any).electronAPI;
      const state = providerStates[providerId];
      if (!api?.saveApiKey || !state?.keyInput.trim()) return;

      updateProvider(providerId, { saving: true });
      try {
        await api.saveApiKey(providerId, state.keyInput.trim());
        updateProvider(providerId, { saving: false, configured: true });
        const providerName = PROVIDERS.find((p) => p.id === providerId)?.name ?? providerId;
        addToast(`${providerName} API key saved successfully`, 'success');
      } catch (err: any) {
        updateProvider(providerId, { saving: false });
        addToast(`Failed to save key: ${err?.message ?? 'Unknown error'}`, 'error');
      }
    },
    [providerStates, updateProvider, addToast],
  );

  /* Fetch models for a single provider */
  const fetchModels = useCallback(
    async (providerId: string) => {
      const api = (window as any).electronAPI;
      if (!api?.getModels) return;

      updateProvider(providerId, { loadingModels: true });
      try {
        const models = await api.getModels(providerId);
        updateProvider(providerId, {
          loadingModels: false,
          models: Array.isArray(models) ? models : [],
        });
      } catch {
        updateProvider(providerId, { loadingModels: false, models: [] });
      }
    },
    [updateProvider],
  );

  /* Refresh models for all configured providers */
  const handleRefreshAll = useCallback(async () => {
    setRefreshingAll(true);
    const configured = PROVIDERS.filter((p) => providerStates[p.id]?.configured);
    await Promise.allSettled(configured.map((p) => fetchModels(p.id)));
    setRefreshingAll(false);
    addToast(`Refreshed models for ${configured.length} provider${configured.length !== 1 ? 's' : ''}`, 'success');
  }, [providerStates, fetchModels, addToast]);

  const configuredCount = PROVIDERS.filter((p) => providerStates[p.id]?.configured).length;

  return (
    <div className="p-8 text-white min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 mb-2">
            AI Models & Providers
          </h1>
          <p className="text-sm text-zinc-500">
            Configure your AI providers and manage model access.{' '}
            <span className="text-purple-400/80 font-medium">{configuredCount}</span> of{' '}
            <span className="text-zinc-400">{PROVIDERS.length}</span> configured.
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={refreshingAll || configuredCount === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border',
            configuredCount > 0
              ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20'
              : 'border-white/5 text-zinc-600 cursor-not-allowed',
          )}
        >
          <RefreshCw size={13} className={refreshingAll ? 'animate-spin' : ''} />
          Refresh All Models
        </button>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 mb-8"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-purple-400" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">Provider Status</span>
        </div>
        <div className="flex-1 flex items-center gap-3 ml-4">
          {PROVIDERS.map((p) => {
            const configured = providerStates[p.id]?.configured;
            return (
              <div
                key={p.id}
                className="flex items-center gap-1.5"
                title={`${p.name}: ${configured ? 'Connected' : 'Not configured'}`}
              >
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    configured ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-zinc-700',
                  )}
                />
                <span className={cn('text-[10px]', configured ? 'text-zinc-300' : 'text-zinc-600')}>
                  {p.name.split(' ').pop()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Provider Cards Grid - Grouped by Type */}
      <div className="flex flex-col gap-12">
        
        {/* Vision Models */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Eye size={14} />
              Visual Analysis Models
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Visual models excel at "seeing" the screen, analyzing complex UI structures, and processing multimodal input like video streams or screenshots.
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {PROVIDERS.filter(p => p.type === 'vision').map((provider, idx) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <ProviderCard
                  provider={provider}
                  state={providerStates[provider.id]}
                  onKeyChange={(val) => updateProvider(provider.id, { keyInput: val })}
                  onToggleShow={() =>
                    updateProvider(provider.id, { showKey: !providerStates[provider.id].showKey })
                  }
                  onSave={() => handleSaveKey(provider.id)}
                  onRefreshModels={() => fetchModels(provider.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reasoning Models */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Brain size={14} />
              LLM Reasoning Models
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Reasoning models provide ultra-fast text inference, making them perfect for planning, thinking steps, and orchestrating complex automation logic securely.
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {PROVIDERS.filter(p => p.type === 'reasoning').map((provider, idx) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <ProviderCard
                  provider={provider}
                  state={providerStates[provider.id]}
                  onKeyChange={(val) => updateProvider(provider.id, { keyInput: val })}
                  onToggleShow={() =>
                    updateProvider(provider.id, { showKey: !providerStates[provider.id].showKey })
                  }
                  onSave={() => handleSaveKey(provider.id)}
                  onRefreshModels={() => fetchModels(provider.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastNotification key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
