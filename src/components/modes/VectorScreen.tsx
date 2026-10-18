import React, { useState } from 'react';
import { VectorEngine } from '../../engine/vectorEngine';
import { ArrowLeft, RefreshCw, Copy, Check } from 'lucide-react';

interface VectorScreenProps {
  onBackToCalculate: () => void;
}

type VectorDim = 2 | 3;
type DisplayFormat = 'both' | 'fraction' | 'decimal';

export const VectorScreen: React.FC<VectorScreenProps> = ({ onBackToCalculate }) => {
  const [dim, setDim] = useState<VectorDim>(3);
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('both');

  const [vctA, setVctA] = useState({ x: '1', y: '2', z: '3' });
  const [vctB, setVctB] = useState({ x: '4', y: '5', z: '6' });
  const [scalarK, setScalarK] = useState('2');

  const [resultTitle, setResultTitle] = useState<string | null>(null);
  const [resultVector, setResultVector] = useState<number[] | null>(null);
  const [resultScalar, setResultScalar] = useState<number | null>(null);
  const [scalarUnit, setScalarUnit] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parseVal = (str: string): number => {
    if (!str) return 0;
    const t = str.trim();
    if (t.includes('/')) {
      const p = t.split('/');
      const n = parseFloat(p[0]);
      const d = parseFloat(p[1]);
      if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
    }
    const n = parseFloat(t);
    return isNaN(n) ? 0 : n;
  };

  const getVecA = (): number[] => {
    return dim === 2
      ? [parseVal(vctA.x), parseVal(vctA.y)]
      : [parseVal(vctA.x), parseVal(vctA.y), parseVal(vctA.z)];
  };

  const getVecB = (): number[] => {
    return dim === 2
      ? [parseVal(vctB.x), parseVal(vctB.y)]
      : [parseVal(vctB.x), parseVal(vctB.y), parseVal(vctB.z)];
  };

  const handleDot = () => {
    try {
      const d = VectorEngine.dot(getVecA(), getVecB());
      setResultTitle('Dot Product (A • B)');
      setResultScalar(d);
      setResultVector(null);
      setScalarUnit('');
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleCross = () => {
    try {
      if (dim !== 3) {
        throw new Error('Cross Product (A × B) requires 3D vectors');
      }
      const c = VectorEngine.cross(getVecA(), getVecB());
      setResultTitle('Cross Product (A × B)');
      setResultVector(c);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleAngle = () => {
    try {
      const ang = VectorEngine.angle(getVecA(), getVecB(), true);
      setResultTitle('Angle Between Vectors (θ)');
      setResultScalar(ang);
      setResultVector(null);
      setScalarUnit('°');
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleAdd = () => {
    try {
      const res = VectorEngine.add(getVecA(), getVecB());
      setResultTitle('Vector Sum (A + B)');
      setResultVector(res);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleSubtract = () => {
    try {
      const res = VectorEngine.subtract(getVecA(), getVecB());
      setResultTitle('Vector Difference (A − B)');
      setResultVector(res);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleUnitA = () => {
    try {
      const u = VectorEngine.unit(getVecA());
      setResultTitle('Unit Vector Â (A / |A|)');
      setResultVector(u);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleProjAonB = () => {
    try {
      const p = VectorEngine.projection(getVecA(), getVecB());
      setResultTitle('Projection of A onto B (proj_B A)');
      setResultVector(p);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleScalarMulA = () => {
    try {
      const k = parseVal(scalarK);
      const res = VectorEngine.scalarMultiply(getVecA(), k);
      setResultTitle(`Scalar Multiplication (${k} · A)`);
      setResultVector(res);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleMagnitudes = () => {
    try {
      const magA = VectorEngine.magnitude(getVecA());
      const magB = VectorEngine.magnitude(getVecB());
      setResultTitle('|A| and |B|');
      setResultVector([magA, magB]);
      setResultScalar(null);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message);
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
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>Vector Mode</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">
                2D & 3D
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Dot, Cross, Projection, Unit Vectors & Angles</p>
          </div>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Dimension Switcher (2D / 3D) & Display format */}
      <div className="flex items-center justify-between my-3 gap-2">
        <div className="flex space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => { setDim(2); setResultTitle(null); }}
            className={`px-3 py-1 text-xs rounded font-medium transition ${
              dim === 2 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2D Vector (x, y)
          </button>
          <button
            onClick={() => { setDim(3); setResultTitle(null); }}
            className={`px-3 py-1 text-xs rounded font-medium transition ${
              dim === 3 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Vector (x, y, z)
          </button>
        </div>

        {/* Display Format */}
        <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setDisplayFormat('fraction')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              displayFormat === 'fraction' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fraction
          </button>
          <button
            onClick={() => setDisplayFormat('decimal')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              displayFormat === 'decimal' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Decimal
          </button>
          <button
            onClick={() => setDisplayFormat('both')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              displayFormat === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Both
          </button>
        </div>
      </div>

      {/* Vector Inputs */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div>
          <p className="text-xs font-semibold text-sky-400 mb-1">
            Vector A ({dim === 2 ? 'xi + yj' : 'xi + yj + zk'}):
          </p>
          <div className={`grid gap-2 ${dim === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            <input
              type="text"
              value={vctA.x}
              onChange={(e) => setVctA({ ...vctA, x: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-center text-white focus:border-sky-400 focus:outline-none"
              placeholder="x"
            />
            <input
              type="text"
              value={vctA.y}
              onChange={(e) => setVctA({ ...vctA, y: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-center text-white focus:border-sky-400 focus:outline-none"
              placeholder="y"
            />
            {dim === 3 && (
              <input
                type="text"
                value={vctA.z}
                onChange={(e) => setVctA({ ...vctA, z: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-center text-white focus:border-sky-400 focus:outline-none"
                placeholder="z"
              />
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-emerald-400 mb-1">
            Vector B ({dim === 2 ? 'xi + yj' : 'xi + yj + zk'}):
          </p>
          <div className={`grid gap-2 ${dim === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            <input
              type="text"
              value={vctB.x}
              onChange={(e) => setVctB({ ...vctB, x: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-center text-white focus:border-emerald-400 focus:outline-none"
              placeholder="x"
            />
            <input
              type="text"
              value={vctB.y}
              onChange={(e) => setVctB({ ...vctB, y: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-center text-white focus:border-emerald-400 focus:outline-none"
              placeholder="y"
            />
            {dim === 3 && (
              <input
                type="text"
                value={vctB.z}
                onChange={(e) => setVctB({ ...vctB, z: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-center text-white focus:border-emerald-400 focus:outline-none"
                placeholder="z"
              />
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2 p-2 bg-rose-950/70 border border-rose-800 rounded-lg text-rose-300 text-xs font-mono">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Operations Grid */}
      <div className="mt-3 space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Vector Operations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            onClick={handleDot}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-sky-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Dot Product</span>
            <span className="text-[10px] text-slate-400 font-mono">A • B</span>
          </button>
          <button
            onClick={handleCross}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-emerald-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Cross Product</span>
            <span className="text-[10px] text-slate-400 font-mono">A × B (3D)</span>
          </button>
          <button
            onClick={handleAngle}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-amber-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Angle θ</span>
            <span className="text-[10px] text-slate-400 font-mono">between A & B</span>
          </button>
          <button
            onClick={handleMagnitudes}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-purple-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Magnitudes</span>
            <span className="text-[10px] text-slate-400 font-mono">|A| & |B|</span>
          </button>
          <button
            onClick={handleAdd}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-teal-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Addition</span>
            <span className="text-[10px] text-slate-400 font-mono">A + B</span>
          </button>
          <button
            onClick={handleSubtract}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-rose-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Subtraction</span>
            <span className="text-[10px] text-slate-400 font-mono">A − B</span>
          </button>
          <button
            onClick={handleUnitA}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-cyan-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Unit Vector Â</span>
            <span className="text-[10px] text-slate-400 font-mono">A / |A|</span>
          </button>
          <button
            onClick={handleProjAonB}
            className="py-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-xs font-semibold text-indigo-400 border border-slate-700 cursor-pointer flex flex-col items-center justify-center"
          >
            <span>Projection</span>
            <span className="text-[10px] text-slate-400 font-mono">proj_B(A)</span>
          </button>
        </div>

        {/* Scalar Multiplication */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-2 gap-2">
          <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">Scalar k · A:</span>
          <input
            type="text"
            value={scalarK}
            onChange={(e) => setScalarK(e.target.value)}
            className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-sky-400 focus:outline-none"
            placeholder="k"
          />
          <button
            onClick={handleScalarMulA}
            className="flex-1 py-1 bg-sky-600 hover:bg-sky-500 rounded text-xs font-bold text-white transition cursor-pointer"
          >
            Multiply
          </button>
        </div>
      </div>

      {/* Result Section (Dual Decimal & Fraction) */}
      {resultTitle && (
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-sky-900/60 shadow-lg">
          <p className="text-xs font-bold text-sky-400 mb-2">{resultTitle}</p>

          {/* Scalar Result */}
          {resultScalar !== null && (
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {VectorEngine.formatNumber(resultScalar).fraction} {scalarUnit}
                </span>
                {VectorEngine.formatNumber(resultScalar).fraction !== VectorEngine.formatNumber(resultScalar).decimal && (
                  <span className="text-sm font-mono text-slate-400">
                    ≈ {VectorEngine.formatNumber(resultScalar).decimal} {scalarUnit}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">FRACTION</span>
                  <span className="text-sky-300 font-bold">{VectorEngine.formatNumber(resultScalar).fraction}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DECIMAL</span>
                  <span className="text-emerald-300 font-bold">{VectorEngine.formatNumber(resultScalar).decimal} {scalarUnit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Vector Result */}
          {resultVector !== null && (
            <div className="space-y-2">
              {resultTitle.includes('|A| and |B|') ? (
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-sky-400 block font-semibold mb-1">|A| Magnitude:</span>
                    <span className="text-emerald-400 font-bold text-sm block">
                      {VectorEngine.formatNumber(resultVector[0]).fraction}
                    </span>
                    <span className="text-slate-400 text-[10px] block">
                      ≈ {VectorEngine.formatNumber(resultVector[0]).decimal}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-sky-400 block font-semibold mb-1">|B| Magnitude:</span>
                    <span className="text-emerald-400 font-bold text-sm block">
                      {VectorEngine.formatNumber(resultVector[1]).fraction}
                    </span>
                    <span className="text-slate-400 text-[10px] block">
                      ≈ {VectorEngine.formatNumber(resultVector[1]).decimal}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center space-x-2 font-mono text-sm overflow-x-auto py-1">
                    <span className="text-slate-400">[</span>
                    {resultVector.map((comp, idx) => {
                      const f = VectorEngine.formatNumber(comp);
                      const label = ['i', 'j', 'k'][idx] || '';
                      return (
                        <div key={idx} className="flex flex-col items-center px-1.5">
                          {displayFormat === 'fraction' && (
                            <span className="font-bold text-emerald-400">{f.fraction}{label}</span>
                          )}
                          {displayFormat === 'decimal' && (
                            <span className="font-bold text-sky-300">{f.decimal}{label}</span>
                          )}
                          {displayFormat === 'both' && (
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-emerald-400">{f.fraction}{label}</span>
                              {f.fraction !== f.decimal && (
                                <span className="text-[10px] text-slate-400">({f.decimal})</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <span className="text-slate-400">]</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
