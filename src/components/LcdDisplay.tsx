import React, { useEffect, useRef } from 'react';
import { AngleUnit, CalculatorApp, CalculatorSettings } from '../model/calculatorSettings';

interface LcdDisplayProps {
  expression: string;
  cursorPosition: number;
  resultText: string;
  exactFractionText: string | null;
  errorMessage: string | null;
  isShiftActive: boolean;
  isAlphaActive: boolean;
  settings: CalculatorSettings;
  currentApp: CalculatorApp;
  onScreenClick?: () => void;
}

export const LcdDisplay: React.FC<LcdDisplayProps> = ({
  expression,
  cursorPosition,
  resultText,
  exactFractionText,
  errorMessage,
  isShiftActive,
  isAlphaActive,
  settings,
  currentApp,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression to cursor / end when updated
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression, cursorPosition]);

  const cursorPos = Math.max(0, Math.min(cursorPosition, expression.length));
  const beforeCursor = expression.substring(0, cursorPos);
  const afterCursor = expression.substring(cursorPos);

  const getAngleShortName = (unit: AngleUnit) => {
    switch (unit) {
      case 'DEG': return 'DEG';
      case 'RAD': return 'RAD';
      case 'GRAD': return 'GRAD';
    }
  };

  return (
    <div className="w-full rounded-xl bg-[#D4E6D9] border-2 border-slate-700 shadow-inner p-3 text-[#14241B] transition-all duration-150 select-none">
      {/* --- TOP STATUS BAR / ANNUNCIATORS --- */}
      <div className="flex items-center justify-between pb-1 border-b border-[#B8D4C2] text-xs font-mono font-semibold tracking-wide">
        <div className="flex items-center space-x-2">
          {/* Shift Annunciator */}
          {isShiftActive && (
            <span className="bg-[#D97706] text-white px-1.5 py-0.2 rounded text-[10px] font-bold shadow-xs animate-pulse">
              S
            </span>
          )}

          {/* Alpha Annunciator */}
          {isAlphaActive && (
            <span className="bg-[#DC2626] text-white px-1.5 py-0.2 rounded text-[10px] font-bold shadow-xs animate-pulse">
              A
            </span>
          )}

          {/* Mode Annunciator (DEG / RAD / GRAD) */}
          <span className="text-[#14241B] font-bold">
            {getAngleShortName(settings.angleUnit)}
          </span>

          {/* Math Indicator */}
          <span className="text-[#28543E] font-medium text-[11px]">
            Math
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Active App Mode Tag */}
          <span className="text-[#28543E] text-[10px] font-extrabold uppercase px-1 rounded bg-[#B8D4C2]/40 tracking-wider">
            {currentApp}
          </span>

          {/* Solar / Battery cell indicator */}
          <span className="text-[#14241B]/70 text-[10px]" title="Solar & Battery Powered">
            ■
          </span>
        </div>
      </div>

      {/* --- EXPRESSION INPUT LINE (With Live Blinking Cursor) --- */}
      <div
        ref={scrollRef}
        className="w-full min-h-[38px] flex items-center overflow-x-auto whitespace-pre font-mono text-xl font-medium tracking-normal py-1 px-0.5 scrollbar-thin"
      >
        <span>{beforeCursor || (afterCursor ? '' : ' ')}</span>
        <span className="inline-block w-[2px] h-[22px] bg-[#14241B] animate-pulse align-middle" />
        <span>{afterCursor}</span>
      </div>

      {/* --- RESULT READOUT LINE (Right-aligned) --- */}
      <div className="w-full flex flex-col items-end justify-center pt-1 min-h-[46px]">
        <div
          className={`font-mono text-3xl font-extrabold tracking-tight ${
            errorMessage ? 'text-red-700 animate-bounce' : 'text-[#14241B]'
          }`}
        >
          {resultText}
        </div>

        {exactFractionText && exactFractionText !== resultText && (
          <div className="text-xs font-mono text-[#28543E] font-semibold flex items-center space-x-1">
            <span>exact:</span>
            <span>{exactFractionText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
