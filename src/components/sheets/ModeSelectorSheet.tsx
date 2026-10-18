import React from 'react';
import { CalculatorApp, CalculatorAppsList } from '../../model/calculatorSettings';
import {
  Calculator,
  Binary,
  Grid,
  TrendingUp,
  BarChart3,
  Table as TableIcon,
  Sigma,
  Scale,
  Percent,
  Grid3X3,
  ArrowRightLeft,
  Dices,
  Navigation,
  Compass,
  X,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface ModeSelectorSheetProps {
  currentApp: CalculatorApp;
  onSelectApp: (app: CalculatorApp) => void;
  onDismiss: () => void;
  onOpenCoverageDashboard: () => void;
  onOpenFunctionExplorer: () => void;
}

export const ModeSelectorSheet: React.FC<ModeSelectorSheetProps> = ({
  currentApp,
  onSelectApp,
  onDismiss,
  onOpenCoverageDashboard,
  onOpenFunctionExplorer,
}) => {
  const getAppIcon = (id: CalculatorApp) => {
    switch (id) {
      case 'CALCULATE': return <Calculator className="w-5 h-5" />;
      case 'COMPLEX': return <Compass className="w-5 h-5" />;
      case 'BASE_N': return <Binary className="w-5 h-5" />;
      case 'MATRIX': return <Grid className="w-5 h-5" />;
      case 'VECTOR': return <Navigation className="w-5 h-5" />;
      case 'STATISTICS': return <BarChart3 className="w-5 h-5" />;
      case 'DISTRIBUTION': return <TrendingUp className="w-5 h-5" />;
      case 'TABLE': return <TableIcon className="w-5 h-5" />;
      case 'EQUATION': return <Sigma className="w-5 h-5" />;
      case 'INEQUALITY': return <Scale className="w-5 h-5" />;
      case 'RATIO': return <Percent className="w-5 h-5" />;
      case 'SPREADSHEET': return <Grid3X3 className="w-5 h-5" />;
      case 'UNIT_CONV': return <ArrowRightLeft className="w-5 h-5" />;
      case 'MATH_BOX': return <Dices className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Application Modes</h2>
            <p className="text-xs text-slate-400">Scientific Application Suite</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { onDismiss(); onOpenFunctionExplorer(); }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-semibold flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>fx Explorer</span>
            </button>
            <button
              onClick={() => { onDismiss(); onOpenCoverageDashboard(); }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Coverage</span>
            </button>
            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid of Apps */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto">
          {CalculatorAppsList.map((app) => {
            const isSelected = app.id === currentApp;
            return (
              <button
                key={app.id}
                onClick={() => {
                  onSelectApp(app.id);
                  onDismiss();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md scale-[1.02]'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200 hover:border-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-800 text-sky-400'}`}>
                  {getAppIcon(app.id)}
                </div>
                <span className="text-xs font-bold truncate w-full">{app.title}</span>
                <span className={`text-[10px] truncate w-full mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {app.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
