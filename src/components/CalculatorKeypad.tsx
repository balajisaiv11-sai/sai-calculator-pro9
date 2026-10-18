import React from 'react';

export type KeyStyle =
  | 'NUMBER'
  | 'FUNCTION'
  | 'MODIFIER_SHIFT'
  | 'MODIFIER_ALPHA'
  | 'DELETE'
  | 'CLEAR'
  | 'EXECUTE'
  | 'SYSTEM';

interface CalculatorKeyProps {
  label: string;
  shiftLabel?: string;
  alphaLabel?: string;
  style?: KeyStyle;
  testTag?: string;
  className?: string;
  onClick: () => void;
}

export const CalculatorKey: React.FC<CalculatorKeyProps> = ({
  label,
  shiftLabel,
  alphaLabel,
  style = 'NUMBER',
  testTag,
  className = '',
  onClick,
}) => {
  const getBgStyle = () => {
    switch (style) {
      case 'NUMBER':
        return 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white shadow-sm border border-slate-700/60';
      case 'FUNCTION':
        return 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 shadow-sm border border-slate-600/60';
      case 'MODIFIER_SHIFT':
        return 'bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white shadow-sm font-bold border border-amber-600/70';
      case 'MODIFIER_ALPHA':
        return 'bg-rose-700 hover:bg-rose-600 active:bg-rose-800 text-white shadow-sm font-bold border border-rose-600/70';
      case 'DELETE':
        return 'bg-slate-600 hover:bg-slate-500 active:bg-slate-700 text-white shadow-sm border border-slate-500/60';
      case 'CLEAR':
        return 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-sm font-bold border border-red-500/70';
      case 'EXECUTE':
        return 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md font-bold border border-blue-500/80';
      case 'SYSTEM':
        return 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-200 shadow-sm border border-slate-800/80';
    }
  };

  return (
    <div className={`flex flex-col items-center px-0.5 py-0.5 ${className}`}>
      {/* Shift & Alpha secondary printed labels */}
      <div className="w-full h-3 flex items-center justify-between px-0.5 text-[9px] font-bold tracking-tight">
        <span className="text-amber-400 truncate">{shiftLabel || ''}</span>
        <span className="text-red-400 truncate">{alphaLabel || ''}</span>
      </div>

      {/* Button body */}
      <button
        type="button"
        data-testid={testTag}
        onClick={onClick}
        className={`w-full h-10 sm:h-11 rounded-lg flex items-center justify-center transition-all duration-100 select-none cursor-pointer active:scale-95 text-center font-medium ${
          label.length > 3 ? 'text-xs' : 'text-sm sm:text-base'
        } ${getBgStyle()}`}
      >
        {label}
      </button>
    </div>
  );
};

interface CalculatorKeypadProps {
  isShiftActive: boolean;
  isAlphaActive: boolean;
  onKeyClick: (key: string) => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  isShiftActive,
  isAlphaActive,
  onKeyClick,
}) => {
  return (
    <div className="w-full flex flex-col space-y-0.5 p-1 select-none">
      {/* ROW 1: SYSTEM CONTROLS (SHIFT, ALPHA, HOME, CATALOG, TOOLS, SETTINGS) */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey
          label="SHIFT"
          style={isShiftActive ? 'CLEAR' : 'MODIFIER_SHIFT'}
          testTag="key_shift"
          onClick={() => onKeyClick('SHIFT')}
        />
        <CalculatorKey
          label="ALPHA"
          style={isAlphaActive ? 'CLEAR' : 'MODIFIER_ALPHA'}
          testTag="key_alpha"
          onClick={() => onKeyClick('ALPHA')}
        />
        <CalculatorKey
          label="HOME"
          style="SYSTEM"
          testTag="key_home"
          onClick={() => onKeyClick('HOME')}
        />
        <CalculatorKey
          label="CATALOG"
          style="SYSTEM"
          testTag="key_catalog"
          onClick={() => onKeyClick('CATALOG')}
        />
        <CalculatorKey
          label="TOOLS"
          style="SYSTEM"
          testTag="key_tools"
          onClick={() => onKeyClick('TOOLS')}
        />
        <CalculatorKey
          label="⚙"
          style="SYSTEM"
          testTag="key_settings"
          onClick={() => onKeyClick('SETTINGS')}
        />
      </div>

      {/* ROW 2: SCIENTIFIC FUNCTIONS (Abs, log, ln, sin, cos, tan) */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="Abs" style="FUNCTION" testTag="key_abs" onClick={() => onKeyClick('abs')} />
        <CalculatorKey label="log" shiftLabel="10ˣ" style="FUNCTION" testTag="key_log" onClick={() => onKeyClick('log')} />
        <CalculatorKey label="ln" shiftLabel="eˣ" style="FUNCTION" testTag="key_ln" onClick={() => onKeyClick('ln')} />
        <CalculatorKey label="sin" shiftLabel="sin⁻¹" style="FUNCTION" testTag="key_sin" onClick={() => onKeyClick('sin')} />
        <CalculatorKey label="cos" shiftLabel="cos⁻¹" style="FUNCTION" testTag="key_cos" onClick={() => onKeyClick('cos')} />
        <CalculatorKey label="tan" shiftLabel="tan⁻¹" style="FUNCTION" testTag="key_tan" onClick={() => onKeyClick('tan')} />
      </div>

      {/* ROW 3: POWERS, ROOTS & CALCULUS (x², √, xʸ, f(x), g(x), ∫) */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="x²" shiftLabel="x³" style="FUNCTION" testTag="key_square" onClick={() => onKeyClick('square')} />
        <CalculatorKey label="√" shiftLabel="³√" style="FUNCTION" testTag="key_sqrt" onClick={() => onKeyClick('sqrt')} />
        <CalculatorKey label="xʸ" shiftLabel="ʸ√x" style="FUNCTION" testTag="key_power" onClick={() => onKeyClick('pow')} />
        <CalculatorKey label="f(x)" style="FUNCTION" testTag="key_fx" onClick={() => onKeyClick('fx')} />
        <CalculatorKey label="g(x)" style="FUNCTION" testTag="key_gx" onClick={() => onKeyClick('gx')} />
        <CalculatorKey label="∫" shiftLabel="d/dx" style="FUNCTION" testTag="key_integral" onClick={() => onKeyClick('diff_int')} />
      </div>

      {/* ROW 4: MEMORY, ENG & EDITING (RCL, ENG, ◀, ▶, DEL, AC) */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="RCL" shiftLabel="STO" style="FUNCTION" testTag="key_rcl" onClick={() => onKeyClick('RCL')} />
        <CalculatorKey label="ENG" alphaLabel="i" style="FUNCTION" testTag="key_eng" onClick={() => onKeyClick('i')} />
        <CalculatorKey label="◀" style="FUNCTION" testTag="key_left" onClick={() => onKeyClick('LEFT')} />
        <CalculatorKey label="▶" style="FUNCTION" testTag="key_right" onClick={() => onKeyClick('RIGHT')} />
        <CalculatorKey label="DEL" shiftLabel="INS" style="DELETE" testTag="key_del" onClick={() => onKeyClick('DEL')} />
        <CalculatorKey label="AC" shiftLabel="OFF" style="CLEAR" testTag="key_ac" onClick={() => onKeyClick('AC')} />
      </div>

      {/* ROW 5: NUMBERS 7, 8, 9, PARENS, S⇔D */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="7" alphaLabel="A" style="NUMBER" testTag="key_7" onClick={() => onKeyClick('7')} />
        <CalculatorKey label="8" alphaLabel="B" style="NUMBER" testTag="key_8" onClick={() => onKeyClick('8')} />
        <CalculatorKey label="9" alphaLabel="C" style="NUMBER" testTag="key_9" onClick={() => onKeyClick('9')} />
        <CalculatorKey label="(" style="FUNCTION" testTag="key_lparen" onClick={() => onKeyClick('lparen')} />
        <CalculatorKey label=")" style="FUNCTION" testTag="key_rparen" onClick={() => onKeyClick('rparen')} />
        <CalculatorKey label="S⇔D" shiftLabel="a b/c" style="FUNCTION" testTag="key_format" onClick={() => onKeyClick('SD')} />
      </div>

      {/* ROW 6: NUMBERS 4, 5, 6, MULTIPLY, DIVIDE */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="4" alphaLabel="D" style="NUMBER" testTag="key_4" onClick={() => onKeyClick('4')} />
        <CalculatorKey label="5" alphaLabel="E" style="NUMBER" testTag="key_5" onClick={() => onKeyClick('5')} />
        <CalculatorKey label="6" alphaLabel="F" style="NUMBER" testTag="key_6" onClick={() => onKeyClick('6')} />
        <CalculatorKey label="×" shiftLabel="nPr" style="FUNCTION" className="col-span-1" testTag="key_mul" onClick={() => onKeyClick('mul')} />
        <CalculatorKey label="÷" shiftLabel="nCr" style="FUNCTION" className="col-span-2" testTag="key_div" onClick={() => onKeyClick('div')} />
      </div>

      {/* ROW 7: NUMBERS 1, 2, 3, PLUS, MINUS */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="1" alphaLabel="x" style="NUMBER" testTag="key_1" onClick={() => onKeyClick('1')} />
        <CalculatorKey label="2" alphaLabel="y" style="NUMBER" testTag="key_2" onClick={() => onKeyClick('2')} />
        <CalculatorKey label="3" alphaLabel="z" style="NUMBER" testTag="key_3" onClick={() => onKeyClick('3')} />
        <CalculatorKey label="+" shiftLabel="Pol" style="FUNCTION" className="col-span-1" testTag="key_add" onClick={() => onKeyClick('add')} />
        <CalculatorKey label="−" shiftLabel="Rec" style="FUNCTION" className="col-span-2" testTag="key_sub" onClick={() => onKeyClick('sub')} />
      </div>

      {/* ROW 8: NUMBER 0, DECIMAL, POW10, ANS, EXE */}
      <div className="grid grid-cols-6 gap-1 w-full">
        <CalculatorKey label="0" style="NUMBER" testTag="key_0" onClick={() => onKeyClick('0')} />
        <CalculatorKey label="•" shiftLabel="Ran#" style="NUMBER" testTag="key_dot" onClick={() => onKeyClick('dot')} />
        <CalculatorKey label="×10ˣ" shiftLabel="π" alphaLabel="e" style="FUNCTION" testTag="key_exp10" onClick={() => onKeyClick('10X')} />
        <CalculatorKey label="Ans" shiftLabel="%" style="FUNCTION" testTag="key_ans" onClick={() => onKeyClick('Ans')} />
        <CalculatorKey label="EXE" style="EXECUTE" className="col-span-2" testTag="key_exe" onClick={() => onKeyClick('EXE')} />
      </div>
    </div>
  );
};
