import React from 'react';
import { motion } from 'framer-motion';
import { Database, HardDrive, FileText, LayoutList } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function StorageView() {
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
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <Database size={24} className="text-zinc-600" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300 mb-1">Database is empty</h3>
            <p className="text-xs text-zinc-500 max-w-[250px]">
              No tasks have been executed yet. Try running your first automation in the Agent Console.
            </p>
          </div>
          
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span>Size: 0 MB</span>
            <span>0 Records</span>
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
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <FileText size={24} className="text-zinc-600" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300 mb-1">No embeddings found</h3>
            <p className="text-xs text-zinc-500 max-w-[250px]">
              The vector store is currently empty. Head over to the Knowledge Base to ingest documents.
            </p>
          </div>
          
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span>Size: 0 MB</span>
            <span>0 Vectors</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
