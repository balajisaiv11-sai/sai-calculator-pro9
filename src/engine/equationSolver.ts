import { ComplexNumber } from './complexNumber';

export type LinearResult = 
  | { type: 'unique'; solutions: number[] }
  | { type: 'infinite' }
  | { type: 'none' };

export interface QuadraticResult {
  root1: ComplexNumber;
  root2: ComplexNumber;
  vertexX: number;
  vertexY: number;
  isMinimum: boolean;
}

export interface PolynomialResult {
  roots: ComplexNumber[];
}

export class EquationSolver {
  /**
   * Solves a system of n linear equations: A * x = B using Gaussian elimination with partial pivoting.
   */
  static solveLinear(coefficients: number[][], constants: number[]): LinearResult {
    const n = constants.length;
    const a: number[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n + 1 }, (_, c) => (c < n ? coefficients[r][c] : constants[r]))
    );

    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(a[j][i]) > Math.abs(a[pivot][i])) pivot = j;
      }

      if (Math.abs(a[pivot][i]) < 1e-11) {
        let allZero = true;
        for (let r = i; r < n; r++) {
          if (Math.abs(a[r][n]) > 1e-11) return { type: 'none' };
          for (let c = i; c < n; c++) {
            if (Math.abs(a[r][c]) > 1e-11) allZero = false;
          }
        }
        if (allZero) return { type: 'infinite' };
        continue;
      }

      const temp = a[i];
      a[i] = a[pivot];
      a[pivot] = temp;

      for (let j = i + 1; j < n; j++) {
        const factor = a[j][i] / a[i][i];
        for (let k = i; k < n + 1; k++) {
          a[j][k] -= factor * a[i][k];
        }
      }
    }

    const x: number[] = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = a[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= a[i][j] * x[j];
      }
      if (Math.abs(a[i][i]) < 1e-11) {
        return Math.abs(sum) < 1e-11 ? { type: 'infinite' } : { type: 'none' };
      }
      x[i] = sum / a[i][i];
    }

    return { type: 'unique', solutions: x };
  }

  /**
   * Solves quadratic ax² + bx + c = 0
   */
  static solveQuadratic(a: number, b: number, c: number): QuadraticResult {
    if (Math.abs(a) <= 1e-12) {
      throw new Error("Coefficient 'a' cannot be zero in quadratic equation");
    }
    const discriminant = b * b - 4 * a * c;
    let r1: ComplexNumber;
    let r2: ComplexNumber;

    if (discriminant >= 0) {
      const sqrtD = Math.sqrt(discriminant);
      r1 = new ComplexNumber((-b + sqrtD) / (2 * a), 0.0);
      r2 = new ComplexNumber((-b - sqrtD) / (2 * a), 0.0);
    } else {
      const sqrtD = Math.sqrt(-discriminant);
      r1 = new ComplexNumber(-b / (2 * a), sqrtD / (2 * a));
      r2 = new ComplexNumber(-b / (2 * a), -sqrtD / (2 * a));
    }

    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    const isMin = a > 0;

    return { root1: r1, root2: r2, vertexX: vx, vertexY: vy, isMinimum: isMin };
  }

  /**
   * Solves cubic ax³ + bx² + cx + d = 0 using Cardano's formula.
   */
  static solveCubic(a: number, b: number, c: number, d: number): PolynomialResult {
    if (Math.abs(a) <= 1e-12) {
      throw new Error("Coefficient 'a' cannot be zero in cubic equation");
    }
    const p = b / a;
    const q = c / a;
    const r = d / a;

    const bigA = q - (p * p) / 3.0;
    const bigB = (2.0 * p * p * p) / 27.0 - (p * q) / 3.0 + r;

    const delta = (bigB * bigB) / 4.0 + (bigA * bigA * bigA) / 27.0;
    const shift = p / 3.0;

    const roots: ComplexNumber[] = [];

    if (delta > 1e-11) {
      const u = Math.cbrt(-bigB / 2.0 + Math.sqrt(delta));
      const v = Math.cbrt(-bigB / 2.0 - Math.sqrt(delta));
      const t1 = u + v;
      roots.push(new ComplexNumber(t1 - shift, 0.0));

      const realPart = -(u + v) / 2.0 - shift;
      const imagPart = ((u - v) * Math.sqrt(3.0)) / 2.0;
      roots.push(new ComplexNumber(realPart, imagPart));
      roots.push(new ComplexNumber(realPart, -imagPart));
    } else if (Math.abs(delta) <= 1e-11) {
      const u = Math.cbrt(-bigB / 2.0);
      const t1 = 2.0 * u;
      const t2 = -u;
      roots.push(new ComplexNumber(t1 - shift, 0.0));
      roots.push(new ComplexNumber(t2 - shift, 0.0));
      roots.push(new ComplexNumber(t2 - shift, 0.0));
    } else {
      const rho = Math.sqrt(-(bigA * bigA * bigA) / 27.0);
      const theta = Math.acos(Math.max(-1.0, Math.min(1.0, -bigB / (2.0 * rho))));
      const m = 2.0 * Math.cbrt(rho);
      const t1 = m * Math.cos(theta / 3.0);
      const t2 = m * Math.cos((theta + 2.0 * Math.PI) / 3.0);
      const t3 = m * Math.cos((theta + 4.0 * Math.PI) / 3.0);
      roots.push(new ComplexNumber(t1 - shift, 0.0));
      roots.push(new ComplexNumber(t2 - shift, 0.0));
      roots.push(new ComplexNumber(t3 - shift, 0.0));
    }

    return { roots };
  }

  /**
   * Solves quartic ax⁴ + bx³ + cx² + dx + e = 0 using Durand-Kerner numerical root-finding.
   */
  static solveQuartic(a: number, b: number, c: number, d: number, e: number): PolynomialResult {
    if (Math.abs(a) <= 1e-12) {
      throw new Error("Coefficient 'a' cannot be zero in quartic equation");
    }
    const p = [e / a, d / a, c / a, b / a, 1.0];
    const roots: ComplexNumber[] = Array.from({ length: 4 }, (_, i) => {
      const angle = (2.0 * Math.PI * i) / 4.0 + 0.4;
      return new ComplexNumber(0.4 * Math.cos(angle), 0.9 * Math.sin(angle));
    });

    for (let iter = 0; iter < 100; iter++) {
      for (let i = 0; i < 4; i++) {
        let polyVal = new ComplexNumber(p[4], 0.0);
        for (let j = 3; j >= 0; j--) {
          polyVal = polyVal.times(roots[i]).plus(p[j]);
        }

        let denom = ComplexNumber.ONE;
        for (let j = 0; j < 4; j++) {
          if (j !== i) {
            denom = denom.times(roots[i].minus(roots[j]));
          }
        }
        if (denom.magnitude > 1e-12) {
          roots[i] = roots[i].minus(polyVal.div(denom));
        }
      }
    }
    return { roots };
  }
}
