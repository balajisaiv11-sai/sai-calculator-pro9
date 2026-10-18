export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export const AngleUnitLabels: Record<AngleUnit, { label: string; shortName: string }> = {
  DEG: { label: 'Degree', shortName: 'DEG' },
  RAD: { label: 'Radian', shortName: 'RAD' },
  GRAD: { label: 'Gradian', shortName: 'GRAD' }
};

export type InputOutputFormat = 
  | 'MATH_I_MATH_O' 
  | 'MATH_I_DECIMAL_O' 
  | 'LINE_I_LINE_O' 
  | 'LINE_I_DECIMAL_O';

export type FractionFormat = 'IMPROPER' | 'MIXED';

export type NumberFormatType = 'Norm1' | 'Norm2' | 'Fix' | 'Sci';

export interface NumberFormatConfig {
  type: NumberFormatType;
  digits?: number;
}

export type CalculatorApp = 
  | 'CALCULATE'
  | 'COMPLEX'
  | 'BASE_N'
  | 'MATRIX'
  | 'VECTOR'
  | 'STATISTICS'
  | 'DISTRIBUTION'
  | 'TABLE'
  | 'EQUATION'
  | 'INEQUALITY'
  | 'RATIO'
  | 'SPREADSHEET'
  | 'UNIT_CONV'
  | 'MATH_BOX';

export interface CalculatorAppInfo {
  id: CalculatorApp;
  title: string;
  subtitle: string;
  iconName: string;
}

export const CalculatorAppsList: CalculatorAppInfo[] = [
  { id: 'CALCULATE', title: 'Calculate', subtitle: 'General scientific calculations', iconName: 'calculate' },
  { id: 'COMPLEX', title: 'Complex', subtitle: 'Complex number arithmetic (a+bi, r∠θ)', iconName: 'complex' },
  { id: 'BASE_N', title: 'Base-N', subtitle: 'Binary, Octal, Decimal, Hexadecimal', iconName: 'base_n' },
  { id: 'MATRIX', title: 'Matrix', subtitle: 'Matrix computations up to 4×4', iconName: 'matrix' },
  { id: 'VECTOR', title: 'Vector', subtitle: '2D & 3D Vector operations', iconName: 'vector' },
  { id: 'STATISTICS', title: 'Statistics', subtitle: '1-Var & 2-Var Regression', iconName: 'statistics' },
  { id: 'DISTRIBUTION', title: 'Distribution', subtitle: 'Normal, Binomial, Poisson probabilities', iconName: 'distribution' },
  { id: 'TABLE', title: 'Table', subtitle: 'Numerical value tables for f(x) and g(x)', iconName: 'table' },
  { id: 'EQUATION', title: 'Equation', subtitle: 'Simultaneous & Polynomial equations', iconName: 'equation' },
  { id: 'INEQUALITY', title: 'Inequality', subtitle: 'Polynomial inequalities', iconName: 'inequality' },
  { id: 'RATIO', title: 'Ratio', subtitle: 'Ratio and proportion solver', iconName: 'ratio' },
  { id: 'SPREADSHEET', title: 'Spreadsheet', subtitle: 'Spreadsheet grid with formulas', iconName: 'spreadsheet' },
  { id: 'UNIT_CONV', title: 'Unit Conversion', subtitle: '40+ metric and imperial units', iconName: 'unit_conv' },
  { id: 'MATH_BOX', title: 'Math Box', subtitle: 'Coin toss & dice roll simulations', iconName: 'math_box' },
];

export interface CalculatorSettings {
  angleUnit: AngleUnit;
  ioFormat: InputOutputFormat;
  fractionFormat: FractionFormat;
  numberFormat: NumberFormatConfig;
  engineeringNotation: boolean;
  hapticFeedback: boolean;
  keySound: boolean;
  highContrastLcd: boolean;
}

export const defaultSettings: CalculatorSettings = {
  angleUnit: 'DEG',
  ioFormat: 'MATH_I_MATH_O',
  fractionFormat: 'IMPROPER',
  numberFormat: { type: 'Norm1' },
  engineeringNotation: false,
  hapticFeedback: true,
  keySound: false,
  highContrastLcd: false,
};
