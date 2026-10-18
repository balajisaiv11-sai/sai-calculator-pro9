export class DistributionEngine {
  static normalPD(x: number, mean: number = 0.0, stdDev: number = 1.0): number {
    if (stdDev <= 0) throw new Error('Standard deviation must be positive');
    const z = (x - mean) / stdDev;
    return (1.0 / (stdDev * Math.sqrt(2.0 * Math.PI))) * Math.exp(-0.5 * z * z);
  }

  static normalCD(lower: number, upper: number, mean: number = 0.0, stdDev: number = 1.0): number {
    if (stdDev <= 0) throw new Error('Standard deviation must be positive');
    const phiUpper = this.phi((upper - mean) / stdDev);
    const phiLower = this.phi((lower - mean) / stdDev);
    return Math.max(0.0, Math.min(1.0, phiUpper - phiLower));
  }

  private static phi(z: number): number {
    return 0.5 * (1.0 + this.erf(z / Math.sqrt(2.0)));
  }

  private static erf(x: number): number {
    // Abramowitz and Stegun formula 7.1.26 approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1.0 : 1.0;
    const t = 1.0 / (1.0 + p * Math.abs(x));
    const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
    return sign * y;
  }

  static inverseNormal(area: number, mean: number = 0.0, stdDev: number = 1.0): number {
    if (area <= 0.0 || area >= 1.0 || stdDev <= 0) {
      throw new Error('Area must be between 0 and 1, std dev > 0');
    }
    const q = area - 0.5;
    let z: number;
    if (Math.abs(q) <= 0.42) {
      const r = q * q;
      z =
        (q * (((-25.44106049637 * r + 41.39119773534) * r - 18.61500062529) * r + 2.50662823884)) /
        ((((3.13082909833 * r - 21.06224101826) * r + 23.08336743743) * r + 1.0));
    } else {
      const r = q > 0 ? 1.0 - area : area;
      const s = Math.sqrt(-2.0 * Math.log(r));
      const num = (0.010328 * s + 0.802853) * s + 2.515517;
      const den = ((0.001308 * s + 0.189269) * s + 1.432788) * s + 1.0;
      const t = s - num / den;
      z = q > 0 ? t : -t;
    }
    return mean + z * stdDev;
  }

  static binomialPD(x: number, n: number, p: number): number {
    if (n < 0 || x < 0 || x > n || p < 0.0 || p > 1.0) {
      throw new Error('Invalid binomial parameters');
    }
    const nCr = this.nChooseK(n, x);
    return nCr * Math.pow(p, x) * Math.pow(1.0 - p, n - x);
  }

  static binomialCD(x: number, n: number, p: number): number {
    if (n < 0 || p < 0.0 || p > 1.0) {
      throw new Error('Invalid binomial parameters');
    }
    let sum = 0.0;
    const limit = Math.max(0, Math.min(n, x));
    for (let k = 0; k <= limit; k++) {
      sum += this.binomialPD(k, n, p);
    }
    return Math.max(0.0, Math.min(1.0, sum));
  }

  static poissonPD(x: number, lambda: number): number {
    if (x < 0 || lambda <= 0) throw new Error('x must be >= 0, lambda > 0');
    let fact = 1.0;
    for (let i = 2; i <= x; i++) fact *= i;
    return (Math.pow(lambda, x) * Math.exp(-lambda)) / fact;
  }

  static poissonCD(x: number, lambda: number): number {
    if (x < 0 || lambda <= 0) throw new Error('x must be >= 0, lambda > 0');
    let sum = 0.0;
    for (let k = 0; k <= x; k++) {
      sum += this.poissonPD(k, lambda);
    }
    return Math.max(0.0, Math.min(1.0, sum));
  }

  private static nChooseK(n: number, k: number): number {
    if (k < 0 || k > n) return 0.0;
    if (k === 0 || k === n) return 1.0;
    const r = Math.min(k, n - k);
    let c = 1.0;
    for (let i = 1; i <= r; i++) {
      c = (c * (n - i + 1)) / i;
    }
    return c;
  }
}
