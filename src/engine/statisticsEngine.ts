export interface OneVarStats {
  n: number;
  mean: number;
  sumX: number;
  sumX2: number;
  popVar: number;
  sampleVar: number;
  popStdDev: number;
  sampleStdDev: number;
  minX: number;
  q1: number;
  median: number;
  q3: number;
  maxX: number;
}

export interface TwoVarStats {
  n: number;
  meanX: number;
  meanY: number;
  stdDevX: number;
  stdDevY: number;
  interceptA: number;
  slopeB: number;
  correlationR: number;
  rSquared: number;
}

export class StatisticsEngine {
  static calculateOneVar(data: number[]): OneVarStats {
    if (data.length === 0) throw new Error('Data cannot be empty');
    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    const sumX = data.reduce((a, b) => a + b, 0);
    const sumX2 = data.reduce((a, b) => a + b * b, 0);
    const mean = sumX / n;

    const popVar = data.reduce((sum, v) => sum + (v - mean) * (v - mean), 0) / n;
    const sampleVar = n > 1 ? data.reduce((sum, v) => sum + (v - mean) * (v - mean), 0) / (n - 1) : 0;
    const popSd = Math.sqrt(popVar);
    const sampleSd = Math.sqrt(sampleVar);

    const minX = sorted[0];
    const maxX = sorted[sorted.length - 1];
    const med = this.medianOf(sorted);
    const q1 = this.medianOf(sorted.slice(0, Math.floor(n / 2)));
    const q3 = this.medianOf(sorted.slice(Math.ceil(n / 2)));

    return {
      n,
      mean,
      sumX,
      sumX2,
      popVar,
      sampleVar,
      popStdDev: popSd,
      sampleStdDev: sampleSd,
      minX,
      q1,
      median: med,
      q3,
      maxX,
    };
  }

  private static medianOf(list: number[]): number {
    if (list.length === 0) return 0;
    const mid = Math.floor(list.length / 2);
    return list.length % 2 === 1 ? list[mid] : (list[mid - 1] + list[mid]) / 2.0;
  }

  static calculateTwoVar(xList: number[], yList: number[]): TwoVarStats {
    if (xList.length !== yList.length || xList.length < 2) {
      throw new Error('Need at least 2 coordinate pairs');
    }
    const n = xList.length;
    const sumX = xList.reduce((a, b) => a + b, 0);
    const sumY = yList.reduce((a, b) => a + b, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;

    let ssXX = 0.0;
    let ssYY = 0.0;
    let ssXY = 0.0;

    for (let i = 0; i < n; i++) {
      const dx = xList[i] - meanX;
      const dy = yList[i] - meanY;
      ssXX += dx * dx;
      ssYY += dy * dy;
      ssXY += dx * dy;
    }

    const b = ssXX !== 0.0 ? ssXY / ssXX : 0.0;
    const a = meanY - b * meanX;
    const r = ssXX > 0 && ssYY > 0 ? ssXY / Math.sqrt(ssXX * ssYY) : 0.0;
    const r2 = r * r;

    const sdX = Math.sqrt(ssXX / (n - 1));
    const sdY = Math.sqrt(ssYY / (n - 1));

    return {
      n,
      meanX,
      meanY,
      stdDevX: sdX,
      stdDevY: sdY,
      interceptA: a,
      slopeB: b,
      correlationR: r,
      rSquared: r2,
    };
  }

  static estimateY(stats: TwoVarStats, x: number): number {
    return stats.interceptA + stats.slopeB * x;
  }

  static estimateX(stats: TwoVarStats, y: number): number {
    return stats.slopeB !== 0.0 ? (y - stats.interceptA) / stats.slopeB : NaN;
  }
}
