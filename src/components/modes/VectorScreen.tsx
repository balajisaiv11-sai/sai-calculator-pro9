import React, { useState } from 'react';
import { VectorEngine } from '../../engine/vectorEngine';
import { ArrowLeft } from 'lucide-react';

interface VectorScreenProps {
  onBackToCalculate: () => void;
}

export const VectorScreen: React.FC<VectorScreenProps> = ({ onBackToCalculate }) => {
  const [vctA, setVctA] = useState({ x: '1', y: '2', z: '3' });
  const [vctB, setVctB] = useState({ x: '4', y: '5', z: '6' });
  const [resultText, setResultText] = useState<string | null>(null);

  const getVecA = () => [parseFloat(vctA.x) || 0, parseFloat(vctA.y) || 0, parseFloat(vctA.z) || 0];
  const getVecB = () => [parseFloat(vctB.x) || 0, parseFloat(vctB.y) || 0, parseFloat(vctB.z) || 0];

  const calcDot = () => {
    try {
      const d = VectorEngine.dot(getVecA(), getVecB());
      setResultText(`Dot Product (A • B) = ${d}`);
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    }
  };

  const calcCross = () => {
    try {
      const c = VectorEngine.cross(getVecA(), getVecB());
      setResultText(`Cross Product (A × B) = [${c.join(', ')}]`);
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    }
  };

  const calcAngle = () => {
    try {
      const ang = VectorEngine.angle(getVecA(), getVecB(), true);
      setResultText(`Angle θ between A & B = ${ang.toFixed(2)}°`);
    } catch (e: any) {
      setResultText(`Error: ${e.message}`);
    }
  };

  const calcNorms = () => {
    try {
      const nA = VectorEngine.magnitude(getVecA());
      const nB = VectorEngine.magnitude(getVecB());
      setResultText(`|A| = ${nA.toFixed(4)}\n|B| = ${nB.toFixed(4)}`);
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
          <h2 className="text-base font-bold text-white">Vector Mode</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Vector Inputs */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 my-3 space-y-3 font-mono text-xs">
        <div>
          <p className="text-xs font-semibold text-sky-400 mb-1">Vector A (xi + yj + zk):</p>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={vctA.x}
              onChange={(e) => setVctA({ ...vctA, x: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
              placeholder="x"
            />
            <input
              type="text"
              value={vctA.y}
              onChange={(e) => setVctA({ ...vctA, y: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
              placeholder="y"
            />
            <input
              type="text"
              value={vctA.z}
              onChange={(e) => setVctA({ ...vctA, z: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
              placeholder="z"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-emerald-400 mb-1">Vector B (xi + yj + zk):</p>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={vctB.x}
              onChange={(e) => setVctB({ ...vctB, x: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
              placeholder="x"
            />
            <input
              type="text"
              value={vctB.y}
              onChange={(e) => setVctB({ ...vctB, y: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
              placeholder="y"
            />
            <input
              type="text"
              value={vctB.z}
              onChange={(e) => setVctB({ ...vctB, z: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
              placeholder="z"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={calcDot}
          className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-sky-400 border border-slate-700 cursor-pointer"
        >
          Dot Product (A • B)
        </button>
        <button
          onClick={calcCross}
          className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-emerald-400 border border-slate-700 cursor-pointer"
        >
          Cross Product (A × B)
        </button>
        <button
          onClick={calcAngle}
          className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-amber-400 border border-slate-700 cursor-pointer"
        >
          Angle Between θ
        </button>
        <button
          onClick={calcNorms}
          className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-purple-400 border border-slate-700 cursor-pointer"
        >
          Magnitude |v|
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
