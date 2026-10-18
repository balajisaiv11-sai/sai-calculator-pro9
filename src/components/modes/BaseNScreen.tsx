import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface BaseNScreenProps {
  onBackToCalculate: () => void;
}

export const BaseNScreen: React.FC<BaseNScreenProps> = ({ onBackToCalculate }) => {
  const [activeBase, setActiveBase] = useState<'DEC' | 'HEX' | 'BIN' | 'OCT'>('DEC');
  const [inputStr, setInputStr] = useState('42');

  const getRadix = (base: string) => {
    switch (base) {
      case 'HEX': return 16;
      case 'BIN': return 2;
      case 'OCT': return 8;
      default: return 10;
    }
  };

  const currentBigInt = (() => {
    try {
      if (!inputStr) return 0n;
      return BigInt(parseInt(inputStr, getRadix(activeBase)) || 0);
    } catch {
      return 0n;
    }
  })();

  const num = Number(currentBigInt);
  const decVal = num.toString(10);
  const hexVal = (num >>> 0).toString(16).toUpperCase();
  const binVal = (num >>> 0).toString(2);
  const octVal = (num >>> 0).toString(8);

  const applyBitwise = (op: (v: number) => number) => {
    const res = op(num);
    const radix = getRadix(activeBase);
    setInputStr((res >>> 0).toString(radix));
  };

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
          <h2 className="text-base font-bold text-white">Base-N Programmer Mode</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Base selector */}
      <div className="grid grid-cols-4 gap-2 my-3">
        {(['DEC', 'HEX', 'BIN', 'OCT'] as const).map((base) => (
          <button
            key={base}
            onClick={() => setActiveBase(base)}
            className={`py-1.5 text-xs font-bold rounded-lg transition ${
              activeBase === base ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {base}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="text-xs text-slate-400 font-mono mb-1 block">Input in {activeBase}:</label>
        <input
          type="text"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-base focus:border-sky-400 focus:outline-none"
        />
      </div>

      {/* Radix readouts */}
      <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
        <div className="flex justify-between items-center py-1 border-b border-slate-900">
          <span className="text-slate-400 font-bold">DEC:</span>
          <span className="text-sky-400 font-semibold text-sm">{decVal}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-900">
          <span className="text-slate-400 font-bold">HEX:</span>
          <span className="text-amber-400 font-semibold text-sm">0x{hexVal}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-900">
          <span className="text-slate-400 font-bold">BIN:</span>
          <span className="text-emerald-400 font-semibold text-sm tracking-wider">0b{binVal}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 font-bold">OCT:</span>
          <span className="text-purple-400 font-semibold text-sm">0o{octVal}</span>
        </div>
      </div>

      {/* Bitwise operations */}
      <div className="mt-4">
        <p className="text-xs text-slate-400 mb-2 font-semibold">Bitwise Logic Operations:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => applyBitwise((v) => ~v)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-sky-400 border border-slate-700"
          >
            NOT (~)
          </button>
          <button
            onClick={() => applyBitwise((v) => v << 1)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-sky-400 border border-slate-700"
          >
            SHL (&lt;&lt;)
          </button>
          <button
            onClick={() => applyBitwise((v) => v >> 1)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-sky-400 border border-slate-700"
          >
            SHR (&gt;&gt;)
          </button>
          <button
            onClick={() => applyBitwise((v) => v & 0xff)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-sky-400 border border-slate-700"
          >
            &amp; 0xFF (Byte)
          </button>
          <button
            onClick={() => applyBitwise((v) => v & 0xffff)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-sky-400 border border-slate-700"
          >
            &amp; 0xFFFF (Word)
          </button>
          <button
            onClick={() => applyBitwise((v) => -v)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-sky-400 border border-slate-700"
          >
            NEG (-x)
          </button>
        </div>
      </div>
    </div>
  );
};
