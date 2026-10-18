/**
 * Matrix calculation engine supporting 2x2, 3x3, and 4x4 matrices.
 * Implements Determinant, Inverse, Transpose, Matrix Arithmetic, and Identity generation.
 */
export class MatrixEngine {
  static determinant(matrix: number[][]): number {
    const n = matrix.length;
    if (n === 0 || !matrix.every(r => r.length === n)) {
      throw new Error('Matrix must be square');
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
    return det;
  }

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

  static inverse(matrix: number[][]): number[][] {
    const n = matrix.length;
    if (n === 0 || !matrix.every(r => r.length === n)) {
      throw new Error('Matrix must be square');
    }
    const det = this.determinant(matrix);
    if (Math.abs(det) < 1e-12) {
      throw new Error('Matrix is singular (determinant is zero); cannot invert');
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
      if (Math.abs(div) < 1e-12) throw new Error('Matrix is singular');
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
        inv[r][c] = aug[r][c + n];
      }
    }
    return inv;
  }

  static multiply(a: number[][], b: number[][]): number[][] {
    const rA = a.length;
    const cA = a[0].length;
    const rB = b.length;
    const cB = b[0].length;
    if (cA !== rB) {
      throw new Error(`Matrix dimensions incompatible for multiplication (${rA}×${cA} and ${rB}×${cB})`);
    }

    const res: number[][] = Array.from({ length: rA }, () => Array(cB).fill(0));
    for (let i = 0; i < rA; i++) {
      for (let j = 0; j < cB; j++) {
        let sum = 0.0;
        for (let k = 0; k < cA; k++) {
          sum += a[i][k] * b[k][j];
        }
        res[i][j] = sum;
      }
    }
    return res;
  }

  static add(a: number[][], b: number[][]): number[][] {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrix dimensions must match for addition');
    }
    return a.map((row, r) => row.map((val, c) => val + b[r][c]));
  }

  static subtract(a: number[][], b: number[][]): number[][] {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrix dimensions must match for subtraction');
    }
    return a.map((row, r) => row.map((val, c) => val - b[r][c]));
  }

  static scalarMultiply(matrix: number[][], scalar: number): number[][] {
    return matrix.map(row => row.map(val => val * scalar));
  }
}
