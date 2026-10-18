import React from 'react';
import { X, History, Trash2, ArrowUpRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  exactFraction?: string | null;
}

interface HistorySheetProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDismiss: () => void;
}

export const HistorySheet: React.FC<HistorySheetProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[80vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white">Calculation History</h2>
          </div>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition"
                title="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History list */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 font-mono text-xs">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectHistory(item);
                onDismiss();
              }}
              className="p-3 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 border border-slate-750 hover:border-slate-600 rounded-xl cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex-1 pr-3">
                <p className="text-slate-400 text-xs truncate">{item.expression}</p>
                <p className="text-base font-bold text-white mt-0.5">{item.result}</p>
                {item.exactFraction && (
                  <p className="text-[11px] text-emerald-400 mt-0.5">exact: {item.exactFraction}</p>
                )}
              </div>
              <button className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-sans text-xs">
              No recent calculation history yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
