import React, { useState } from 'react';
import { MatrixEngine } from '../../engine/matrixEngine';
import { ArrowLeft } from 'lucide-react';

interface MatrixScreenProps {
  onBackToCalculate: () => void;
}

export const MatrixScreen: React.FC<MatrixScreenProps> = ({ onBackToCalculate }) => {
  const [dim, setDim] = useState<2 | 3>(2);

  // 3x3 matrix values
  const [grid, setGrid] = useState<string[][]>([
    ['1', '2', '0'],
    ['3', '4', '0'],
    ['0', '0', '1'],
  ]);

  const [resultText, setResultText] = useState<string | null>(null);

  const getArray = (): number[][] => {
    return Array.from({ length: dim }, (_, r) =>
      Array.from({ length: dim }, (_, c) => parseFloat(grid[r][c]) || 0)
    );
  };

  const updateCell = (r: number, c: number, val: string) => {
    const next = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === r && cIdx === c ? val : cell))
    );
    setGrid(next);
  };

  const calculateDet = () => {
    try {
      const d = MatrixEngine.determinant(getArray());
      setResultText(`Det(A) = ${d}`);
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    }
  };

  const calculateInv = () => {
    try {
      const inv = MatrixEngine.inverse(getArray());
      const rows = inv.map(row => row.map(v => v.toFixed(3)).join('  '));
      setResultText(`Inverse A⁻¹:\n${rows.join('\n')}`);
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    }
  };

  const calculateTrn = () => {
    try {
      const trn = MatrixEngine.transpose(getArray());
      const rows = trn.map(row => row.map(v => v.toFixed(2)).join('  '));
      setResultText(`Transpose Aᵀ:\n${rows.join('\n')}`);
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    }
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
          <h2 className="text-base font-bold text-white">Matrix Operations</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Dimension Switcher */}
      <div className="flex space-x-2 my-3">
        <button
          onClick={() => { setDim(2); setResultText(null); }}
          className={`flex-1 py-1 text-xs rounded font-medium transition ${
            dim === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          2 × 2 Matrix
        </button>
        <button
          onClick={() => { setDim(3); setResultText(null); }}
          className={`flex-1 py-1 text-xs rounded font-medium transition ${
            dim === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          3 × 3 Matrix
        </button>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
        <p className="text-xs text-slate-400 mb-2 font-mono">Matrix A [{dim}×{dim}]</p>
        <div className="flex items-center space-x-2">
          <div className="w-2 border-l-2 border-t-2 border-b-2 border-sky-400 self-stretch rounded-l" />
          <div className="flex flex-col space-y-2">
            {Array.from({ length: dim }).map((_, r) => (
              <div key={r} className="flex space-x-2">
                {Array.from({ length: dim }).map((_, c) => (
                  <input
                    key={c}
                    type="text"
                    value={grid[r][c]}
                    onChange={(e) => updateCell(r, c, e.target.value)}
                    className="w-16 h-10 bg-slate-800 border border-slate-700 rounded text-center text-white font-mono text-sm focus:border-sky-400 focus:outline-none"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="w-2 border-r-2 border-t-2 border-b-2 border-sky-400 self-stretch rounded-r" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={calculateDet}
          className="py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 cursor-pointer"
        >
          Determinant
        </button>
        <button
          onClick={calculateInv}
          className="py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-emerald-400 cursor-pointer"
        >
          Inverse (A⁻¹)
        </button>
        <button
          onClick={calculateTrn}
          className="py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-amber-400 cursor-pointer"
        >
          Transpose (Aᵀ)
        </button>
      </div>

      {/* Result Display */}
      {resultText && (
        <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Result:</p>
          <pre className="text-emerald-400 font-mono text-sm font-bold whitespace-pre-wrap">
            {resultText}
          </pre>
        </div>
      )}
    </div>
  );
};
