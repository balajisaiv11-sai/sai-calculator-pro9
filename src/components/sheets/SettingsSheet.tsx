import React from 'react';
import { AngleUnit, CalculatorSettings, FractionFormat, InputOutputFormat } from '../../model/calculatorSettings';
import { X, Settings2, RotateCcw } from 'lucide-react';

interface SettingsSheetProps {
  settings: CalculatorSettings;
  onUpdateSettings: (settings: CalculatorSettings) => void;
  onResetAll: () => void;
  onDismiss: () => void;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  settings,
  onUpdateSettings,
  onResetAll,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white">Calculator Settings</h2>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* 1. Angle Unit */}
          <div>
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider block mb-1.5">
              Angle Unit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['DEG', 'RAD', 'GRAD'] as AngleUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => onUpdateSettings({ ...settings, angleUnit: unit })}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    settings.angleUnit === unit
                      ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Input / Output Format */}
          <div>
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider block mb-1.5">
              Input / Output Format
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'MATH_I_MATH_O', label: 'MathI / MathO (Natural Textbook Display)' },
                { id: 'MATH_I_DECIMAL_O', label: 'MathI / DecimalO (Natural Input, Decimal Output)' },
                { id: 'LINE_I_LINE_O', label: 'LineI / LineO (Linear Input & Output)' },
                { id: 'LINE_I_DECIMAL_O', label: 'LineI / DecimalO (Linear Input, Decimal Output)' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => onUpdateSettings({ ...settings, ioFormat: fmt.id as InputOutputFormat })}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition ${
                    settings.ioFormat === fmt.id
                      ? 'bg-blue-600/30 border-blue-500 text-white font-semibold'
                      : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Fraction Format */}
          <div>
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider block mb-1.5">
              Fraction Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['IMPROPER', 'MIXED'] as FractionFormat[]).map((ff) => (
                <button
                  key={ff}
                  onClick={() => onUpdateSettings({ ...settings, fractionFormat: ff })}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    settings.fractionFormat === ff
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {ff === 'IMPROPER' ? 'd/c (Improper)' : 'a b/c (Mixed)'}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Number Format */}
          <div>
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider block mb-1.5">
              Number Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'Norm1', label: 'Norm 1 (Auto Exp)' },
                { type: 'Norm2', label: 'Norm 2 (Standard)' },
                { type: 'Fix', digits: 2, label: 'Fix 2 (2 Decimals)' },
                { type: 'Sci', digits: 3, label: 'Sci 3 (Scientific)' },
              ].map((nf, idx) => {
                const isSelected = settings.numberFormat.type === nf.type;
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        numberFormat: { type: nf.type as any, digits: nf.digits },
                      })
                    }
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {nf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset All */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onResetAll();
                onDismiss();
              }}
              className="w-full py-2.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Memory &amp; Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
