import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  GraduationCap,
  GitBranch,
  Shield,
  Plus,
  Link2,
  Loader2,
  CheckCircle2,
  Clock,
  Hash,
  ExternalLink,
  Database,
  Zap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Collection {
  id: string;
  name: string;
  icon: React.ElementType;
  documentCount: number;
  lastUpdated: string;
  status: 'active' | 'syncing' | 'stale';
}

interface Document {
  id: string;
  title: string;
  source: string;
  chunkCount: number;
  dateAdded: string;
  collection: string;
}

type IngestStatus = 'idle' | 'ingesting' | 'success' | 'error';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const collections: Collection[] = [
  {
    id: 'docs',
    name: 'Documentation',
    icon: FileText,
    documentCount: 142,
    lastUpdated: '2 hours ago',
    status: 'active',
  },
  {
    id: 'tutorials',
    name: 'Tutorials',
    icon: GraduationCap,
    documentCount: 56,
    lastUpdated: '1 day ago',
    status: 'active',
  },
  {
    id: 'workflows',
    name: 'Workflows',
    icon: GitBranch,
    documentCount: 23,
    lastUpdated: '30 min ago',
    status: 'syncing',
  },
  {
    id: 'rules',
    name: 'Review Rules',
    icon: Shield,
    documentCount: 18,
    lastUpdated: '3 days ago',
    status: 'stale',
  },
];

const documents: Document[] = [
  {
    id: '1',
    title: 'Canva Design Token Reference',
    source: 'canva.dev/docs/tokens',
    chunkCount: 34,
    dateAdded: 'Jun 5, 2026',
    collection: 'docs',
  },
  {
    id: '2',
    title: 'Getting Started with CanvaPilot',
    source: 'internal/onboarding.md',
    chunkCount: 12,
    dateAdded: 'Jun 4, 2026',
    collection: 'tutorials',
  },
  {
    id: '3',
    title: 'Batch Export Workflow Spec',
    source: 'workflows/batch-export.yaml',
    chunkCount: 8,
    dateAdded: 'Jun 3, 2026',
    collection: 'workflows',
  },
  {
    id: '4',
    title: 'Brand Guideline Compliance Rules',
    source: 'rules/brand-compliance.json',
    chunkCount: 21,
    dateAdded: 'Jun 2, 2026',
    collection: 'rules',
  },
  {
    id: '5',
    title: 'Figma-to-Canva Migration Guide',
    source: 'canva.dev/docs/migration',
    chunkCount: 45,
    dateAdded: 'Jun 1, 2026',
    collection: 'docs',
  },
  {
    id: '6',
    title: 'Presentation Template Cookbook',
    source: 'tutorials/ppt-templates.md',
    chunkCount: 16,
    dateAdded: 'May 30, 2026',
    collection: 'tutorials',
  },
];

const statusConfig: Record<
  Collection['status'],
  { label: string; dotClass: string; glow: string }
> = {
  active: {
    label: 'Active',
    dotClass: 'bg-emerald-400',
    glow: 'rgba(52,211,153,0.5)',
  },
  syncing: {
    label: 'Syncing',
    dotClass: 'bg-blue-400 animate-pulse',
    glow: 'rgba(96,165,250,0.5)',
  },
  stale: {
    label: 'Stale',
    dotClass: 'bg-amber-400',
    glow: 'rgba(251,191,36,0.5)',
  },
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CollectionCard({ collection, isActive, onClick }: { collection: Collection; isActive?: boolean; onClick?: () => void }) {
  const status = statusConfig[collection.status];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, borderColor: 'rgba(168,85,247,0.25)' }}
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
        isActive ? "border-purple-500/40 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]" : "border-white/5 bg-white/[0.025]"
      )}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-purple-500/10">
            <collection.icon
              size={18}
              className="text-purple-400 group-hover:text-purple-300 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={cn('w-2 h-2 rounded-full', status.dotClass)}
              style={{ boxShadow: `0 0 6px ${status.glow}` }}
            />
            <span className="text-[10px] text-zinc-500">{status.label}</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white mb-1">
          {collection.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-zinc-500 tabular-nums">
            {collection.documentCount} documents
          </span>
          <span className="text-[10px] text-zinc-600">
            {collection.lastUpdated}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

import { Trash2 } from 'lucide-react';

function DocumentRow({ doc, onDelete }: { doc: Document; onDelete: (id: string, collection: string) => void }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 4 }}
      className="group flex items-center gap-4 px-4 py-3.5 transition-all duration-200 cursor-default hover:bg-white/[0.025] border-b border-white/[0.03] last:border-b-0"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.04] group-hover:bg-purple-500/10 transition-colors">
        <FileText
          size={14}
          className="text-zinc-500 group-hover:text-purple-400 transition-colors"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-300 group-hover:text-white truncate transition-colors">
          {doc.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-zinc-600 truncate max-w-[200px]">
            {doc.source}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
          <Hash size={10} />
          <span className="tabular-nums">{doc.chunkCount} chunks</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
          <Clock size={10} />
          <span>{doc.dateAdded}</span>
        </div>
        <button
          onClick={() => onDelete(doc.id, doc.collection)}
          className="p-1 rounded text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Delete Document"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
}

function IngestPanel() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<IngestStatus>('idle');

  const handleIngest = async () => {
    if (!url.trim()) return;
    setStatus('ingesting');
    
    try {
      const api = (window as any).electronAPI;
      if (api) {
        await api.invoke('scrape-knowledge-source', url, 'docs');
        setStatus('success');
      } else {
        throw new Error('No API');
      }
    } catch (e) {
      console.error(e);
      setStatus('error');
    }

    setTimeout(() => {
      setStatus('idle');
      setUrl('');
      // Trigger a refresh event for the stats
      window.dispatchEvent(new Event('knowledge-updated'));
    }, 2000);
  };

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-white/5 p-5 space-y-4"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="flex items-center gap-2">
        <Database size={14} className="text-purple-400/80" />
        <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
          Ingest Document
        </h3>
      </div>

      <div className="space-y-3">
        {/* URL Input */}
        <div className="relative">
          <Link2
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIngest()}
            placeholder="Paste URL (e.g., https://canva.dev/docs/)"
            className={cn(
              'w-full bg-white/[0.03] border border-white/5 rounded-xl pl-9 pr-4 py-2.5',
              'text-sm text-zinc-300 placeholder:text-zinc-600',
              'focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20',
              'transition-all duration-200',
            )}
          />
        </div>

        <p className="text-[10px] text-zinc-500 leading-relaxed px-1">
          Provide a link to a documentation page, GitHub markdown file, or API reference. The system will launch a headless browser, scrape the content, and vectorize it into ChromaDB for semantic retrieval.
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              console.log('[IngestPanel] Add Document dialog triggered')
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-white/10 text-zinc-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200"
          >
            <Plus size={13} />
            Add Document
          </button>

          <button
            onClick={handleIngest}
            disabled={!url.trim() || status === 'ingesting'}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-200',
              url.trim() && status !== 'ingesting'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50'
                : 'bg-white/5 text-zinc-600 cursor-not-allowed',
            )}
          >
            {status === 'ingesting' ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Ingesting…
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 size={13} />
                Done!
              </>
            ) : (
              <>
                <Zap size={13} />
                Ingest
              </>
            )}
          </button>
        </div>

        {/* Status bar */}
        <AnimatePresence>
          {status === 'ingesting' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1.5">
                Chunking and embedding document…
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function KnowledgeBaseView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [realDocs, setRealDocs] = useState<Document[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>('docs');

  const fetchStats = async (collectionId: string) => {
    const api = (window as any).electronAPI;
    if (api?.invoke) {
      try {
        const resStats = await api.invoke('get-db-stats');
        setStats(resStats);
        
        const docs = await api.invoke('get-documents', collectionId);
        setRealDocs(docs || []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteDoc = async (id: string, collection: string) => {
    const api = (window as any).electronAPI;
    if (api?.invoke) {
      await api.invoke('delete-document', collection, id);
      fetchStats(activeCollection);
    }
  };

  React.useEffect(() => {
    fetchStats(activeCollection);
    const handleUpdate = () => fetchStats(activeCollection);
    window.addEventListener('knowledge-updated', handleUpdate);
    return () => window.removeEventListener('knowledge-updated', handleUpdate);
  }, [activeCollection]);

  const dynamicCollections = useMemo(() => {
    return collections.map(c => {
      const count = stats?.chroma?.collectionsCount?.[c.id] || 0;
      return {
        ...c,
        documentCount: count,
        status: count > 0 ? 'active' as const : 'stale' as const
      };
    });
  }, [stats]);

  const filteredCollections = useMemo(
    () =>
      dynamicCollections.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, dynamicCollections],
  );

  const displayDocuments = useMemo(() => {
    // Use real docs from ChromaDB if available, otherwise fall back to mock data for the active collection
    const source = realDocs.length > 0
      ? realDocs
      : documents.filter(d => d.collection === activeCollection);

    return source.filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.source.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, realDocs, activeCollection]);

  const activeCollectionName = collections.find(c => c.id === activeCollection)?.name || 'Documents';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 max-w-6xl mx-auto space-y-8"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-300">
            Knowledge Base
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your RAG collections and embedded documents
          </p>
          {stats?.chroma?.path && (
            <p className="text-[10px] font-mono text-zinc-600 mt-2">
              Local Storage: {stats.chroma.path}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Search ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className={cn(
            'w-full bg-white/[0.025] border border-white/5 rounded-2xl pl-11 pr-4 py-3',
            'text-sm text-zinc-300 placeholder:text-zinc-600',
            'focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20',
            'transition-all duration-200',
          )}
        />
      </motion.div>

      {/* ── Main grid: collections + documents | ingest ────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Collections Grid */}
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
              Collections
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    isActive={activeCollection === collection.id}
                    onClick={() => setActiveCollection(collection.id)}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-sm text-zinc-600">
                  No collections match "{searchQuery}"
                </div>
              )}
            </motion.div>
          </div>

          {/* Document List */}
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
              Documents — <span className="text-purple-400">{activeCollectionName}</span>
            </h2>
            <div
              className="rounded-2xl border border-white/5 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.015)' }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={activeCollection}
              >
                <div className="flex flex-col">
                  {displayDocuments.length > 0 ? (
                    displayDocuments.map((doc) => (
                      <DocumentRow key={doc.id} doc={doc} onDelete={handleDeleteDoc} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-sm text-zinc-600">
                      {searchQuery
                        ? `No documents match "${searchQuery}"`
                        : `No documents in ${activeCollectionName} yet. Use the ingest panel to add some.`}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right column — Ingest Panel */}
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
            Ingest
          </h2>
          <IngestPanel />
        </div>
      </div>
    </motion.div>
  );
}
