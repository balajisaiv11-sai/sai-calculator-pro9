import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface RatioScreenProps {
  onBackToCalculate: () => void;
}

export const RatioScreen: React.FC<RatioScreenProps> = ({ onBackToCalculate }) => {
  const [ratioType, setRatioType] = useState<1 | 2>(1); // 1: A:B = X:D; 2: A:B = C:X
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
  const [cOrD, setCOrD] = useState('6');

  const aVal = parseFloat(a) || 0;
  const bVal = parseFloat(b) || 0;
  const otherVal = parseFloat(cOrD) || 0;

  // Type 1: A:B = X:D => X = (A * D) / B
  // Type 2: A:B = C:X => X = (B * C) / A
  const xResult = (() => {
    if (ratioType === 1) {
      return bVal !== 0 ? (aVal * otherVal) / bVal : NaN;
    } else {
      return aVal !== 0 ? (bVal * otherVal) / aVal : NaN;
    }
  })();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 sm:p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBackToCalculate}
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-400 transition"
            title="Back to Calculator"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-white">Ratio & Proportion</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Mode choice */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <button
          onClick={() => setRatioType(1)}
          className={`py-2 text-xs font-mono font-bold rounded-lg transition ${
            ratioType === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          A : B = X : D
        </button>
        <button
          onClick={() => setRatioType(2)}
          className={`py-2 text-xs font-mono font-bold rounded-lg transition ${
            ratioType === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          A : B = C : X
        </button>
      </div>

      {/* Input container */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <p className="text-xs text-sky-400 font-semibold mb-2">
          {ratioType === 1 ? 'Solve for X in A:B = X:D' : 'Solve for X in A:B = C:X'}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Value A:</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-center text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Value B:</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-center text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">
              Value {ratioType === 1 ? 'D' : 'C'}:
            </label>
            <input
              type="number"
              value={cOrD}
              onChange={(e) => setCOrD(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-center text-white"
            />
          </div>
        </div>

        {/* Result */}
        <div className="pt-3 border-t border-slate-800 mt-2">
          <p className="text-xs text-slate-400 mb-1">Unknown Value X:</p>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xl font-bold text-emerald-400">
            X = {isNaN(xResult) ? 'Division by zero' : xResult}
          </div>
        </div>
      </div>
    </div>
  );
};
