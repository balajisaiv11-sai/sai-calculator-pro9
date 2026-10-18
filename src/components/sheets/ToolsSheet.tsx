import React from 'react';
import { CalculatorApp } from '../../model/calculatorSettings';
import { X, Wrench } from 'lucide-react';

interface ToolCommand {
  name: string;
  notation: string;
  description: string;
}

interface ToolsSheetProps {
  activeApp: CalculatorApp;
  onExecuteTool: (tool: string) => void;
  onDismiss: () => void;
}

export const ToolsSheet: React.FC<ToolsSheetProps> = ({
  activeApp,
  onExecuteTool,
  onDismiss,
}) => {
  const getTools = (): ToolCommand[] => {
    switch (activeApp) {
      case 'CALCULATE':
        return [
          { name: 'Factorial (n!)', notation: '!', description: 'Appends factorial' },
          { name: 'Permutation (nPr)', notation: 'npr(', description: 'Combinatorics nPr' },
          { name: 'Combination (nCr)', notation: 'ncr(', description: 'Combinatorics nCr' },
          { name: 'Polar Coordinates', notation: 'Pol(', description: 'Rectangular to polar' },
          { name: 'Rectangular Coordinates', notation: 'Rec(', description: 'Polar to rectangular' },
          { name: 'Greatest Common Divisor', notation: 'gcd(', description: 'GCD of two numbers' },
          { name: 'Least Common Multiple', notation: 'lcm(', description: 'LCM of two numbers' },
        ];
      case 'COMPLEX':
        return [
          { name: 'Complex Conjugate', notation: 'conjg(', description: 'Conjugate a - bi' },
          { name: 'Argument Angle', notation: 'arg(', description: 'Angle in active unit' },
          { name: 'Real Part', notation: 'rep(', description: 'Extract real component' },
          { name: 'Imaginary Part', notation: 'imp(', description: 'Extract imaginary coefficient' },
          { name: 'Polar Form', notation: '▶r∠θ', description: 'Convert to polar magnitude and angle' },
        ];
      case 'BASE_N':
        return [
          { name: 'Decimal Base', notation: 'DEC', description: 'Switch to decimal base' },
          { name: 'Hexadecimal Base', notation: 'HEX', description: 'Switch to hexadecimal base' },
          { name: 'Binary Base', notation: 'BIN', description: 'Switch to binary base' },
          { name: 'Octal Base', notation: 'OCT', description: 'Switch to octal base' },
          { name: 'Bitwise AND', notation: ' and ', description: 'Bitwise AND' },
          { name: 'Bitwise OR', notation: ' or ', description: 'Bitwise OR' },
          { name: 'Bitwise XOR', notation: ' xor ', description: 'Bitwise XOR' },
          { name: 'Bitwise NOT', notation: ' not ', description: 'Bitwise NOT' },
        ];
      case 'MATRIX':
        return [
          { name: 'Determinant', notation: 'det(', description: 'Calculate determinant' },
          { name: 'Inverse', notation: 'inv(', description: 'Matrix inverse' },
          { name: 'Transpose', notation: 'trn(', description: 'Matrix transpose' },
          { name: 'Identity Matrix', notation: 'Identity(3)', description: '3x3 identity matrix' },
        ];
      case 'VECTOR':
        return [
          { name: 'Dot Product', notation: 'dot(', description: 'Scalar dot product' },
          { name: 'Cross Product', notation: 'cross(', description: 'Vector cross product' },
          { name: 'Vector Magnitude', notation: 'norm(', description: 'Vector norm/magnitude' },
          { name: 'Unit Vector', notation: 'unit(', description: 'Normalized unit vector' },
        ];
      default:
        return [
          { name: 'Calculate f(x)', notation: 'fx(', description: 'Custom function f(x)' },
          { name: 'Calculate g(x)', notation: 'gx(', description: 'Custom function g(x)' },
          { name: 'Numerical Derivative', notation: 'diff(', description: 'Derivative at point' },
          { name: 'Definite Integral', notation: 'integrate(', description: 'Integral over [a, b]' },
          { name: 'Summation Σ', notation: 'sum(', description: 'Summation over [a, b]' },
        ];
    }
  };

  const tools = getTools();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[80vh] bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white">TOOLS ({activeApp})</h2>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools list */}
        <div className="p-4 space-y-2 overflow-y-auto">
          {tools.map((t, idx) => (
            <div
              key={idx}
              onClick={() => {
                onExecuteTool(t.notation);
                onDismiss();
              }}
              className="p-3 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 border border-slate-750 rounded-xl flex items-center justify-between cursor-pointer transition"
            >
              <div>
                <p className="font-bold text-sky-400 font-mono text-sm">{t.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {t.notation}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
