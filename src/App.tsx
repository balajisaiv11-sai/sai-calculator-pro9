import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CalculatorApp,
  CalculatorSettings,
  defaultSettings,
} from './model/calculatorSettings';
import { MathEngine } from './engine/mathEngine';
import { FunctionRegistry } from './model/functionRegistry';
import { LcdDisplay } from './components/LcdDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';

// Dedicated Mode Screens
import { EquationScreen } from './components/modes/EquationScreen';
import { MatrixScreen } from './components/modes/MatrixScreen';
import { StatisticsScreen } from './components/modes/StatisticsScreen';
import { BaseNScreen } from './components/modes/BaseNScreen';
import { SpreadsheetScreen } from './components/modes/SpreadsheetScreen';
import { MathBoxScreen } from './components/modes/MathBoxScreen';
import { UnitConversionScreen } from './components/modes/UnitConversionScreen';
import { TableScreen } from './components/modes/TableScreen';
import { RatioScreen } from './components/modes/RatioScreen';
import { VectorScreen } from './components/modes/VectorScreen';
import { DistributionScreen } from './components/modes/DistributionScreen';

// Modal Sheets
import { ModeSelectorSheet } from './components/sheets/ModeSelectorSheet';
import { FunctionExplorerSheet } from './components/sheets/FunctionExplorerSheet';
import { CoverageDashboardSheet } from './components/sheets/CoverageDashboardSheet';
import { CatalogSheet } from './components/sheets/CatalogSheet';
import { ToolsSheet } from './components/sheets/ToolsSheet';
import { SettingsSheet } from './components/sheets/SettingsSheet';
import { VariableInspectorSheet } from './components/sheets/VariableInspectorSheet';
import { HistoryItem, HistorySheet } from './components/sheets/HistorySheet';
import { DesktopExeModal } from './components/sheets/DesktopExeModal';

import {
  CheckCircle2,
  LayoutGrid,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Sparkles,
  Monitor,
} from 'lucide-react';

export type ActiveSheetType =
  | 'MENU'
  | 'CATALOG'
  | 'TOOLS'
  | 'SETTINGS'
  | 'FUNCTION_EXPLORER'
  | 'COVERAGE_DASHBOARD'
  | 'VARIABLES'
  | 'HISTORY'
  | 'DESKTOP_EXE'
  | null;

export const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<CalculatorApp>('CALCULATE');
  const [expression, setExpression] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [resultText, setResultText] = useState('0');
  const [exactFractionText, setExactFractionText] = useState<string | null>(null);
  const [mixedFractionText, setMixedFractionText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isAlphaActive, setIsAlphaActive] = useState(false);

  const [settings, setSettings] = useState<CalculatorSettings>(() => {
    try {
      const saved = localStorage.getItem('sai_calc_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [variables, setVariables] = useState<Record<string, number>>({
    A: 0.0, B: 0.0, C: 0.0,
    D: 0.0, E: 0.0, F: 0.0,
    x: 0.0, y: 0.0, z: 0.0,
    Ans: 0.0,
  });

  const [fxDefinition, setFxDefinition] = useState('x^2');
  const [gxDefinition, setGxDefinition] = useState('2*x + 1');

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sai_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSheet, setActiveSheet] = useState<ActiveSheetType>(null);

  // Save settings and history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sai_calc_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('sai_calc_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const mathEngine = useMemo(() => {
    return new MathEngine(
      settings,
      variables,
      variables['Ans'] || 0.0,
      fxDefinition,
      gxDefinition
    );
  }, [settings, variables, fxDefinition, gxDefinition]);

  const insertText = useCallback((token: string) => {
    setExpression((prev) => {
      const pos = Math.max(0, Math.min(cursorPosition, prev.length));
      const next = prev.substring(0, pos) + token + prev.substring(pos);
      setCursorPosition(pos + token.length);
      return next;
    });
    setErrorMessage(null);
  }, [cursorPosition]);

  const deleteAtCursor = useCallback(() => {
    setExpression((prev) => {
      if (cursorPosition > 0 && prev.length > 0) {
        const next = prev.substring(0, cursorPosition - 1) + prev.substring(cursorPosition);
        setCursorPosition(cursorPosition - 1);
        return next;
      }
      return prev;
    });
  }, [cursorPosition]);

  const moveCursor = useCallback((delta: number) => {
    setCursorPosition((prev) => Math.max(0, Math.min(prev + delta, expression.length)));
  }, [expression.length]);

  const clearAll = useCallback(() => {
    setExpression('');
    setCursorPosition(0);
    setResultText('0');
    setExactFractionText(null);
    setMixedFractionText(null);
    setIsShiftActive(false);
    setIsAlphaActive(false);
    setErrorMessage(null);
  }, []);

  const executeCalculation = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    try {
      const res = mathEngine.evaluate(expression);
      setResultText(res.displayText);
      setExactFractionText(res.exactFractionText);
      setMixedFractionText(res.mixedFractionText);
      setErrorMessage(null);

      setVariables((prev) => ({
        ...prev,
        Ans: res.numericValue,
      }));

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: res.displayText,
        exactFraction: res.exactFractionText,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
    } catch (e: any) {
      setResultText('Syntax ERROR');
      setErrorMessage(e.message || 'Calculation error');
    }
  }, [expression, mathEngine]);

  const toggleResultFormat = useCallback(() => {
    if (exactFractionText) {
      if (resultText === exactFractionText) {
        setResultText(mathEngine.formatResult(variables['Ans'] || 0.0));
      } else if (resultText === mixedFractionText) {
        setResultText(exactFractionText);
      } else {
        setResultText(mixedFractionText || exactFractionText);
      }
    }
  }, [exactFractionText, mixedFractionText, resultText, mathEngine, variables]);

  const mapKeyToToken = useCallback((keyId: string, shift: boolean, alpha: boolean): string | null => {
    if (alpha) {
      switch (keyId) {
        case '7': return 'A';
        case '8': return 'B';
        case '9': return 'C';
        case '4': return 'D';
        case '5': return 'E';
        case '6': return 'F';
        case '1': return 'x';
        case '2': return 'y';
        case '3': return 'z';
        case 'EXP':
        case '10X': return 'e';
        default: return null;
      }
    }

    if (shift) {
      switch (keyId) {
        case 'sin': return 'asin(';
        case 'cos': return 'acos(';
        case 'tan': return 'atan(';
        case 'ln': return 'exp(';
        case 'log': return '10^(';
        case 'sqrt': return 'cbrt(';
        case 'pow': return '^';
        case 'square': return '^3';
        case 'frac': return ' + ';
        case 'diff_int': return 'diff(';
        case 'inv': return '!';
        case 'dot': return 'Ran#';
        case 'EXP':
        case '10X': return 'π';
        case 'Ans': return '%';
        case 'SD': return 'mixed';
        default: return null;
      }
    }

    // Primary key mappings
    switch (keyId) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9': return keyId;
      case 'dot': return '.';
      case 'add': return ' + ';
      case 'sub': return ' - ';
      case 'mul': return ' × ';
      case 'div': return ' ÷ ';
      case 'neg': return '(-)';
      case 'lparen': return '(';
      case 'rparen': return ')';
      case 'comma': return ', ';
      case 'square': return '²';
      case 'pow': return '^';
      case 'sqrt': return '√(';
      case 'frac': return '/';
      case 'sin': return 'sin(';
      case 'cos': return 'cos(';
      case 'tan': return 'tan(';
      case 'ln': return 'ln(';
      case 'log': return 'log(';
      case 'abs': return 'abs(';
      case 'inv': return '^(-1)';
      case 'EXP':
      case '10X': return '×10^';
      case 'Ans': return 'Ans';
      case 'diff_int': return 'integrate(';
      case 'fx': return 'fx(';
      case 'gx': return 'gx(';
      case 'i': return 'i';
      default: return null;
    }
  }, []);

  const handleKeyPress = useCallback((keyId: string) => {
    const shift = isShiftActive;
    const alpha = isAlphaActive;

    switch (keyId) {
      case 'SHIFT':
        setIsShiftActive((prev) => !prev);
        setIsAlphaActive(false);
        return;
      case 'ALPHA':
        setIsAlphaActive((prev) => !prev);
        setIsShiftActive(false);
        return;
      case 'HOME':
        setActiveSheet('MENU');
        return;
      case 'SETTINGS':
        setActiveSheet('SETTINGS');
        return;
      case 'CATALOG':
        setActiveSheet('CATALOG');
        return;
      case 'TOOLS':
        setActiveSheet('TOOLS');
        return;
      case 'AC':
        if (shift) {
          clearAll();
        } else {
          setExpression('');
          setCursorPosition(0);
          setIsShiftActive(false);
          setIsAlphaActive(false);
        }
        return;
      case 'DEL':
        deleteAtCursor();
        setIsShiftActive(false);
        setIsAlphaActive(false);
        return;
      case 'EXE':
      case '=':
        executeCalculation();
        setIsShiftActive(false);
        setIsAlphaActive(false);
        return;
      case 'FORMAT':
      case 'SD':
        toggleResultFormat();
        return;
      case 'LEFT':
        moveCursor(-1);
        return;
      case 'RIGHT':
        moveCursor(1);
        return;
      case 'UP':
        if (history.length > 0) {
          setExpression(history[0].expression);
          setCursorPosition(history[0].expression.length);
        }
        return;
      case 'DOWN':
        setExpression('');
        setCursorPosition(0);
        return;
      case 'RCL':
        setActiveSheet('VARIABLES');
        return;
    }

    const token = mapKeyToToken(keyId, shift, alpha);
    if (token) {
      insertText(token);
    }

    if (shift || alpha) {
      setIsShiftActive(false);
      setIsAlphaActive(false);
    }
  }, [
    isShiftActive,
    isAlphaActive,
    clearAll,
    deleteAtCursor,
    executeCalculation,
    toggleResultFormat,
    moveCursor,
    history,
    mapKeyToToken,
    insertText,
  ]);

  // Hardware keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input field in sub-screens
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === '.') {
        handleKeyPress('dot');
      } else if (e.key === '+') {
        handleKeyPress('add');
      } else if (e.key === '-') {
        handleKeyPress('sub');
      } else if (e.key === '*' || e.key === 'x') {
        handleKeyPress('mul');
      } else if (e.key === '/') {
        handleKeyPress('div');
      } else if (e.key === '(') {
        handleKeyPress('lparen');
      } else if (e.key === ')') {
        handleKeyPress('rparen');
      } else if (e.key === '^') {
        handleKeyPress('pow');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleKeyPress('EXE');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('DEL');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleKeyPress('AC');
      } else if (e.key === 'ArrowLeft') {
        handleKeyPress('LEFT');
      } else if (e.key === 'ArrowRight') {
        handleKeyPress('RIGHT');
      } else if (e.key === 'ArrowUp') {
        handleKeyPress('UP');
      } else if (e.key === 'ArrowDown') {
        handleKeyPress('DOWN');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex items-center justify-center p-2 sm:p-4">
      {/* Main Titanium Chassis */}
      <div className="w-full max-w-[480px] bg-[#0F172A] border border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden min-h-[640px] max-h-[96vh]">
        {/* --- TOP BRAND HEADER & STATUS --- */}
        <header className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white">
                Sai CALCULATOR PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {FunctionRegistry.totalCount} Functions • Natural Textbook Display
            </p>
          </div>

          {/* Quick Access Action Shortcuts */}
          <div className="flex items-center space-x-1">
            {/* fx Explorer */}
            <button
              onClick={() => setActiveSheet('FUNCTION_EXPLORER')}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold font-mono text-xs flex items-center justify-center border border-slate-700 transition"
              title="Master Function Explorer"
            >
              fx
            </button>

            {/* Coverage Dashboard */}
            <button
              onClick={() => setActiveSheet('COVERAGE_DASHBOARD')}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center border border-slate-700 transition"
              title="Verification & Coverage Dashboard"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* History */}
            <button
              onClick={() => setActiveSheet('HISTORY')}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition"
              title="Calculation History"
            >
              <HistoryIcon className="w-4 h-4" />
            </button>

            {/* Desktop .EXE Button */}
            <button
              onClick={() => setActiveSheet('DESKTOP_EXE')}
              className="h-8 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold font-mono text-xs flex items-center space-x-1 border border-blue-500/30 transition cursor-pointer"
              title="Desktop .EXE App & Windows Standalone Launcher"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold tracking-tight">.EXE</span>
            </button>

            {/* Apps Mode Launcher */}
            <button
              onClick={() => setActiveSheet('MENU')}
              className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-sm transition"
              title="Select Application Mode"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* --- MAIN DISPLAY / DEDICATED SCREEN AREA --- */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {(currentApp === 'CALCULATE' || currentApp === 'COMPLEX') && (
            <div className="flex-1 flex flex-col justify-between p-2 sm:p-2.5">
              <LcdDisplay
                expression={expression}
                cursorPosition={cursorPosition}
                resultText={resultText}
                exactFractionText={exactFractionText}
                errorMessage={errorMessage}
                isShiftActive={isShiftActive}
                isAlphaActive={isAlphaActive}
                settings={settings}
                currentApp={currentApp}
              />

              <div className="mt-auto pt-1">
                <CalculatorKeypad
                  isShiftActive={isShiftActive}
                  isAlphaActive={isAlphaActive}
                  onKeyClick={handleKeyPress}
                />
              </div>
            </div>
          )}

          {currentApp === 'EQUATION' && (
            <EquationScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'INEQUALITY' && (
            <EquationScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'MATRIX' && (
            <MatrixScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'STATISTICS' && (
            <StatisticsScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'BASE_N' && (
            <BaseNScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'SPREADSHEET' && (
            <SpreadsheetScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'UNIT_CONV' && (
            <UnitConversionScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'MATH_BOX' && (
            <MathBoxScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'TABLE' && (
            <TableScreen
              onBackToCalculate={() => setCurrentApp('CALCULATE')}
              fxDefinition={fxDefinition}
              gxDefinition={gxDefinition}
              onUpdateFunctions={(f, g) => {
                setFxDefinition(f);
                setGxDefinition(g);
              }}
            />
          )}

          {currentApp === 'RATIO' && (
            <RatioScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'VECTOR' && (
            <VectorScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}

          {currentApp === 'DISTRIBUTION' && (
            <DistributionScreen onBackToCalculate={() => setCurrentApp('CALCULATE')} />
          )}
        </main>
      </div>

      {/* --- MODAL BOTTOM SHEETS --- */}
      {activeSheet === 'MENU' && (
        <ModeSelectorSheet
          currentApp={currentApp}
          onSelectApp={(app) => setCurrentApp(app)}
          onDismiss={() => setActiveSheet(null)}
          onOpenCoverageDashboard={() => setActiveSheet('COVERAGE_DASHBOARD')}
          onOpenFunctionExplorer={() => setActiveSheet('FUNCTION_EXPLORER')}
        />
      )}

      {activeSheet === 'FUNCTION_EXPLORER' && (
        <FunctionExplorerSheet
          onInsertToken={(tok) => insertText(tok)}
          onDismiss={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'COVERAGE_DASHBOARD' && (
        <CoverageDashboardSheet onDismiss={() => setActiveSheet(null)} />
      )}

      {activeSheet === 'CATALOG' && (
        <CatalogSheet
          activeApp={currentApp}
          onInsertToken={(tok) => insertText(tok)}
          onDismiss={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'TOOLS' && (
        <ToolsSheet
          activeApp={currentApp}
          onExecuteTool={(tool) => insertText(tool)}
          onDismiss={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'SETTINGS' && (
        <SettingsSheet
          settings={settings}
          onUpdateSettings={(s) => setSettings(s)}
          onResetAll={() => {
            clearAll();
            setSettings(defaultSettings);
            setHistory([]);
          }}
          onDismiss={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'VARIABLES' && (
        <VariableInspectorSheet
          variables={variables}
          ans={variables['Ans'] ?? 0.0}
          onInsertVariable={(v) => insertText(v)}
          onStoreToVariable={(v, val) => {
            setVariables((prev) => ({ ...prev, [v]: val }));
          }}
          onDismiss={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'HISTORY' && (
        <HistorySheet
          history={history}
          onSelectHistory={(item) => {
            setExpression(item.expression);
            setCursorPosition(item.expression.length);
          }}
          onClearHistory={() => setHistory([])}
          onDismiss={() => setActiveSheet(null)}
        />
      )}

      {activeSheet === 'DESKTOP_EXE' && (
        <DesktopExeModal onDismiss={() => setActiveSheet(null)} />
      )}
    </div>
  );
};

export default App;
