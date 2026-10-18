import { MathEngine } from './mathEngine';

/**
 * Spreadsheet computation engine for a 5-column (A..E) x 10-row (1..10) cell grid.
 * Evaluates values and formulas (=A1+B1, =SUM(A1:A5), =MEAN(A1:A5), etc.).
 */
export class SpreadsheetEngine {
  readonly cols = ['A', 'B', 'C', 'D', 'E'];
  readonly rowCount = 10;

  // Raw cell input strings (e.g. "10", "=A1+2", "=SUM(A1:A3)")
  rawCells: Record<string, string> = {};
  // Cached computed values
  computedValues: Record<string, number> = {};

  constructor() {
    this.rawCells['A1'] = '10';
    this.rawCells['A2'] = '20';
    this.rawCells['A3'] = '30';
    this.rawCells['B1'] = '5';
    this.rawCells['B2'] = '15';
    this.rawCells['B3'] = '=A3-10';
    this.rawCells['C1'] = '=SUM(A1:A3)';
    this.rawCells['C2'] = '=MEAN(A1:A3)';
    this.recalculateAll();
  }

  setCell(cellRef: string, value: string): void {
    const norm = cellRef.toUpperCase().trim();
    if (!value || value.trim() === '') {
      delete this.rawCells[norm];
      delete this.computedValues[norm];
    } else {
      this.rawCells[norm] = value.trim();
    }
    this.recalculateAll();
  }

  recalculateAll(): void {
    this.computedValues = {};
    const visiting = new Set<string>();

    for (const col of this.cols) {
      for (let r = 1; r <= this.rowCount; r++) {
        const ref = `${col}${r}`;
        this.evalCell(ref, visiting);
      }
    }
  }

  evalCell(ref: string, visiting: Set<string>): number {
    if (this.computedValues[ref] !== undefined) return this.computedValues[ref];
    const raw = this.rawCells[ref];
    if (raw === undefined) return 0.0;

    if (!raw.startsWith('=')) {
      const num = parseFloat(raw) || 0.0;
      this.computedValues[ref] = num;
      return num;
    }

    if (visiting.has(ref)) {
      // Circular dependency detected
      return NaN;
    }

    visiting.add(ref);
    const formula = raw.substring(1).trim().toUpperCase();
    const res = this.evaluateFormula(formula, visiting);
    visiting.delete(ref);

    this.computedValues[ref] = res;
    return res;
  }

  private evaluateFormula(formula: string, visiting: Set<string>): number {
    // Range functions: SUM, MEAN, MIN, MAX, COUNT
    const rangeRegex = /^(SUM|MEAN|MIN|MAX|COUNT)\(([A-E](?:10|[1-9])):([A-E](?:10|[1-9]))\)$/;
    const match = rangeRegex.exec(formula);
    if (match) {
      const fn = match[1];
      const startRef = match[2];
      const endRef = match[3];
      const values = this.getRangeValues(startRef, endRef, visiting);
      if (values.length === 0) return 0.0;
      switch (fn) {
        case 'SUM':
          return values.reduce((a, b) => a + b, 0);
        case 'MEAN':
          return values.reduce((a, b) => a + b, 0) / values.length;
        case 'MIN':
          return Math.min(...values);
        case 'MAX':
          return Math.max(...values);
        case 'COUNT':
          return values.length;
        default:
          return 0.0;
      }
    }

    // Basic arithmetic between cell references and constants (e.g. A1 + B2)
    let parsedExpr = formula;
    const cellRefRegex = /[A-E](?:10|[1-9])/g;
    parsedExpr = parsedExpr.replace(cellRefRegex, (ref) => {
      const v = this.evalCell(ref, visiting);
      return isNaN(v) ? '0' : v.toString();
    });

    try {
      const mathEngine = new MathEngine();
      return mathEngine.evaluate(parsedExpr).numericValue;
    } catch {
      return 0.0;
    }
  }

  private getRangeValues(start: string, end: string, visiting: Set<string>): number[] {
    const startCol = start.charCodeAt(0);
    const startRow = parseInt(start.substring(1), 10);
    const endCol = end.charCodeAt(0);
    const endRow = parseInt(end.substring(1), 10);

    const cMin = Math.min(startCol, endCol);
    const cMax = Math.max(startCol, endCol);
    const rMin = Math.min(startRow, endRow);
    const rMax = Math.max(startRow, endRow);

    const list: number[] = [];
    for (let c = cMin; c <= cMax; c++) {
      for (let r = rMin; r <= rMax; r++) {
        const ref = `${String.fromCharCode(c)}${r}`;
        list.push(this.evalCell(ref, visiting));
      }
    }
    return list;
  }
}
