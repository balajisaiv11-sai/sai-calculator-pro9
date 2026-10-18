import React, { useState, useEffect } from 'react';
import { OneVarStats, StatisticsEngine, TwoVarStats } from '../../engine/statisticsEngine';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface StatisticsScreenProps {
  onBackToCalculate: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBackToCalculate }) => {
  const [selectedTab, setSelectedTab] = useState<0 | 1 | 2>(0);
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');

  const [dataX, setDataX] = useState<number[]>([10.0, 20.0, 30.0, 40.0, 50.0]);
  const [dataY, setDataY] = useState<number[]>([15.0, 28.0, 35.0, 48.0, 62.0]);

  const [oneVarStats, setOneVarStats] = useState<OneVarStats | null>(null);
  const [twoVarStats, setTwoVarStats] = useState<TwoVarStats | null>(null);

  useEffect(() => {
    if (dataX.length > 0) {
      try {
        const o1 = StatisticsEngine.calculateOneVar(dataX);
        setOneVarStats(o1);
      } catch {
        setOneVarStats(null);
      }

      if (dataX.length === dataY.length && dataX.length >= 2) {
        try {
          const o2 = StatisticsEngine.calculateTwoVar(dataX, dataY);
          setTwoVarStats(o2);
        } catch {
          setTwoVarStats(null);
        }
      }
    } else {
      setOneVarStats(null);
      setTwoVarStats(null);
    }
  }, [dataX, dataY]);

  const addRow = () => {
    const xVal = parseFloat(xInput);
    const yVal = parseFloat(yInput);
    if (!isNaN(xVal)) {
      setDataX([...dataX, xVal]);
      setDataY([...dataY, isNaN(yVal) ? 0 : yVal]);
      setXInput('');
      setYInput('');
    }
  };

  const removeRow = (idx: number) => {
    setDataX(dataX.filter((_, i) => i !== idx));
    setDataY(dataY.filter((_, i) => i !== idx));
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
          <h2 className="text-base font-bold text-white">Statistics Mode</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 my-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setSelectedTab(0)}
          className={`flex-1 py-1 text-xs rounded font-medium transition ${
            selectedTab === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Data Table ({dataX.length})
        </button>
        <button
          onClick={() => setSelectedTab(1)}
          className={`flex-1 py-1 text-xs rounded font-medium transition ${
            selectedTab === 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          1-Var Stats
        </button>
        <button
          onClick={() => setSelectedTab(2)}
          className={`flex-1 py-1 text-xs rounded font-medium transition ${
            selectedTab === 2 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          2-Var Regression
        </button>
      </div>

      {/* TAB 0: DATA TABLE */}
      {selectedTab === 0 && (
        <div className="flex flex-col flex-1 space-y-3">
          {/* Add row */}
          <div className="flex space-x-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
            <input
              type="text"
              value={xInput}
              onChange={(e) => setXInput(e.target.value)}
              placeholder="X value"
              className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
            />
            <input
              type="text"
              value={yInput}
              onChange={(e) => setYInput(e.target.value)}
              placeholder="Y value"
              className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
            />
            <button
              onClick={addRow}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <tr>
                  <th className="py-1.5 px-3">#</th>
                  <th className="py-1.5 px-3">X</th>
                  <th className="py-1.5 px-3">Y</th>
                  <th className="py-1.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dataX.map((x, i) => (
                  <tr key={i} className="hover:bg-slate-900">
                    <td className="py-1.5 px-3 text-slate-500">{i + 1}</td>
                    <td className="py-1.5 px-3 font-semibold text-sky-400">{x}</td>
                    <td className="py-1.5 px-3 text-emerald-400">{dataY[i] ?? 0}</td>
                    <td className="py-1.5 px-3 text-right">
                      <button
                        onClick={() => removeRow(i)}
                        className="text-slate-500 hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: 1-VAR STATS */}
      {selectedTab === 1 && oneVarStats && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Sample Size (n):</span>{' '}
              <span className="font-bold text-white text-sm">{oneVarStats.n}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Mean (x̄):</span>{' '}
              <span className="font-bold text-sky-400 text-sm">{oneVarStats.mean.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Sum (Σx):</span>{' '}
              <span className="font-bold text-white text-sm">{oneVarStats.sumX.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Sum of Squares (Σx²):</span>{' '}
              <span className="font-bold text-white text-sm">{oneVarStats.sumX2.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Sample Std Dev (sx):</span>{' '}
              <span className="font-bold text-emerald-400 text-sm">{oneVarStats.sampleStdDev.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Population Std Dev (σx):</span>{' '}
              <span className="font-bold text-emerald-400 text-sm">{oneVarStats.popStdDev.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Sample Variance (s²):</span>{' '}
              <span className="font-bold text-white text-sm">{oneVarStats.sampleVar.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Median (Med):</span>{' '}
              <span className="font-bold text-amber-400 text-sm">{oneVarStats.median.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Min (minX) / Max (maxX):</span>{' '}
              <span className="font-bold text-white text-sm">{oneVarStats.minX} / {oneVarStats.maxX}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Quartiles (Q1 / Q3):</span>{' '}
              <span className="font-bold text-white text-sm">{oneVarStats.q1} / {oneVarStats.q3}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 2-VAR REGRESSION */}
      {selectedTab === 2 && twoVarStats && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg">
            <p className="text-xs text-blue-300 font-sans mb-1 font-semibold">Linear Regression Equation:</p>
            <p className="text-lg font-bold text-white">
              y = {twoVarStats.interceptA.toFixed(4)} + {twoVarStats.slopeB.toFixed(4)}x
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Intercept (a):</span>{' '}
              <span className="font-bold text-sky-400 text-sm">{twoVarStats.interceptA.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Slope (b):</span>{' '}
              <span className="font-bold text-sky-400 text-sm">{twoVarStats.slopeB.toFixed(4)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Correlation (r):</span>{' '}
              <span className="font-bold text-emerald-400 text-sm">{twoVarStats.correlationR.toFixed(5)}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Determination (r²):</span>{' '}
              <span className="font-bold text-emerald-400 text-sm">{twoVarStats.rSquared.toFixed(5)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
