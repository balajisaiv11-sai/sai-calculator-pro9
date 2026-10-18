import { Fraction } from './fraction';

/**
 * 2D and 3D Vector calculation engine.
 * Dot Product, Cross Product, Magnitude, Unit Vector, Projection, Angle between vectors,
 * Vector addition, subtraction, scalar multiplication, and dual Decimal/Fraction formatting.
 */
export class VectorEngine {
  static dot(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same dimension');
    }
    return a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  }

  static magnitude(a: number[]): number {
    return Math.sqrt(this.dot(a, a));
  }

  static cross(a: number[], b: number[]): number[] {
    if (a.length !== 3 || b.length !== 3) {
      throw new Error('Cross product is only defined for 3D vectors');
    }
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  static unit(a: number[]): number[] {
    const mag = this.magnitude(a);
    if (mag < 1e-12) {
      throw new Error('Cannot compute unit vector of zero vector');
    }
    return a.map(v => v / mag);
  }

  static angle(a: number[], b: number[], inDegrees: boolean = true): number {
    const magA = this.magnitude(a);
    const magB = this.magnitude(b);
    if (magA < 1e-12 || magB < 1e-12) {
      throw new Error('Zero vector has no defined angle');
    }
    const cosTheta = Math.max(-1.0, Math.min(1.0, this.dot(a, b) / (magA * magB)));
    const rad = Math.acos(cosTheta);
    return inDegrees ? (rad * 180.0) / Math.PI : rad;
  }

  static add(a: number[], b: number[]): number[] {
    if (a.length !== b.length) throw new Error('Vectors must have same dimension');
    return a.map((v, i) => v + b[i]);
  }

  static subtract(a: number[], b: number[]): number[] {
    if (a.length !== b.length) throw new Error('Vectors must have same dimension');
    return a.map((v, i) => v - b[i]);
  }

  static scalarMultiply(a: number[], scalar: number): number[] {
    return a.map(v => v * scalar);
  }

  /**
   * Vector projection of vector a onto vector b: proj_b(a) = ((a • b) / |b|²) * b
   */
  static projection(a: number[], b: number[]): number[] {
    const dotBB = this.dot(b, b);
    if (dotBB < 1e-12) {
      throw new Error('Cannot project onto zero vector');
    }
    const scalar = this.dot(a, b) / dotBB;
    return this.scalarMultiply(b, scalar);
  }

  /**
   * Formats a single number into dual decimal and fraction representations.
   */
  static formatNumber(val: number): { decimal: string; fraction: string } {
    if (Math.abs(val) < 1e-12) return { decimal: '0', fraction: '0' };
    if (Math.abs(val - Math.round(val)) < 1e-10) {
      const s = Math.round(val).toString();
      return { decimal: s, fraction: s };
    }
    let fracStr = '';
    try {
      const frac = Fraction.fromDouble(val, 100000);
      fracStr = frac.toString();
    } catch {
      fracStr = val.toFixed(4).replace(/\.?0+$/, '');
    }
    const decStr = val.toFixed(4).replace(/\.?0+$/, '');
    return { decimal: decStr, fraction: fracStr || decStr };
  }
}
