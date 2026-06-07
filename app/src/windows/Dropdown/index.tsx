import React, { useEffect, useState } from 'react';

const models = ['Gemini 3.1 Pro', 'Qwen2.5-VL-7B', 'Claude 3.5 Sonnet', 'GPT-4o'];
const projects = ['CanvaPilot Demo', 'Figma Automation', 'Notion Sync', 'Jira Triage'];

export default function DropdownWindow() {
  const [type, setType] = useState<'models' | 'projects' | null>(null);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api) {
      api.onDropdownData((event: any, data: { type: 'models' | 'projects' }) => {
        setType(data.type);
      });
    }

    // Add escape key listener to hide dropdown
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        api?.hideDropdown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (value: string) => {
    const api = (window as any).electronAPI;
    if (api && type) {
      api.dropdownSelect({ type, value });
    }
  };

  if (!type) return null;

  return (
    <div className="w-full h-full bg-transparent overflow-hidden p-1">
      <div className="w-full bg-zinc-900 border border-purple-500/20 rounded-lg shadow-xl overflow-hidden flex flex-col">
        {type === 'models' && (
          <>
            <div className="px-3 py-1.5 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600">Select Model</span>
            </div>
            {models.map(m => (
              <button 
                key={m} 
                onClick={() => handleSelect(m)} 
                className="w-full text-left px-3 py-2 text-xs transition-colors text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
              >
                {m}
              </button>
            ))}
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
