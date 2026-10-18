import { Fraction } from './fraction';

export interface MatrixCellFormatted {
  decimal: string;
  fraction: string;
  mixed: string;
  raw: number;
}

/**
 * Matrix calculation engine supporting 1x1, 2x2, 3x3, 4x4 and rectangular matrices.
 * Implements Determinant, Inverse, Transpose, Trace, Rank, RREF, REF, Matrix Arithmetic,
 * Matrix Powers, Scalar Multiplication, and dual Decimal/Fraction formatting.
 */
export class MatrixEngine {
  /**
   * Parses a number or fraction string (e.g. "0.5", "-3/4", "7").
   */
  static parseNumberOrFraction(input: string): number {
    if (!input) return 0;
    const trimmed = input.trim();
    if (trimmed === '') return 0;
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return num / den;
        }
      }
    }
    const n = parseFloat(trimmed);
    return isNaN(n) ? 0 : n;
  }

  /**
   * Formats a single number into both decimal and exact fraction representations.
   */
  static formatCell(val: number): MatrixCellFormatted {
    if (isNaN(val)) {
      return { decimal: 'NaN', fraction: 'NaN', mixed: 'NaN', raw: val };
    }
    if (!isFinite(val)) {
      const sign = val > 0 ? '∞' : '-∞';
      return { decimal: sign, fraction: sign, mixed: sign, raw: val };
    }

    if (Math.abs(val) < 1e-12) {
      return { decimal: '0', fraction: '0', mixed: '0', raw: 0 };
    }

    // Check if integer
    if (Math.abs(val - Math.round(val)) < 1e-10) {
      const intVal = Math.round(val);
      const str = intVal.toString();
      return { decimal: str, fraction: str, mixed: str, raw: intVal };
    }

    // Try rational fraction conversion
    let fractionStr = '';
    let mixedStr = '';
    try {
      const frac = Fraction.fromDouble(val, 100000);
      fractionStr = frac.toString();
      mixedStr = frac.toMixedString();
    } catch {
      fractionStr = val.toFixed(4).replace(/\.?0+$/, '');
      mixedStr = fractionStr;
    }

    // Clean decimal formatting (up to 4-6 decimal places, stripping trailing zeros)
    let decimalStr = val.toFixed(4);
    if (decimalStr.includes('.')) {
      decimalStr = decimalStr.replace(/\.?0+$/, '');
    }
    if (decimalStr === '-0') decimalStr = '0';

    return {
      decimal: decimalStr,
      fraction: fractionStr || decimalStr,
      mixed: mixedStr || decimalStr,
      raw: val,
    };
  }

  /**
   * Determinant for 1x1, 2x2, 3x3, and 4x4 (and higher) square matrices.
   */
  static determinant(matrix: number[][]): number {
    const n = matrix.length;
    if (n === 0 || !matrix.every(r => r.length === n)) {
      throw new Error('Matrix must be square for determinant');
    }

    if (n === 1) return matrix[0][0];
    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    if (n === 3) {
      const a = matrix;
      return (
        a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
        a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
        a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
      );
    }
    return this.luDeterminant(matrix);
  }

  private static luDeterminant(matrix: number[][]): number {
    const n = matrix.length;
    const a = matrix.map(r => [...r]);
    let det = 1.0;

    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(a[j][i]) > Math.abs(a[pivot][i])) pivot = j;
      }
      if (Math.abs(a[pivot][i]) < 1e-12) return 0.0;

      if (pivot !== i) {
        const temp = a[i];
        a[i] = a[pivot];
        a[pivot] = temp;
        det = -det;
      }

      det *= a[i][i];
      for (let j = i + 1; j < n; j++) {
        const factor = a[j][i] / a[i][i];
        for (let k = i; k < n; k++) {
          a[j][k] -= factor * a[i][k];
        }
      }
    }

    return Math.abs(det - Math.round(det)) < 1e-10 ? Math.round(det) : det;
  }

  /**
   * Matrix Trace (sum of main diagonal elements).
   */
  static trace(matrix: number[][]): number {
    const n = Math.min(matrix.length, matrix[0]?.length || 0);
    if (n === 0) return 0;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += matrix[i][i];
    }
    return sum;
  }

  /**
   * Transpose of matrix (swaps rows and columns).
   */
  static transpose(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result[c][r] = matrix[r][c];
      }
    }
    return result;
  }

  /**
   * Inversion using Gauss-Jordan elimination on [A | I].
   * Works for 2x2, 3x3, 4x4 and any n x n non-singular square matrix.
   */
  static inverse(matrix: number[][]): number[][] {
    const n = matrix.length;
    if (n === 0 || !matrix.every(r => r.length === n)) {
      throw new Error('Matrix must be square to invert');
    }
    const det = this.determinant(matrix);
    if (Math.abs(det) < 1e-12) {
      throw new Error('Matrix is singular (det = 0); cannot compute inverse');
    }

    if (n === 2) {
      const d = matrix;
      return [
        [d[1][1] / det, -d[0][1] / det],
        [-d[1][0] / det, d[0][0] / det],
      ];
    }

    // Gauss-Jordan elimination on [A | I]
    const aug: number[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: 2 * n }, (_, c) => {
        if (c < n) return matrix[r][c];
        return c - n === r ? 1.0 : 0.0;
      })
    );

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
      }
      const temp = aug[i];
      aug[i] = aug[maxRow];
      aug[maxRow] = temp;

      const div = aug[i][i];
      if (Math.abs(div) < 1e-12) throw new Error('Matrix is singular (det = 0)');
      for (let j = 0; j < 2 * n; j++) {
        aug[i][j] /= div;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = aug[k][i];
          for (let j = 0; j < 2 * n; j++) {
            aug[k][j] -= factor * aug[i][j];
          }
        }
      }
    }

    const inv: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const val = aug[r][c + n];
        inv[r][c] = Math.abs(val) < 1e-12 ? 0 : val;
      }
    }
    return inv;
  }

  /**
   * Matrix Multiplication (A × B).
   */
  static multiply(a: number[][], b: number[][]): number[][] {
    const rA = a.length;
    const cA = a[0].length;
    const rB = b.length;
    const cB = b[0].length;
    if (cA !== rB) {
      throw new Error(`Incompatible matrix dimensions: ${rA}×${cA} and ${rB}×${cB}`);
    }

    const res: number[][] = Array.from({ length: rA }, () => Array(cB).fill(0));
    for (let i = 0; i < rA; i++) {
      for (let j = 0; j < cB; j++) {
        let sum = 0.0;
        for (let k = 0; k < cA; k++) {
          sum += a[i][k] * b[k][j];
        }
        res[i][j] = Math.abs(sum) < 1e-12 ? 0 : sum;
      }
    }
    return res;
  }

  /**
   * Matrix Addition (A + B).
   */
  static add(a: number[][], b: number[][]): number[][] {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error(`Matrix dimensions must match for addition (${a.length}×${a[0].length} vs ${b.length}×${b[0].length})`);
    }
    return a.map((row, r) => row.map((val, c) => {
      const s = val + b[r][c];
      return Math.abs(s) < 1e-12 ? 0 : s;
    }));
  }

  /**
   * Matrix Subtraction (A - B).
   */
  static subtract(a: number[][], b: number[][]): number[][] {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error(`Matrix dimensions must match for subtraction (${a.length}×${a[0].length} vs ${b.length}×${b[0].length})`);
    }
    return a.map((row, r) => row.map((val, c) => {
      const s = val - b[r][c];
      return Math.abs(s) < 1e-12 ? 0 : s;
    }));
  }

  /**
   * Scalar Multiplication (k × M).
   */
  static scalarMultiply(matrix: number[][], scalar: number): number[][] {
    return matrix.map(row => row.map(val => {
      const s = val * scalar;
      return Math.abs(s) < 1e-12 ? 0 : s;
    }));
  }

  /**
   * Matrix Power (A^p) for square matrices.
   */
  static power(matrix: number[][], p: number): number[][] {
    const n = matrix.length;
    if (n === 0 || !matrix.every(r => r.length === n)) {
      throw new Error('Matrix must be square to raise to a power');
    }
    if (!Number.isInteger(p)) {
      throw new Error('Matrix exponent must be an integer');
    }
    if (p === 0) return this.identity(n);
    if (p < 0) {
      const inv = this.inverse(matrix);
      return this.power(inv, -p);
    }
    let result = this.identity(n);
    let base = matrix;
    let exp = p;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = this.multiply(result, base);
      }
      if (exp > 1) {
        base = this.multiply(base, base);
      }
      exp = Math.floor(exp / 2);
    }
    return result;
  }

  /**
   * Generates n×n Identity Matrix.
   */
  static identity(n: number): number[][] {
    return Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === c ? 1 : 0))
    );
  }

  /**
   * Generates rows×cols Zero Matrix.
   */
  static zero(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  /**
   * Reduced Row Echelon Form (RREF) using Gauss-Jordan elimination.
   */
  static rref(matrix: number[][]): number[][] {
    const m = matrix.map(row => [...row]);
    const rows = m.length;
    const cols = m[0].length;
    let lead = 0;

    for (let r = 0; r < rows; r++) {
      if (lead >= cols) break;
      let i = r;
      while (Math.abs(m[i][lead]) < 1e-11) {
        i++;
        if (i === rows) {
          i = r;
          lead++;
          if (lead === cols) return m.map(row => row.map(v => (Math.abs(v) < 1e-11 ? 0 : v)));
        }
      }

      // Swap rows
      const temp = m[i];
      m[i] = m[r];
      m[r] = temp;

      // Normalize pivot row
      const lv = m[r][lead];
      for (let c = 0; c < cols; c++) {
        m[r][c] /= lv;
      }

      // Eliminate other rows
      for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        if (rowIdx !== r) {
          const factor = m[rowIdx][lead];
          for (let c = 0; c < cols; c++) {
            m[rowIdx][c] -= factor * m[r][c];
          }
        }
      }
      lead++;
    }

    return m.map(row => row.map(v => (Math.abs(v) < 1e-11 ? 0 : v)));
  }

  /**
   * Row Echelon Form (REF) using Gaussian elimination.
   */
  static ref(matrix: number[][]): number[][] {
    const m = matrix.map(row => [...row]);
    const rows = m.length;
    const cols = m[0].length;
    let lead = 0;

    for (let r = 0; r < rows; r++) {
      if (lead >= cols) break;
      let i = r;
      while (Math.abs(m[i][lead]) < 1e-11) {
        i++;
        if (i === rows) {
          i = r;
          lead++;
          if (lead === cols) return m.map(row => row.map(v => (Math.abs(v) < 1e-11 ? 0 : v)));
        }
      }

      // Swap rows
      const temp = m[i];
      m[i] = m[r];
      m[r] = temp;

      // Eliminate below pivot
      for (let rowIdx = r + 1; rowIdx < rows; rowIdx++) {
        const factor = m[rowIdx][lead] / m[r][lead];
        for (let c = lead; c < cols; c++) {
          m[rowIdx][c] -= factor * m[r][c];
        }
      }
      lead++;
    }

    return m.map(row => row.map(v => (Math.abs(v) < 1e-11 ? 0 : v)));
  }

  /**
   * Matrix Rank (number of linearly independent rows).
   */
  static rank(matrix: number[][]): number {
    const r = this.rref(matrix);
    let rankCount = 0;
    for (const row of r) {
      if (row.some(v => Math.abs(v) > 1e-11)) {
        rankCount++;
      }
    }
    return rankCount;
  }
}
