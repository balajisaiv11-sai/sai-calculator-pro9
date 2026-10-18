import React, { useState } from 'react';
import { SpreadsheetEngine } from '../../engine/spreadsheetEngine';
import { ArrowLeft } from 'lucide-react';

interface SpreadsheetScreenProps {
  onBackToCalculate: () => void;
}

export const SpreadsheetScreen: React.FC<SpreadsheetScreenProps> = ({ onBackToCalculate }) => {
  const [engine] = useState(() => new SpreadsheetEngine());
  const [selectedCell, setSelectedCell] = useState('A1');
  const [cellEditInput, setCellEditInput] = useState(engine.rawCells['A1'] || '');
  const [, setRefreshTrigger] = useState(0);

  const selectCell = (ref: string) => {
    setSelectedCell(ref);
    setCellEditInput(engine.rawCells[ref] || '');
  };

  const setCell = () => {
    engine.setCell(selectedCell, cellEditInput);
    setRefreshTrigger(v => v + 1);
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
          <h2 className="text-base font-bold text-white">Spreadsheet Mode</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center space-x-2 my-3">
        <span className="bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm">
          {selectedCell}
        </span>
        <input
          type="text"
          value={cellEditInput}
          onChange={(e) => setCellEditInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setCell();
          }}
          placeholder="Value or =Formula (e.g. =SUM(A1:A3))"
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
        />
        <button
          onClick={setCell}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
        >
          Set
        </button>
      </div>

      {/* Formula helper pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {['=SUM(A1:A3)', '=MEAN(A1:A3)', '=MIN(A1:A3)', '=MAX(A1:A3)', '=A1+B1'].map(f => (
          <button
            key={f}
            onClick={() => setCellEditInput(f)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-center font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <th className="p-2 w-8 border-r border-slate-800">#</th>
              {engine.cols.map(col => (
                <th key={col} className="p-2 min-w-[64px] border-r border-slate-800 font-bold text-sky-400">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: engine.rowCount }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <tr key={rowNum} className="border-b border-slate-900/60 hover:bg-slate-900/40">
                  <td className="p-1.5 font-bold text-slate-500 bg-slate-900/30 border-r border-slate-800">
                    {rowNum}
                  </td>
                  {engine.cols.map(col => {
                    const ref = `${col}${rowNum}`;
                    const isSelected = selectedCell === ref;
                    const computed = engine.computedValues[ref];
                    const raw = engine.rawCells[ref] || '';
                    return (
                      <td
                        key={ref}
                        onClick={() => selectCell(ref)}
                        className={`p-1.5 border-r border-slate-900 cursor-pointer select-none transition ${
                          isSelected
                            ? 'bg-blue-600/30 text-white font-bold outline-2 outline-blue-500'
                            : raw.startsWith('=')
                            ? 'text-sky-300 font-semibold'
                            : 'text-slate-200'
                        }`}
                      >
                        {computed !== undefined ? (
                          Number.isInteger(computed) ? computed : computed.toFixed(2)
                        ) : raw || '-'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
