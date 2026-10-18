import React, { useState } from 'react';
import { EquationSolver } from '../../engine/equationSolver';
import { ArrowLeft } from 'lucide-react';

export type EquationType =
  | 'SIMULTANEOUS_2'
  | 'SIMULTANEOUS_3'
  | 'POLYNOMIAL_2'
  | 'POLYNOMIAL_3';

interface EquationScreenProps {
  onBackToCalculate: () => void;
}

export const EquationScreen: React.FC<EquationScreenProps> = ({ onBackToCalculate }) => {
  const [selectedType, setSelectedType] = useState<EquationType>('SIMULTANEOUS_2');

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

  // Polynomial inputs
  const [pA, setPA] = useState('1');
  const [pB, setPB] = useState('-5');
  const [pC, setPC] = useState('6');
  const [pD, setPD] = useState('0');

  const [solutionText, setSolutionText] = useState<string | null>(null);

  const solve = () => {
    try {
      if (selectedType === 'SIMULTANEOUS_2') {
        const coeffs = [
          [parseFloat(a1) || 0, parseFloat(b1) || 0],
          [parseFloat(a2) || 0, parseFloat(b2) || 0],
        ];
        const consts = [parseFloat(c1) || 0, parseFloat(c2) || 0];
        const res = EquationSolver.solveLinear(coeffs, consts);
        if (res.type === 'unique') {
          setSolutionText(`x = ${res.solutions[0]}\ny = ${res.solutions[1]}`);
        } else if (res.type === 'infinite') {
          setSolutionText('Infinitely many solutions');
        } else {
          setSolutionText('No solution');
        }
      } else if (selectedType === 'SIMULTANEOUS_3') {
        const coeffs = [
          [parseFloat(s3.a1) || 0, parseFloat(s3.b1) || 0, parseFloat(s3.c1) || 0],
          [parseFloat(s3.a2) || 0, parseFloat(s3.b2) || 0, parseFloat(s3.c2) || 0],
          [parseFloat(s3.a3) || 0, parseFloat(s3.b3) || 0, parseFloat(s3.c3) || 0],
        ];
        const consts = [
          parseFloat(s3.d1) || 0,
          parseFloat(s3.d2) || 0,
          parseFloat(s3.d3) || 0,
        ];
        const res = EquationSolver.solveLinear(coeffs, consts);
        if (res.type === 'unique') {
          setSolutionText(`x = ${res.solutions[0]}\ny = ${res.solutions[1]}\nz = ${res.solutions[2]}`);
        } else if (res.type === 'infinite') {
          setSolutionText('Infinitely many solutions');
        } else {
          setSolutionText('No solution');
        }
      } else if (selectedType === 'POLYNOMIAL_2') {
        const res = EquationSolver.solveQuadratic(
          parseFloat(pA) || 1,
          parseFloat(pB) || 0,
          parseFloat(pC) || 0
        );
        const minMax = res.isMinimum ? 'Min' : 'Max';
        setSolutionText(
          `x₁ = ${res.root1.toRectangularString(4)}\n` +
          `x₂ = ${res.root2.toRectangularString(4)}\n` +
          `Vertex (${minMax}): x = ${res.vertexX}, y = ${res.vertexY}`
        );
      } else if (selectedType === 'POLYNOMIAL_3') {
        const res = EquationSolver.solveCubic(
          parseFloat(pA) || 1,
          parseFloat(pB) || 0,
          parseFloat(pC) || 0,
          parseFloat(pD) || 0
        );
        setSolutionText(
          res.roots.map((r, idx) => `x${idx + 1} = ${r.toRectangularString(4)}`).join('\n')
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
          <h2 className="text-base font-bold text-white">Equation Solver</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Mode selection buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-3">
        <button
          onClick={() => { setSelectedType('SIMULTANEOUS_2'); setSolutionText(null); }}
          className={`py-1.5 px-2 text-xs rounded font-medium transition ${
            selectedType === 'SIMULTANEOUS_2' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Linear (2-Var)
        </button>
        <button
          onClick={() => { setSelectedType('SIMULTANEOUS_3'); setSolutionText(null); }}
          className={`py-1.5 px-2 text-xs rounded font-medium transition ${
            selectedType === 'SIMULTANEOUS_3' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Linear (3-Var)
        </button>
        <button
          onClick={() => { setSelectedType('POLYNOMIAL_2'); setSolutionText(null); }}
          className={`py-1.5 px-2 text-xs rounded font-medium transition ${
            selectedType === 'POLYNOMIAL_2' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Quadratic (ax²)
        </button>
        <button
          onClick={() => { setSelectedType('POLYNOMIAL_3'); setSolutionText(null); }}
          className={`py-1.5 px-2 text-xs rounded font-medium transition ${
            selectedType === 'POLYNOMIAL_3' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Cubic (ax³)
        </button>
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

        <button
          onClick={solve}
          data-testid="solve_equation_button"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg transition text-sm cursor-pointer shadow-sm"
        >
          Solve Equation
        </button>
      </div>

      {/* Solution readout */}
      {solutionText && (
        <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Solution:</p>
          <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap font-bold">
            {solutionText}
          </pre>
        </div>
      )}
    </div>
  );
};
