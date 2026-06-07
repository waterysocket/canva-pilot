import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Bot,
  User,
  Sparkles,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  Wand2,
  Presentation,
  Palette,
  Type,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Provider = 'gemini' | 'openai' | 'claude' | 'ollama';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status?: 'success' | 'error' | 'info' | 'step';
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PROVIDERS: { value: Provider; label: string }[] = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'claude', label: 'Claude' },
  { value: 'ollama', label: 'Ollama' },
];

const SUGGESTIONS = [
  { icon: Presentation, text: 'Export as PPT', color: 'from-purple-500 to-blue-500' },
  { icon: Type, text: 'Replace all blue headings', color: 'from-blue-500 to-cyan-500' },
  { icon: Palette, text: 'Apply company branding', color: 'from-pink-500 to-purple-500' },
  { icon: Wand2, text: 'Auto-layout all slides', color: 'from-amber-500 to-orange-500' },
];

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */

let _msgId = 0;
const uid = () => `msg-${Date.now()}-${++_msgId}`;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Animated typing / thinking dots */
function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-start gap-3 px-5 py-2"
    >
      <div className="mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/30">
        <Bot size={14} className="text-white" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5"
        style={{ background: 'rgba(255,255,255,0.025)' }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-purple-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** Single chat bubble */
function MessageBubble({ message }: { message: Message }) {
  if (message.role === 'system') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="flex justify-center px-5 py-1"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 text-[11px] text-zinc-500 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <Info size={11} className="text-zinc-600" />
          {message.content}
        </div>
      </motion.div>
    );
  }

  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSuccess = message.status === 'success';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={cn('flex items-end gap-2.5 px-5 py-1', isUser ? 'justify-end' : 'justify-start')}
    >
      {/* Agent avatar */}
      {!isUser && (
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-lg mb-0.5',
          isError
            ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-900/30'
            : isSuccess
              ? 'bg-gradient-to-br from-emerald-600 to-green-700 shadow-green-900/30'
              : 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-purple-900/30'
        )}>
          {isError ? <XCircle size={13} className="text-white" /> :
            isSuccess ? <CheckCircle2 size={13} className="text-white" /> :
              <Bot size={14} className="text-white" />}
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'rounded-2xl rounded-br-sm text-white shadow-lg shadow-purple-900/20'
            : 'rounded-2xl rounded-tl-sm border text-zinc-200 shadow-sm',
          !isUser && isError && 'border-red-500/20',
          !isUser && isSuccess && 'border-emerald-500/20',
          !isUser && !isError && !isSuccess && 'border-white/5',
        )}
        style={
          isUser
            ? { background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)' }
            : { background: 'rgba(255,255,255,0.025)' }
        }
      >
        {message.content}
        <div className={cn(
          'text-[10px] mt-1.5 tabular-nums',
          isUser ? 'text-purple-200/50 text-right' : 'text-zinc-600',
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-lg mb-0.5"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
        >
          <User size={13} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

/** Empty state with suggestion chips */
function EmptyState({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex-1 flex flex-col items-center justify-center px-6 select-none"
    >
      {/* Glowing orb */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-to-br from-purple-500 to-blue-500" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center backdrop-blur-sm">
          <Sparkles size={30} className="text-purple-400" />
        </div>
      </div>

      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 mb-2">
        What can I help you with?
      </h2>
      <p className="text-sm text-zinc-500 max-w-xs text-center mb-8">
        Describe any task and CanvaPilot will automate it for you in real time.
      </p>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestion(s.text)}
            className="group flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-white/5 hover:border-purple-500/25 transition-all duration-300 text-left"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className={cn(
              'w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity',
              s.color,
            )}>
              <s.icon size={13} className="text-white" />
            </div>
            <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-tight">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main View                                                          */
/* ------------------------------------------------------------------ */

export default function AgentConsoleView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<Provider>('gemini');
  const [showProviders, setShowProviders] = useState(false);
  const [thinking, setThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const providerRef = useRef<HTMLDivElement>(null);

  /* ---------- auto-scroll ---------- */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, scrollToBottom]);

  /* ---------- close provider dropdown on outside click ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
        setShowProviders(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ---------- task-event listener ---------- */
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (!api?.onTaskEvent) return;

    api.onTaskEvent((_event: any, data: any) => {
      switch (data?.type) {
        case 'started':
          setMessages((prev) => [
            ...prev,
            { id: uid(), role: 'system', content: 'Task started…', timestamp: new Date(), status: 'info' },
          ]);
          break;

        case 'updated':
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: 'agent',
              content: data?.currentStep?.action || 'Processing…',
              timestamp: new Date(),
              status: 'step',
            },
          ]);
          break;

        case 'completed':
          setThinking(false);
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: 'agent',
              content: 'Task completed successfully.',
              timestamp: new Date(),
              status: 'success',
            },
          ]);
          break;

        case 'failed':
          setThinking(false);
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: 'agent',
              content: data?.error || 'Something went wrong. Please try again.',
              timestamp: new Date(),
              status: 'error',
            },
          ]);
          break;

        default:
          break;
      }
    });
  }, []);

  /* ---------- submit handler ---------- */
  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    // 1. user bubble
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'user', content: text, timestamp: new Date() },
    ]);
    setInput('');
    setThinking(true);

    // 2. call backend
    const api = (window as any).electronAPI;
    if (api?.startTask) {
      api.startTask(text, provider).catch((err: any) => {
        setThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'agent',
            content: `Failed to start task: ${err?.message || err}`,
            timestamp: new Date(),
            status: 'error',
          },
        ]);
      });
    }
  }, [input, provider]);

  const handleSuggestion = useCallback((text: string) => {
    setInput(text);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const isEmpty = messages.length === 0;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col h-full relative">
      {/* ---- Header ---- */}
      <div className="shrink-0 px-6 pt-2 pb-3 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center">
          <Bot size={15} className="text-purple-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Agent Console
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">AI Command Interface</p>
        </div>

        {/* Right-side status pill */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/5 text-[10px] text-zinc-500"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              thinking ? 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400/50' : 'bg-emerald-400 shadow-sm shadow-emerald-400/50',
            )} />
            {thinking ? 'Processing' : 'Ready'}
          </div>
        </div>
      </div>

      {/* ---- Message Area ---- */}
      {isEmpty ? (
        <EmptyState onSuggestion={handleSuggestion} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-1.5 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          <AnimatePresence>{thinking && <ThinkingIndicator />}</AnimatePresence>
        </div>
      )}

      {/* ---- Input Bar ---- */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/5 focus-within:border-purple-500/30 transition-colors duration-300"
          style={{ background: 'rgba(255,255,255,0.025)' }}
        >
          {/* Provider Pill */}
          <div className="relative" ref={providerRef}>
            <button
              onClick={() => setShowProviders((p) => !p)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-400 hover:text-purple-300 border border-white/5 hover:border-purple-500/25 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {PROVIDERS.find((p) => p.value === provider)?.label}
              <ChevronDown size={10} className={cn('transition-transform duration-200', showProviders && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {showProviders && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 mb-2 w-32 rounded-xl border border-white/5 overflow-hidden shadow-2xl shadow-black/60 z-50"
                  style={{ background: '#15151f' }}
                >
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => { setProvider(p.value); setShowProviders(false); }}
                      className={cn(
                        'w-full text-left px-3.5 py-2 text-xs transition-colors duration-150',
                        provider === p.value
                          ? 'text-purple-300 bg-purple-500/10 font-medium'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200',
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell CanvaPilot what to do..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none py-1"
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || thinking}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0',
              input.trim() && !thinking
                ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-105 active:scale-95'
                : 'bg-white/5 text-zinc-600 cursor-not-allowed',
            )}
          >
            <ArrowUp size={15} />
          </button>
        </div>

        {/* Subtle disclaimer */}
        <p className="text-center text-[10px] text-zinc-700 mt-2 select-none">
          CanvaPilot may make mistakes. Verify important actions.
        </p>
      </div>
    </div>
  );
}
