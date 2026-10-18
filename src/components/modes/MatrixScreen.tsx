import React, { useState } from 'react';
import { MatrixEngine, MatrixCellFormatted } from '../../engine/matrixEngine';
import { ArrowLeft, RefreshCw, Copy, Check, Calculator, Sparkles, SlidersHorizontal } from 'lucide-react';

interface MatrixScreenProps {
  onBackToCalculate: () => void;
}

type MatrixId = 'MatA' | 'MatB';
type DisplayFormat = 'both' | 'fraction' | 'decimal';

export const MatrixScreen: React.FC<MatrixScreenProps> = ({ onBackToCalculate }) => {
  const [activeMatrixId, setActiveMatrixId] = useState<MatrixId>('MatA');
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);

  // Storage for MatA and MatB
  const [matrixData, setMatrixData] = useState<Record<MatrixId, string[][]>>({
    MatA: [
      ['1', '2', '3', '0'],
      ['0', '1', '4', '0'],
      ['5', '6', '0', '1'],
      ['0', '0', '1', '2'],
    ],
    MatB: [
      ['2', '0', '-1', '1'],
      ['1', '3', '2', '0'],
      ['0', '-2', '1', '3'],
      ['1', '1', '0', '1'],
    ],
  });

  // Scalar input for k × M
  const [scalarInput, setScalarInput] = useState<string>('2');

  // Result state
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [resultScalar, setResultScalar] = useState<{ title: string; value: number } | null>(null);
  const [resultTitle, setResultTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('both');
  const [selectedResultCell, setSelectedResultCell] = useState<{ r: number; c: number } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Helper to extract numeric 2D array for a matrix
  const getNumericMatrix = (id: MatrixId, rCount: number = rows, cCount: number = cols): number[][] => {
    const raw = matrixData[id];
    return Array.from({ length: rCount }, (_, r) =>
      Array.from({ length: cCount }, (_, c) => MatrixEngine.parseNumberOrFraction(raw[r]?.[c] || '0'))
    );
  };

  const updateCell = (r: number, c: number, val: string) => {
    setMatrixData((prev) => {
      const current = prev[activeMatrixId];
      const next = current.map((rowArr, rIdx) =>
        rowArr.map((cellVal, cIdx) => (rIdx === r && cIdx === c ? val : cellVal))
      );
      return {
        ...prev,
        [activeMatrixId]: next,
      };
    });
    setErrorMessage(null);
  };

  // Preset dimension handler
  const setDimensions = (r: number, c: number) => {
    setRows(r);
    setCols(c);
    setResultMatrix(null);
    setResultScalar(null);
    setSelectedResultCell(null);
    setErrorMessage(null);
  };

  // Fill utilities
  const fillIdentity = () => {
    setMatrixData((prev) => {
      const next = Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (r === c && r < Math.min(rows, cols) ? '1' : '0'))
      );
      return { ...prev, [activeMatrixId]: next };
    });
    setErrorMessage(null);
  };

  const fillZero = () => {
    setMatrixData((prev) => {
      const next = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => '0'));
      return { ...prev, [activeMatrixId]: next };
    });
    setErrorMessage(null);
  };

  const fillSample = () => {
    setMatrixData((prev) => {
      const samples: string[][] = [
        ['1', '2', '1', '2'],
        ['3', '8', '1', '4'],
        ['0', '4', '1', '1'],
        ['1', '0', '2', '3'],
      ];
      return { ...prev, [activeMatrixId]: samples };
    });
    setErrorMessage(null);
  };

  // Matrix Operations
  const handleDeterminant = () => {
    try {
      if (rows !== cols) {
        throw new Error('Determinant requires a square matrix');
      }
      const mat = getNumericMatrix(activeMatrixId);
      const det = MatrixEngine.determinant(mat);
      setResultMatrix(null);
      setResultScalar({ title: `det(${activeMatrixId})`, value: det });
      setResultTitle(`Determinant of ${activeMatrixId}`);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing determinant');
      setResultMatrix(null);
      setResultScalar(null);
    }
  };

  const handleInverse = () => {
    try {
      if (rows !== cols) {
        throw new Error('Inverse requires a square matrix');
      }
      const mat = getNumericMatrix(activeMatrixId);
      const inv = MatrixEngine.inverse(mat);
      setResultMatrix(inv);
      setResultScalar(null);
      setResultTitle(`Inverse (${activeMatrixId}⁻¹)`);
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Matrix is singular (det = 0)');
      setResultMatrix(null);
      setResultScalar(null);
    }
  };

  const handleTranspose = () => {
    try {
      const mat = getNumericMatrix(activeMatrixId);
      const trn = MatrixEngine.transpose(mat);
      setResultMatrix(trn);
      setResultScalar(null);
      setResultTitle(`Transpose (${activeMatrixId}ᵀ)`);
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing transpose');
    }
  };

  const handleTrace = () => {
    try {
      const mat = getNumericMatrix(activeMatrixId);
      const tr = MatrixEngine.trace(mat);
      setResultMatrix(null);
      setResultScalar({ title: `tr(${activeMatrixId})`, value: tr });
      setResultTitle(`Trace of ${activeMatrixId}`);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing trace');
    }
  };

  const handleRank = () => {
    try {
      const mat = getNumericMatrix(activeMatrixId);
      const r = MatrixEngine.rank(mat);
      setResultMatrix(null);
      setResultScalar({ title: `rank(${activeMatrixId})`, value: r });
      setResultTitle(`Rank of ${activeMatrixId}`);
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing rank');
    }
  };

  const handleRref = () => {
    try {
      const mat = getNumericMatrix(activeMatrixId);
      const r = MatrixEngine.rref(mat);
      setResultMatrix(r);
      setResultScalar(null);
      setResultTitle(`Reduced Row Echelon Form: RREF(${activeMatrixId})`);
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing RREF');
    }
  };

  const handleRef = () => {
    try {
      const mat = getNumericMatrix(activeMatrixId);
      const r = MatrixEngine.ref(mat);
      setResultMatrix(r);
      setResultScalar(null);
      setResultTitle(`Row Echelon Form: REF(${activeMatrixId})`);
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing REF');
    }
  };

  const handlePower = (p: number) => {
    try {
      if (rows !== cols) {
        throw new Error('Power requires a square matrix');
      }
      const mat = getNumericMatrix(activeMatrixId);
      const res = MatrixEngine.power(mat, p);
      setResultMatrix(res);
      setResultScalar(null);
      setResultTitle(`${activeMatrixId}^${p}`);
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing power');
    }
  };

  const handleScalarMultiply = () => {
    try {
      const k = MatrixEngine.parseNumberOrFraction(scalarInput);
      const mat = getNumericMatrix(activeMatrixId);
      const res = MatrixEngine.scalarMultiply(mat, k);
      setResultMatrix(res);
      setResultScalar(null);
      setResultTitle(`${k} × ${activeMatrixId}`);
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error computing scalar multiplication');
    }
  };

  const handleAdd = () => {
    try {
      const a = getNumericMatrix('MatA');
      const b = getNumericMatrix('MatB');
      const res = MatrixEngine.add(a, b);
      setResultMatrix(res);
      setResultScalar(null);
      setResultTitle('MatA + MatB');
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Dimension mismatch for addition');
    }
  };

  const handleSubtract = () => {
    try {
      const a = getNumericMatrix('MatA');
      const b = getNumericMatrix('MatB');
      const res = MatrixEngine.subtract(a, b);
      setResultMatrix(res);
      setResultScalar(null);
      setResultTitle('MatA − MatB');
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Dimension mismatch for subtraction');
    }
  };

  const handleMultiply = () => {
    try {
      const a = getNumericMatrix('MatA');
      const b = getNumericMatrix('MatB');
      const res = MatrixEngine.multiply(a, b);
      setResultMatrix(res);
      setResultScalar(null);
      setResultTitle('MatA × MatB');
      setSelectedResultCell({ r: 0, c: 0 });
      setErrorMessage(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'Incompatible dimensions for multiplication');
    }
  };

  const copyResultToMatrix = (targetId: MatrixId) => {
    if (!resultMatrix) return;
    const rCount = resultMatrix.length;
    const cCount = resultMatrix[0].length;
    setRows(rCount);
    setCols(cCount);
    setMatrixData((prev) => {
      const updated = Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => {
          if (r < rCount && c < cCount) {
            const formatted = MatrixEngine.formatCell(resultMatrix[r][c]);
            return formatted.fraction;
          }
          return prev[targetId][r]?.[c] || '0';
        })
      );
      return { ...prev, [targetId]: updated };
    });
    setActiveMatrixId(targetId);
    setCopiedNotification(`Stored in ${targetId}`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // Toggle S <=> D format
  const toggleSd = () => {
    setDisplayFormat((prev) => {
      if (prev === 'fraction') return 'decimal';
      if (prev === 'decimal') return 'both';
      return 'fraction';
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-3 sm:p-4 overflow-y-auto">
      {/* Top Header */}
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
              <span>Matrix Mode</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">
                2x2 / 3x3 / 4x4
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Exact Fractions & Decimals with 4×4 Support</p>
          </div>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-medium"
        >
          Back to Calc
        </button>
      </div>

      {/* Matrix Selector & Dimension Preset Buttons */}
      <div className="my-3 space-y-2">
        {/* Active Matrix Choice */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1.5">
            {(['MatA', 'MatB'] as MatrixId[]).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setActiveMatrixId(id);
                  setErrorMessage(null);
                }}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition flex items-center gap-1 ${
                  activeMatrixId === id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{id}</span>
                <span className="text-[10px] opacity-75 font-mono">[{rows}×{cols}]</span>
              </button>
            ))}
          </div>

          {/* Quick Clear / Reset */}
          <div className="flex items-center space-x-1">
            <button
              onClick={fillIdentity}
              className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded border border-slate-700"
              title="Identity Matrix"
            >
              Identity
            </button>
            <button
              onClick={fillZero}
              className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
              title="Zero Matrix"
            >
              Clear (0)
            </button>
            <button
              onClick={fillSample}
              className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700"
              title="Fill Sample Numbers"
            >
              Sample
            </button>
          </div>
        </div>

        {/* Dimension Switcher: 2x2, 3x3, 4x4 */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium pl-1">Size:</span>
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setDimensions(n, n)}
              className={`flex-1 py-1 text-xs rounded font-bold transition ${
                rows === n && cols === n
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {n} × {n}
            </button>
          ))}
          {/* Custom Dimension Selector */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
            <span>R:</span>
            <select
              value={rows}
              onChange={(e) => setDimensions(parseInt(e.target.value), cols)}
              className="bg-slate-800 border border-slate-700 rounded px-1 text-xs text-white"
            >
              {[1, 2, 3, 4].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span>C:</span>
            <select
              value={cols}
              onChange={(e) => setDimensions(rows, parseInt(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded px-1 text-xs text-white"
            >
              {[1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col items-center shadow-inner">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-400">
              {activeMatrixId} [{rows} × {cols}]
            </span>
            <span className="text-[10px] text-slate-500">
              (accepts numbers and fractions like 1/2, -3/4)
            </span>
          </div>
          {copiedNotification && (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 animate-pulse">
              <Check className="w-3 h-3" /> {copiedNotification}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 my-1 max-w-full overflow-x-auto py-1">
          {/* Left Bracket */}
          <div className="w-2.5 border-l-2 border-t-2 border-b-2 border-sky-400 self-stretch rounded-l" />

          {/* Grid Rows */}
          <div className="flex flex-col space-y-1.5">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="flex space-x-1.5 sm:space-x-2">
                {Array.from({ length: cols }).map((_, c) => (
                  <input
                    key={c}
                    type="text"
                    value={matrixData[activeMatrixId][r]?.[c] || '0'}
                    onChange={(e) => updateCell(r, c, e.target.value)}
                    placeholder="0"
                    className="w-14 sm:w-16 h-9 sm:h-10 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-md text-center text-white font-mono text-xs sm:text-sm focus:border-sky-400 focus:bg-slate-900 focus:outline-none transition shadow-sm"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Right Bracket */}
          <div className="w-2.5 border-r-2 border-t-2 border-b-2 border-sky-400 self-stretch rounded-r" />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2 p-2 bg-rose-950/70 border border-rose-800 rounded-lg text-rose-300 text-xs font-mono">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Single Matrix Operations */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Single Matrix Operations ({activeMatrixId})
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          <button
            onClick={handleDeterminant}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Determinant</span>
            <span className="text-[10px] text-slate-400 font-mono">det(M)</span>
          </button>
          <button
            onClick={handleInverse}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-emerald-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Inverse</span>
            <span className="text-[10px] text-slate-400 font-mono">M⁻¹</span>
          </button>
          <button
            onClick={handleTranspose}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-amber-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Transpose</span>
            <span className="text-[10px] text-slate-400 font-mono">Mᵀ</span>
          </button>
          <button
            onClick={handleTrace}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-purple-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Trace</span>
            <span className="text-[10px] text-slate-400 font-mono">tr(M)</span>
          </button>
          <button
            onClick={handleRref}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-teal-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>RREF</span>
            <span className="text-[10px] text-slate-400 font-mono">Reduced Echelon</span>
          </button>
          <button
            onClick={handleRef}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>REF</span>
            <span className="text-[10px] text-slate-400 font-mono">Row Echelon</span>
          </button>
          <button
            onClick={handleRank}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-orange-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Rank</span>
            <span className="text-[10px] text-slate-400 font-mono">rank(M)</span>
          </button>
          <button
            onClick={() => handlePower(2)}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-indigo-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Square</span>
            <span className="text-[10px] text-slate-400 font-mono">M²</span>
          </button>
          <button
            onClick={() => handlePower(3)}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-indigo-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Cube</span>
            <span className="text-[10px] text-slate-400 font-mono">M³</span>
          </button>
          {/* Scalar Multiply with Inline Input */}
          <div className="col-span-2 sm:col-span-3 flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 space-x-2">
            <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">Scalar k × M:</span>
            <input
              type="text"
              value={scalarInput}
              onChange={(e) => setScalarInput(e.target.value)}
              placeholder="k (e.g. 2 or 1/2)"
              className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white text-center font-mono focus:border-sky-400 focus:outline-none"
            />
            <button
              onClick={handleScalarMultiply}
              className="flex-1 py-1 bg-sky-600 hover:bg-sky-500 rounded text-xs font-bold text-white transition cursor-pointer"
            >
              Multiply
            </button>
          </div>
        </div>
      </div>

      {/* Two Matrix Operations */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Two Matrix Arithmetic (MatA & MatB)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleAdd}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-emerald-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Add</span>
            <span className="text-[10px] text-slate-400 font-mono">MatA + MatB</span>
          </button>
          <button
            onClick={handleSubtract}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-rose-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Subtract</span>
            <span className="text-[10px] text-slate-400 font-mono">MatA − MatB</span>
          </button>
          <button
            onClick={handleMultiply}
            className="py-2 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 cursor-pointer transition flex flex-col items-center justify-center"
          >
            <span>Multiply</span>
            <span className="text-[10px] text-slate-400 font-mono">MatA × MatB</span>
          </button>
        </div>
      </div>

      {/* RESULT SECTION: Dual Type Decimal and Fraction Display */}
      {(resultMatrix !== null || resultScalar !== null) && (
        <div className="mt-4 p-3.5 bg-slate-950 rounded-xl border border-sky-900/60 shadow-lg">
          {/* Result Header & Display Type Switcher */}
          <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-800 gap-2">
            <div>
              <p className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <span>Result: {resultTitle}</span>
              </p>
              {resultMatrix && (
                <p className="text-[10px] text-slate-400 font-mono">
                  Dimensions: [{resultMatrix.length} × {resultMatrix[0]?.length || 0}]
                </p>
              )}
            </div>

            {/* Decimal / Fraction / Both Mode Switcher */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDisplayFormat('fraction')}
                className={`px-2 py-0.5 text-[11px] rounded font-semibold transition ${
                  displayFormat === 'fraction' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Exact Simplified Fractions"
              >
                Fraction
              </button>
              <button
                onClick={() => setDisplayFormat('decimal')}
                className={`px-2 py-0.5 text-[11px] rounded font-semibold transition ${
                  displayFormat === 'decimal' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Decimal Representation"
              >
                Decimal
              </button>
              <button
                onClick={() => setDisplayFormat('both')}
                className={`px-2 py-0.5 text-[11px] rounded font-semibold transition ${
                  displayFormat === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Show Both Fraction & Decimal"
              >
                Both
              </button>
              <button
                onClick={toggleSd}
                className="px-2 py-0.5 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-mono"
                title="Toggle S <=> D"
              >
                S⇔D
              </button>
            </div>
          </div>

          {/* Scalar Result (Det, Trace, Rank) */}
          {resultScalar && (
            <div className="my-2 p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-300">{resultScalar.title} =</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {MatrixEngine.formatCell(resultScalar.value).fraction}
                </span>
                {MatrixEngine.formatCell(resultScalar.value).fraction !== MatrixEngine.formatCell(resultScalar.value).decimal && (
                  <span className="text-sm font-mono text-slate-400">
                    ≈ {MatrixEngine.formatCell(resultScalar.value).decimal}
                  </span>
                )}
              </div>

              {/* Both types breakdown card */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                <div>
                  <span className="text-slate-500 text-[10px] block">EXACT FRACTION</span>
                  <span className="text-sky-300 font-bold text-sm">
                    {MatrixEngine.formatCell(resultScalar.value).fraction}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DECIMAL VALUE</span>
                  <span className="text-emerald-300 font-bold text-sm">
                    {MatrixEngine.formatCell(resultScalar.value).decimal}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Matrix 2D Result */}
          {resultMatrix && (
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 my-2 overflow-x-auto max-w-full p-1">
                {/* Left bracket */}
                <div className="w-3 border-l-2 border-t-2 border-b-2 border-emerald-400 self-stretch rounded-l" />

                {/* Grid */}
                <div className="flex flex-col space-y-1.5">
                  {resultMatrix.map((row, r) => (
                    <div key={r} className="flex space-x-1.5 sm:space-x-2">
                      {row.map((val, c) => {
                        const fmt = MatrixEngine.formatCell(val);
                        const isSelected = selectedResultCell?.r === r && selectedResultCell?.c === c;

                        return (
                          <button
                            key={c}
                            onClick={() => setSelectedResultCell({ r, c })}
                            className={`min-w-16 sm:min-w-20 px-2 py-1.5 rounded-lg border text-center font-mono cursor-pointer transition flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-sky-900/60 border-sky-400 ring-1 ring-sky-400'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {displayFormat === 'fraction' && (
                              <span className="text-xs sm:text-sm font-bold text-emerald-400">
                                {fmt.fraction}
                              </span>
                            )}
                            {displayFormat === 'decimal' && (
                              <span className="text-xs sm:text-sm font-bold text-sky-300">
                                {fmt.decimal}
                              </span>
                            )}
                            {displayFormat === 'both' && (
                              <div className="flex flex-col items-center leading-tight">
                                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                                  {fmt.fraction}
                                </span>
                                {fmt.fraction !== fmt.decimal && (
                                  <span className="text-[10px] text-slate-400">
                                    ≈ {fmt.decimal}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Right bracket */}
                <div className="w-3 border-r-2 border-t-2 border-b-2 border-emerald-400 self-stretch rounded-r" />
              </div>

              {/* Selected Cell Detailed Inspector */}
              {selectedResultCell && resultMatrix[selectedResultCell.r]?.[selectedResultCell.c] !== undefined && (
                <div className="w-full mt-2 p-2 bg-slate-900 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">
                      Element [{selectedResultCell.r + 1}, {selectedResultCell.c + 1}]:
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {MatrixEngine.formatCell(resultMatrix[selectedResultCell.r][selectedResultCell.c]).fraction}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-sky-300">
                      Dec: {MatrixEngine.formatCell(resultMatrix[selectedResultCell.r][selectedResultCell.c]).decimal}
                    </span>
                    {MatrixEngine.formatCell(resultMatrix[selectedResultCell.r][selectedResultCell.c]).mixed !== MatrixEngine.formatCell(resultMatrix[selectedResultCell.r][selectedResultCell.c]).fraction && (
                      <>
                        <span className="text-slate-500">|</span>
                        <span className="text-amber-300">
                          Mixed: {MatrixEngine.formatCell(resultMatrix[selectedResultCell.r][selectedResultCell.c]).mixed}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons on Result */}
              <div className="flex items-center space-x-2 mt-3 w-full">
                <button
                  onClick={() => copyResultToMatrix('MatA')}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Store into MatA</span>
                </button>
                <button
                  onClick={() => copyResultToMatrix('MatB')}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Store into MatB</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
