import React, { useState, Suspense } from 'react';
import { componentsRegistry } from './components/registry';
import type { ComponentCategory } from './components/registry';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown, ChevronRight, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import all raw source code from the components folder at build time
const rawCodes = import.meta.glob('../../components/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(componentsRegistry[0]?.id || 'physics-text-2');
  const [expandedCategories, setExpandedCategories] = useState<Set<ComponentCategory>>(new Set(['Typography & Text']));
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const selectedComp = componentsRegistry.find(c => c.id === selectedId);

  // Group components by category
  const grouped = componentsRegistry.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<ComponentCategory, typeof componentsRegistry>);

  const toggleCategory = (cat: ComponentCategory) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  const handleCopyCode = () => {
    if (selectedComp) {
      const code = rawCodes[`../../components/${selectedComp.filename}`] || '';
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      {/* Navbar */}
      <header className="h-14 border-b border-white/10 flex items-center px-6 flex-shrink-0 bg-[#09090b] z-10">
        <div className="flex items-center gap-3">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-sm" />
            </div>
            Motion Library
          </div>
          <a 
            href="https://github.com/swastikdahiya1-ctrl/Component-Library" 
            target="_blank" 
            rel="noreferrer" 
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 ml-1"
            title="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#09090b] overflow-y-auto flex-shrink-0 custom-scrollbar pb-10">
          <div className="p-4 flex flex-col gap-1 mt-2">
            {Object.entries(grouped).map(([category, items]) => {
              const isExpanded = expandedCategories.has(category as ComponentCategory);
              return (
                <div key={category} className="mb-2">
                  <button 
                    onClick={() => toggleCategory(category as ComponentCategory)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-zinc-100 py-2 px-3 rounded-md hover:bg-zinc-900 transition-colors"
                  >
                    {category}
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col mt-1 space-y-0.5 px-1"
                      >
                        {items.map(comp => (
                          <button
                            key={comp.id}
                            onClick={() => { setSelectedId(comp.id); setActiveTab('preview'); }}
                            className={`text-sm text-left px-3 py-1.5 rounded-md transition-colors ${
                              selectedId === comp.id 
                                ? 'bg-zinc-800 text-white font-medium' 
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                            }`}
                          >
                            {comp.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 flex flex-col bg-black relative p-6 lg:p-8 overflow-hidden min-h-0">
          {selectedComp && (
            <div className="w-full h-full max-w-6xl mx-auto flex flex-col min-h-0">
              <div className="mb-4 shrink-0">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{selectedComp.name}</h1>
                <p className="text-zinc-400 text-sm mt-1">A beautiful and interactive {selectedComp.name.toLowerCase()} built with Framer Motion and Tailwind CSS.</p>
              </div>

              <div className="border border-white/10 rounded-2xl bg-[#09090b] overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950 px-6 shrink-0">
                  <div className="flex gap-6 relative">
                    <button 
                      onClick={() => setActiveTab('preview')}
                      className={`py-3 text-sm font-medium relative transition-colors ${activeTab === 'preview' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Preview
                      {activeTab === 'preview' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab('code')}
                      className={`py-3 text-sm font-medium relative transition-colors ${activeTab === 'code' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Code
                      {activeTab === 'code' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    {activeTab === 'code' && (
                      <button 
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy Prompt'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Container */}
                <div className="w-full flex-1 relative min-h-0 flex items-center justify-center bg-black overflow-hidden group [&_.min-h-screen]:min-h-0 [&_.min-h-screen]:h-full [&_.min-h-screen]:w-full">
                  {activeTab === 'preview' ? (
                    <Suspense fallback={<div className="text-zinc-500">Loading animation...</div>}>
                      <selectedComp.component />
                    </Suspense>
                  ) : (
                    <div className="absolute inset-0 bg-[#1e1e1e] overflow-auto custom-scrollbar p-6 text-sm">
                      <SyntaxHighlighter
                        language="tsx"
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, background: 'transparent', padding: 0 }}
                        wrapLines={true}
                      >
                        {rawCodes[`../../components/${selectedComp.filename}`] || '// Source code not found.'}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
}
