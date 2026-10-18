/**
 * Representation of a complex number z = real + imag * i.
 * Supports rectangular, polar (r∠θ), conjugate, argument, magnitude, and powers.
 */
export class ComplexNumber {
  readonly real: number;
  readonly imag: number;

  constructor(real: number, imag: number = 0.0) {
    this.real = real;
    this.imag = imag;
  }

  get magnitude(): number {
    return Math.hypot(this.real, this.imag);
  }

  get argumentRad(): number {
    return Math.atan2(this.imag, this.real);
  }

  get argumentDeg(): number {
    return (this.argumentRad * 180.0) / Math.PI;
  }

  plus(other: ComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      return new ComplexNumber(this.real + other, this.imag);
    }
    return new ComplexNumber(this.real + other.real, this.imag + other.imag);
  }

  minus(other: ComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      return new ComplexNumber(this.real - other, this.imag);
    }
    return new ComplexNumber(this.real - other.real, this.imag - other.imag);
  }

  times(other: ComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      return new ComplexNumber(this.real * other, this.imag * other);
    }
    return new ComplexNumber(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  div(other: ComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      if (other === 0) throw new Error('Division by zero');
      return new ComplexNumber(this.real / other, this.imag / other);
    }
    const denom = other.real * other.real + other.imag * other.imag;
    if (denom === 0) throw new Error('Complex division by zero');
    return new ComplexNumber(
      (this.real * other.real + this.imag * other.imag) / denom,
      (this.imag * other.real - this.real * other.imag) / denom
    );
  }

  conjugate(): ComplexNumber {
    return new ComplexNumber(this.real, -this.imag);
  }

  pow(n: number): ComplexNumber {
    const r = Math.pow(this.magnitude, n);
    const theta = this.argumentRad * n;
    return new ComplexNumber(r * Math.cos(theta), r * Math.sin(theta));
  }

  sqrt(): ComplexNumber {
    const r = Math.sqrt(this.magnitude);
    const theta = this.argumentRad / 2.0;
    return new ComplexNumber(r * Math.cos(theta), r * Math.sin(theta));
  }

  toRectangularString(decimals: number = 4): string {
    const rStr = formatNum(this.real, decimals);
    const iAbs = Math.abs(this.imag);
    const iStr = formatNum(iAbs, decimals);

    if (Math.abs(this.imag) < 1e-12) return rStr;
    if (Math.abs(this.real) < 1e-12) {
      return this.imag < 0 ? `-${iStr}i` : `${iStr}i`;
    }
    return this.imag < 0 ? `${rStr} - ${iStr}i` : `${rStr} + ${iStr}i`;
  }

  toPolarString(inDegrees: boolean = true, decimals: number = 4): string {
    const rStr = formatNum(this.magnitude, decimals);
    const angle = inDegrees ? this.argumentDeg : this.argumentRad;
    const unit = inDegrees ? '°' : ' rad';
    const angleStr = formatNum(angle, decimals);
    return `${rStr} ∠ ${angleStr}${unit}`;
  }

  static readonly ZERO = new ComplexNumber(0, 0);
  static readonly ONE = new ComplexNumber(1, 0);
  static readonly I = new ComplexNumber(0, 1);

  static fromPolar(r: number, theta: number, isDegrees: boolean = false): ComplexNumber {
    const angle = isDegrees ? (theta * Math.PI) / 180.0 : theta;
    return new ComplexNumber(r * Math.cos(angle), r * Math.sin(angle));
  }
}

function formatNum(n: number, decimals: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-9) return Math.round(n).toString();
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(n * factor) / factor;
  return rounded.toString();
}
