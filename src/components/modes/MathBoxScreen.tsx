import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface MathBoxScreenProps {
  onBackToCalculate: () => void;
}

export const MathBoxScreen: React.FC<MathBoxScreenProps> = ({ onBackToCalculate }) => {
  const [selectedTool, setSelectedTool] = useState<0 | 1>(0); // 0: Coin Toss, 1: Dice Roll
  const [attempts, setAttempts] = useState(50);

  // Coin simulation
  const [coinNum, setCoinNum] = useState(2); // 1..3
  const [coinCounts, setCoinCounts] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });

  // Dice simulation
  const [diceNum, setDiceNum] = useState(2); // 1..3
  const [diceCounts, setDiceCounts] = useState<Record<number, number>>({});

  const runCoinSimulation = () => {
    const map: Record<number, number> = {};
    for (let i = 0; i <= coinNum; i++) map[i] = 0;
    for (let a = 0; a < attempts; a++) {
      let heads = 0;
      for (let c = 0; c < coinNum; c++) {
        if (Math.random() < 0.5) heads++;
      }
      map[heads] = (map[heads] || 0) + 1;
    }
    setCoinCounts(map);
  };

  const runDiceSimulation = () => {
    const map: Record<number, number> = {};
    const minSum = diceNum;
    const maxSum = diceNum * 6;
    for (let s = minSum; s <= maxSum; s++) map[s] = 0;

    for (let a = 0; a < attempts; a++) {
      let sum = 0;
      for (let d = 0; d < diceNum; d++) {
        sum += Math.floor(Math.random() * 6) + 1;
      }
      map[sum] = (map[sum] || 0) + 1;
    }
    setDiceCounts(map);
  };

  useEffect(() => {
    if (selectedTool === 0) runCoinSimulation();
    else runDiceSimulation();
  }, [selectedTool, attempts, coinNum, diceNum]);

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
          <h2 className="text-base font-bold text-white">Math Box Learning Simulation</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Mode selection buttons */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <button
          onClick={() => setSelectedTool(0)}
          className={`py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedTool === 0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Coin Toss Simulation
        </button>
        <button
          onClick={() => setSelectedTool(1)}
          className={`py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedTool === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Dice Roll Simulation
        </button>
      </div>

      {/* Controls */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Number of {selectedTool === 0 ? 'Coins' : 'Dice'}:</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => (selectedTool === 0 ? setCoinNum(n) : setDiceNum(n))}
                className={`w-7 h-7 rounded text-xs font-bold ${
                  (selectedTool === 0 ? coinNum === n : diceNum === n)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Attempts (N):</span>
          <div className="flex space-x-1">
            {[25, 50, 100, 250].map((a) => (
              <button
                key={a}
                onClick={() => setAttempts(a)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  attempts === a ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => (selectedTool === 0 ? runCoinSimulation() : runDiceSimulation())}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run Simulation</span>
        </button>
      </div>

      {/* Visualization Bars */}
      <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-3 font-mono">
          Frequency Histogram ({attempts} trials):
        </p>

        {selectedTool === 0 ? (
          <div className="space-y-2">
            {Object.entries(coinCounts).map(([heads, count]) => {
              const pct = attempts > 0 ? (count / attempts) * 100 : 0;
              return (
                <div key={heads} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{heads} Heads:</span>
                    <span className="font-bold text-sky-400">
                      {count} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1.5">
            {Object.entries(diceCounts).map(([sum, count]) => {
              const pct = attempts > 0 ? (count / attempts) * 100 : 0;
              return (
                <div key={sum} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Sum {sum}:</span>
                    <span className="font-bold text-emerald-400">
                      {count} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
