import { useState } from 'react';
import { Link } from 'react-router-dom';
import { componentsRegistry, type ComponentSource } from '../components/registry';

export default function LibraryGrid() {
  const [filter, setFilter] = useState<ComponentSource | 'all'>('all');

  const filteredComponents = componentsRegistry.filter(
    (c) => filter === 'all' || c.source === filter
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md pb-6 pt-4 border-b border-white/10 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Component Library</h1>
        
        <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
          {(['all', 'aceternity', 'magicui', 'custom'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-white text-black' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredComponents.map((component) => (
            <Link 
              key={component.id} 
              to={`/preview/${component.id}`}
              className="group relative flex flex-col items-center justify-center p-8 h-48 bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-zinc-800 hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <span className="text-xs font-mono text-zinc-500 mb-2 uppercase tracking-widest">
                {component.source}
              </span>
              <h2 className="text-lg font-semibold text-center text-zinc-200 group-hover:text-white">
                {component.name}
              </h2>
            </Link>
          ))}
        </div>
        
        {filteredComponents.length === 0 && (
          <div className="text-center text-zinc-500 mt-20">
            No components found for this category.
          </div>
        )}
      </main>
    </div>
  );
}
