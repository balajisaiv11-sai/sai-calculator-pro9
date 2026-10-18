import React, { useState } from 'react';
import { X, Database, ArrowRight } from 'lucide-react';

interface VariableInspectorSheetProps {
  variables: Record<string, number>;
  ans: number;
  onInsertVariable: (v: string) => void;
  onStoreToVariable: (v: string, val: number) => void;
  onDismiss: () => void;
}

export const VariableInspectorSheet: React.FC<VariableInspectorSheetProps> = ({
  variables,
  ans,
  onInsertVariable,
  onStoreToVariable,
  onDismiss,
}) => {
  const varKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z'];
  const [storeTarget, setStoreTarget] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');

  const handleStore = (v: string) => {
    const val = customValue ? parseFloat(customValue) || 0 : ans;
    onStoreToVariable(v, val);
    setStoreTarget(null);
    setCustomValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white">Variables &amp; Memory (RCL / STO)</h2>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto font-mono text-xs">
          {/* Ans Banner */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400">Ans (Answer Memory):</span>
              <p className="text-xl font-bold text-white mt-0.5">{ans}</p>
            </div>
            <button
              onClick={() => {
                onInsertVariable('Ans');
                onDismiss();
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold"
            >
              Recall Ans
            </button>
          </div>

          <p className="text-xs text-slate-400 font-sans font-semibold pt-1">
            Registered Variables:
          </p>

          {/* Grid of Variables */}
          <div className="grid grid-cols-3 gap-2">
            {varKeys.map((v) => {
              const val = variables[v] ?? 0.0;
              return (
                <div
                  key={v}
                  className="bg-slate-850 p-2.5 rounded-xl border border-slate-750 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-base font-bold text-sky-400">{v}</span>
                    <span className="text-[10px] text-slate-400">Var</span>
                  </div>
                  <span className="text-sm font-semibold text-white truncate my-1">
                    {val}
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <button
                      onClick={() => {
                        onInsertVariable(v);
                        onDismiss();
                      }}
                      className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-sans font-medium"
                    >
                      RCL
                    </button>
                    <button
                      onClick={() => setStoreTarget(v)}
                      className="flex-1 py-1 rounded bg-amber-700/40 hover:bg-amber-600/50 text-amber-300 text-[10px] font-sans font-medium border border-amber-600/40"
                    >
                      STO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Store Dialog Popup if selected */}
          {storeTarget && (
            <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2">
              <p className="text-xs text-amber-300 font-sans font-semibold">
                Store to Variable <span className="font-bold text-white font-mono">{storeTarget}</span>:
              </p>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder={`Ans (${ans})`}
                  className="flex-1 bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
                <button
                  onClick={() => handleStore(storeTarget)}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-sans font-bold flex items-center space-x-1"
                >
                  <span>Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
