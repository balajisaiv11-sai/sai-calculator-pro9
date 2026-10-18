import React from 'react';
import { FunctionRegistry } from '../../model/functionRegistry';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface CoverageDashboardSheetProps {
  onDismiss: () => void;
}

export const CoverageDashboardSheet: React.FC<CoverageDashboardSheetProps> = ({ onDismiss }) => {
  const allFunctions = FunctionRegistry.allFunctions;
  const total = allFunctions.length;
  const verified = allFunctions.filter((f) => f.status === 'TESTED_PASS').length;
  const pct = total > 0 ? Math.round((verified / total) * 100) : 100;

  // Breakdown by category
  const categoriesMap: Record<string, { total: number; passed: number }> = {};
  allFunctions.forEach((fn) => {
    if (!categoriesMap[fn.category]) {
      categoriesMap[fn.category] = { total: 0, passed: 0 };
    }
    categoriesMap[fn.category].total++;
    if (fn.status === 'TESTED_PASS') categoriesMap[fn.category].passed++;
  });

  const categories = Object.entries(categoriesMap).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-xl h-[88vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Coverage &amp; Verification Dashboard</span>
            </h2>
            <p className="text-xs text-slate-400">Comprehensive Scientific Feature Compliance</p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Main Progress Card */}
          <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-emerald-950/40 p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">
                  Total Function Coverage
                </span>
                <p className="text-2xl font-black text-white font-mono mt-0.5">
                  {verified} / {total} Functions
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {pct}%
                </span>
                <p className="text-[10px] text-emerald-300 font-medium">Verified Active</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center space-x-4 mt-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>540+ Verified Functions</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exact Rational Arithmetic</span>
              </div>
            </div>
          </div>

          {/* Module Categories Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Category Verification Breakdown:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map(([name, stat]) => {
                const catPct = stat.total > 0 ? Math.round((stat.passed / stat.total) * 100) : 100;
                return (
                  <div
                    key={name}
                    className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white truncate">{name}</span>
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        {stat.passed}/{stat.total}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
