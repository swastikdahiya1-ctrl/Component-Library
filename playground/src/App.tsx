import React, { useState, Suspense } from 'react';
import { componentsRegistry } from './components/registry';
import type { ComponentCategory } from './components/registry';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronDown, ChevronRight, Github, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import all raw source code from the components folder at build time
const rawCodes = import.meta.glob('../../components/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export default function App() {
  const [selectedId, setSelectedId] = useState<string>('split-text-scatter');
  const [expandedCategories, setExpandedCategories] = useState<Set<ComponentCategory>>(new Set(['Text Animations']));
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
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0 bg-[#09090b] z-10">
        <div className="flex items-center gap-6">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-sm" />
            </div>
            Motion Library
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-zinc-400 font-medium ml-4">
            <a href="#" className="text-white">Components</a>
            <a href="#" className="hover:text-white transition-colors">Showcase</a>
            <a href="#" className="hover:text-white transition-colors">Tools</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="bg-zinc-900 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 text-zinc-300 w-64 transition-all"
            />
          </div>
          <a href="https://github.com/swastikdahiya1-ctrl/Component-Library" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
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
        <main className="flex-1 overflow-y-auto bg-black relative custom-scrollbar">
          {selectedComp && (
            <div className="max-w-6xl mx-auto p-8 lg:p-12 pb-24">
              <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">{selectedComp.name}</h1>
                <p className="text-zinc-400 text-lg">A beautiful and interactive {selectedComp.name.toLowerCase()} built with Framer Motion and Tailwind CSS.</p>
              </div>

              <div className="border border-white/10 rounded-2xl bg-[#09090b] overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950 px-6">
                  <div className="flex gap-6 relative">
                    <button 
                      onClick={() => setActiveTab('preview')}
                      className={`py-4 text-sm font-medium relative transition-colors ${activeTab === 'preview' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Preview
                      {activeTab === 'preview' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab('code')}
                      className={`py-4 text-sm font-medium relative transition-colors ${activeTab === 'code' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
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
                <div className="w-full relative min-h-[600px] max-h-[800px] flex items-center justify-center bg-black overflow-hidden group">
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

              {/* Props / Future Customization Area */}
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-white tracking-tight">Customize</h2>
                <div className="border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/50">
                  <p>Interactive props mapping coming soon.</p>
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
