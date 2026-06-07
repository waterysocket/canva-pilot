import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Monitor,
  Shield,
  Info,
  ChevronDown,
  Sparkles,
  Brain,
  MessageSquare,
  Globe as GlobeIcon,
  Server,
  Zap,
  ExternalLink,
  GitBranch,
  Heart,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Animated Toggle Switch                                             */
/* ------------------------------------------------------------------ */

function Toggle({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30',
        disabled && 'opacity-40 cursor-not-allowed',
        enabled ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white/10',
      )}
    >
      <motion.div
        className="inline-block h-4 w-4 rounded-full bg-white shadow-md"
        animate={{ x: enabled ? 22 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      {enabled && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            boxShadow: '0 0 12px 2px rgba(139, 92, 246, 0.3)',
          }}
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Select Dropdown                                             */
/* ------------------------------------------------------------------ */

function SelectDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; icon?: React.ElementType }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-500 mb-2">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-white border border-white/5 hover:border-purple-500/30 focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all duration-200"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center gap-2">
          {selected?.icon && <selected.icon size={14} className="text-purple-400/70" />}
          <span>{selected?.label ?? 'Select…'}</span>
        </div>
        <ChevronDown
          size={14}
          className={cn('text-zinc-500 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
            style={{ background: '#18181b' }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors',
                  opt.value === value
                    ? 'bg-purple-600/15 text-purple-300'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white',
                )}
              >
                {opt.icon && <opt.icon size={14} className="text-zinc-500" />}
                {opt.label}
                {opt.value === value && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slider Component                                                   */
/* ------------------------------------------------------------------ */

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">{label}</label>
        <span className="text-sm font-semibold text-white tabular-nums">
          {value}
          <span className="text-zinc-500 font-normal ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-6 opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-md shadow-purple-900/30 border-2 border-purple-500 pointer-events-none transition-all duration-150"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Card Wrapper                                               */
/* ------------------------------------------------------------------ */

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-white/5 hover:border-purple-500/15 transition-all duration-500"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      <div className="p-6">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-purple-500/10">
            <Icon size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-[11px] text-zinc-500">{description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5">{children}</div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Setting Row (label + control)                                      */
/* ------------------------------------------------------------------ */

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-200 font-medium">{label}</div>
        {description && <div className="text-[11px] text-zinc-600 mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provider & model options                                           */
/* ------------------------------------------------------------------ */

const PROVIDER_OPTIONS = [
  { value: 'gemini', label: 'Google Gemini', icon: Sparkles },
  { value: 'openai', label: 'OpenAI', icon: Brain },
  { value: 'claude', label: 'Anthropic Claude', icon: MessageSquare },
  { value: 'openrouter', label: 'OpenRouter', icon: GlobeIcon },
  { value: 'ollama', label: 'Ollama (Local)', icon: Server },
];

const MODEL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  gemini: [
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  ],
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'o3', label: 'o3' },
  ],
  claude: [
    { value: 'claude-sonnet-4', label: 'Claude Sonnet 4' },
    { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  ],
  openrouter: [
    { value: 'auto', label: 'Auto (Best Available)' },
    { value: 'openrouter/optimus', label: 'Optimus' },
  ],
  ollama: [
    { value: 'llama3', label: 'Llama 3' },
    { value: 'codellama', label: 'Code Llama' },
    { value: 'mistral', label: 'Mistral' },
  ],
};

const BROWSER_OPTIONS = [
  { value: 'chrome', label: 'Google Chrome', icon: Monitor },
  { value: 'edge', label: 'Microsoft Edge', icon: Monitor },
];

/* ------------------------------------------------------------------ */
/*  Main SettingsView                                                  */
/* ------------------------------------------------------------------ */

export default function SettingsView() {
  /* General */
  const [defaultProvider, setDefaultProvider] = useState('gemini');
  const [defaultModel, setDefaultModel] = useState('gemini-2.5-flash');

  /* Automation */
  const [browser, setBrowser] = useState('chrome');
  const [screenshotQuality, setScreenshotQuality] = useState(80);

  /* Privacy */
  const [storeLogs, setStoreLogs] = useState(true);
  const [sendUsageData, setSendUsageData] = useState(false);

  const handleProviderChange = useCallback((provider: string) => {
    setDefaultProvider(provider);
    const models = MODEL_OPTIONS[provider];
    if (models && models.length > 0) {
      setDefaultModel(models[0].value);
    }
  }, []);

  const currentModelOptions = MODEL_OPTIONS[defaultProvider] ?? [];

  return (
    <div className="p-8 text-white min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 mb-2">
          Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Configure your CanvaPilot experience. Changes are saved locally.
        </p>
      </motion.div>

      {/* Settings sections */}
      <div className="space-y-5 max-w-3xl">
        {/* ─── General ──────────────────────────────────────────── */}
        <SectionCard
          icon={Settings}
          title="General"
          description="Default AI provider and model configuration"
          delay={0}
        >
          <SelectDropdown
            label="Default Provider"
            value={defaultProvider}
            options={PROVIDER_OPTIONS}
            onChange={handleProviderChange}
          />
          <SelectDropdown
            label="Default Model"
            value={defaultModel}
            options={currentModelOptions}
            onChange={setDefaultModel}
          />
        </SectionCard>

        {/* ─── Automation ───────────────────────────────────────── */}
        <SectionCard
          icon={Zap}
          title="Automation"
          description="Browser and screenshot configuration"
          delay={0.08}
        >
          <SelectDropdown
            label="Browser Preference"
            value={browser}
            options={BROWSER_OPTIONS}
            onChange={setBrowser}
          />
          <Slider
            label="Screenshot Quality"
            value={screenshotQuality}
            min={10}
            max={100}
            step={5}
            unit="%"
            onChange={setScreenshotQuality}
          />
        </SectionCard>

        {/* ─── Privacy & Security ───────────────────────────────── */}
        <SectionCard
          icon={Shield}
          title="Privacy & Security"
          description="Control data storage and telemetry"
          delay={0.16}
        >
          <SettingRow
            label="Store Execution Logs"
            description="Keep a local record of all automation runs"
          >
            <Toggle enabled={storeLogs} onChange={setStoreLogs} />
          </SettingRow>

          <div className="h-px bg-white/5" />

          <SettingRow
            label="Send Anonymous Usage Data"
            description="Help improve CanvaPilot with anonymized analytics"
          >
            <Toggle enabled={sendUsageData} onChange={setSendUsageData} />
          </SettingRow>
        </SectionCard>

        {/* ─── About ────────────────────────────────────────────── */}
        <SectionCard
          icon={Info}
          title="About"
          description="Application information"
          delay={0.24}
        >
          <div className="space-y-4">
            {/* App info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">CanvaPilot</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    v0.1.0-alpha
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    Developer Edition
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Tech stack badges */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-500 mb-2.5">
                Built With
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 hover:border-purple-500/20"
              >
                <GitBranch size={16} />
                GitHub
                <ExternalLink size={10} className="opacity-50" />
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 hover:border-purple-500/20"
              >
                <ExternalLink size={13} />
                Documentation
              </a>
            </div>

            <p className="text-[11px] text-zinc-600 flex items-center gap-1">
              Made with <Heart size={10} className="text-pink-500" /> for desktop AI automation
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
