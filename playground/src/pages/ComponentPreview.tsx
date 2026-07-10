import { useParams, Link } from 'react-router-dom';
import { Suspense } from 'react';
import { componentsRegistry } from '../components/registry';
import { ArrowLeft } from 'lucide-react';

export default function ComponentPreview() {
  const { id } = useParams<{ id: string }>();
  
  const componentEntry = componentsRegistry.find((c) => c.id === id);

  if (!componentEntry) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Component Not Found</h1>
        <Link to="/" className="text-zinc-400 hover:text-white underline">
          Return to Library
        </Link>
      </div>
    );
  }

  const Component = componentEntry.component;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md p-4 border-b border-white/10 flex items-center gap-4">
        <Link 
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Grid
        </Link>
        <div className="h-4 w-px bg-white/20 mx-2" />
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          {componentEntry.source}
        </span>
        <h1 className="text-lg font-semibold text-white">
          {componentEntry.name}
        </h1>
      </header>
      
      <main className="flex-1 relative overflow-hidden bg-zinc-950">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-zinc-500">Loading component...</div>}>
          <Component />
        </Suspense>
      </main>
    </div>
  );
}
