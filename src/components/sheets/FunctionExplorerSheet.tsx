import React, { useState, useMemo } from 'react';
import { FunctionRegistry } from '../../model/functionRegistry';
import { X, Search, CheckCircle, HelpCircle } from 'lucide-react';

interface FunctionExplorerSheetProps {
  onInsertToken: (token: string) => void;
  onDismiss: () => void;
}

export const FunctionExplorerSheet: React.FC<FunctionExplorerSheetProps> = ({
  onInsertToken,
  onDismiss,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    FunctionRegistry.allFunctions.forEach((f) => set.add(f.category));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredFunctions = useMemo(() => {
    return FunctionRegistry.allFunctions.filter((fn) => {
      const matchesCategory = selectedCategory === 'All' || fn.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        q === '' ||
        fn.name.toLowerCase().includes(q) ||
        fn.notation.toLowerCase().includes(q) ||
        fn.id.toLowerCase().includes(q) ||
        fn.accessPath.toLowerCase().includes(q) ||
        fn.expectedBehavior.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-xl h-[88vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Master Function Explorer</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-semibold">
                {FunctionRegistry.totalCount} Functions
              </span>
            </h2>
            <p className="text-xs text-slate-400">Comprehensive Scientific Function Catalog</p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-slate-800 bg-slate-950">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, notation (e.g. sin, Pol, integrate, c, h)..."
              className="w-full bg-slate-850 border border-slate-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
            />
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex overflow-x-auto space-x-1.5 p-2 bg-slate-950 border-b border-slate-800 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Functions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredFunctions.map((fn) => (
            <div
              key={fn.id}
              onClick={() => {
                onInsertToken(fn.notation);
                onDismiss();
              }}
              className="p-3 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 border border-slate-750 hover:border-slate-600 rounded-xl cursor-pointer transition flex flex-col space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sky-400 text-base bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {fn.notation}
                  </span>
                  <span className="text-xs font-bold text-white">{fn.name}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                    Insert
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300">{fn.expectedBehavior}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500">Access:</span>
                <span className="text-amber-400/90 font-medium">{fn.accessPath}</span>
                {fn.testCase && (
                  <span className="text-slate-500 ml-auto text-[10px]">
                    Test: <code className="text-slate-300">{fn.testCase}</code> = <code className="text-emerald-400">{fn.testExpected}</code>
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredFunctions.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No matching functions found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
