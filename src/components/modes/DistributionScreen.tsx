import React, { useState } from 'react';
import { DistributionEngine } from '../../engine/distributionEngine';
import { ArrowLeft } from 'lucide-react';

interface DistributionScreenProps {
  onBackToCalculate: () => void;
}

export const DistributionScreen: React.FC<DistributionScreenProps> = ({ onBackToCalculate }) => {
  const [distType, setDistType] = useState<'NORM' | 'BINOM' | 'POISS'>('NORM');

  // Normal params
  const [normX, setNormX] = useState('1');
  const [normMean, setNormMean] = useState('0');
  const [normSd, setNormSd] = useState('1');

  // Binomial params
  const [binomX, setBinomX] = useState('3');
  const [binomN, setBinomN] = useState('10');
  const [binomP, setBinomP] = useState('0.5');

  // Poisson params
  const [poissX, setPoissX] = useState('2');
  const [poissLambda, setPoissLambda] = useState('3');

  const [resText, setResText] = useState<string | null>(null);

  const calcNormal = () => {
    try {
      const x = parseFloat(normX) || 0;
      const m = parseFloat(normMean) || 0;
      const s = parseFloat(normSd) || 1;
      const pd = DistributionEngine.normalPD(x, m, s);
      const cd = DistributionEngine.normalCD(-1000, x, m, s);
      setResText(`Normal Distribution:\nP(X = ${x}) = ${pd.toFixed(6)}\nP(X <= ${x}) = ${cd.toFixed(6)}`);
    } catch (e: any) {
      setResText(`Error: ${e.message}`);
    }
  };

  const calcBinomial = () => {
    try {
      const x = parseInt(binomX, 10) || 0;
      const n = parseInt(binomN, 10) || 1;
      const p = parseFloat(binomP) || 0.5;
      const pd = DistributionEngine.binomialPD(x, n, p);
      const cd = DistributionEngine.binomialCD(x, n, p);
      setResText(`Binomial Distribution (n=${n}, p=${p}):\nP(X = ${x}) = ${pd.toFixed(6)}\nP(X <= ${x}) = ${cd.toFixed(6)}`);
    } catch (e: any) {
      setResText(`Error: ${e.message}`);
    }
  };

  const calcPoisson = () => {
    try {
      const x = parseInt(poissX, 10) || 0;
      const l = parseFloat(poissLambda) || 1;
      const pd = DistributionEngine.poissonPD(x, l);
      const cd = DistributionEngine.poissonCD(x, l);
      setResText(`Poisson Distribution (λ=${l}):\nP(X = ${x}) = ${pd.toFixed(6)}\nP(X <= ${x}) = ${cd.toFixed(6)}`);
    } catch (e: any) {
      setResText(`Error: ${e.message}`);
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
          <h2 className="text-base font-bold text-white">Distribution Probability</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <button
          onClick={() => { setDistType('NORM'); setResText(null); }}
          className={`py-1.5 text-xs font-semibold rounded-lg transition ${
            distType === 'NORM' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => { setDistType('BINOM'); setResText(null); }}
          className={`py-1.5 text-xs font-semibold rounded-lg transition ${
            distType === 'BINOM' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Binomial
        </button>
        <button
          onClick={() => { setDistType('POISS'); setResText(null); }}
          className={`py-1.5 text-xs font-semibold rounded-lg transition ${
            distType === 'POISS' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Poisson
        </button>
      </div>

      {/* Input container */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        {distType === 'NORM' && (
          <div className="space-y-2">
            <p className="text-sky-400 font-semibold">Normal Distribution N(μ, σ²):</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">x Value:</label>
                <input
                  type="text"
                  value={normX}
                  onChange={(e) => setNormX(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Mean (μ):</label>
                <input
                  type="text"
                  value={normMean}
                  onChange={(e) => setNormMean(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Std Dev (σ):</label>
                <input
                  type="text"
                  value={normSd}
                  onChange={(e) => setNormSd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
            </div>
            <button
              onClick={calcNormal}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-lg cursor-pointer"
            >
              Calculate Normal Probabilities
            </button>
          </div>
        )}

        {distType === 'BINOM' && (
          <div className="space-y-2">
            <p className="text-sky-400 font-semibold">Binomial Distribution B(n, p):</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">x Successes:</label>
                <input
                  type="text"
                  value={binomX}
                  onChange={(e) => setBinomX(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Trials (n):</label>
                <input
                  type="text"
                  value={binomN}
                  onChange={(e) => setBinomN(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Prob (p):</label>
                <input
                  type="text"
                  value={binomP}
                  onChange={(e) => setBinomP(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
            </div>
            <button
              onClick={calcBinomial}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-lg cursor-pointer"
            >
              Calculate Binomial Probabilities
            </button>
          </div>
        )}

        {distType === 'POISS' && (
          <div className="space-y-2">
            <p className="text-sky-400 font-semibold">Poisson Distribution Po(λ):</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">x Events:</label>
                <input
                  type="text"
                  value={poissX}
                  onChange={(e) => setPoissX(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Rate (λ):</label>
                <input
                  type="text"
                  value={poissLambda}
                  onChange={(e) => setPoissLambda(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                />
              </div>
            </div>
            <button
              onClick={calcPoisson}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-lg cursor-pointer"
            >
              Calculate Poisson Probabilities
            </button>
          </div>
        )}
      </div>

      {/* Result readout */}
      {resText && (
        <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Result:</p>
          <pre className="text-emerald-400 font-mono text-sm font-bold whitespace-pre-wrap">
            {resText}
          </pre>
        </div>
      )}
    </div>
  );
};
