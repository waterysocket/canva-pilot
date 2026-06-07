import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, CheckCircle2, Loader2, PlayCircle, Eye, BrainCircuit } from 'lucide-react';
import { useAgentStore, ThoughtStage } from '../../store/useAgentStore';
import { cn } from '../../lib/utils';

export default function AgentChat() {
  const { messages, currentStage, isProcessing, progress } = useAgentStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStage, progress]);

  const StageIcon = ({ stage }: { stage: ThoughtStage }) => {
    switch (stage) {
      case 'observe': return <Eye size={14} className="text-blue-400" />;
      case 'plan': return <BrainCircuit size={14} className="text-purple-400" />;
      case 'execute': return <PlayCircle size={14} className="text-yellow-400" />;
      case 'verify': return <CheckCircle2 size={14} className="text-green-400" />;
      case 'complete': return <CheckCircle2 size={14} className="text-green-500" />;
      default: return <Loader2 size={14} className="animate-spin text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-[420px] bg-black/40">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 text-sm",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
              msg.role === 'user' ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-lg p-3",
              msg.role === 'user' ? "bg-primary/10 text-foreground" : "bg-white/5 text-foreground"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-3 text-sm flex-row"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary shrink-0">
              <Bot size={16} />
            </div>
            <div className="flex-1 max-w-[80%] rounded-lg p-3 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2 font-medium text-xs uppercase tracking-wider text-muted-foreground">
                <StageIcon stage={currentStage} />
                <span>{currentStage}</span>
                <span className="ml-auto text-[10px]">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1 mb-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                Working on it...
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
