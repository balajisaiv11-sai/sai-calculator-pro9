import React, { useState } from 'react';
import { MathEngine } from '../../engine/mathEngine';
import { ArrowLeft } from 'lucide-react';

interface TableScreenProps {
  onBackToCalculate: () => void;
  fxDefinition: string;
  gxDefinition: string;
  onUpdateFunctions: (fx: string, gx: string) => void;
}

export const TableScreen: React.FC<TableScreenProps> = ({
  onBackToCalculate,
  fxDefinition,
  gxDefinition,
  onUpdateFunctions,
}) => {
  const [fx, setFx] = useState(fxDefinition);
  const [gx, setGx] = useState(gxDefinition);
  const [start, setStart] = useState('-2');
  const [end, setEnd] = useState('2');
  const [step, setStep] = useState('1');

  const [tableData, setTableData] = useState<{ x: number; fx: number; gx: number }[]>([]);

  const generateTable = () => {
    onUpdateFunctions(fx, gx);
    const s = parseFloat(start) || -2;
    const e = parseFloat(end) || 2;
    const stp = parseFloat(step) || 1;
    if (stp <= 0) return;

    const data: { x: number; fx: number; gx: number }[] = [];
    const engine = new MathEngine();

    for (let x = s; x <= e + 1e-9; x += stp) {
      const cleanX = Math.round(x * 10000) / 10000;
      let fVal = NaN;
      let gVal = NaN;
      try {
        fVal = engine.evaluate(fx, { x: cleanX }).numericValue;
      } catch {
        fVal = NaN;
      }
      try {
        gVal = engine.evaluate(gx, { x: cleanX }).numericValue;
      } catch {
        gVal = NaN;
      }
      data.push({ x: cleanX, fx: fVal, gx: gVal });
    }
    setTableData(data);
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
          <h2 className="text-base font-bold text-white">Table Mode</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Function definitions and parameters */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 my-3 space-y-2.5">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-sky-400 w-12">f(x) =</span>
          <input
            type="text"
            value={fx}
            onChange={(e) => setFx(e.target.value)}
            className="flex-1 bg-slate-850 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
            placeholder="e.g. x^2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-emerald-400 w-12">g(x) =</span>
          <input
            type="text"
            value={gx}
            onChange={(e) => setGx(e.target.value)}
            className="flex-1 bg-slate-850 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
            placeholder="e.g. 2*x + 1"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Start:</label>
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">End:</label>
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Step:</label>
            <input
              type="text"
              value={step}
              onChange={(e) => setStep(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
            />
          </div>
        </div>

        <button
          onClick={generateTable}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition cursor-pointer mt-1"
        >
          Generate Table
        </button>
      </div>

      {/* Generated Table */}
      {tableData.length > 0 && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden overflow-y-auto max-h-64 font-mono text-xs">
          <table className="w-full text-center">
            <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
              <tr>
                <th className="py-1.5 px-3">x</th>
                <th className="py-1.5 px-3 text-sky-400">f(x)</th>
                <th className="py-1.5 px-3 text-emerald-400">g(x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900">
                  <td className="py-1.5 px-3 font-semibold text-white">{row.x}</td>
                  <td className="py-1.5 px-3 text-sky-300">
                    {isNaN(row.fx) ? 'ERROR' : row.fx.toFixed(3)}
                  </td>
                  <td className="py-1.5 px-3 text-emerald-300">
                    {isNaN(row.gx) ? 'ERROR' : row.gx.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
