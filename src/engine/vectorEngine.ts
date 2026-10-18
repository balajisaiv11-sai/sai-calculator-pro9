/**
 * 2D and 3D Vector calculation engine.
 * Dot Product, Cross Product, Magnitude, Unit Vector, Angle between vectors.
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
}
