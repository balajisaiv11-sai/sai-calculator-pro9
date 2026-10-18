import React, { useState } from 'react';
import { EquationSolver } from '../../engine/equationSolver';
import { Fraction } from '../../engine/fraction';
import { ComplexNumber } from '../../engine/complexNumber';
import { ArrowLeft } from 'lucide-react';

export type EquationType =
  | 'SIMULTANEOUS_2'
  | 'SIMULTANEOUS_3'
  | 'SIMULTANEOUS_4'
  | 'POLYNOMIAL_2'
  | 'POLYNOMIAL_3'
  | 'POLYNOMIAL_4';

type DisplayFormat = 'both' | 'fraction' | 'decimal';

interface EquationScreenProps {
  onBackToCalculate: () => void;
}

export const EquationScreen: React.FC<EquationScreenProps> = ({ onBackToCalculate }) => {
  const [selectedType, setSelectedType] = useState<EquationType>('SIMULTANEOUS_2');
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('both');

  // Helper to parse number or fraction like "1/2"
  const parseVal = (str: string): number => {
    if (!str) return 0;
    const t = str.trim();
    if (t.includes('/')) {
      const p = t.split('/');
      const num = parseFloat(p[0]);
      const den = parseFloat(p[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    }
    const n = parseFloat(t);
    return isNaN(n) ? 0 : n;
  };

  const formatSolutionNumber = (val: number): string => {
    if (Math.abs(val) < 1e-12) return '0';
    if (Math.abs(val - Math.round(val)) < 1e-10) {
      return Math.round(val).toString();
    }
    let fracStr = '';
    try {
      const f = Fraction.fromDouble(val, 100000);
      fracStr = f.toString();
    } catch {
      fracStr = val.toFixed(4).replace(/\.?0+$/, '');
    }
    const decStr = val.toFixed(4).replace(/\.?0+$/, '');

    if (displayFormat === 'fraction') return fracStr;
    if (displayFormat === 'decimal') return decStr;
    // both
    return fracStr !== decStr ? `${fracStr}  (= ${decStr})` : fracStr;
  };

  const formatComplexRoot = (c: ComplexNumber): string => {
    if (Math.abs(c.imag) < 1e-10) {
      return formatSolutionNumber(c.real);
    }
    // Complex number display
    const r = formatSolutionNumber(c.real);
    const imSign = c.imag >= 0 ? '+' : '-';
    const imVal = formatSolutionNumber(Math.abs(c.imag));
    return `${r} ${imSign} ${imVal}i`;
  };

  // Simultaneous 2 unknowns: a1*x + b1*y = c1; a2*x + b2*y = c2
  const [a1, setA1] = useState('1');
  const [b1, setB1] = useState('1');
  const [c1, setC1] = useState('5');
  const [a2, setA2] = useState('2');
  const [b2, setB2] = useState('-1');
  const [c2, setC2] = useState('1');

  // Simultaneous 3 unknowns
  const [s3, setS3] = useState({
    a1: '1', b1: '2', c1: '-1', d1: '1',
    a2: '2', b2: '-1', c2: '1', d2: '3',
    a3: '3', b3: '1', c3: '-2', d3: '0',
  });

  // Simultaneous 4 unknowns (x, y, z, w)
  const [s4, setS4] = useState({
    a1: '1', b1: '1', c1: '1', d1: '1', e1: '10',
    a2: '1', b2: '-1', c2: '2', d2: '0', e2: '5',
    a3: '2', b3: '1', c3: '-1', d3: '1', e3: '7',
    a4: '1', b4: '2', c4: '1', d4: '-1', e4: '6',
  });

  // Polynomial inputs
  const [pA, setPA] = useState('1');
  const [pB, setPB] = useState('-5');
  const [pC, setPC] = useState('6');
  const [pD, setPD] = useState('0');
  const [pE, setPE] = useState('0');

  const [solutionText, setSolutionText] = useState<string | null>(null);

  const solve = () => {
    try {
      if (selectedType === 'SIMULTANEOUS_2') {
        const coeffs = [
          [parseVal(a1), parseVal(b1)],
          [parseVal(a2), parseVal(b2)],
        ];
        const consts = [parseVal(c1), parseVal(c2)];
        const res = EquationSolver.solveLinear(coeffs, consts);
        if (res.type === 'unique') {
          setSolutionText(
            `x = ${formatSolutionNumber(res.solutions[0])}\n` +
            `y = ${formatSolutionNumber(res.solutions[1])}`
          );
        } else if (res.type === 'infinite') {
          setSolutionText('Infinitely many solutions');
        } else {
          setSolutionText('No solution (Inconsistent system)');
        }
      } else if (selectedType === 'SIMULTANEOUS_3') {
        const coeffs = [
          [parseVal(s3.a1), parseVal(s3.b1), parseVal(s3.c1)],
          [parseVal(s3.a2), parseVal(s3.b2), parseVal(s3.c2)],
          [parseVal(s3.a3), parseVal(s3.b3), parseVal(s3.c3)],
        ];
        const consts = [parseVal(s3.d1), parseVal(s3.d2), parseVal(s3.d3)];
        const res = EquationSolver.solveLinear(coeffs, consts);
        if (res.type === 'unique') {
          setSolutionText(
            `x = ${formatSolutionNumber(res.solutions[0])}\n` +
            `y = ${formatSolutionNumber(res.solutions[1])}\n` +
            `z = ${formatSolutionNumber(res.solutions[2])}`
          );
        } else if (res.type === 'infinite') {
          setSolutionText('Infinitely many solutions');
        } else {
          setSolutionText('No solution');
        }
      } else if (selectedType === 'SIMULTANEOUS_4') {
        const coeffs = [
          [parseVal(s4.a1), parseVal(s4.b1), parseVal(s4.c1), parseVal(s4.d1)],
          [parseVal(s4.a2), parseVal(s4.b2), parseVal(s4.c2), parseVal(s4.d2)],
          [parseVal(s4.a3), parseVal(s4.b3), parseVal(s4.c3), parseVal(s4.d3)],
          [parseVal(s4.a4), parseVal(s4.b4), parseVal(s4.c4), parseVal(s4.d4)],
        ];
        const consts = [parseVal(s4.e1), parseVal(s4.e2), parseVal(s4.e3), parseVal(s4.e4)];
        const res = EquationSolver.solveLinear(coeffs, consts);
        if (res.type === 'unique') {
          setSolutionText(
            `x = ${formatSolutionNumber(res.solutions[0])}\n` +
            `y = ${formatSolutionNumber(res.solutions[1])}\n` +
            `z = ${formatSolutionNumber(res.solutions[2])}\n` +
            `w = ${formatSolutionNumber(res.solutions[3])}`
          );
        } else if (res.type === 'infinite') {
          setSolutionText('Infinitely many solutions');
        } else {
          setSolutionText('No solution');
        }
      } else if (selectedType === 'POLYNOMIAL_2') {
        const res = EquationSolver.solveQuadratic(
          parseVal(pA) || 1,
          parseVal(pB),
          parseVal(pC)
        );
        const minMax = res.isMinimum ? 'Min' : 'Max';
        setSolutionText(
          `x₁ = ${formatComplexRoot(res.root1)}\n` +
          `x₂ = ${formatComplexRoot(res.root2)}\n` +
          `Vertex (${minMax}): x = ${formatSolutionNumber(res.vertexX)}, y = ${formatSolutionNumber(res.vertexY)}`
        );
      } else if (selectedType === 'POLYNOMIAL_3') {
        const res = EquationSolver.solveCubic(
          parseVal(pA) || 1,
          parseVal(pB),
          parseVal(pC),
          parseVal(pD)
        );
        setSolutionText(
          res.roots.map((r, idx) => `x${idx + 1} = ${formatComplexRoot(r)}`).join('\n')
        );
      } else if (selectedType === 'POLYNOMIAL_4') {
        const res = EquationSolver.solveQuartic(
          parseVal(pA) || 1,
          parseVal(pB),
          parseVal(pC),
          parseVal(pD),
          parseVal(pE)
        );
        setSolutionText(
          res.roots.map((r, idx) => `x${idx + 1} = ${formatComplexRoot(r)}`).join('\n')
        );
      }
    } catch (e: any) {
      setSolutionText(`Error: ${e.message}`);
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
              <span>Equation Solver</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">
                Linear & Polynomial
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Simultaneous 2-4 Unknowns, Degrees 2-4 Quartic</p>
          </div>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Mode selection buttons */}
      <div className="my-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Equation Type:
          </span>
          {/* Decimal / Fraction Switcher */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => { setDisplayFormat('fraction'); if (solutionText) solve(); }}
              className={`px-2 py-0.5 rounded font-medium transition ${
                displayFormat === 'fraction' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fraction
            </button>
            <button
              onClick={() => { setDisplayFormat('decimal'); if (solutionText) solve(); }}
              className={`px-2 py-0.5 rounded font-medium transition ${
                displayFormat === 'decimal' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Decimal
            </button>
            <button
              onClick={() => { setDisplayFormat('both'); if (solutionText) solve(); }}
              className={`px-2 py-0.5 rounded font-medium transition ${
                displayFormat === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Both
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          <button
            onClick={() => { setSelectedType('SIMULTANEOUS_2'); setSolutionText(null); }}
            className={`py-1.5 px-1.5 text-xs rounded font-medium transition ${
              selectedType === 'SIMULTANEOUS_2' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Linear (2-Var)
          </button>
          <button
            onClick={() => { setSelectedType('SIMULTANEOUS_3'); setSolutionText(null); }}
            className={`py-1.5 px-1.5 text-xs rounded font-medium transition ${
              selectedType === 'SIMULTANEOUS_3' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Linear (3-Var)
          </button>
          <button
            onClick={() => { setSelectedType('SIMULTANEOUS_4'); setSolutionText(null); }}
            className={`py-1.5 px-1.5 text-xs rounded font-medium transition ${
              selectedType === 'SIMULTANEOUS_4' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Linear (4-Var)
          </button>
          <button
            onClick={() => { setSelectedType('POLYNOMIAL_2'); setSolutionText(null); }}
            className={`py-1.5 px-1.5 text-xs rounded font-medium transition ${
              selectedType === 'POLYNOMIAL_2' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Quadratic (ax²)
          </button>
          <button
            onClick={() => { setSelectedType('POLYNOMIAL_3'); setSolutionText(null); }}
            className={`py-1.5 px-1.5 text-xs rounded font-medium transition ${
              selectedType === 'POLYNOMIAL_3' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Cubic (ax³)
          </button>
          <button
            onClick={() => { setSelectedType('POLYNOMIAL_4'); setSolutionText(null); }}
            className={`py-1.5 px-1.5 text-xs rounded font-medium transition ${
              selectedType === 'POLYNOMIAL_4' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Quartic (ax⁴)
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        {selectedType === 'SIMULTANEOUS_2' && (
          <>
            <div>
              <p className="text-xs text-sky-400 font-mono mb-1 font-semibold">a₁x + b₁y = c₁</p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={a1}
                  onChange={(e) => setA1(e.target.value)}
                  placeholder="a₁"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
                />
                <input
                  type="text"
                  value={b1}
                  onChange={(e) => setB1(e.target.value)}
                  placeholder="b₁"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
                />
                <input
                  type="text"
                  value={c1}
                  onChange={(e) => setC1(e.target.value)}
                  placeholder="c₁"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-sky-400 font-mono mb-1 font-semibold">a₂x + b₂y = c₂</p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={a2}
                  onChange={(e) => setA2(e.target.value)}
                  placeholder="a₂"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
                />
                <input
                  type="text"
                  value={b2}
                  onChange={(e) => setB2(e.target.value)}
                  placeholder="b₂"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
                />
                <input
                  type="text"
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                  placeholder="c₂"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
                />
              </div>
            </div>
          </>
        )}

        {selectedType === 'SIMULTANEOUS_3' && (
          <>
            <p className="text-xs text-sky-400 font-mono font-semibold">aₙx + bₙy + cₙz = dₙ</p>
            {[1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-1.5">
                {(['a', 'b', 'c', 'd'] as const).map((col) => {
                  const key = `${col}${row}` as keyof typeof s3;
                  return (
                    <input
                      key={key}
                      type="text"
                      value={s3[key]}
                      onChange={(e) => setS3({ ...s3, [key]: e.target.value })}
                      placeholder={`${col}${row}`}
                      className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
                    />
                  );
                })}
              </div>
            ))}
          </>
        )}

        {selectedType === 'SIMULTANEOUS_4' && (
          <>
            <p className="text-xs text-sky-400 font-mono font-semibold">aₙx + bₙy + cₙz + dₙw = eₙ</p>
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="grid grid-cols-5 gap-1.5">
                {(['a', 'b', 'c', 'd', 'e'] as const).map((col) => {
                  const key = `${col}${row}` as keyof typeof s4;
                  return (
                    <input
                      key={key}
                      type="text"
                      value={s4[key]}
                      onChange={(e) => setS4({ ...s4, [key]: e.target.value })}
                      placeholder={`${col}${row}`}
                      className="bg-slate-800 border border-slate-700 rounded px-1 py-1 text-[11px] text-center text-white font-mono"
                    />
                  );
                })}
              </div>
            ))}
          </>
        )}

        {selectedType === 'POLYNOMIAL_2' && (
          <div>
            <p className="text-xs text-sky-400 font-mono mb-1 font-semibold">ax² + bx + c = 0</p>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={pA}
                onChange={(e) => setPA(e.target.value)}
                placeholder="a"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
              />
              <input
                type="text"
                value={pB}
                onChange={(e) => setPB(e.target.value)}
                placeholder="b"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
              />
              <input
                type="text"
                value={pC}
                onChange={(e) => setPC(e.target.value)}
                placeholder="c"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-white font-mono"
              />
            </div>
          </div>
        )}

        {selectedType === 'POLYNOMIAL_3' && (
          <div>
            <p className="text-xs text-sky-400 font-mono mb-1 font-semibold">ax³ + bx² + cx + d = 0</p>
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                value={pA}
                onChange={(e) => setPA(e.target.value)}
                placeholder="a"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pB}
                onChange={(e) => setPB(e.target.value)}
                placeholder="b"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pC}
                onChange={(e) => setPC(e.target.value)}
                placeholder="c"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pD}
                onChange={(e) => setPD(e.target.value)}
                placeholder="d"
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white font-mono"
              />
            </div>
          </div>
        )}

        {selectedType === 'POLYNOMIAL_4' && (
          <div>
            <p className="text-xs text-sky-400 font-mono mb-1 font-semibold">ax⁴ + bx³ + cx² + dx + e = 0</p>
            <div className="grid grid-cols-5 gap-1.5">
              <input
                type="text"
                value={pA}
                onChange={(e) => setPA(e.target.value)}
                placeholder="a"
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pB}
                onChange={(e) => setPB(e.target.value)}
                placeholder="b"
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pC}
                onChange={(e) => setPC(e.target.value)}
                placeholder="c"
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pD}
                onChange={(e) => setPD(e.target.value)}
                placeholder="d"
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
              />
              <input
                type="text"
                value={pE}
                onChange={(e) => setPE(e.target.value)}
                placeholder="e"
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
              />
            </div>
          </div>
        )}

        <button
          onClick={solve}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg transition text-sm cursor-pointer shadow-sm"
        >
          Solve Equation
        </button>
      </div>

      {/* Solution readout */}
      {solutionText && (
        <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 mb-1">Solution:</p>
          <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap font-bold">
            {solutionText}
          </pre>
        </div>
      )}
    </div>
  );
};
