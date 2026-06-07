import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, HardDrive, FileText, LayoutList } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function StorageView() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api) {
      api.invoke('get-db-stats').then((res: any) => setStats(res)).catch(console.error);
    }
  }, []);
  return (
    <div className="p-8 text-white min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 mb-2">
          System Storage
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl">
          A high-level overview of the local databases powering CanvaPilot. 
          All your data is securely stored on your own device and is never sent to the cloud.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQLite Database */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/5 overflow-hidden flex flex-col"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/10">
                <LayoutList size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Task History (SQLite)</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                  <Database size={10} />
                  <span>better-sqlite3</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              This relational database stores all your past task executions, agent plans, and automation logs. 
              It allows you to review exactly what the AI did during each session.
            </p>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", (stats?.sqlite?.tasksCount || 0) > 0 ? "bg-blue-500/10" : "bg-white/[0.03]")}>
              <Database size={24} className={(stats?.sqlite?.tasksCount || 0) > 0 ? "text-blue-400" : "text-zinc-600"} />
            </div>
            <h3 className="text-base font-semibold text-zinc-300 mb-1">{(stats?.sqlite?.tasksCount || 0) > 0 ? 'Database Active' : 'Database is empty'}</h3>
            <p className="text-xs text-zinc-500 max-w-[250px]">
              {(stats?.sqlite?.tasksCount || 0) > 0 ? `Stored ${stats?.sqlite?.tasksCount} task records successfully.` : 'No tasks have been executed yet. Try running your first automation in the Agent Console.'}
            </p>
            {stats?.sqlite?.path && (
              <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Local Storage Location</span>
                <p className="text-[9px] font-mono text-zinc-600 break-all px-4 bg-white/[0.02] py-2 rounded-lg border border-white/5">
                  {stats.sqlite.path}
                </p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span>Size: Dynamic</span>
            <span>{stats?.sqlite?.tasksCount || 0} Records</span>
          </div>
        </motion.div>

        {/* ChromaDB Vector Store */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-white/5 overflow-hidden flex flex-col"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/10">
                <FileText size={20} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Knowledge Engine (ChromaDB)</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                  <HardDrive size={10} />
                  <span>Vector Embeddings</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              This vector database stores "embeddings" — mathematical representations of text. 
              It powers the RAG system, allowing the agent to semantically search through documentation and workflows.
            </p>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", (stats?.chroma?.vectorsCount || 0) > 0 ? "bg-purple-500/10" : "bg-white/[0.03]")}>
              <FileText size={24} className={(stats?.chroma?.vectorsCount || 0) > 0 ? "text-purple-400" : "text-zinc-600"} />
            </div>
            <h3 className="text-base font-semibold text-zinc-300 mb-1">{(stats?.chroma?.vectorsCount || 0) > 0 ? 'Vectors Stored' : 'No embeddings found'}</h3>
            <p className="text-xs text-zinc-500 max-w-[250px]">
              {(stats?.chroma?.vectorsCount || 0) > 0 ? `ChromaDB currently holds ${stats?.chroma?.vectorsCount} vector embeddings.` : 'The vector store is currently empty. Head over to the Knowledge Base to ingest documents.'}
            </p>
            {stats?.chroma?.path && (
              <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Local Storage Location</span>
                <p className="text-[9px] font-mono text-zinc-600 break-all px-4 bg-white/[0.02] py-2 rounded-lg border border-white/5">
                  {stats.chroma.path}
                </p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span>Size: Dynamic</span>
            <span>{stats?.chroma?.vectorsCount || 0} Vectors</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
