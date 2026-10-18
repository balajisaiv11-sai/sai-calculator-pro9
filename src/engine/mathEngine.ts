import { AngleUnit, CalculatorSettings, FractionFormat } from '../model/calculatorSettings';
import { Fraction } from './fraction';
import { ComplexNumber } from './complexNumber';

export interface EvalResult {
  numericValue: number;
  fractionValue: Fraction | null;
  complexValue: ComplexNumber | null;
  displayText: string;
  exactFractionText: string | null;
  mixedFractionText: string | null;
}

type Token = 
  | { type: 'number'; value: number }
  | { type: 'identifier'; name: string }
  | { type: 'operator'; op: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' }
  | { type: 'exclamation' };

export class MathEngine {
  settings: CalculatorSettings;
  variables: Record<string, number>;
  ans: number;
  fxDefinition: string;
  gxDefinition: string;

  constructor(
    settings: CalculatorSettings = {
      angleUnit: 'DEG',
      ioFormat: 'MATH_I_MATH_O',
      fractionFormat: 'IMPROPER',
      numberFormat: { type: 'Norm1' },
      engineeringNotation: false,
      hapticFeedback: true,
      keySound: false,
      highContrastLcd: false,
    },
    variables: Record<string, number> = {},
    ans: number = 0,
    fxDefinition: string = 'x^2',
    gxDefinition: string = '2*x + 1'
  ) {
    this.settings = settings;
    this.variables = { ...variables };
    this.ans = ans;
    this.fxDefinition = fxDefinition;
    this.gxDefinition = gxDefinition;
  }

  evaluate(expression: string, customVariables: Record<string, number> = {}): EvalResult {
    if (!expression || expression.trim() === '') {
      return {
        numericValue: 0,
        fractionValue: Fraction.ZERO,
        complexValue: null,
        displayText: '0',
        exactFractionText: null,
        mixedFractionText: null,
      };
    }

    const cleaned = this.sanitizeExpression(expression);

    // Check if complex calculation is required (contains 'i' or '∠')
    const hasImaginary = /(?<![a-zA-Z])i(?![a-zA-Z])/.test(cleaned) || cleaned.includes('∠');

    if (hasImaginary) {
      const cmplx = this.evaluateComplex(cleaned, customVariables);
      const disp = cmplx.toRectangularString(6);
      return {
        numericValue: cmplx.magnitude,
        fractionValue: null,
        complexValue: cmplx,
        displayText: disp,
        exactFractionText: null,
        mixedFractionText: null,
      };
    }

    const tokens = this.tokenize(cleaned);
    const mergedVars = this.getMergedVariables(customVariables);
    const parser = new ExpressionParser(tokens, mergedVars, this.settings.angleUnit, this);
    const numResult = parser.parseExpression();

    // Attempt exact fraction conversion if reasonable
    let frac: Fraction | null = null;
    try {
      if (!isNaN(numResult) && isFinite(numResult) && Math.abs(numResult) < 1e7) {
        frac = Fraction.fromDouble(numResult);
        if (Number(frac.denominator) > 10000 && Math.abs(frac.toDouble() - numResult) > 1e-9) {
          frac = null;
        }
      }
    } catch {
      frac = null;
    }

    const formattedText = this.formatResult(numResult, frac);
    const exactFracStr = frac ? frac.toString() : null;
    const mixedFracStr = frac ? frac.toMixedString() : null;

    return {
      numericValue: numResult,
      fractionValue: frac,
      complexValue: null,
      displayText: formattedText,
      exactFractionText: exactFracStr,
      mixedFractionText: mixedFracStr,
    };
  }

  getMergedVariables(custom: Record<string, number>): Record<string, number> {
    const merged: Record<string, number> = {
      ...this.variables,
      ans: this.ans,
      Ans: this.ans,
      pi: Math.PI,
      π: Math.PI,
      e: Math.E,
      // Physical & Scientific constants
      c: 299792458,
      h: 6.62607015e-34,
      hbar: 1.054571817e-34,
      mu0: 1.25663706212e-6,
      eps0: 8.8541878128e-12,
      G: 6.67430e-11,
      me: 9.1093837015e-31,
      mp: 1.67262192369e-27,
      mn: 1.67492749804e-27,
      mu: 1.883531627e-28,
      a0: 5.29177210903e-11,
      alpha: 0.0072973525693,
      re: 2.8179403262e-15,
      lambda_c: 2.42631023867e-12,
      gamma_p: 2.6752218744e8,
      R_inf: 10973731.568160,
      u: 1.66053906660e-27,
      mu_B: 9.2740100783e-24,
      mu_N: 5.0507837461e-27,
      NA: 6.02214076e23,
      k: 1.380649e-23,
      R: 8.314462618,
      sigma: 5.670374419e-8,
      g: 9.80665,
      atm: 101325,
      F: 96485.33212,
      Z0: 376.730313668,
      ...custom,
    };
    return merged;
  }

  sanitizeExpression(expr: string): string {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\u2212/g, '-')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/√/g, 'sqrt')
      .replace(/³√/g, 'cbrt')
      .replace(/×10\^/g, '*10^')
      .replace(/×10ˣ/g, '*10^')
      .replace(/π/g, 'pi')
      .replace(/Ans/g, 'ans')
      .replace(/\(-\)/g, '-');
  }

  formatResult(value: number, fraction: Fraction | null = null): string {
    if (isNaN(value)) return 'Math ERROR';
    if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

    // If natural textbook output with exact fraction
    if (
      this.settings.ioFormat === 'MATH_I_MATH_O' &&
      fraction &&
      fraction.denominator !== 1n
    ) {
      return this.settings.fractionFormat === 'MIXED'
        ? fraction.toMixedString()
        : fraction.toString();
    }

    const nf = this.settings.numberFormat;
    if (nf.type === 'Fix') {
      const d = nf.digits ?? 2;
      return value.toFixed(d);
    }
    if (nf.type === 'Sci') {
      const d = nf.digits ?? 3;
      return value.toExponential(d);
    }
    if (nf.type === 'Norm1') {
      const absVal = Math.abs(value);
      if (absVal > 0 && (absVal < 1e-2 || absVal >= 1e10)) {
        return value.toExponential(5);
      }
      return this.formatGeneral(value);
    }
    // Norm2 default
    const absVal = Math.abs(value);
    if (absVal > 0 && (absVal < 1e-9 || absVal >= 1e10)) {
      return value.toExponential(8);
    }
    return this.formatGeneral(value);
  }

  private formatGeneral(value: number): string {
    if (Math.abs(value - Math.round(value)) < 1e-11) {
      return Math.round(value).toString();
    }
    // Limit decimal precision up to 10 decimal digits cleanly
    const factor = Math.pow(10, 10);
    const rounded = Math.round(value * factor) / factor;
    return rounded.toString();
  }

  private evaluateComplex(expr: string, customVars: Record<string, number>): ComplexNumber {
    const clean = expr.replace(/\s+/g, '');
    if (clean.includes('∠') || clean.includes('<')) {
      const parts = clean.split(/[∠<]/);
      const r = parseFloat(parts[0]) || 1.0;
      const theta = parseFloat(parts[1]) || 0.0;
      return ComplexNumber.fromPolar(r, theta, this.settings.angleUnit === 'DEG');
    }

    let realPart = 0.0;
    let imagPart = 0.0;

    const regex = /([+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?i?|[+-]?i)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(clean)) !== null) {
      const term = m[1];
      if (term.endsWith('i')) {
        const coeff = term.slice(0, -1);
        let v = 1.0;
        if (coeff === '' || coeff === '+') v = 1.0;
        else if (coeff === '-') v = -1.0;
        else v = parseFloat(coeff) || 1.0;
        imagPart += v;
      } else {
        realPart += parseFloat(term) || 0.0;
      }
    }
    return new ComplexNumber(realPart, imagPart);
  }

  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const len = input.length;

    while (i < len) {
      const c = input[i];
      if (/\s/.test(c)) {
        i++;
      } else if (/\d/.test(c) || (c === '.' && i + 1 < len && /\d/.test(input[i + 1]))) {
        const start = i;
        while (
          i < len &&
          (/\d/.test(input[i]) ||
            input[i] === '.' ||
            input[i] === 'E' ||
            input[i] === 'e')
        ) {
          if (
            (input[i] === 'E' || input[i] === 'e') &&
            i + 1 < len &&
            (input[i + 1] === '+' || input[i + 1] === '-')
          ) {
            i += 2;
          } else {
            i++;
          }
        }
        const numStr = input.substring(start, i);
        tokens.push({ type: 'number', value: parseFloat(numStr) || 0.0 });
      } else if (/[a-zA-Z_]/.test(c)) {
        const start = i;
        while (i < len && /[a-zA-Z0-9_]/.test(input[i])) {
          i++;
        }
        const id = input.substring(start, i);
        tokens.push({ type: 'identifier', name: id });
      } else if (c === '(') {
        tokens.push({ type: 'lparen' });
        i++;
      } else if (c === ')') {
        tokens.push({ type: 'rparen' });
        i++;
      } else if (c === ',') {
        tokens.push({ type: 'comma' });
        i++;
      } else if (c === '!') {
        tokens.push({ type: 'exclamation' });
        i++;
      } else if ('+-*/^%'.includes(c)) {
        tokens.push({ type: 'operator', op: c });
        i++;
      } else {
        i++;
      }
    }

    return this.insertImplicitMultiplication(tokens);
  }

  private insertImplicitMultiplication(tokens: Token[]): Token[] {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const curr = tokens[i];
      result.push(curr);
      if (i + 1 < tokens.length) {
        const next = tokens[i + 1];
        const needMul =
          (curr.type === 'number' && (next.type === 'lparen' || next.type === 'identifier')) ||
          (curr.type === 'rparen' && (next.type === 'lparen' || next.type === 'number' || next.type === 'identifier')) ||
          (curr.type === 'identifier' && next.type !== 'lparen' && (next.type === 'number' || next.type === 'identifier')) ||
          (curr.type === 'exclamation' && (next.type === 'number' || next.type === 'identifier' || next.type === 'lparen'));

        if (needMul) {
          result.push({ type: 'operator', op: '*' });
        }
      }
    }
    return result;
  }
}

class ExpressionParser {
  private tokens: Token[];
  private vars: Record<string, number>;
  private angleUnit: AngleUnit;
  private engine: MathEngine;
  private pos = 0;

  constructor(
    tokens: Token[],
    vars: Record<string, number>,
    angleUnit: AngleUnit,
    engine: MathEngine
  ) {
    this.tokens = tokens;
    this.vars = vars;
    this.angleUnit = angleUnit;
    this.engine = engine;
  }

  private peek(): Token | undefined {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : undefined;
  }

  private next(): Token | undefined {
    return this.pos < this.tokens.length ? this.tokens[this.pos++] : undefined;
  }

  parseExpression(): number {
    return this.parseAddSub();
  }

  private parseAddSub(): number {
    let left = this.parseMulDiv();
    while (true) {
      const p = this.peek();
      if (p && p.type === 'operator' && (p.op === '+' || p.op === '-')) {
        this.next();
        const right = this.parseMulDiv();
        left = p.op === '+' ? left + right : left - right;
      } else break;
    }
    return left;
  }

  private parseMulDiv(): number {
    let left = this.parsePower();
    while (true) {
      const p = this.peek();
      if (p && p.type === 'operator' && (p.op === '*' || p.op === '/' || p.op === '%')) {
        this.next();
        const right = this.parsePower();
        if (p.op === '*') left = left * right;
        else if (p.op === '/') {
          if (right === 0) throw new Error('Division by zero');
          left = left / right;
        } else if (p.op === '%') {
          left = left % right;
        }
      } else break;
    }
    return left;
  }

  private parsePower(): number {
    let left = this.parseUnary();
    const p = this.peek();
    if (p && p.type === 'operator' && p.op === '^') {
      this.next();
      const right = this.parsePower(); // right-associative
      left = Math.pow(left, right);
    }
    return left;
  }

  private parseUnary(): number {
    const p = this.peek();
    if (p && p.type === 'operator' && (p.op === '+' || p.op === '-')) {
      this.next();
      const factor = p.op === '-' ? -1.0 : 1.0;
      return factor * this.parseUnary();
    }
    return this.parsePostfix();
  }

  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (this.peek()?.type === 'exclamation') {
      this.next();
      value = this.factorial(value);
    }
    return value;
  }

  private factorial(n: number): number {
    if (n < 0 || Math.abs(n - Math.round(n)) > 1e-9) {
      throw new Error('Factorial requires non-negative integer');
    }
    const k = Math.round(n);
    if (k > 170) return Infinity;
    let res = 1.0;
    for (let i = 2; i <= k; i++) res *= i;
    return res;
  }

  private parsePrimary(): number {
    const t = this.next();
    if (!t) throw new Error('Unexpected end of expression');

    if (t.type === 'number') return t.value;
    if (t.type === 'identifier') return this.parseIdentifier(t.name);
    if (t.type === 'lparen') {
      const inner = this.parseExpression();
      if (this.peek()?.type === 'rparen') this.next();
      return inner;
    }
    throw new Error(`Unexpected token: ${JSON.stringify(t)}`);
  }

  private parseIdentifier(name: string): number {
    const lower = name.toLowerCase();
    if (this.vars[name] !== undefined) return this.vars[name];
    if (this.vars[lower] !== undefined) return this.vars[lower];

    // Function call
    if (this.peek()?.type === 'lparen') {
      this.next(); // consume '('
      const args: number[] = [];
      if (this.peek()?.type !== 'rparen') {
        args.push(this.parseExpression());
        while (this.peek()?.type === 'comma') {
          this.next();
          args.push(this.parseExpression());
        }
      }
      if (this.peek()?.type === 'rparen') this.next();

      return this.evaluateFunction(lower, args);
    }

    throw new Error(`Unknown variable or identifier: ${name}`);
  }

  private evaluateFunction(func: string, args: number[]): number {
    const toRad = (val: number): number => {
      switch (this.angleUnit) {
        case 'DEG': return (val * Math.PI) / 180.0;
        case 'RAD': return val;
        case 'GRAD': return (val * Math.PI) / 200.0;
      }
    };

    const fromRad = (val: number): number => {
      switch (this.angleUnit) {
        case 'DEG': return (val * 180.0) / Math.PI;
        case 'RAD': return val;
        case 'GRAD': return (val * 200.0) / Math.PI;
      }
    };

    switch (func) {
      case 'sin': return Math.sin(toRad(args[0]));
      case 'cos': return Math.cos(toRad(args[0]));
      case 'tan': {
        const v = Math.tan(toRad(args[0]));
        if (Math.abs(v) > 1e15) throw new Error('Tangent undefined');
        return v;
      }
      case 'asin': return fromRad(Math.asin(args[0]));
      case 'acos': return fromRad(Math.acos(args[0]));
      case 'atan': return fromRad(Math.atan(args[0]));
      case 'sinh': return Math.sinh(args[0]);
      case 'cosh': return Math.cosh(args[0]);
      case 'tanh': return Math.tanh(args[0]);
      case 'asinh': return Math.asinh(args[0]);
      case 'acosh': return Math.acosh(args[0]);
      case 'atanh': return Math.atanh(args[0]);
      case 'sqrt': return Math.sqrt(args[0]);
      case 'cbrt': return Math.cbrt(args[0]);
      case 'root': return Math.pow(args[0], 1.0 / args[1]);
      case 'log10':
      case 'log':
        return args.length === 1 ? Math.log10(args[0]) : Math.log(args[0]) / Math.log(args[1]);
      case 'ln': return Math.log(args[0]);
      case 'exp': return Math.exp(args[0]);
      case 'abs': return Math.abs(args[0]);
      case 'int':
      case 'floor': return Math.floor(args[0]);
      case 'ceil': return Math.ceil(args[0]);
      case 'round': return Math.round(args[0]);
      case 'gcd': return Number(Fraction.gcd(BigInt(Math.round(args[0])), BigInt(Math.round(args[1]))));
      case 'lcm': return Number(Fraction.lcm(BigInt(Math.round(args[0])), BigInt(Math.round(args[1]))));
      case 'fact': return this.factorial(args[0]);
      case 'npr': {
        const n = Math.round(args[0]);
        const r = Math.round(args[1]);
        if (n < r || r < 0) throw new Error('nPr condition failed: n >= r >= 0');
        let p = 1.0;
        for (let i = n - r + 1; i <= n; i++) p *= i;
        return p;
      }
      case 'ncr': {
        const n = Math.round(args[0]);
        const r = Math.round(args[1]);
        if (n < r || r < 0) throw new Error('nCr condition failed: n >= r >= 0');
        let c = 1.0;
        for (let i = 1; i <= r; i++) {
          c = (c * (n - i + 1)) / i;
        }
        return Math.round(c);
      }
      case 'diff': {
        const x0 = args[0];
        const h = 1e-6;
        const fPlus = this.evaluateSavedFunction(this.engine.fxDefinition, x0 + h);
        const fMinus = this.evaluateSavedFunction(this.engine.fxDefinition, x0 - h);
        return (fPlus - fMinus) / (2.0 * h);
      }
      case 'integrate': {
        const a = args[0];
        const b = args[1];
        const n = 100;
        const h = (b - a) / n;
        let sum = this.evaluateSavedFunction(this.engine.fxDefinition, a) + this.evaluateSavedFunction(this.engine.fxDefinition, b);
        for (let i = 1; i < n; i++) {
          const x = a + i * h;
          const w = i % 2 === 0 ? 2.0 : 4.0;
          sum += w * this.evaluateSavedFunction(this.engine.fxDefinition, x);
        }
        return (h / 3.0) * sum;
      }
      case 'sum': {
        const start = Math.round(args[0]);
        const end = Math.round(args[1]);
        let s = 0.0;
        for (let k = start; k <= end; k++) {
          s += this.evaluateSavedFunction(this.engine.fxDefinition, k);
        }
        return s;
      }
      case 'prod': {
        const start = Math.round(args[0]);
        const end = Math.round(args[1]);
        let p = 1.0;
        for (let k = start; k <= end; k++) {
          p *= this.evaluateSavedFunction(this.engine.fxDefinition, k);
        }
        return p;
      }
      case 'sec': return 1.0 / Math.cos(toRad(args[0]));
      case 'csc': return 1.0 / Math.sin(toRad(args[0]));
      case 'cot': return 1.0 / Math.tan(toRad(args[0]));
      case 'asec': return fromRad(Math.acos(1.0 / args[0]));
      case 'acsc': return fromRad(Math.asin(1.0 / args[0]));
      case 'acot': return fromRad(Math.atan(1.0 / args[0]));
      case 'sech': return 1.0 / Math.cosh(args[0]);
      case 'csch': return 1.0 / Math.sinh(args[0]);
      case 'coth': return 1.0 / Math.tanh(args[0]);
      case 'asech': return Math.acosh(1.0 / args[0]);
      case 'acsch': return Math.asinh(1.0 / args[0]);
      case 'acoth': return Math.atanh(1.0 / args[0]);
      case 'hav': return (1.0 - Math.cos(toRad(args[0]))) / 2.0;
      case 'archav': return fromRad(2.0 * Math.asin(Math.sqrt(args[0])));
      case 'vers': return 1.0 - Math.cos(toRad(args[0]));
      case 'covers': return 1.0 - Math.sin(toRad(args[0]));
      case 'exsec': return (1.0 / Math.cos(toRad(args[0]))) - 1.0;
      case 'excsc': return (1.0 / Math.sin(toRad(args[0]))) - 1.0;
      case 'crd': return 2.0 * Math.sin(toRad(args[0] / 2.0));
      case 'sinc': return args[0] === 0 ? 1.0 : Math.sin(args[0]) / args[0];
      case 'atan2': return fromRad(Math.atan2(args[0], args[1]));
      case 'pol':
      case 'pol_r': return Math.hypot(args[0], args[1]);
      case 'rec':
      case 'rec_x': return args[0] * Math.cos(toRad(args[1]));
      case 'rec_y': return args[0] * Math.sin(toRad(args[1]));
      case 'hypot': return Math.hypot(args[0], args[1]);
      case 'hypot3': return Math.hypot(args[0], args[1], args[2] ?? 0);
      case 'rad': return (args[0] * Math.PI) / 180.0;
      case 'deg': return (args[0] * 180.0) / Math.PI;
      case 'grad': return (args[0] * 200.0) / 180.0;
      case 'sgn':
      case 'sign': return Math.sign(args[0]);
      case 'trunc': return Math.trunc(args[0]);
      case 'frac': return args[0] - Math.floor(args[0]);
      case 'mod': return ((args[0] % args[1]) + args[1]) % args[1];
      case 'clamp': return Math.min(Math.max(args[0], args[1]), args[2]);
      case 'lerp': return args[0] + (args[1] - args[0]) * args[2];
      case 'log2': return Math.log2(args[0]);
      case 'log1p': return Math.log1p(args[0]);
      case 'expm1': return Math.expm1(args[0]);
      case 'colog': return -Math.log10(args[0]);
      case 'ran':
      case 'rand': return Math.floor(Math.random() * 1000) / 1000;
      case 'ranint': return Math.floor(Math.random() * (args[1] - args[0] + 1)) + args[0];
      case 'isprime': {
        const n = Math.round(args[0]);
        if (n < 2) return 0;
        for (let i = 2; i * i <= n; i++) if (n % i === 0) return 0;
        return 1;
      }
      case 'fib': {
        const n = Math.round(args[0]);
        if (n <= 0) return 0;
        if (n === 1) return 1;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; }
        return b;
      }
      case 'min': return Math.min(...args);
      case 'max': return Math.max(...args);
      case 'fx': return this.evaluateSavedFunction(this.engine.fxDefinition, args[0]);
      case 'gx': return this.evaluateSavedFunction(this.engine.gxDefinition, args[0]);
      default:
        throw new Error(`Unsupported function: ${func}`);
    }
  }

  private evaluateSavedFunction(expr: string, xVal: number): number {
    const subEngine = new MathEngine(this.engine.settings, { x: xVal }, this.engine.ans);
    return subEngine.evaluate(expr).numericValue;
  }
}
