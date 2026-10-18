import React, { useState } from 'react';
import { CalculatorApp } from '../../model/calculatorSettings';
import { FunctionRegistry } from '../../model/functionRegistry';
import { X, Search } from 'lucide-react';

interface CatalogSheetProps {
  activeApp: CalculatorApp;
  onInsertToken: (token: string) => void;
  onDismiss: () => void;
}

export const CatalogSheet: React.FC<CatalogSheetProps> = ({
  activeApp,
  onInsertToken,
  onDismiss,
}) => {
  const categories = [
    'Arithmetic',
    'Powers & Roots',
    'Trigonometry',
    'Hyperbolic',
    'Logarithms',
    'Calculus',
    'Combinatorics',
    'Numeric',
    'Scientific Constants',
    'Unit Conversion',
    'Engineering Symbols',
  ];

  const [selectedCat, setSelectedCat] = useState(categories[0]);
  const [query, setQuery] = useState('');

  const items = FunctionRegistry.allFunctions.filter((fn) => {
    const matchesCat = fn.category === selectedCat;
    const matchesQuery = query === '' ||
      fn.name.toLowerCase().includes(query.toLowerCase()) ||
      fn.notation.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg h-[80vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">CATALOG</h2>
            <p className="text-xs text-slate-400">Context-sensitive function registry</p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-950">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search category functions..."
              className="w-full bg-slate-850 border border-slate-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
            />
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex overflow-x-auto space-x-1 p-2 bg-slate-950 border-b border-slate-800 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Function Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.map((fn) => (
            <div
              key={fn.id}
              onClick={() => {
                onInsertToken(fn.notation.includes('(') ? fn.notation : `${fn.notation}`);
                onDismiss();
              }}
              className="p-2.5 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 border border-slate-750 hover:border-slate-600 rounded-xl flex items-center justify-between cursor-pointer transition"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sky-400 text-sm">
                    {fn.notation}
                  </span>
                  <span className="text-xs text-white font-medium">{fn.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{fn.expectedBehavior}</p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Insert
              </span>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No functions found matching query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
