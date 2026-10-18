import React, { useState } from 'react';
import { UnitCategory, UnitConversionEngine, UnitItem } from '../../engine/unitConversionEngine';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

interface UnitConversionScreenProps {
  onBackToCalculate: () => void;
}

export const UnitConversionScreen: React.FC<UnitConversionScreenProps> = ({ onBackToCalculate }) => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(UnitConversionEngine.categories[0]);
  const [fromUnit, setFromUnit] = useState<UnitItem>(selectedCategory.units[0]);
  const [toUnit, setToUnit] = useState<UnitItem>(selectedCategory.units[1] || selectedCategory.units[0]);
  const [inputValue, setInputValue] = useState('1');

  const onSelectCategory = (cat: UnitCategory) => {
    setSelectedCategory(cat);
    setFromUnit(cat.units[0]);
    setToUnit(cat.units[1] || cat.units[0]);
  };

  const val = parseFloat(inputValue) || 0;
  const result = UnitConversionEngine.convert(val, fromUnit, toUnit);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
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
          <h2 className="text-base font-bold text-white">Unit Conversion</h2>
        </div>
        <button
          onClick={onBackToCalculate}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
        >
          Back to Calc
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 my-3">
        {UnitConversionEngine.categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedCategory.name === cat.name
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Conversion Interface */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
        {/* Input */}
        <div>
          <label className="text-xs text-slate-400 font-mono mb-1 block">Value to Convert:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg focus:border-sky-400 focus:outline-none"
          />
        </div>

        {/* From & To Selectors */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">From:</span>
            <select
              value={fromUnit.id}
              onChange={(e) => {
                const u = selectedCategory.units.find((x) => x.id === e.target.value);
                if (u) setFromUnit(u);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
            >
              {selectedCategory.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapUnits}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 self-end mb-0.5 border border-slate-700 cursor-pointer"
            title="Swap Units"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">To:</span>
            <select
              value={toUnit.id}
              onChange={(e) => {
                const u = selectedCategory.units.find((x) => x.id === e.target.value);
                if (u) setToUnit(u);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
            >
              {selectedCategory.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result readout */}
        <div className="pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-mono mb-1">Converted Result:</p>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-baseline space-x-2 font-mono">
            <span className="text-2xl font-bold text-emerald-400">
              {Number.isInteger(result) ? result : result.toPrecision(6)}
            </span>
            <span className="text-sm font-semibold text-slate-300">{toUnit.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
