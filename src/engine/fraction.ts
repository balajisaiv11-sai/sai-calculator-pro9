/**
 * Representation of an exact rational number (Fraction).
 * Handles proper, improper, and mixed fractions with automatic simplification.
 */
export class Fraction {
  readonly numerator: bigint;
  readonly denominator: bigint;

  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    const num = typeof numerator === 'number' ? BigInt(Math.round(numerator)) : numerator;
    const den = typeof denominator === 'number' ? BigInt(Math.round(denominator)) : denominator;

    if (den === 0n) {
      throw new Error('Denominator cannot be zero');
    }

    this.numerator = num;
    this.denominator = den;
  }

  get isNegative(): boolean {
    return (this.numerator < 0n) !== (this.denominator < 0n);
  }

  get absNumerator(): bigint {
    return this.numerator < 0n ? -this.numerator : this.numerator;
  }

  get absDenominator(): bigint {
    return this.denominator < 0n ? -this.denominator : this.denominator;
  }

  get simplified(): Fraction {
    const g = Fraction.gcd(this.absNumerator, this.absDenominator);
    const sNum = this.absNumerator / g;
    const sDen = this.absDenominator / g;
    return new Fraction(this.isNegative ? -sNum : sNum, sDen);
  }

  plus(other: Fraction): Fraction {
    const num = this.numerator * other.denominator + other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den).simplified;
  }

  minus(other: Fraction): Fraction {
    const num = this.numerator * other.denominator - other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den).simplified;
  }

  times(other: Fraction): Fraction {
    const num = this.numerator * other.numerator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den).simplified;
  }

  div(other: Fraction): Fraction {
    if (other.numerator === 0n) {
      throw new Error('Division by zero fraction');
    }
    const num = this.numerator * other.denominator;
    const den = this.denominator * other.numerator;
    return new Fraction(num, den).simplified;
  }

  toDouble(): number {
    return Number(this.numerator) / Number(this.denominator);
  }

  toMixedString(): string {
    const simp = this.simplified;
    const whole = simp.numerator / simp.denominator;
    const rem = simp.numerator % simp.denominator;
    const absRem = rem < 0n ? -rem : rem;

    if (absRem === 0n) {
      return `${whole}`;
    }
    if (whole === 0n) {
      return `${simp.numerator}/${simp.denominator}`;
    }
    return `${whole} ${absRem}/${simp.denominator}`;
  }

  toString(): string {
    const simp = this.simplified;
    if (simp.denominator === 1n) {
      return `${simp.numerator}`;
    }
    return `${simp.numerator}/${simp.denominator}`;
  }

  static readonly ZERO = new Fraction(0n, 1n);
  static readonly ONE = new Fraction(1n, 1n);

  static gcd(a: bigint, b: bigint): bigint {
    let x = a < 0n ? -a : a;
    let y = b < 0n ? -b : b;
    while (y !== 0n) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x === 0n ? 1n : x;
  }

  static lcm(a: bigint, b: bigint): bigint {
    if (a === 0n || b === 0n) return 0n;
    const prod = (a < 0n ? -a : a) * (b < 0n ? -b : b);
    return prod / Fraction.gcd(a, b);
  }

  static fromDouble(value: number, maxDenominator: number = 100000): Fraction {
    if (isNaN(value) || !isFinite(value)) {
      throw new Error('Cannot convert NaN or Infinite to fraction');
    }

    const isNeg = value < 0;
    const x = Math.abs(value);

    let m00 = 1n;
    let m01 = 0n;
    let m10 = 0n;
    let m11 = 1n;

    let z = x;
    let previousError = Number.MAX_VALUE;

    while (true) {
      const a = BigInt(Math.floor(z));
      const newM00 = a * m00 + m01;
      const newM10 = a * m10 + m11;
      if (Number(newM10) > maxDenominator) break;

      m01 = m00;
      m00 = newM00;
      m11 = m10;
      m10 = newM10;

      const currentVal = Number(m00) / Number(m10);
      const error = Math.abs(x - currentVal);
      if (error < 1e-12 || error >= previousError) break;
      previousError = error;

      const fracPart = z - Math.floor(z);
      if (fracPart < 1e-14) break;
      z = 1.0 / fracPart;
    }

    const sign = isNeg ? -1n : 1n;
    return new Fraction(sign * m00, m10).simplified;
  }
}
