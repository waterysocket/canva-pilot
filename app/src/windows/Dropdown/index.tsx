import React, { useEffect, useState } from 'react';
import { Coins, Cpu } from 'lucide-react';

interface ModelEntry {
  id: string;
  label: string;
  provider: string;
  isPaid: boolean;
}

const FALLBACK_MODELS: ModelEntry[] = [
  { id: 'gpt-4o',            label: 'gpt-4o',            provider: 'OpenAI',    isPaid: true  },
  { id: 'claude-3-5-sonnet', label: 'claude-3-5-sonnet', provider: 'Anthropic', isPaid: true  },
  { id: 'gemini-1.5-pro',    label: 'gemini-1.5-pro',    provider: 'Google',    isPaid: true  },
  { id: 'llama3',            label: 'llama3',             provider: 'Ollama',    isPaid: false },
];

const projects = ['CanvaPilot Demo', 'Figma Automation', 'Notion Sync', 'Jira Triage'];

export default function DropdownWindow() {
  const [type, setType] = useState<'models' | 'projects' | null>(null);
  const [modelEntries, setModelEntries] = useState<ModelEntry[]>(FALLBACK_MODELS);

  useEffect(() => {
    const fetchModels = async () => {
      const api = (window as any).electronAPI;
      if (!api) return;
      try {
        const res: ModelEntry[] = await api.invoke('get-configured-models');
        if (res && res.length > 0) setModelEntries(res);
      } catch (e) {
        console.error('get-configured-models failed', e);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (!api) return;
    api.onDropdownData((_event: any, data: { type: 'models' | 'projects' }) => {
      setType(data.type);
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') api?.hideDropdown();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (value: string) => {
    const api = (window as any).electronAPI;
    if (api && type) api.dropdownSelect({ type, value });
  };

  if (!type) return null;

  // Group models by provider
  const grouped = modelEntries.reduce<Record<string, ModelEntry[]>>((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {});

  return (
    <div className="w-full h-full bg-transparent overflow-hidden p-1">
      <div className="w-full bg-zinc-900 border border-purple-500/20 rounded-lg shadow-xl overflow-hidden flex flex-col">

        {type === 'models' && (
          <>
            <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600">Select Model</span>
              <div className="flex items-center gap-2 text-[9px] text-zinc-600">
                <span className="flex items-center gap-0.5"><Coins size={9} className="text-amber-400" /> Paid</span>
                <span className="flex items-center gap-0.5"><Cpu size={9} className="text-emerald-400" /> Free</span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-64">
              {Object.entries(grouped).map(([provider, models]) => (
                <div key={provider}>
                  {/* Provider group header */}
                  <div className="px-3 py-1 bg-white/[0.02] border-b border-white/5">
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-zinc-600">
                      {provider}
                    </span>
                  </div>
                  {models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m.id)}
                      className="w-full text-left px-3 py-1.5 text-xs transition-colors text-zinc-300 hover:bg-white/5 hover:text-white flex items-center justify-between gap-2"
                      style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
                    >
                      <span className="truncate">{m.label}</span>
                      {m.isPaid
                        ? <Coins size={10} className="shrink-0 text-amber-400" title="Paid model" />
                        : <Cpu    size={10} className="shrink-0 text-emerald-400" title="Free / local model" />
                      }
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {type === 'projects' && (
          <>
            {projects.map(p => (
              <button
                key={p}
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 text-zinc-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

