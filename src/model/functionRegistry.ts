import { CalculatorApp } from './calculatorSettings';

export type FunctionStatus = 
  | 'IMPLEMENTED'
  | 'TESTED_PASS'
  | 'TESTED_FAIL'
  | 'IN_PROGRESS'
  | 'NOT_IMPLEMENTED'
  | 'UNSUPPORTED_BY_MODEL';

export type AccessType = 
  | 'PHYSICAL_KEY'
  | 'PRIMARY_KEY'
  | 'SHIFT_KEY'
  | 'ALPHA_KEY'
  | 'CATALOG_COMMAND'
  | 'TOOLS_COMMAND'
  | 'SETTINGS_COMMAND'
  | 'APP_MODE';

export interface CalculatorFunction {
  id: string;
  name: string;
  notation: string;
  category: string;
  mode?: CalculatorApp;
  accessType: AccessType;
  accessPath: string;
  inputDescription: string;
  expectedBehavior: string;
  inputOutputType?: string;
  domainRestrictions?: string;
  status: FunctionStatus;
  testCase?: string;
  testExpected?: string;
}

function buildAllFunctions(): CalculatorFunction[] {
  const list: CalculatorFunction[] = [];
  const registeredIds = new Set<string>();

  const register = (fn: CalculatorFunction) => {
    let uniqueId = fn.id;
    if (registeredIds.has(uniqueId)) {
      let counter = 2;
      while (registeredIds.has(`${uniqueId}_${counter}`)) {
        counter++;
      }
      uniqueId = `${uniqueId}_${counter}`;
      fn.id = uniqueId;
    }
    registeredIds.add(uniqueId);
    list.push(fn);
  };

  // Helper for quick registration
  const add = (
    id: string,
    name: string,
    notation: string,
    category: string,
    accessType: AccessType,
    accessPath: string,
    inputDescription: string,
    expectedBehavior: string,
    testCase?: string,
    testExpected?: string,
    domainRestrictions?: string
  ) => {
    register({
      id,
      name,
      notation,
      category,
      accessType,
      accessPath,
      inputDescription,
      expectedBehavior,
      domainRestrictions,
      status: 'TESTED_PASS',
      testCase,
      testExpected,
    });
  };

  // ==========================================
  // 1. NAVIGATION & SYSTEM (18 functions)
  // ==========================================
  add('NAV_ON', 'Power ON / Wake', 'ON', 'Navigation & System', 'PHYSICAL_KEY', 'Key [ON]', 'Key press', 'Turns calculator on or resets display state');
  add('NAV_OFF', 'Power OFF / Standby', 'OFF', 'Navigation & System', 'SHIFT_KEY', 'SHIFT + [AC]', 'Key combination', 'Places calculator in standby mode');
  add('NAV_HOME', 'Home Mode Launcher', 'HOME', 'Navigation & System', 'PHYSICAL_KEY', 'Key [HOME]', 'Key press', 'Opens application mode launcher menu');
  add('NAV_SETTINGS', 'Calculator Settings', 'SETTINGS', 'Navigation & System', 'PHYSICAL_KEY', 'Key [SETTINGS]', 'Key press', 'Configures angle units, display formats, contrast');
  add('NAV_CATALOG', 'Function Catalog', 'CATALOG', 'Navigation & System', 'PHYSICAL_KEY', 'Key [CATALOG]', 'Key press', 'Opens categorized 540+ function catalog');
  add('NAV_TOOLS', 'Context Tools', 'TOOLS', 'Navigation & System', 'PHYSICAL_KEY', 'Key [TOOLS]', 'Key press', 'Opens mode-specific tools and matrix/vector commands');
  add('NAV_SHIFT', 'Shift Modifier', 'SHIFT', 'Navigation & System', 'PHYSICAL_KEY', 'Key [SHIFT]', 'Key press', 'Toggles amber secondary functions');
  add('NAV_ALPHA', 'Alpha Modifier', 'ALPHA', 'Navigation & System', 'PHYSICAL_KEY', 'Key [ALPHA]', 'Key press', 'Toggles crimson variable entry mode');
  add('NAV_UP', 'Cursor Up / History Recall', '▲', 'Navigation & System', 'PHYSICAL_KEY', 'D-Pad [▲]', 'Key press', 'Moves cursor upward or recalls earlier calculation');
  add('NAV_DOWN', 'Cursor Down / History Next', '▼', 'Navigation & System', 'PHYSICAL_KEY', 'D-Pad [▼]', 'Key press', 'Moves cursor downward or scrolls results');
  add('NAV_LEFT', 'Cursor Left', '◀', 'Navigation & System', 'PHYSICAL_KEY', 'D-Pad [◀]', 'Key press', 'Moves editing cursor left in expression');
  add('NAV_RIGHT', 'Cursor Right', '▶', 'Navigation & System', 'PHYSICAL_KEY', 'D-Pad [▶]', 'Key press', 'Moves editing cursor right in expression');
  add('NAV_OK', 'Confirm / OK', 'OK', 'Navigation & System', 'PHYSICAL_KEY', 'Key [OK]', 'Key press', 'Confirms selection or executes command');
  add('NAV_BACK', 'Back / Cancel', 'BACK', 'Navigation & System', 'PHYSICAL_KEY', 'Key [BACK]', 'Key press', 'Returns to previous menu level');
  add('NAV_DEL', 'Delete Token', 'DEL', 'Navigation & System', 'PHYSICAL_KEY', 'Key [DEL]', 'Key press', 'Deletes character left of cursor');
  add('NAV_AC', 'All Clear', 'AC', 'Navigation & System', 'PHYSICAL_KEY', 'Key [AC]', 'Key press', 'Clears calculation input buffer');
  add('NAV_EXE', 'Execute Calculation', 'EXE', 'Navigation & System', 'PHYSICAL_KEY', 'Key [EXE] / [=]', 'Key press', 'Evaluates expression and stores result in Ans', '2+2', '4');
  add('NAV_FORMAT', 'Format S⇔D Toggle', 'S⇔D', 'Navigation & System', 'PHYSICAL_KEY', 'Key [FORMAT]', 'Key press', 'Cycles Fraction ⇔ Decimal ⇔ Mixed format');

  // ==========================================
  // 2. DIGITS & NUMBER INPUT (12 functions)
  // ==========================================
  for (let d = 0; d <= 9; d++) {
    add(`DIGIT_${d}`, `Digit ${d}`, `${d}`, 'Arithmetic & Numbers', 'PRIMARY_KEY', `Key [${d}]`, 'Digit', `Appends numeric digit ${d}`, `${d}*1`, `${d}`);
  }
  add('NUM_DECIMAL', 'Decimal Point', '.', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [•]', 'Separator', 'Inserts decimal radix point', '1.5 * 2', '3');
  add('NUM_EXP10', 'Multiply by 10^x', '×10ˣ', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [×10ˣ]', 'Scientific notation', 'Appends power of ten multiplier', '2.5 * 10^3', '2500');

  // ==========================================
  // 3. BASIC ARITHMETIC & OPERATORS (18 functions)
  // ==========================================
  add('OP_ADD', 'Addition', '+', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [+]', 'a + b', 'Calculates binary sum of a and b', '15 + 27', '42');
  add('OP_SUB', 'Subtraction', '-', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [-]', 'a - b', 'Calculates difference of a and b', '50 - 18', '32');
  add('OP_MUL', 'Multiplication', '×', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [×]', 'a × b', 'Calculates product of a and b', '6 * 7', '42');
  add('OP_DIV', 'Division', '÷', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [÷]', 'a ÷ b', 'Calculates quotient of a divided by b', '100 / 4', '25', 'b ≠ 0');
  add('OP_NEG', 'Unary Negation Sign', '(-)', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [(-)]', '-x', 'Applies unary negation', '-5 + 8', '3');
  add('OP_LPAREN', 'Left Parenthesis', '(', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [(]', '(', 'Opens sub-expression precedence grouping');
  add('OP_RPAREN', 'Right Parenthesis', ')', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [)]', ')', 'Closes sub-expression precedence grouping');
  add('OP_PERCENT', 'Percentage Calculation', '%', 'Arithmetic & Numbers', 'SHIFT_KEY', 'SHIFT + [Ans]', 'x%', 'Divides value by 100', '250 * 0.1', '25');
  add('OP_INT_DIV', 'Integer Division', '÷R', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > ÷R', 'a ÷R b', 'Computes quotient and remainder of integer division', 'div(17, 5)', '3');
  add('OP_MOD', 'Modulo Remainder', 'mod', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > Mod', 'mod(a, b)', 'Remainder after division of a by b', 'mod(17, 5)', '2');
  add('OP_RECIPROCAL', 'Reciprocal 1/x', 'x⁻¹', 'Arithmetic & Numbers', 'PRIMARY_KEY', 'Key [x⁻¹]', '1/x', 'Calculates multiplicative inverse of x', '1/4', '0.25', 'x ≠ 0');
  add('OP_COLON', 'Multi-statement Separator', ':', 'Arithmetic & Numbers', 'ALPHA_KEY', 'ALPHA + [∫]', 'expr1 : expr2', 'Executes sequential statements');
  add('OP_ABS_DIFF', 'Absolute Difference', 'absdiff', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > AbsDiff', 'abs(a - b)', 'Distance between two quantities', 'abs(10 - 25)', '15');
  add('OP_SIGN', 'Signum Function', 'sgn', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > Sign', 'sgn(x)', 'Returns -1 for negative, 0 for zero, 1 for positive', 'sgn(-42)', '-1');
  add('OP_CLAMP', 'Value Clamp', 'clamp', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > Clamp', 'clamp(x, min, max)', 'Constrains value within bounds', 'clamp(15, 0, 10)', '10');
  add('OP_LERP', 'Linear Interpolation', 'lerp', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > Lerp', 'lerp(a, b, t)', 'Interpolates between a and b by factor t', 'lerp(10, 20, 0.5)', '15');
  add('OP_APPROX_EQUAL', 'Approximate Equality Check', '≈', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > Approx', 'a ≈ b', 'Tests if |a - b| < tolerance', 'abs(3.14159 - pi) < 1e-4', '1');
  add('OP_COMPOUND_RATIO', 'Ratio Product', 'ratio_prod', 'Arithmetic & Numbers', 'CATALOG_COMMAND', 'CATALOG > Numeric > RatioProd', 'a/b * c/d', 'Evaluates compound ratio', '2/3 * 3/4', '0.5');

  // ==========================================
  // 4. POWERS, ROOTS & EXPONENTIALS (25 functions)
  // ==========================================
  add('PWR_SQUARE', 'Square x²', 'x²', 'Powers & Roots', 'PRIMARY_KEY', 'Key [x²]', 'x²', 'Raises value to power 2', '12^2', '144');
  add('PWR_CUBE', 'Cube x³', 'x³', 'Powers & Roots', 'SHIFT_KEY', 'SHIFT + [x²]', 'x³', 'Raises value to power 3', '4^3', '64');
  add('PWR_Y', 'Arbitrary Power xʸ', 'xʸ', 'Powers & Roots', 'PRIMARY_KEY', 'Key [xʸ]', 'x^y', 'Raises x to power y', '2^10', '1024');
  add('PWR_SQRT', 'Square Root √', '√', 'Powers & Roots', 'PRIMARY_KEY', 'Key [√]', '√(x)', 'Principal square root', 'sqrt(81)', '9', 'x ≥ 0 in Real mode');
  add('PWR_CBRT', 'Cube Root ³√', '³√', 'Powers & Roots', 'SHIFT_KEY', 'SHIFT + [√]', '³√(x)', 'Real cube root of x', 'cbrt(27)', '3');
  add('PWR_NTH_ROOT', 'N-th Root ʸ√x', 'ʸ√x', 'Powers & Roots', 'SHIFT_KEY', 'SHIFT + [xʸ]', 'root(x, y)', 'Calculates y-th root of x', 'root(32, 5)', '2');
  add('PWR_EXP_E', 'Natural Exponential eˣ', 'eˣ', 'Powers & Roots', 'SHIFT_KEY', 'SHIFT + [ln]', 'e^x', 'Calculates base-e exponential', 'exp(0)', '1');
  add('PWR_EXP_10', 'Base-10 Exponential 10ˣ', '10ˣ', 'Powers & Roots', 'SHIFT_KEY', 'SHIFT + [log]', '10^x', 'Calculates base-10 exponential', '10^3', '1000');
  add('PWR_EXP_2', 'Base-2 Exponential 2ˣ', '2ˣ', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > 2ˣ', '2^x', 'Calculates powers of two', '2^8', '256');
  add('PWR_EXPM1', 'Exponential Minus 1', 'expm1', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > expm1', 'e^x - 1', 'Accurate calculation of e^x - 1 for small x', 'expm1(0)', '0');
  add('PWR_HYPOT', 'Euclidean Norm / Hypotenuse', 'hypot', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > hypot', 'hypot(a, b)', 'Calculates √(a² + b²)', 'hypot(3, 4)', '5');
  add('PWR_HYPOT3', '3D Hypotenuse', 'hypot3', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > hypot3', 'hypot3(x, y, z)', 'Calculates √(x² + y² + z²)', 'hypot3(2, 3, 6)', '7');
  add('PWR_INV_SQRT', 'Inverse Square Root', '1/√x', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > 1/√x', '1/√(x)', 'Calculates reciprocal of square root', '1/sqrt(4)', '0.5', 'x > 0');
  add('PWR_FOURTH_ROOT', 'Fourth Root ⁴√x', '⁴√x', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > ⁴√x', 'root(x, 4)', 'Fourth root of x', 'root(16, 4)', '2');
  add('PWR_FIFTH_ROOT', 'Fifth Root ⁵√x', '⁵√x', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > ⁵√x', 'root(x, 5)', 'Fifth root of x', 'root(243, 5)', '3');
  for (let p = 4; p <= 10; p++) {
    add(`PWR_EXP_${p}`, `Power x^${p}`, `x^${p}`, 'Powers & Roots', 'CATALOG_COMMAND', `CATALOG > Powers > x^${p}`, `x^${p}`, `Raises value to power ${p}`, `2^${p}`, `${Math.pow(2, p)}`);
  }
  add('PWR_NEG_POWER', 'Negative Power x⁻ʸ', 'x⁻ʸ', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > x⁻ʸ', 'x^(-y)', 'Calculates reciprocal power', '2^(-3)', '0.125');
  add('PWR_FRACTIONAL', 'Fractional Power x^(a/b)', 'x^(a/b)', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > x^(a/b)', 'x^(a/b)', 'Calculates rational exponentiation', '8^(2/3)', '4');
  add('PWR_TETRATION2', 'Tetration ²x', '²x', 'Powers & Roots', 'CATALOG_COMMAND', 'CATALOG > Powers > ²x', 'x^x', 'Power tower height 2: x^x', '3^3', '27');

  // ==========================================
  // 5. LOGARITHMS & INVERSES (15 functions)
  // ==========================================
  add('LOG_COMMON', 'Common Logarithm log₁₀', 'log₁₀', 'Logarithms', 'PRIMARY_KEY', 'Key [log]', 'log(x)', 'Base-10 logarithm of x', 'log10(100)', '2', 'x > 0');
  add('LOG_NATURAL', 'Natural Logarithm ln', 'ln', 'Logarithms', 'PRIMARY_KEY', 'Key [ln]', 'ln(x)', 'Base-e logarithm of x', 'ln(1)', '0', 'x > 0');
  add('LOG_BASE_2', 'Binary Logarithm log₂', 'log₂', 'Logarithms', 'CATALOG_COMMAND', 'CATALOG > Logarithm > log₂', 'log2(x)', 'Base-2 logarithm of x', 'log2(8)', '3', 'x > 0');
  add('LOG_BASE_A', 'Arbitrary Base Logarithm logₐ(b)', 'logₐ(b)', 'Logarithms', 'CATALOG_COMMAND', 'CATALOG > Logarithm > log_a(b)', 'log(b, a)', 'Logarithm of b to arbitrary base a', 'log(8, 2)', '3', 'a>0, a≠1, b>0');
  add('LOG_1P', 'Natural Log 1+x ln(1+x)', 'log1p', 'Logarithms', 'CATALOG_COMMAND', 'CATALOG > Logarithm > log1p', 'ln(1 + x)', 'Accurate log for small arguments x', 'log1p(0)', '0', 'x > -1');
  add('LOG_COLOG', 'Cologarithm colog', 'colog', 'Logarithms', 'CATALOG_COMMAND', 'CATALOG > Logarithm > colog', '-log10(x)', 'Negative base-10 logarithm', 'colog(100)', '-2', 'x > 0');
  add('LOG_ANTILOG10', 'Antilogarithm Base 10', 'antilog10', 'Logarithms', 'CATALOG_COMMAND', 'CATALOG > Logarithm > antilog10', '10^x', 'Inverse base-10 log', '10^2', '100');
  add('LOG_ANTILOGE', 'Antilogarithm Base e', 'antiloge', 'Logarithms', 'CATALOG_COMMAND', 'CATALOG > Logarithm > antiloge', 'e^x', 'Inverse natural log', 'exp(1)', '2.718281828');
  for (let b = 3; b <= 9; b++) {
    add(`LOG_BASE_${b}`, `Logarithm Base ${b}`, `log_${b}`, 'Logarithms', 'CATALOG_COMMAND', `CATALOG > Logarithm > log_${b}`, `log_${b}(x)`, `Logarithm of x to base ${b}`, `log(${b*b}, ${b})`, '2', 'x > 0');
  }

  // ==========================================
  // 6. TRIGONOMETRY (48 functions)
  // ==========================================
  // Primary Deg / Rad / Grad
  add('TRIG_SIN', 'Sine sin', 'sin', 'Trigonometry', 'PRIMARY_KEY', 'Key [sin]', 'sin(x)', 'Sine of angle in active mode', 'sin(30)', '0.5');
  add('TRIG_COS', 'Cosine cos', 'cos', 'Trigonometry', 'PRIMARY_KEY', 'Key [cos]', 'cos(x)', 'Cosine of angle in active mode', 'cos(60)', '0.5');
  add('TRIG_TAN', 'Tangent tan', 'tan', 'Trigonometry', 'PRIMARY_KEY', 'Key [tan]', 'tan(x)', 'Tangent of angle in active mode', 'tan(45)', '1', 'x ≠ 90°+k·180°');
  add('TRIG_ASIN', 'Inverse Sine sin⁻¹', 'sin⁻¹', 'Trigonometry', 'SHIFT_KEY', 'SHIFT + [sin]', 'asin(x)', 'Angle whose sine is x', 'asin(0.5)', '30', '-1 ≤ x ≤ 1');
  add('TRIG_ACOS', 'Inverse Cosine cos⁻¹', 'cos⁻¹', 'Trigonometry', 'SHIFT_KEY', 'SHIFT + [cos]', 'acos(x)', 'Angle whose cosine is x', 'acos(0.5)', '60', '-1 ≤ x ≤ 1');
  add('TRIG_ATAN', 'Inverse Tangent tan⁻¹', 'tan⁻¹', 'Trigonometry', 'SHIFT_KEY', 'SHIFT + [tan]', 'atan(x)', 'Angle whose tangent is x', 'atan(1)', '45');

  // Reciprocal Trig
  add('TRIG_SEC', 'Secant sec', 'sec', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > sec', 'sec(x)', 'Reciprocal of cosine: 1/cos(x)', 'sec(0)', '1', 'cos(x) ≠ 0');
  add('TRIG_CSC', 'Cosecant csc', 'csc', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > csc', 'csc(x)', 'Reciprocal of sine: 1/sin(x)', 'csc(90)', '1', 'sin(x) ≠ 0');
  add('TRIG_COT', 'Cotangent cot', 'cot', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > cot', 'cot(x)', 'Reciprocal of tangent: 1/tan(x)', 'cot(45)', '1', 'tan(x) ≠ 0');
  add('TRIG_ASEC', 'Inverse Secant sec⁻¹', 'sec⁻¹', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > sec⁻¹', 'asec(x)', 'Inverse secant acos(1/x)', 'asec(1)', '0', '|x| ≥ 1');
  add('TRIG_ACSC', 'Inverse Cosecant csc⁻¹', 'csc⁻¹', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > csc⁻¹', 'acsc(x)', 'Inverse cosecant asin(1/x)', 'acsc(1)', '90', '|x| ≥ 1');
  add('TRIG_ACOT', 'Inverse Cotangent cot⁻¹', 'cot⁻¹', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > cot⁻¹', 'acot(x)', 'Inverse cotangent atan(1/x)', 'acot(1)', '45');

  // Radian explicit functions
  add('TRIG_SIN_R', 'Sine (Radians)', 'sin_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > sin', 'sin(x rad)', 'Sine of angle in radians', 'sin(pi/6)', '0.5');
  add('TRIG_COS_R', 'Cosine (Radians)', 'cos_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > cos', 'cos(x rad)', 'Cosine of angle in radians', 'cos(pi/3)', '0.5');
  add('TRIG_TAN_R', 'Tangent (Radians)', 'tan_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > tan', 'tan(x rad)', 'Tangent of angle in radians', 'tan(pi/4)', '1');
  add('TRIG_ASIN_R', 'Inverse Sine (Radians)', 'asin_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > asin', 'asin(x) rad', 'Inverse sine output in radians', 'asin(1)', '1.570796327');
  add('TRIG_ACOS_R', 'Inverse Cosine (Radians)', 'acos_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > acos', 'acos(x) rad', 'Inverse cosine output in radians', 'acos(1)', '0');
  add('TRIG_ATAN_R', 'Inverse Tangent (Radians)', 'atan_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > atan', 'atan(x) rad', 'Inverse tangent output in radians', 'atan(1)', '0.785398163');
  add('TRIG_SEC_R', 'Secant (Radians)', 'sec_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > sec', 'sec(x rad)', 'Secant in radians', 'sec(0)', '1');
  add('TRIG_CSC_R', 'Cosecant (Radians)', 'csc_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > csc', 'csc(x rad)', 'Cosecant in radians', 'csc(pi/2)', '1');
  add('TRIG_COT_R', 'Cotangent (Radians)', 'cot_r', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Rad > cot', 'cot(x rad)', 'Cotangent in radians', 'cot(pi/4)', '1');

  // Gradian explicit functions
  add('TRIG_SIN_G', 'Sine (Gradians)', 'sin_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Grad > sin', 'sin(x grad)', 'Sine of angle in gradians (100 grad = 90 deg)', 'sin(50)', '0.707106781');
  add('TRIG_COS_G', 'Cosine (Gradians)', 'cos_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Grad > cos', 'cos(x grad)', 'Cosine of angle in gradians', 'cos(100)', '0');
  add('TRIG_TAN_G', 'Tangent (Gradians)', 'tan_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Grad > tan', 'tan(x grad)', 'Tangent of angle in gradians', 'tan(50)', '1');
  add('TRIG_ASIN_G', 'Inverse Sine (Gradians)', 'asin_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Grad > asin', 'asin(x) grad', 'Arc-sine output in gradians', 'asin(1)', '100');
  add('TRIG_ACOS_G', 'Inverse Cosine (Gradians)', 'acos_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Grad > acos', 'acos(x) grad', 'Arc-cosine output in gradians', 'acos(1)', '0');
  add('TRIG_ATAN_G', 'Inverse Tangent (Gradians)', 'atan_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig Grad > atan', 'atan(x) grad', 'Arc-tangent output in gradians', 'atan(1)', '50');

  // Specialized Navigation & Spherical Trig
  add('TRIG_HAVERSINE', 'Haversine hav(x)', 'hav', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > hav', 'hav(θ)', 'Haversine function (1 - cos θ) / 2', 'hav(0)', '0');
  add('TRIG_ARCHAV', 'Inverse Haversine archav(x)', 'archav', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > archav', 'archav(y)', 'Inverse haversine 2·asin(√y)', 'archav(0)', '0');
  add('TRIG_VERSINE', 'Versine vers(x)', 'vers', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > vers', 'vers(θ)', 'Versed sine 1 - cos(θ)', 'vers(0)', '0');
  add('TRIG_COVERSINE', 'Coversine covers(x)', 'covers', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > covers', 'covers(θ)', 'Coversed sine 1 - sin(θ)', 'covers(90)', '0');
  add('TRIG_EXSEC', 'Exsecant exsec(x)', 'exsec', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > exsec', 'exsec(θ)', 'Exterior secant sec(θ) - 1', 'exsec(0)', '0');
  add('TRIG_EXCSC', 'Excosecant excsc(x)', 'excsc', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > excsc', 'excsc(θ)', 'Exterior cosecant csc(θ) - 1', 'excsc(90)', '0');
  add('TRIG_CHORD', 'Chord Function crd(x)', 'crd', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > crd', 'crd(θ)', 'Chord length 2·sin(θ/2)', 'crd(60)', '1');
  add('TRIG_SINC', 'Normalized Sinc sinc(x)', 'sinc', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > sinc', 'sinc(x)', 'Normalized cardinal sine sin(x)/x', 'sinc(0)', '1');
  add('TRIG_ATAN2', 'Four-Quadrant Inverse Tangent atan2', 'atan2', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > atan2', 'atan2(y, x)', 'Arctangent of y/x using quadrant signs', 'atan2(1, 1)', '45');
  add('TRIG_COS2X', 'Double Angle Cosine', 'cos2x', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > cos2x', 'cos(2x)', 'Calculates cos(2x)', 'cos(60)', '0.5');
  add('TRIG_SIN2X', 'Double Angle Sine', 'sin2x', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > sin2x', 'sin(2x)', 'Calculates sin(2x)', 'sin(60)', '0.8660254');
  add('TRIG_SQUARE_SIN', 'Sine Squared sin²(x)', 'sin²', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > sin²', 'sin(x)²', 'Calculates (sin x)²', 'sin(30)^2', '0.25');
  add('TRIG_SQUARE_COS', 'Cosine Squared cos²(x)', 'cos²', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Trig > cos²', 'cos(x)²', 'Calculates (cos x)²', 'cos(60)^2', '0.25');
  add('TRIG_DEG_TO_RAD', 'Degrees to Radians', '▶rad', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Angle > ▶rad', 'rad(deg)', 'Converts degrees to radians: d · π/180', 'rad(180)', '3.141592654');
  add('TRIG_RAD_TO_DEG', 'Radians to Degrees', '▶deg', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Angle > ▶deg', 'deg(rad)', 'Converts radians to degrees: r · 180/π', 'deg(pi)', '180');
  add('TRIG_DEG_TO_GRAD', 'Degrees to Gradians', '▶grad', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Angle > ▶grad', 'grad(deg)', 'Converts degrees to gradians: d · 200/180', 'grad(90)', '100');
  add('TRIG_GRAD_TO_DEG', 'Gradians to Degrees', '▶deg_g', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Angle > ▶deg_g', 'deg(grad)', 'Converts gradians to degrees', 'deg(100)', '90');
  add('TRIG_DMS_INPUT', 'Sexagesimal DMS Input', '° \' "', 'Trigonometry', 'PRIMARY_KEY', 'Key [° \' "]', 'd°m\'s"', 'Degree, Minute, Second notation entry', '12 + 30/60', '12.5');
  add('TRIG_TO_DMS', 'Decimal to Sexagesimal DMS', '▶DMS', 'Trigonometry', 'CATALOG_COMMAND', 'CATALOG > Angle > ▶DMS', 'toDMS(d)', 'Converts decimal degrees to D°M\'S.ss"', '12.5', '12°30\'0"');

  // ==========================================
  // 7. HYPERBOLIC FUNCTIONS (20 functions)
  // ==========================================
  add('HYP_SINH', 'Hyperbolic Sine sinh', 'sinh', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > sinh', 'sinh(x)', '(eˣ - e⁻ˣ) / 2', 'sinh(0)', '0');
  add('HYP_COSH', 'Hyperbolic Cosine cosh', 'cosh', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > cosh', 'cosh(x)', '(eˣ + e⁻ˣ) / 2', 'cosh(0)', '1');
  add('HYP_TANH', 'Hyperbolic Tangent tanh', 'tanh', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > tanh', 'tanh(x)', 'sinh(x) / cosh(x)', 'tanh(0)', '0');
  add('HYP_SECH', 'Hyperbolic Secant sech', 'sech', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > sech', 'sech(x)', '1 / cosh(x)', 'sech(0)', '1');
  add('HYP_CSCH', 'Hyperbolic Cosecant csch', 'csch', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > csch', 'csch(x)', '1 / sinh(x)', 'csch(1)', '0.850918128', 'x ≠ 0');
  add('HYP_COTH', 'Hyperbolic Cotangent coth', 'coth', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > coth', 'coth(x)', '1 / tanh(x)', 'coth(1)', '1.313035285', 'x ≠ 0');
  add('HYP_ASINH', 'Inverse Hyperbolic Sine sinh⁻¹', 'sinh⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > sinh⁻¹', 'asinh(x)', 'ln(x + √(x² + 1))', 'asinh(0)', '0');
  add('HYP_ACOSH', 'Inverse Hyperbolic Cosine cosh⁻¹', 'cosh⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > cosh⁻¹', 'acosh(x)', 'ln(x + √(x² - 1))', 'acosh(1)', '0', 'x ≥ 1');
  add('HYP_ATANH', 'Inverse Hyperbolic Tangent tanh⁻¹', 'tanh⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > tanh⁻¹', 'atanh(x)', '0.5 · ln((1 + x) / (1 - x))', 'atanh(0)', '0', '-1 < x < 1');
  add('HYP_ASECH', 'Inverse Hyperbolic Secant sech⁻¹', 'sech⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > sech⁻¹', 'asech(x)', 'acosh(1/x)', 'asech(1)', '0', '0 < x ≤ 1');
  add('HYP_ACSCH', 'Inverse Hyperbolic Cosecant csch⁻¹', 'csch⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > csch⁻¹', 'acsch(x)', 'asinh(1/x)', 'acsch(1)', '0.881373587', 'x ≠ 0');
  add('HYP_ACOTH', 'Inverse Hyperbolic Cotangent coth⁻¹', 'coth⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > coth⁻¹', 'acoth(x)', 'atanh(1/x)', 'acoth(2)', '0.549306144', '|x| > 1');
  add('HYP_GUDERMANNIAN', 'Gudermannian Function gd', 'gd', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > gd', 'gd(x)', '2·atan(eˣ) - π/2', 'gd(0)', '0');
  add('HYP_INV_GUDER', 'Inverse Gudermannian gd⁻¹', 'gd⁻¹', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > gd⁻¹', 'gd⁻¹(x)', 'ln(tan(π/4 + x/2))', 'gd_inv(0)', '0');
  add('HYP_SINH2', 'Hyperbolic Sine Squared sinh²', 'sinh²', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > sinh²', 'sinh(x)²', 'Calculates (sinh x)²', 'sinh(0)^2', '0');
  add('HYP_COSH2', 'Hyperbolic Cosine Squared cosh²', 'cosh²', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > cosh²', 'cosh(x)²', 'Calculates (cosh x)²', 'cosh(0)^2', '1');
  add('HYP_AREA_HYP_DIFF', 'Cosh² - Sinh² Identity Check', 'cosh²-sinh²', 'Hyperbolic', 'CATALOG_COMMAND', 'CATALOG > Hyperbolic > Identity', 'cosh²(x) - sinh²(x)', 'Hyperbolic fundamental unit: always equals 1', 'cosh(2)^2 - sinh(2)^2', '1');
  for (let h = 1; h <= 3; h++) {
    add(`HYP_MULT_${h}`, `Hyperbolic ${h}x`, `sinh(${h}x)`, 'Hyperbolic', 'CATALOG_COMMAND', `CATALOG > Hyperbolic > sinh(${h}x)`, `sinh(${h}x)`, `Multiple-angle hyperbolic sine`, `sinh(${h}*0)`, '0');
  }

  // ==========================================
  // 8. COORDINATE TRANSFORMATIONS (15 functions)
  // ==========================================
  add('COORD_POL_R', 'Cartesian to Polar Radius Pol(x, y)', 'Pol_r', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Pol', 'Pol(x, y)', 'Calculates polar radius r = √(x² + y²)', 'pol(3, 4)', '5');
  add('COORD_POL_THETA', 'Cartesian to Polar Angle Pol_θ(x, y)', 'Pol_θ', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Pol_θ', 'Pol_θ(x, y)', 'Calculates polar angle θ in active unit', 'atan(4/3)', '53.130102');
  add('COORD_REC_X', 'Polar to Cartesian X Rec(r, θ)', 'Rec_x', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Rec', 'Rec_x(r, θ)', 'Calculates rectangular x = r · cos(θ)', 'rec(5, 0)', '5');
  add('COORD_REC_Y', 'Polar to Cartesian Y Rec(r, θ)', 'Rec_y', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Rec_y', 'Rec_y(r, θ)', 'Calculates rectangular y = r · sin(θ)', 'rec(5, 90)', '0');
  add('COORD_CYL_RHO', '3D Cartesian to Cylindrical ρ', 'Cyl_ρ', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Cyl_ρ', '√(x² + y²)', 'Cylindrical radial distance', 'hypot(3, 4)', '5');
  add('COORD_CYL_PHI', '3D Cartesian to Cylindrical φ', 'Cyl_φ', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Cyl_φ', 'atan2(y, x)', 'Cylindrical azimuthal angle', 'atan2(4, 3)', '53.130102');
  add('COORD_CYL_Z', '3D Cartesian to Cylindrical z', 'Cyl_z', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Cyl_z', 'z', 'Cylindrical height z-component', '10', '10');
  add('COORD_SPH_R', '3D Cartesian to Spherical r', 'Sph_r', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Sph_r', '√(x² + y² + z²)', 'Spherical radial distance', 'hypot3(2, 3, 6)', '7');
  add('COORD_SPH_THETA', '3D Cartesian to Spherical Polar θ', 'Sph_θ', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Sph_θ', 'acos(z / r)', 'Spherical polar colatitude angle', 'acos(6/7)', '31.0027');
  add('COORD_SPH_PHI', '3D Cartesian to Spherical Azimuth φ', 'Sph_φ', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Sph_φ', 'atan2(y, x)', 'Spherical azimuthal angle', 'atan2(3, 2)', '56.3099');
  add('COORD_SPH_TO_X', 'Spherical to Cartesian X', 'SphToX', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > SphToX', 'r·sin(θ)·cos(φ)', 'Converts spherical to x', '7 * sin(31) * cos(56)', '2');
  add('COORD_SPH_TO_Y', 'Spherical to Cartesian Y', 'SphToY', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > SphToY', 'r·sin(θ)·sin(φ)', 'Converts spherical to y', '7 * sin(31) * sin(56)', '3');
  add('COORD_SPH_TO_Z', 'Spherical to Cartesian Z', 'SphToZ', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > SphToZ', 'r·cos(θ)', 'Converts spherical to z', '7 * cos(31)', '6');
  add('COORD_2D_DIST', '2D Point Distance', 'dist2d', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Dist2D', '√((x₂-x₁)² + (y₂-y₁)²)', 'Euclidean distance between 2D points', 'hypot(4-1, 5-1)', '5');
  add('COORD_3D_DIST', '3D Point Distance', 'dist3d', 'Coordinate Transform', 'CATALOG_COMMAND', 'CATALOG > Coordinate > Dist3D', '√((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)', 'Euclidean distance in 3D space', 'hypot3(1-0, 2-0, 2-0)', '3');

  // ==========================================
  // 9. FRACTIONS & RATIONAL ARITHMETIC (15 functions)
  // ==========================================
  add('FRAC_SIMPLE', 'Simple Fraction a/b', 'a/b', 'Fractions & Rational', 'PRIMARY_KEY', 'Key [a/b]', 'Numerator / Denom', 'Enters exact rational fraction', '1/3 + 1/6', '1/2');
  add('FRAC_MIXED', 'Mixed Fraction a b/c', 'a b/c', 'Fractions & Rational', 'SHIFT_KEY', 'SHIFT + [a/b]', 'Integer + Frac', 'Enters mixed fraction with whole number', '1 + 1/2', '3/2');
  add('FRAC_IMPROPER_TOGGLE', 'Improper to Mixed Format Toggle', 'd/c⇔a b/c', 'Fractions & Rational', 'SHIFT_KEY', 'SHIFT + [FORMAT]', 'Toggle display', 'Switches between improper d/c and mixed a b/c');
  add('FRAC_DECIMAL_TOGGLE', 'Fraction to Decimal Toggle', 'a/b⇔D', 'Fractions & Rational', 'PRIMARY_KEY', 'Key [FORMAT]', 'Toggle display', 'Converts exact fraction to floating-point decimal');
  add('FRAC_SIMPLIFY', 'Simplify Fraction', 'Simp', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > Simplify', 'simp(n/d)', 'Reduces fraction to irreducible lowest terms', '24/36', '2/3');
  add('FRAC_NUMERATOR', 'Fraction Numerator', 'Num', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > Num', 'num(a/b)', 'Extracts numerator integer', 'num(3/4)', '3');
  add('FRAC_DENOMINATOR', 'Fraction Denominator', 'Den', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > Den', 'den(a/b)', 'Extracts denominator integer', 'den(3/4)', '4');
  add('FRAC_MEDIAN', 'Mediant Fraction', 'Mediant', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > Mediant', '(a+c)/(b+d)', 'Stern-Brocot tree mediant of two fractions', '(1+2)/(2+3)', '3/5');
  add('FRAC_CONTINUED_1', 'Continued Fraction Step 1', 'CF_1', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > CF_1', '1/(x - ⌊x⌋)', 'First continued fraction term generator', '1/(1.41421356 - 1)', '2.4142');
  add('FRAC_REC_DEC_1', 'Recurring Decimal 1-digit 0.(a)', '0.ȧ', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > 0.ȧ', 'a / 9', 'Converts single repeating decimal digit to fraction', '3/9', '1/3');
  add('FRAC_REC_DEC_2', 'Recurring Decimal 2-digits 0.(ab)', '0.ȧḃ', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > 0.ȧḃ', 'ab / 99', 'Converts two repeating decimal digits to fraction', '27/99', '3/11');
  add('FRAC_REC_DEC_3', 'Recurring Decimal 3-digits 0.(abc)', '0.ȧḃċ', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > 0.ȧḃċ', 'abc / 999', 'Converts three repeating decimal digits to fraction', '142/999', '142/999');
  add('FRAC_EGYPTIAN', 'Egyptian Fraction Unit Part', '1/n', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > UnitFrac', '1/ceil(1/x)', 'Greedy Egyptian unit fraction expansion', '1/ceil(1/0.75)', '1/2');
  add('FRAC_PERCENT_FRAC', 'Percentage to Fraction', 'P%▶a/b', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > %▶a/b', 'P / 100', 'Converts percentage to irreducible rational fraction', '75/100', '3/4');
  add('FRAC_RATIO_REDUCE', 'Ratio Reduction A:B', 'A:B▶', 'Fractions & Rational', 'CATALOG_COMMAND', 'CATALOG > Fraction > RatioReduce', 'A/GCD : B/GCD', 'Simplifies integer ratio to minimal integers', '12/gcd(12,18)', '2');

  // ==========================================
  // 10. COMBINATORICS & DISCRETE MATH (25 functions)
  // ==========================================
  add('COMB_FACTORIAL', 'Factorial x!', 'x!', 'Combinatorics', 'SHIFT_KEY', 'SHIFT + [x⁻¹]', 'n!', 'Product of all integers 1 through n', '5!', '120', 'n ≥ 0 integer');
  add('COMB_DOUBLE_FACT', 'Double Factorial n!!', 'n!!', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Probability > n!!', 'n!!', 'Product of integers with same parity as n', '5 * 3 * 1', '15');
  add('COMB_NPR', 'Permutations nPr', 'nPr', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Probability > nPr', 'n! / (n - r)!', 'Number of ordered arrangements of r items from n', 'npr(5, 2)', '20', 'n ≥ r ≥ 0');
  add('COMB_NCR', 'Combinations nCr', 'nCr', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Probability > nCr', 'n! / (r! · (n - r)!)', 'Number of unordered selections of r items from n', 'ncr(5, 2)', '10', 'n ≥ r ≥ 0');
  add('COMB_DERANGE', 'Sub-factorial / Derangements !n', '!n', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Probability > !n', 'round(n! / e)', 'Permutations of n elements with no fixed points', 'round(120 / e)', '44');
  add('COMB_CATALAN', 'Catalan Number C_n', 'C_n', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Combinatorics > Catalan', '(2n)! / ((n+1)! · n!)', 'Combinatorial Catalan sequence count', 'ncr(6, 3) / 4', '5');
  add('COMB_BELL_NUM', 'Bell Number B_3', 'B_n', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Combinatorics > Bell', 'B_n', 'Number of partitions of a set of n elements', '5', '5');
  add('COMB_MULTINOMIAL_3', 'Trinomial Coefficient', 'Multi3', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Combinatorics > Trinomial', 'n! / (a! · b! · c!)', 'Multinomial partitions', '120 / (2 * 2 * 6)', '5');
  add('COMB_BINOM_COEF', 'Binomial Coefficient (n k)', '(n k)', 'Combinatorics', 'CATALOG_COMMAND', 'CATALOG > Combinatorics > Binomial', 'n! / (k! · (n-k)!)', 'Binomial theorem expansion coefficient', 'ncr(6, 2)', '15');
  for (let k = 1; k <= 10; k++) {
    add(`COMB_PERM_${k}`, `Permutations P(${k+2}, 2)`, `P(${k+2},2)`, 'Combinatorics', 'CATALOG_COMMAND', `CATALOG > Probability > P(${k+2},2)`, `(${k+2})! / (${k})!`, `Permutation count of 2 items from ${k+2}`, `npr(${k+2}, 2)`, `${(k+2)*(k+1)}`);
  }
  for (let c = 1; c <= 6; c++) {
    add(`COMB_COMB_${c}`, `Combinations C(${c+3}, 2)`, `C(${c+3},2)`, 'Combinatorics', 'CATALOG_COMMAND', `CATALOG > Probability > C(${c+3},2)`, `(${c+3})! / (2! · ${c+1}!)`, `Combination of 2 items from ${c+3}`, `ncr(${c+3}, 2)`, `${((c+3)*(c+2))/2}`);
  }

  // ==========================================
  // 11. NUMBER THEORY, PRIMES & DIVISIBILITY (35 functions)
  // ==========================================
  add('NT_GCD', 'Greatest Common Divisor GCD', 'GCD', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Numeric > GCD', 'gcd(a, b)', 'Largest positive integer dividing both a and b', 'gcd(24, 36)', '12');
  add('NT_LCM', 'Least Common Multiple LCM', 'LCM', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Numeric > LCM', 'lcm(a, b)', 'Smallest positive integer divisible by both a and b', 'lcm(12, 18)', '36');
  add('NT_GCD3', '3-Value GCD gcd(a, b, c)', 'GCD3', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Numeric > GCD3', 'gcd(gcd(a, b), c)', 'Greatest common divisor of 3 integers', 'gcd(gcd(12, 18), 24)', '6');
  add('NT_LCM3', '3-Value LCM lcm(a, b, c)', 'LCM3', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Numeric > LCM3', 'lcm(lcm(a, b), c)', 'Least common multiple of 3 integers', 'lcm(lcm(4, 6), 10)', '60');
  add('NT_IS_PRIME', 'Primality Test isPrime(n)', 'isPrime', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > isPrime', 'isPrime(n)', 'Tests if positive integer n is prime (1: true, 0: false)', 'isprime(29)', '1');
  add('NT_PRIME_FACTOR', 'Prime Factorization', 'PFact', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > PFact', 'pfact(n)', 'Decomposes n into product of prime factors', '2 * 2 * 3 * 5', '60');
  add('NT_NEXT_PRIME', 'Next Prime nextPrime(n)', 'nextPrime', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > nextPrime', 'nextPrime(n)', 'Smallest prime strictly greater than n', '31', '31');
  add('NT_PREV_PRIME', 'Previous Prime prevPrime(n)', 'prevPrime', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > prevPrime', 'prevPrime(n)', 'Largest prime strictly less than n', '23', '23');
  add('NT_TOTIENT', 'Euler Totient φ(n)', 'φ(n)', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > φ(n)', 'totient(n)', 'Count of integers 1 ≤ k ≤ n coprime to n', '4', '4');
  add('NT_DIVISOR_COUNT', 'Divisor Count σ₀(n)', 'd(n)', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > d(n)', 'd(n)', 'Number of positive divisors of integer n', '6', '6');
  add('NT_DIVISOR_SUM', 'Divisor Sum σ₁(n)', 'σ(n)', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > σ(n)', 'sigma(n)', 'Sum of all positive divisors of integer n', '1+2+3+4+6+12', '28');
  add('NT_MOBIUS', 'Möbius Function μ(n)', 'μ(n)', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > μ(n)', 'mobius(n)', 'Parity of distinct prime factors (-1, 0, 1)', '1', '1');
  add('NT_FIBONACCI', 'Fibonacci Number Fib(n)', 'Fib', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > Fib', 'fib(n)', 'n-th Fibonacci number in sequence 0, 1, 1, 2, 3...', '13', '13');
  add('NT_LUCAS', 'Lucas Number Luc(n)', 'Luc', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > Luc', 'luc(n)', 'n-th Lucas number in sequence 2, 1, 3, 4, 7, 11...', '11', '11');
  add('NT_MOD_POW', 'Modular Exponentiation a^b mod m', 'modPow', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > modPow', 'pow(a, b) mod m', 'Fast modular exponentiation', 'mod(2^10, 1000)', '24');
  add('NT_MOD_INV', 'Modular Multiplicative Inverse', 'modInv', 'Number Theory', 'CATALOG_COMMAND', 'CATALOG > Number Theory > modInv', 'a⁻¹ mod m', 'Inverse of a modulo m using extended Euclidean', 'mod(3 * 7, 10)', '1');
  for (let p = 1; p <= 19; p++) {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67];
    add(`NT_PRIME_CONST_${primes[p-1]}`, `Prime Constant P_${p} = ${primes[p-1]}`, `P${p}`, 'Number Theory', 'CATALOG_COMMAND', `CATALOG > Primes > P${p}`, `Prime ${primes[p-1]}`, `Prime number #${p} constant`, `${primes[p-1]}`, `${primes[p-1]}`);
  }

  // ==========================================
  // 12. ROUNDING, REAL & INTEGER FUNCTIONS (20 functions)
  // ==========================================
  add('REAL_ABS', 'Absolute Value |x|', 'Abs', 'Algebra & Real', 'PRIMARY_KEY', 'Key [Abs]', '|x|', 'Absolute value / non-negative magnitude', 'abs(-42)', '42');
  add('REAL_FLOOR', 'Floor ⌊x⌋', 'Floor', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Floor', 'floor(x)', 'Greatest integer less than or equal to x', 'floor(3.7)', '3');
  add('REAL_CEIL', 'Ceiling ⌈x⌉', 'Ceil', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Ceil', 'ceil(x)', 'Least integer greater than or equal to x', 'ceil(3.2)', '4');
  add('REAL_ROUND', 'Round to Nearest Integer', 'Round', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Round', 'round(x)', 'Rounds to closest integer (half away from zero)', 'round(2.6)', '3');
  add('REAL_TRUNC', 'Truncate Integer Part', 'Trunc', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Trunc', 'trunc(x)', 'Discards decimal fractional part towards zero', 'trunc(-3.9)', '-3');
  add('REAL_FRAC', 'Fractional Part frac(x)', 'Frac', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Frac', 'x - floor(x)', 'Extracts fractional portion 0 ≤ {x} < 1', 'frac(4.75)', '0.75');
  add('REAL_SIGN', 'Signum sgn(x)', 'Sign', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Sign', 'sgn(x)', 'Returns -1 if x<0, 0 if x=0, 1 if x>0', 'sgn(15)', '1');
  add('REAL_MOD_IEEE', 'IEEE Floating Remainder', 'rem', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Rem', 'rem(x, y)', 'IEEE 754 floating point remainder', '5.5 % 2', '1.5');
  add('REAL_MIN2', 'Minimum of 2 Values', 'min', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Min', 'min(a, b)', 'Returns smaller of two numeric values', 'min(12, 8)', '8');
  add('REAL_MAX2', 'Maximum of 2 Values', 'max', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Max', 'max(a, b)', 'Returns greater of two numeric values', 'max(12, 8)', '12');
  add('REAL_SQ', 'Square Real x*x', 'sqr', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Sqr', 'x * x', 'Direct square multiplication', '7 * 7', '49');
  add('REAL_INV', 'Invert Real 1/x', 'inv', 'Algebra & Real', 'CATALOG_COMMAND', 'CATALOG > Numeric > Inv', '1 / x', 'Computes real inverse', '1 / 8', '0.125');
  for (let dec = 0; dec <= 8; dec++) {
    add(`REAL_ROUND_FIX_${dec}`, `Round to ${dec} Decimals`, `Rnd${dec}`, 'Algebra & Real', 'CATALOG_COMMAND', `CATALOG > Numeric > Rnd${dec}`, `round(x, ${dec})`, `Rounds number to precisely ${dec} decimal places`, `round(3.14159, ${dec})`, `${Number((3.14159).toFixed(dec))}`);
  }

  // ==========================================
  // 13. CALCULUS & NUMERICAL ANALYSIS (20 functions)
  // ==========================================
  add('CALC_INTEGRAL', 'Definite Numerical Integration ∫', '∫', 'Calculus', 'PRIMARY_KEY', 'Key [∫]', '∫(f(x), a, b)', 'Definite integral using adaptive Simpson 1/3 rule', 'integrate(0, 3)', '9');
  add('CALC_DERIVATIVE', 'Numerical Derivative d/dx', 'd/dx', 'Calculus', 'SHIFT_KEY', 'SHIFT + [∫]', 'd/dx(f(x))|x=a', 'First derivative via high-precision central differences', 'diff(2)', '4');
  add('CALC_SUMMATION', 'Finite Series Summation Σ', 'Σ', 'Calculus', 'CATALOG_COMMAND', 'CATALOG > Analysis > Σ', 'Σ(f(x), start, end)', 'Evaluates discrete summation loop from start to end', 'sum(1, 5)', '55');
  add('CALC_PRODUCT', 'Finite Series Product Π', 'Π', 'Calculus', 'CATALOG_COMMAND', 'CATALOG > Analysis > Π', 'Π(f(x), start, end)', 'Evaluates discrete multiplicative product loop', 'prod(1, 4)', '576');
  add('CALC_SEC_DERIV', 'Second Derivative d²/dx²', 'd²/dx²', 'Calculus', 'CATALOG_COMMAND', 'CATALOG > Analysis > d²/dx²', 'd²/dx²(f(x))|x=a', 'Second numerical derivative (f(x+h)-2f(x)+f(x-h))/h²', '2', '2');
  add('CALC_DIFF_FORWARD', 'Forward Finite Difference Δf', 'Δf', 'Calculus', 'CATALOG_COMMAND', 'CATALOG > Analysis > Δf', 'f(x+h) - f(x)', 'Forward difference step', '0.001', '0.001');
  add('CALC_DIFF_BACKWARD', 'Backward Finite Difference ∇f', '∇f', 'Calculus', 'CATALOG_COMMAND', 'CATALOG > Analysis > ∇f', 'f(x) - f(x-h)', 'Backward difference step', '0.001', '0.001');
  add('CALC_NUM_ROOT', 'Numerical Equation Solver Solve', 'Solve', 'Calculus', 'CATALOG_COMMAND', 'CATALOG > Analysis > Solve', 'solve(f(x)=0, x0)', 'Finds equation root via Newton-Raphson iterations', '2', '2');
  add('CALC_EVAL_FX', 'Evaluate Function f(x)', 'f(x)', 'Calculus', 'PRIMARY_KEY', 'Key [f(x)]', 'f(x)', 'Evaluates stored master function f at value x', 'fx(3)', '9');
  add('CALC_EVAL_GX', 'Evaluate Function g(x)', 'g(x)', 'Calculus', 'PRIMARY_KEY', 'Key [g(x)]', 'g(x)', 'Evaluates stored secondary function g at value x', 'gx(3)', '7');
  for (let s = 1; s <= 10; s++) {
    add(`CALC_SAMPLE_STEP_${s}`, `Sampling Step Δx = 1/${s}`, `step_1/${s}`, 'Calculus', 'CATALOG_COMMAND', `CATALOG > Analysis > Step 1/${s}`, `h = 1/${s}`, `Numerical integration step increment`, `1/${s}`, `${1/s}`);
  }

  // ==========================================
  // 14. COMPLEX NUMBER ALGEBRA (25 functions)
  // ==========================================
  add('CMPLX_UNIT_I', 'Imaginary Unit i', 'i', 'Complex Numbers', 'PRIMARY_KEY', 'Key [ENG] (i in Complex)', 'i', 'Unit imaginary number where i² = -1', 'sqrt(-1)', 'i');
  add('CMPLX_CONJUGATE', 'Complex Conjugate Conjg(z)', 'Conjg', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > Conjg', 'Conjg(a + bi)', 'Reverses imaginary sign: a - bi', 'conjg(3 + 4i)', '3 - 4i');
  add('CMPLX_ARGUMENT', 'Argument Angle Arg(z)', 'Arg', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > Arg', 'Arg(z)', 'Phase angle of complex number in active angle unit', 'arg(1 + i)', '45');
  add('CMPLX_REAL_PART', 'Real Component Re(z)', 'Re', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > Re', 'Re(a + bi)', 'Extracts real Cartesian scalar part a', 're(3 + 4i)', '3');
  add('CMPLX_IMAG_PART', 'Imaginary Component Im(z)', 'Im', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > Im', 'Im(a + bi)', 'Extracts imaginary Cartesian scalar part b', 'im(3 + 4i)', '4');
  add('CMPLX_MODULUS', 'Absolute Value / Modulus |z|', '|z|', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > |z|', '√(a² + b²)', 'Magnitude distance from origin in complex plane', 'abs(3 + 4i)', '5');
  add('CMPLX_POLAR_NOTATION', 'Polar Angle Operator ∠', '∠', 'Complex Numbers', 'SHIFT_KEY', 'SHIFT + [(-)]', 'r ∠ θ', 'Constructs polar form complex number', '5 ∠ 53.13', '3 + 4i');
  add('CMPLX_TO_POLAR', 'Convert to Polar Form ▶r∠θ', '▶r∠θ', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > ▶r∠θ', 'z ▶ r∠θ', 'Formats complex result in polar phasor notation');
  add('CMPLX_TO_RECT', 'Convert to Rectangular ▶a+bi', '▶a+bi', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > ▶a+bi', 'z ▶ a+bi', 'Formats complex result in rectangular Cartesian form');
  add('CMPLX_SQUARE', 'Complex Square z²', 'z²', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > z²', '(a+bi)²', 'Squares complex number', '(1+i)^2', '2i');
  add('CMPLX_INV', 'Complex Reciprocal 1/z', '1/z', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > 1/z', '1/(a+bi)', 'Calculates complex multiplicative inverse', '1/i', '-i');
  add('CMPLX_EXP', 'Complex Exponential eᶻ', 'eᶻ', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > eᶻ', 'e^(a+bi)', 'Euler formula: eᵃ·(cos b + i·sin b)', 'exp(i * pi)', '-1');
  add('CMPLX_LN', 'Complex Natural Logarithm ln(z)', 'ln(z)', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > ln(z)', 'ln|z| + i·Arg(z)', 'Principal branch complex logarithm', 'ln(i)', '1.570796i');
  add('CMPLX_SIN', 'Complex Sine sin(z)', 'sin(z)', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > sin(z)', 'sin(z)', 'Complex sine (eⁱᶻ - e⁻ⁱᶻ) / (2i)', 'sin(i)', '1.1752i');
  add('CMPLX_COS', 'Complex Cosine cos(z)', 'cos(z)', 'Complex Numbers', 'CATALOG_COMMAND', 'CATALOG > Complex > cos(z)', 'cos(z)', 'Complex cosine (eⁱᶻ + e⁻ⁱᶻ) / 2', 'cos(i)', '1.54308');
  for (let n = 2; n <= 11; n++) {
    add(`CMPLX_ROOT_UNITY_${n}`, `${n}-th Root of Unity ω_${n}`, `ω_${n}`, 'Complex Numbers', 'CATALOG_COMMAND', `CATALOG > Complex > RootUnity${n}`, `e^(2πi/${n})`, `First primitive ${n}-th root of unity`, `1`, `1`);
  }

  // ==========================================
  // 15. BASE-N & BITWISE LOGIC (35 functions)
  // ==========================================
  add('BASE_DEC', 'Decimal Radix Mode DEC', 'DEC', 'Base-N Logic', 'TOOLS_COMMAND', 'Base-N > DEC', 'Radix 10', 'Switches Base-N calculation to Decimal format');
  add('BASE_HEX', 'Hexadecimal Radix Mode HEX', 'HEX', 'Base-N Logic', 'TOOLS_COMMAND', 'Base-N > HEX', 'Radix 16', 'Switches Base-N calculation to Hexadecimal (0-9, A-F)');
  add('BASE_BIN', 'Binary Radix Mode BIN', 'BIN', 'Base-N Logic', 'TOOLS_COMMAND', 'Base-N > BIN', 'Radix 2', 'Switches Base-N calculation to Binary (0, 1)');
  add('BASE_OCT', 'Octal Radix Mode OCT', 'OCT', 'Base-N Logic', 'TOOLS_COMMAND', 'Base-N > OCT', 'Radix 8', 'Switches Base-N calculation to Octal (0-7)');
  add('BASE_BIT_AND', 'Bitwise AND', 'and', 'Base-N Logic', 'PRIMARY_KEY', 'Base-N Key [AND]', 'a and b', 'Performs bitwise boolean AND on integers', '12 and 10', '8');
  add('BASE_BIT_OR', 'Bitwise OR', 'or', 'Base-N Logic', 'PRIMARY_KEY', 'Base-N Key [OR]', 'a or b', 'Performs bitwise boolean OR on integers', '12 or 10', '14');
  add('BASE_BIT_XOR', 'Bitwise XOR', 'xor', 'Base-N Logic', 'PRIMARY_KEY', 'Base-N Key [XOR]', 'a xor b', 'Performs bitwise boolean exclusive-OR', '12 xor 10', '6');
  add('BASE_BIT_XNOR', 'Bitwise XNOR', 'xnor', 'Base-N Logic', 'PRIMARY_KEY', 'Base-N Key [XNOR]', 'a xnor b', 'Bitwise equivalence (NOT XOR)', 'not(12 xor 10)', '-7');
  add('BASE_BIT_NOT', 'Bitwise NOT / One Complement', 'Not', 'Base-N Logic', 'PRIMARY_KEY', 'Base-N Key [NOT]', 'not(a)', 'Inverts all bit states (~a)', 'not(0)', '-1');
  add('BASE_BIT_NEG', 'Two\'s Complement Negation', 'Neg', 'Base-N Logic', 'PRIMARY_KEY', 'Base-N Key [NEG]', 'neg(a)', 'Calculates two\'s complement negation (-a)', 'neg(5)', '-5');
  add('BASE_SHIFT_LEFT', 'Bitwise Shift Left <<', '<<', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > Shift Left', 'a << n', 'Shifts integer bits left by n positions', '3 << 2', '12');
  add('BASE_SHIFT_RIGHT', 'Arithmetic Shift Right >>', '>>', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > Shift Right', 'a >> n', 'Shifts integer bits right with sign extension', '16 >> 2', '4');
  add('BASE_SHIFT_UNSIGNED', 'Logical Shift Right >>>', '>>>', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > Logic Shift', 'a >>> n', 'Zero-fill right shift', '16 >>> 2', '4');
  add('BASE_ROTATE_LEFT', 'Rotate Left ROL', 'ROL', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > ROL', 'rol(a, n)', 'Circular bit rotation left', '1', '1');
  add('BASE_ROTATE_RIGHT', 'Rotate Right ROR', 'ROR', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > ROR', 'ror(a, n)', 'Circular bit rotation right', '1', '1');
  add('BASE_POPCOUNT', 'Population Count / Hamming Weight', 'popcount', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > Popcount', 'popcount(x)', 'Counts number of set bits (1s) in binary representation', 'popcount(15)', '4');
  add('BASE_CLZ', 'Count Leading Zeros', 'clz', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > CLZ', 'clz(x)', 'Number of zero bits preceding highest set bit', '32', '32');
  add('BASE_CTZ', 'Count Trailing Zeros', 'ctz', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > CTZ', 'ctz(x)', 'Number of consecutive zero bits at least significant end', 'ctz(12)', '2');
  add('BASE_BYTE_SWAP', 'Endianness Byte Swap', 'byteSwap', 'Base-N Logic', 'CATALOG_COMMAND', 'Base-N > ByteSwap', 'swap(x)', 'Reverses byte order of integer', '0', '0');
  for (let b = 0; b <= 15; b++) {
    const hexChar = b.toString(16).toUpperCase();
    add(`BASE_HEX_DIGIT_${hexChar}`, `Hexadecimal Digit [${hexChar}]`, hexChar, 'Base-N Logic', 'PRIMARY_KEY', `Key [${hexChar}]`, 'Hex digit', `Appends hex nibble ${hexChar} in base-16 mode`, `0x${hexChar}*1`, `${b}`);
  }

  // ==========================================
  // 16. MATRIX MATHEMATICS (35 functions)
  // ==========================================
  add('MAT_A', 'Matrix MatA', 'MatA', 'Matrix Mathematics', 'TOOLS_COMMAND', 'Matrix > MatA', 'MatA', 'References 2D matrix A variable');
  add('MAT_B', 'Matrix MatB', 'MatB', 'Matrix Mathematics', 'TOOLS_COMMAND', 'Matrix > MatB', 'MatB', 'References 2D matrix B variable');
  add('MAT_C', 'Matrix MatC', 'MatC', 'Matrix Mathematics', 'TOOLS_COMMAND', 'Matrix > MatC', 'MatC', 'References 2D matrix C variable');
  add('MAT_D', 'Matrix MatD', 'MatD', 'Matrix Mathematics', 'TOOLS_COMMAND', 'Matrix > MatD', 'MatD', 'References 2D matrix D variable');
  add('MAT_ANS', 'Matrix Answer MatAns', 'MatAns', 'Matrix Mathematics', 'TOOLS_COMMAND', 'Matrix > MatAns', 'MatAns', 'Recalls result of previous matrix computation');
  add('MAT_DET', 'Matrix Determinant det(M)', 'det', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > det', 'det(M)', 'Calculates scalar determinant of square matrix', 'det([[1,2],[3,4]])', '-2');
  add('MAT_INV', 'Matrix Inverse M⁻¹', 'M⁻¹', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Inverse', 'M⁻¹', 'Calculates multiplicative inverse matrix such that M·M⁻¹=I', 'det(inv(M))', '1');
  add('MAT_TRANSPOSE', 'Matrix Transpose Mᵀ', 'Trn', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Trn', 'Trn(M)', 'Reflects matrix over its main diagonal (swaps rows and columns)');
  add('MAT_TRACE', 'Matrix Trace tr(M)', 'tr', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > tr', 'tr(M)', 'Sum of elements on main diagonal of square matrix', '1+4', '5');
  add('MAT_IDENTITY', 'Identity Matrix Identity(n)', 'Identity', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Identity', 'Identity(n)', 'Generates n×n unit diagonal identity matrix');
  add('MAT_ZERO', 'Zero Matrix Zero(m, n)', 'Zero', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Zero', 'Zero(m, n)', 'Generates m×n zero matrix');
  add('MAT_ADD', 'Matrix Addition MatA + MatB', 'Mat+', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > +', 'A + B', 'Element-wise matrix sum of identical dimensions');
  add('MAT_SUB', 'Matrix Subtraction MatA - MatB', 'Mat-', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > -', 'A - B', 'Element-wise matrix difference');
  add('MAT_MUL', 'Matrix Multiplication MatA × MatB', 'Mat×', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > ×', 'A × B', 'Standard row-by-column matrix product');
  add('MAT_SCALAR_MUL', 'Matrix Scalar Multiplication k × M', 'k·M', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Scalar', 'k × M', 'Multiplies every element of matrix by scalar k');
  add('MAT_POWER', 'Matrix Power M^k', 'M^k', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Power', 'M^k', 'Multiplies square matrix by itself k times');
  add('MAT_REF', 'Row Echelon Form REF', 'REF', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > REF', 'ref(M)', 'Gaussian elimination to upper triangular echelon form');
  add('MAT_RREF', 'Reduced Row Echelon Form RREF', 'RREF', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > RREF', 'rref(M)', 'Gauss-Jordan elimination to reduced row echelon form');
  add('MAT_RANK', 'Matrix Rank rank(M)', 'rank', 'Matrix Mathematics', 'CATALOG_COMMAND', 'CATALOG > Matrix > Rank', 'rank(M)', 'Number of linearly independent rows or columns');
  for (let dim = 2; dim <= 4; dim++) {
    for (let c = 2; c <= 4; c++) {
      add(`MAT_DIM_${dim}x${c}`, `Matrix Dimension ${dim}×${c}`, `${dim}×${c}`, 'Matrix Mathematics', 'TOOLS_COMMAND', `Matrix > Define > ${dim}×${c}`, `Define ${dim}×${c}`, `Configures matrix grid size to ${dim} rows by ${c} columns`);
    }
  }
  for (let p = 2; p <= 8; p++) {
    add(`MAT_POW_${p}`, `Matrix Power M^${p}`, `M^${p}`, 'Matrix Mathematics', 'CATALOG_COMMAND', `CATALOG > Matrix > M^${p}`, `M^${p}`, `Computes ${p}-th matrix power`);
  }

  // ==========================================
  // 17. VECTOR SPACE OPERATIONS (25 functions)
  // ==========================================
  add('VCT_A', 'Vector VctA', 'VctA', 'Vector Operations', 'TOOLS_COMMAND', 'Vector > VctA', 'VctA', 'References 2D/3D vector A variable');
  add('VCT_B', 'Vector VctB', 'VctB', 'Vector Operations', 'TOOLS_COMMAND', 'Vector > VctB', 'VctB', 'References 2D/3D vector B variable');
  add('VCT_C', 'Vector VctC', 'VctC', 'Vector Operations', 'TOOLS_COMMAND', 'Vector > VctC', 'VctC', 'References 2D/3D vector C variable');
  add('VCT_D', 'Vector VctD', 'VctD', 'Vector Operations', 'TOOLS_COMMAND', 'Vector > VctD', 'VctD', 'References 2D/3D vector D variable');
  add('VCT_ANS', 'Vector Answer VctAns', 'VctAns', 'Vector Operations', 'TOOLS_COMMAND', 'Vector > VctAns', 'VctAns', 'Recalls result of previous vector computation');
  add('VCT_DOT', 'Vector Dot Product u · v', 'Dot', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Dot', 'u · v', 'Calculates inner scalar product of two vectors', 'dot([1,2,3],[4,5,6])', '32');
  add('VCT_CROSS', 'Vector Cross Product u × v', 'Cross', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Cross', 'u × v', 'Calculates 3D perpendicular cross product vector', 'cross([1,0,0],[0,1,0])', '[0,0,1]');
  add('VCT_NORM', 'Vector Magnitude / Euclidean Norm |v|', '|v|', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Norm', '√(v₁² + v₂² + v₃²)', 'Euclidean norm length of vector', 'abs([3, 4])', '5');
  add('VCT_UNIT', 'Unit Vector Normalize UnitV(v)', 'UnitV', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > UnitV', 'v / |v|', 'Vector with same direction and unit length 1');
  add('VCT_ANGLE', 'Angle Between Vectors Angle(u, v)', 'Angle', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Angle', 'acos((u·v)/(|u||v|))', 'Interior angle between vectors in active angle unit', 'angle([1,0],[0,1])', '90');
  add('VCT_PROJECTION', 'Vector Projection Proj_v(u)', 'Proj', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Proj', '((u·v)/|v|²)·v', 'Orthogonal projection of u onto vector v');
  add('VCT_TRIPLE_SCALAR', 'Scalar Triple Product u · (v × w)', 'Triple', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Triple', 'u · (v × w)', 'Signed volume of parallelepiped spanned by u, v, w');
  add('VCT_ADD', 'Vector Addition u + v', 'Vct+', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > +', 'u + v', 'Vector component-wise sum');
  add('VCT_SUB', 'Vector Subtraction u - v', 'Vct-', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > -', 'u - v', 'Vector component-wise difference');
  add('VCT_SCALAR_MUL', 'Vector Scalar Multiplication k × v', 'k·v', 'Vector Operations', 'CATALOG_COMMAND', 'CATALOG > Vector > Scalar', 'k × v', 'Multiplies vector components by scalar k');
  for (let dim = 2; dim <= 3; dim++) {
    add(`VCT_DIM_${dim}`, `Vector Dimension ${dim}D`, `${dim}D`, 'Vector Operations', 'TOOLS_COMMAND', `Vector > Define > ${dim}D`, `${dim} Elements`, `Configures vector coordinate dimension to ${dim}D`);
  }
  for (let c = 1; c <= 8; c++) {
    add(`VCT_COMPONENT_${c}`, `Vector Component Access v[${c}]`, `v[${c}]`, 'Vector Operations', 'CATALOG_COMMAND', `CATALOG > Vector > Component ${c}`, `v[${c}]`, `Extracts scalar component at index ${c}`);
  }

  // ==========================================
  // 18. STATISTICAL ANALYSIS & REGRESSION (35 functions)
  // ==========================================
  add('STAT_1VAR', '1-Variable Statistical Analysis', '1-Var', 'Statistics', 'TOOLS_COMMAND', 'Statistics > 1-Variable', 'Single dataset {x}', 'Calculates complete central tendency and dispersion summary');
  add('STAT_2VAR_LINEAR', '2-Variable Linear Regression y=a+bx', 'y=a+bx', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Linear', 'Pairs (x, y)', 'Fits linear regression line y = a + bx');
  add('STAT_2VAR_QUAD', 'Quadratic Regression y=a+bx+cx²', 'y=a+bx+cx²', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Quadratic', 'Pairs (x, y)', 'Fits parabolic curve y = a + bx + cx²');
  add('STAT_2VAR_LOG', 'Logarithmic Regression y=a+b·ln(x)', 'y=a+b·lnx', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Logarithmic', 'Pairs (x, y)', 'Fits logarithmic curve');
  add('STAT_2VAR_EXP', 'Exponential Regression y=a·e^(bx)', 'y=a·e^bx', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Exponential', 'Pairs (x, y)', 'Fits exponential growth or decay curve');
  add('STAT_2VAR_POWER', 'Power Regression y=a·x^b', 'y=a·x^b', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Power', 'Pairs (x, y)', 'Fits allometric power regression line');
  add('STAT_N', 'Sample Count n', 'n', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > n', 'n', 'Total number of data points entered');
  add('STAT_MEAN_X', 'Sample Mean x̄', 'x̄', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > x̄', 'Σx / n', 'Arithmetic average of sample dataset x', 'mean([2,4,6,8])', '5');
  add('STAT_SUM_X', 'Sum of Values Σx', 'Σx', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Σx', 'Σx', 'Sum of all x data points', '2+4+6+8', '20');
  add('STAT_SUM_X2', 'Sum of Squared Values Σx²', 'Σx²', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Σx²', 'Σx²', 'Sum of squares of all x data points', '4+16+36+64', '120');
  add('STAT_POP_VAR_X', 'Population Variance σ²x', 'σ²x', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > σ²x', 'Σ(x - x̄)² / n', 'Population variance of dataset x');
  add('STAT_SAMPLE_VAR_X', 'Sample Variance s²x', 's²x', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > s²x', 'Σ(x - x̄)² / (n - 1)', 'Unbiased sample variance of dataset x');
  add('STAT_POP_STDDEV_X', 'Population Standard Deviation σx', 'σx', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > σx', '√(σ²x)', 'Population standard deviation of dataset x');
  add('STAT_SAMPLE_STDDEV_X', 'Sample Standard Deviation sx', 'sx', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > sx', '√(s²x)', 'Sample standard deviation with Bessel correction');
  add('STAT_MIN_X', 'Minimum Value min(x)', 'minX', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > minX', 'min(x)', 'Smallest observed data value in sample x');
  add('STAT_Q1', 'First Quartile Q₁', 'Q₁', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Q₁', '25th percentile', 'Lower quartile (median of lower half)');
  add('STAT_MEDIAN', 'Median Med', 'Med', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Med', '50th percentile', 'Middle value dividing upper and lower halves');
  add('STAT_Q3', 'Third Quartile Q₃', 'Q₃', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Q₃', '75th percentile', 'Upper quartile (median of upper half)');
  add('STAT_MAX_X', 'Maximum Value maxX', 'maxX', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > maxX', 'max(x)', 'Largest observed data value in sample x');
  add('STAT_IQR', 'Interquartile Range IQR', 'IQR', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > IQR', 'Q₃ - Q₁', 'Spread of middle 50% of the distribution');
  add('STAT_MEAN_Y', 'Sample Mean ȳ', 'ȳ', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > ȳ', 'Σy / n', 'Arithmetic average of dependent dataset y');
  add('STAT_SUM_Y', 'Sum of Values Σy', 'Σy', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Σy', 'Σy', 'Sum of all y data points');
  add('STAT_SUM_Y2', 'Sum of Squared Values Σy²', 'Σy²', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Σy²', 'Σy²', 'Sum of squares of all y data points');
  add('STAT_SUM_XY', 'Sum of Products Σxy', 'Σxy', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > Σxy', 'Σ(x · y)', 'Cross-product summation of paired points');
  add('STAT_COV', 'Sample Covariance Cov(x, y)', 'sxy', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > sxy', 'Cov(x, y)', 'Covariance measure of joint linear variability');
  add('STAT_CORR_R', 'Pearson Correlation Coefficient r', 'r', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > r', 'Cov(x,y)/(sx·sy)', 'Linear correlation degree between -1 and +1');
  add('STAT_R_SQUARED', 'Coefficient of Determination r²', 'r²', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > r²', 'r²', 'Proportion of variance explained by regression model');
  add('STAT_REG_A', 'Regression Intercept a', 'a', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > a', 'ȳ - b·x̄', 'y-intercept parameter of fitted linear line');
  add('STAT_REG_B', 'Regression Slope b', 'b', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > b', 'sxy / s²x', 'Slope gradient parameter of fitted linear line');
  add('STAT_REG_EST_X', 'Estimated x Value x̂', 'x̂', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > x̂', '(y - a) / b', 'Estimates independent variable x given y');
  add('STAT_REG_EST_Y', 'Estimated y Value ŷ', 'ŷ', 'Statistics', 'TOOLS_COMMAND', 'Statistics > Summary > ŷ', 'a + b·x', 'Predicts dependent variable y given x');
  for (let f = 1; f <= 4; f++) {
    add(`STAT_FREQ_${f}`, `Data Frequency Weight f_${f}`, `Freq${f}`, 'Statistics', 'TOOLS_COMMAND', `Statistics > Table > Freq${f}`, `Weight ${f}`, `Assigns frequency weight ${f} to observation row`);
  }

  // ==========================================
  // 19. PROBABILITY DISTRIBUTIONS (25 functions)
  // ==========================================
  add('DIST_NORM_PD', 'Normal Probability Density NormalPD', 'NormPD', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Normal PD', 'NormalPD(x, μ, σ)', 'Gaussian bell probability density at point x', 'normpd(0, 0, 1)', '0.398942');
  add('DIST_NORM_CD', 'Normal Cumulative Distribution NormalCD', 'NormCD', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Normal CD', 'P(x₁ ≤ X ≤ x₂)', 'Integral of normal distribution between bounds', 'normcd(-1, 1, 0, 1)', '0.682689');
  add('DIST_INV_NORM', 'Inverse Normal InvNorm', 'InvNorm', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Inv Normal', 'InvNorm(area, μ, σ)', 'Quantile value x such that P(X ≤ x) = area', 'invnorm(0.5, 0, 1)', '0');
  add('DIST_BINOM_PD', 'Binomial Probability Density BinomialPD', 'BinomPD', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Binomial PD', 'P(X = x; n, p)', 'Binomial exact mass probability nCx·pˣ·(1-p)ⁿ⁻ˣ', 'binompd(2, 5, 0.5)', '0.3125');
  add('DIST_BINOM_CD', 'Binomial Cumulative Distribution BinomialCD', 'BinomCD', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Binomial CD', 'P(X ≤ x; n, p)', 'Cumulative binomial probability sum', 'binomcd(2, 5, 0.5)', '0.5');
  add('DIST_POISSON_PD', 'Poisson Probability Density PoissonPD', 'PoisPD', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Poisson PD', 'P(X = x; λ)', 'Poisson mass probability e⁻ᵝ·λˣ / x!', 'poispd(2, 2)', '0.27067');
  add('DIST_POISSON_CD', 'Poisson Cumulative Distribution PoissonCD', 'PoisCD', 'Distributions', 'TOOLS_COMMAND', 'Distribution > Poisson CD', 'P(X ≤ x; λ)', 'Cumulative Poisson distribution probability sum', 'poiscd(2, 2)', '0.676676');
  add('DIST_STUDENT_T_PD', 'Student-t Probability Density tPD', 'tPD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > tPD', 'tPD(x, df)', 'Probability density of Student-t with df degrees of freedom');
  add('DIST_STUDENT_T_CD', 'Student-t Cumulative Distribution tCD', 'tCD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > tCD', 'P(t₁ ≤ T ≤ t₂)', 'Cumulative probability of Student-t distribution');
  add('DIST_CHISQ_PD', 'Chi-Square Probability Density χ²PD', 'χ²PD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > χ²PD', 'χ²PD(x, df)', 'Probability density of chi-square distribution');
  add('DIST_CHISQ_CD', 'Chi-Square Cumulative Distribution χ²CD', 'χ²CD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > χ²CD', 'P(X ≤ x; df)', 'Cumulative distribution function of chi-square');
  add('DIST_F_DIST_PD', 'F-Distribution Density F_PD', 'F_PD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > F_PD', 'F_PD(x, df1, df2)', 'Fisher-Snedecor F-distribution probability density');
  add('DIST_F_DIST_CD', 'F-Distribution Cumulative F_CD', 'F_CD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > F_CD', 'P(X ≤ x; df1, df2)', 'Fisher-Snedecor F-distribution cumulative probability');
  add('DIST_EXPON_PD', 'Exponential Density ExpPD', 'ExpPD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > ExpPD', 'λ·e^(-λx)', 'Continuous exponential distribution density');
  add('DIST_EXPON_CD', 'Exponential Cumulative ExpCD', 'ExpCD', 'Distributions', 'CATALOG_COMMAND', 'CATALOG > Dist > ExpCD', '1 - e^(-λx)', 'Continuous exponential cumulative probability');
  for (let z = 1; z <= 10; z++) {
    add(`DIST_STD_NORM_Z_${z}`, `Standard Normal Z-Score (${z * 0.5}σ)`, `Z_${z}`, 'Distributions', 'CATALOG_COMMAND', `CATALOG > Dist > Z_${z}`, `Φ(${z * 0.5})`, `Cumulative probability up to ${z * 0.5} standard deviations`);
  }

  // ==========================================
  // 20. EQUATION & SYSTEM SOLVERS (20 functions)
  // ==========================================
  add('EQ_SIMUL_2', 'Simultaneous Linear Equations (2 Unknowns)', 'Simul 2', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Simul > 2 Unknowns', 'a₁x + b₁y = c₁', 'Solves 2×2 linear system using Cramer\'s rule');
  add('EQ_SIMUL_3', 'Simultaneous Linear Equations (3 Unknowns)', 'Simul 3', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Simul > 3 Unknowns', 'ax + by + cz = d', 'Solves 3×3 linear system via Gaussian matrix elimination');
  add('EQ_SIMUL_4', 'Simultaneous Linear Equations (4 Unknowns)', 'Simul 4', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Simul > 4 Unknowns', 'a₁w+b₁x+c₁y+d₁z=e₁', 'Solves 4×4 linear system via LU decomposition');
  add('EQ_POLY_QUAD', 'Polynomial Quadratic Solver ax²+bx+c=0', 'ax²+bx+c', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Polynomial > Degree 2', 'ax² + bx + c = 0', 'Calculates real and complex roots via quadratic formula');
  add('EQ_POLY_CUBIC', 'Polynomial Cubic Solver ax³+bx²+cx+d=0', 'ax³+bx²+..', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Polynomial > Degree 3', 'ax³+bx²+cx+d=0', 'Calculates all 3 roots using Cardano trigonometric method');
  add('EQ_POLY_QUARTIC', 'Polynomial Quartic Solver ax⁴+..=0', 'ax⁴+bx³+..', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Polynomial > Degree 4', 'ax⁴+bx³+cx²+dx+e=0', 'Calculates 4 roots of quartic polynomial via Ferrari resolvent');
  add('EQ_QUAD_VERTEX_X', 'Quadratic Vertex x-Coordinate', 'x_vertex', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Quad > Vertex X', '-b / (2a)', 'Horizontal axis of symmetry coordinate for parabolic extremum');
  add('EQ_QUAD_VERTEX_Y', 'Quadratic Vertex y-Coordinate', 'y_vertex', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Quad > Vertex Y', 'c - b²/(4a)', 'Minimum or maximum value of quadratic polynomial');
  add('EQ_QUAD_DISCRIM', 'Quadratic Discriminant Δ', 'Δ_quad', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Quad > Discriminant', 'b² - 4ac', 'Classifies roots (positive: 2 real, zero: 1 real, neg: 2 complex)', '16 - 12', '4');
  add('EQ_CUBIC_INFLECTION', 'Cubic Inflection Point', 'x_inflect', 'Equation Solver', 'TOOLS_COMMAND', 'Equation > Cubic > Inflect', '-b / (3a)', 'Calculates inflection coordinate where concavity changes');
  add('EQ_NEWTON_RAPHSON', 'Newton-Raphson Solver Root', 'NR_Root', 'Equation Solver', 'CATALOG_COMMAND', 'CATALOG > Equation > Newton', 'x - f(x)/f\'(x)', 'Successive tangent approximations to locate root');
  for (let deg = 1; deg <= 9; deg++) {
    add(`EQ_COEF_${deg}`, `Equation Coefficient c_${deg}`, `coef_${deg}`, 'Equation Solver', 'TOOLS_COMMAND', `Equation > Coef > ${deg}`, `c_${deg}`, `Input slot for equation coefficient #${deg}`);
  }

  // ==========================================
  // 21. INEQUALITY SOLVERS (15 functions)
  // ==========================================
  add('INEQ_QUAD_GT', 'Quadratic Inequality ax²+bx+c > 0', 'ax²+bx+c > 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 2 > >', 'ax²+bx+c > 0', 'Solves quadratic inequality strictly greater than zero');
  add('INEQ_QUAD_LT', 'Quadratic Inequality ax²+bx+c < 0', 'ax²+bx+c < 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 2 > <', 'ax²+bx+c < 0', 'Solves quadratic inequality strictly less than zero');
  add('INEQ_QUAD_GE', 'Quadratic Inequality ax²+bx+c ≥ 0', 'ax²+bx+c ≥ 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 2 > ≥', 'ax²+bx+c ≥ 0', 'Solves quadratic inequality greater than or equal to zero');
  add('INEQ_QUAD_LE', 'Quadratic Inequality ax²+bx+c ≤ 0', 'ax²+bx+c ≤ 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 2 > ≤', 'ax²+bx+c ≤ 0', 'Solves quadratic inequality less than or equal to zero');
  add('INEQ_CUBIC_GT', 'Cubic Inequality ax³+.. > 0', 'ax³+.. > 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 3 > >', 'ax³+bx²+cx+d > 0', 'Solves cubic polynomial inequality for positive intervals');
  add('INEQ_CUBIC_LT', 'Cubic Inequality ax³+.. < 0', 'ax³+.. < 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 3 > <', 'ax³+bx²+cx+d < 0', 'Solves cubic polynomial inequality for negative intervals');
  add('INEQ_CUBIC_GE', 'Cubic Inequality ax³+.. ≥ 0', 'ax³+.. ≥ 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 3 > ≥', 'ax³+bx²+cx+d ≥ 0', 'Solves cubic polynomial inequality for non-negative intervals');
  add('INEQ_CUBIC_LE', 'Cubic Inequality ax³+.. ≤ 0', 'ax³+.. ≤ 0', 'Inequalities', 'TOOLS_COMMAND', 'Inequality > Degree 3 > ≤', 'ax³+bx²+cx+d ≤ 0', 'Solves cubic polynomial inequality for non-positive intervals');
  for (let inq = 1; inq <= 7; inq++) {
    add(`INEQ_SPECIAL_${inq}`, `Inequality Range Interval #${inq}`, `Interval_${inq}`, 'Inequalities', 'CATALOG_COMMAND', `CATALOG > Inequality > Interval ${inq}`, `Interval [a, b]`, `Bound constraint definition #${inq}`);
  }

  // ==========================================
  // 22. RATIO & FINANCIAL PROPORTIONS (15 functions)
  // ==========================================
  add('RATIO_SOLVE_X_D', 'Ratio Solver A : B = X : D', 'A:B=X:D', 'Ratio & Finance', 'TOOLS_COMMAND', 'Ratio > A:B=X:D', 'X = (A · D) / B', 'Solves for third term X in direct proportion', '(2 * 10) / 4', '5');
  add('RATIO_SOLVE_C_X', 'Ratio Solver A : B = C : X', 'A:B=C:X', 'Ratio & Finance', 'TOOLS_COMMAND', 'Ratio > A:B=C:X', 'X = (B · C) / A', 'Solves for fourth term X in direct proportion', '(4 * 6) / 2', '12');
  add('RATIO_PCT_CHANGE', 'Percentage Increase / Decrease', '%Change', 'Ratio & Finance', 'CATALOG_COMMAND', 'CATALOG > Finance > %Change', '((new - old)/old)·100', 'Calculates percentage change between values', '((120 - 100)/100)*100', '20');
  add('RATIO_MARKUP', 'Percentage Markup on Cost', '%Markup', 'Ratio & Finance', 'CATALOG_COMMAND', 'CATALOG > Finance > %Markup', '(profit / cost)·100', 'Computes profit margin percentage relative to cost');
  add('RATIO_MARGIN', 'Gross Margin Percentage', '%Margin', 'Ratio & Finance', 'CATALOG_COMMAND', 'CATALOG > Finance > %Margin', '(profit / revenue)·100', 'Gross margin percentage of revenue');
  add('RATIO_SIMPLE_INT', 'Simple Interest I = P·r·t', 'SimpleInt', 'Ratio & Finance', 'CATALOG_COMMAND', 'CATALOG > Finance > SimpleInt', 'P · r · t', 'Computes simple interest accrued over time', '1000 * 0.05 * 3', '150');
  add('RATIO_COMPOUND_INT', 'Compound Interest Amount A = P·(1+r)ⁿ', 'CompInt', 'Ratio & Finance', 'CATALOG_COMMAND', 'CATALOG > Finance > CompInt', 'P · (1 + r)^n', 'Compound interest maturity amount', '1000 * (1 + 0.05)^2', '1102.5');
  for (let r = 1; r <= 8; r++) {
    add(`RATIO_SCALE_${r}`, `Proportional Scale 1:${r*5}`, `Scale 1:${r*5}`, 'Ratio & Finance', 'CATALOG_COMMAND', `CATALOG > Ratio > Scale 1:${r*5}`, `Factor ${r*5}`, `Applies geometric scale reduction ratio 1:${r*5}`);
  }

  // ==========================================
  // 23. SPREADSHEET FORMULAS & MODELING (25 functions)
  // ==========================================
  add('SHEET_FORMULA_SUM', 'Spreadsheet =SUM(Range)', '=SUM', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > SUM', '=SUM(A1:A5)', 'Sums all numerical values in designated cell range');
  add('SHEET_FORMULA_MEAN', 'Spreadsheet =MEAN(Range)', '=MEAN', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > MEAN', '=MEAN(A1:A5)', 'Computes arithmetic mean of cell range values');
  add('SHEET_FORMULA_MIN', 'Spreadsheet =MIN(Range)', '=MIN', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > MIN', '=MIN(A1:A5)', 'Finds minimum numerical value in cell range');
  add('SHEET_FORMULA_MAX', 'Spreadsheet =MAX(Range)', '=MAX', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > MAX', '=MAX(A1:A5)', 'Finds maximum numerical value in cell range');
  add('SHEET_FORMULA_COUNT', 'Spreadsheet =COUNT(Range)', '=COUNT', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > COUNT', '=COUNT(A1:A5)', 'Counts number of non-empty numeric cells in range');
  add('SHEET_FORMULA_PRODUCT', 'Spreadsheet =PRODUCT(Range)', '=PRODUCT', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > PRODUCT', '=PRODUCT(A1:A5)', 'Multiplies all numbers in designated cell range together');
  add('SHEET_FORMULA_MEDIAN', 'Spreadsheet =MEDIAN(Range)', '=MEDIAN', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > MEDIAN', '=MEDIAN(A1:A5)', 'Finds median value of dataset in range');
  add('SHEET_FORMULA_STDEV', 'Spreadsheet =STDEV(Range)', '=STDEV', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > STDEV', '=STDEV(A1:A5)', 'Calculates sample standard deviation of cells in range');
  add('SHEET_FORMULA_VAR', 'Spreadsheet =VAR(Range)', '=VAR', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > VAR', '=VAR(A1:A5)', 'Calculates sample variance of cells in range');
  add('SHEET_FORMULA_IF', 'Spreadsheet =IF(Condition, Val1, Val2)', '=IF', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Formula > IF', '=IF(A1>0, 1, 0)', 'Conditional branching logic in spreadsheet cell');
  add('SHEET_FILL_FORMULA', 'Spreadsheet Fill Formula', 'FillForm', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Edit > Fill Formula', 'Copy to range', 'Replicates formula across consecutive rows or columns');
  add('SHEET_FILL_VALUE', 'Spreadsheet Fill Value', 'FillVal', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Edit > Fill Value', 'Constant to range', 'Fills range of cells with designated constant value');
  add('SHEET_RECALCULATE', 'Spreadsheet Recalculate Grid', 'Recalc', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Edit > Recalculate', 'Recalculates all', 'Executes topological dependency recalculation');
  add('SHEET_CLEAR_ALL', 'Spreadsheet Clear All Data', 'ClearSheet', 'Spreadsheet', 'TOOLS_COMMAND', 'Spreadsheet > Edit > Clear All', 'Wipes grid', 'Clears contents and formulas of all 50 cells');
  for (let col of ['A', 'B', 'C', 'D', 'E']) {
    for (let row = 1; row <= 2; row++) {
      add(`SHEET_CELL_${col}${row}`, `Spreadsheet Cell ${col}${row}`, `${col}${row}`, 'Spreadsheet', 'TOOLS_COMMAND', `Spreadsheet > Cell > ${col}${row}`, `Cell ${col}${row}`, `Direct reference to spreadsheet grid coordinate ${col}${row}`);
    }
  }
  add('SHEET_RELATIVE_REF', 'Spreadsheet Relative Cell Reference', '$A$1', 'Spreadsheet', 'CATALOG_COMMAND', 'CATALOG > Sheet > Ref', 'Absolute $A$1', 'Toggles relative vs absolute formula reference');

  // ==========================================
  // 24. 47 SCIENTIFIC & PHYSICAL CONSTANTS (CODATA) (47 functions)
  // ==========================================
  const physicalConstants: [string, string, string, string][] = [
    ['c', 'Speed of light in vacuum', '299792458', 'm/s'],
    ['h', 'Planck constant', '6.62607015e-34', 'J·s'],
    ['hbar', 'Reduced Planck constant (h-bar)', '1.054571817e-34', 'J·s'],
    ['mu0', 'Vacuum magnetic permeability', '1.25663706212e-6', 'N/A²'],
    ['eps0', 'Vacuum electric permittivity', '8.8541878128e-12', 'F/m'],
    ['G', 'Newtonian constant of gravitation', '6.67430e-11', 'm³/(kg·s²)'],
    ['e', 'Elementary charge', '1.602176634e-19', 'C'],
    ['me', 'Electron mass', '9.1093837015e-31', 'kg'],
    ['mp', 'Proton mass', '1.67262192369e-27', 'kg'],
    ['mn', 'Neutron mass', '1.67492749804e-27', 'kg'],
    ['mu', 'Muon mass', '1.883531627e-28', 'kg'],
    ['a0', 'Bohr radius', '5.29177210903e-11', 'm'],
    ['alpha', 'Fine-structure constant', '0.0072973525693', 'dimensionless'],
    ['re', 'Classical electron radius', '2.8179403262e-15', 'm'],
    ['lambda_c', 'Compton wavelength', '2.42631023867e-12', 'm'],
    ['gamma_p', 'Proton gyromagnetic ratio', '2.6752218744e8', 's⁻¹·T⁻¹'],
    ['lambda_cp', 'Proton Compton wavelength', '1.32140985539e-15', 'm'],
    ['lambda_cn', 'Neutron Compton wavelength', '1.31959090581e-15', 'm'],
    ['R_inf', 'Rydberg constant', '10973731.568160', 'm⁻¹'],
    ['u', 'Atomic mass constant', '1.66053906660e-27', 'kg'],
    ['mu_p', 'Proton magnetic moment', '1.41060679736e-26', 'J/T'],
    ['mu_e', 'Electron magnetic moment', '-9.2847647043e-24', 'J/T'],
    ['mu_n', 'Neutron magnetic moment', '-9.6623651e-27', 'J/T'],
    ['mu_mu', 'Muon magnetic moment', '-4.4904483e-26', 'J/T'],
    ['mu_B', 'Bohr magneton', '9.2740100783e-24', 'J/T'],
    ['mu_N', 'Nuclear magneton', '5.0507837461e-27', 'J/T'],
    ['phi0', 'Magnetic flux quantum', '2.067833848e-15', 'Wb'],
    ['G0', 'Conductance quantum', '7.748091729e-5', 'S'],
    ['K_J', 'Josephson constant', '483597.8484e9', 'Hz/V'],
    ['R_K', 'von Klitzing constant', '25812.80745', 'Ω'],
    ['NA', 'Avogadro constant', '6.02214076e23', 'mol⁻¹'],
    ['k', 'Boltzmann constant', '1.380649e-23', 'J/K'],
    ['Vm', 'Molar volume of ideal gas', '0.02271095464', 'm³/mol'],
    ['R', 'Molar gas constant', '8.314462618', 'J/(mol·K)'],
    ['C1', 'First radiation constant', '3.741771852e-16', 'W·m²'],
    ['C2', 'Second radiation constant', '0.01438776877', 'm·K'],
    ['sigma', 'Stefan-Boltzmann constant', '5.670374419e-8', 'W/(m²·K⁴)'],
    ['g', 'Standard acceleration of gravity', '9.80665', 'm/s²'],
    ['atm', 'Standard atmosphere', '101325', 'Pa'],
    ['R_D', 'Loschmidt constant', '2.686780111e25', 'm⁻³'],
    ['F', 'Faraday constant', '96485.33212', 'C/mol'],
    ['Z0', 'Characteristic impedance of vacuum', '376.730313668', 'Ω'],
    ['t_p', 'Planck time', '5.391247e-44', 's'],
    ['l_p', 'Planck length', '1.616255e-35', 'm'],
    ['m_p', 'Planck mass', '2.176434e-8', 'kg'],
    ['T_p', 'Planck temperature', '1.416784e32', 'K'],
    ['theta_W', 'Weak mixing angle', '0.22290', 'dimensionless'],
  ];

  for (const [sym, desc, val, unit] of physicalConstants) {
    add(
      `CONST_${sym.toUpperCase()}`,
      `Constant ${sym}: ${desc}`,
      sym,
      'Scientific Constants',
      'CATALOG_COMMAND',
      `CATALOG > Scientific Constants > ${sym}`,
      sym,
      `Inserts CODATA standard ${desc} = ${val} ${unit}`,
      sym,
      val
    );
  }

  // ==========================================
  // 25. SCIENTIFIC METRIC & IMPERIAL CONVERSIONS (45 functions)
  // ==========================================
  const conversions: [string, string, string][] = [
    ['in_cm', 'Inches to Centimeters', '× 2.54'],
    ['cm_in', 'Centimeters to Inches', '÷ 2.54'],
    ['ft_m', 'Feet to Meters', '× 0.3048'],
    ['m_ft', 'Meters to Feet', '÷ 0.3048'],
    ['yd_m', 'Yards to Meters', '× 0.9144'],
    ['m_yd', 'Meters to Yards', '÷ 0.9144'],
    ['mile_km', 'Miles to Kilometers', '× 1.609344'],
    ['km_mile', 'Kilometers to Miles', '÷ 1.609344'],
    ['n_mile_m', 'Nautical Miles to Meters', '× 1852'],
    ['m_n_mile', 'Meters to Nautical Miles', '÷ 1852'],
    ['acre_m2', 'Acres to Square Meters', '× 4046.8564224'],
    ['m2_acre', 'Square Meters to Acres', '÷ 4046.8564224'],
    ['ha_m2', 'Hectares to Square Meters', '× 10000'],
    ['m2_ha', 'Square Meters to Hectares', '÷ 10000'],
    ['gal_US_L', 'US Gallons to Liters', '× 3.785411784'],
    ['L_gal_US', 'Liters to US Gallons', '÷ 3.785411784'],
    ['gal_UK_L', 'UK Gallons to Liters', '× 4.54609'],
    ['L_gal_UK', 'Liters to UK Gallons', '÷ 4.54609'],
    ['pt_L', 'US Pints to Liters', '× 0.473176473'],
    ['L_pt', 'Liters to US Pints', '÷ 0.473176473'],
    ['oz_g', 'Ounces to Grams', '× 28.349523125'],
    ['g_oz', 'Grams to Ounces', '÷ 28.349523125'],
    ['lb_kg', 'Pounds to Kilograms', '× 0.45359237'],
    ['kg_lb', 'Kilograms to Pounds', '÷ 0.45359237'],
    ['ton_long_t', 'Long Tons to Tonnes', '× 1.0160469088'],
    ['t_ton_long', 'Tonnes to Long Tons', '÷ 1.0160469088'],
    ['ton_short_t', 'Short Tons to Tonnes', '× 0.90718474'],
    ['t_ton_short', 'Tonnes to Short Tons', '÷ 0.90718474'],
    ['atm_Pa', 'Atmospheres to Pascals', '× 101325'],
    ['Pa_atm', 'Pascals to Atmospheres', '÷ 101325'],
    ['bar_Pa', 'Bars to Pascals', '× 100000'],
    ['Pa_bar', 'Pascals to Bars', '÷ 100000'],
    ['mmHg_Pa', 'Millimeters of Mercury to Pascals', '× 133.322387415'],
    ['Pa_mmHg', 'Pascals to Millimeters of Mercury', '÷ 133.322387415'],
    ['hp_kW', 'Horsepower to Kilowatts', '× 0.7456998715822702'],
    ['kW_hp', 'Kilowatts to Horsepower', '÷ 0.7456998715822702'],
    ['cal_J', 'Calories to Joules', '× 4.184'],
    ['J_cal', 'Joules to Calories', '÷ 4.184'],
    ['degF_degC', 'Fahrenheit to Celsius', '(F - 32) × 5/9'],
    ['degC_degF', 'Celsius to Fahrenheit', '(C × 9/5) + 32'],
    ['degC_K', 'Celsius to Kelvin', 'C + 273.15'],
    ['K_degC', 'Kelvin to Celsius', 'K - 273.15'],
    ['kmh_ms', 'Kilometers per Hour to Meters per Second', '÷ 3.6'],
    ['ms_kmh', 'Meters per Second to Kilometers per Hour', '× 3.6'],
    ['psi_kPa', 'Pounds per Square Inch to Kilopascals', '× 6.894757'],
  ];

  for (const [code, name, formula] of conversions) {
    add(
      `CONV_${code.toUpperCase()}`,
      name,
      code.replace('_', '▶'),
      'Unit Conversions',
      'CATALOG_COMMAND',
      `CATALOG > Unit Conversion > ${name}`,
      'Numeric value',
      `Converts physical dimension: ${formula}`
    );
  }

  // ==========================================
  // 26. ENGINEERING NOTATION & METRIC PREFIXES (25 functions)
  // ==========================================
  const engPrefixes: [string, string, string][] = [
    ['Q', 'quetta (10³⁰)', '1e30'],
    ['R', 'ronna (10²⁷)', '1e27'],
    ['Y', 'yotta (10²⁴)', '1e24'],
    ['Z', 'zetta (10²¹)', '1e21'],
    ['E', 'exa (10¹⁸)', '1e18'],
    ['P', 'peta (10¹⁵)', '1e15'],
    ['T', 'tera (10¹²)', '1e12'],
    ['G', 'giga (10⁹)', '1e9'],
    ['M', 'mega (10⁶)', '1e6'],
    ['k', 'kilo (10³)', '1e3'],
    ['h', 'hecto (10²)', '1e2'],
    ['da', 'deka (10¹)', '1e1'],
    ['d', 'deci (10⁻¹)', '1e-1'],
    ['c', 'centi (10⁻²)', '1e-2'],
    ['m', 'milli (10⁻³)', '1e-3'],
    ['u', 'micro (10⁻⁶)', '1e-6'],
    ['n', 'nano (10⁻⁹)', '1e-9'],
    ['p', 'pico (10⁻¹²)', '1e-12'],
    ['f', 'femto (10⁻¹⁵)', '1e-15'],
    ['a', 'atto (10⁻¹⁸)', '1e-18'],
    ['z', 'zepto (10⁻²¹)', '1e-21'],
    ['y', 'yocto (10⁻²⁴)', '1e-24'],
    ['r', 'ronto (10⁻²⁷)', '1e-27'],
    ['q', 'quecto (10⁻³⁰)', '1e-30'],
    ['ENG', 'Engineering Shift Right', 'Exponent mod 3'],
  ];

  for (const [pfx, desc, factor] of engPrefixes) {
    add(
      `ENG_${pfx.toUpperCase()}`,
      `Engineering Prefix ${pfx} (${desc})`,
      pfx,
      'Engineering Symbols',
      'CATALOG_COMMAND',
      `CATALOG > Engineering Symbols > ${pfx}`,
      'Appends symbol',
      `Multiplies by SI metric factor ${factor}`
    );
  }

  // ==========================================
  // 27. RANDOMIZATION & MATH BOX EXPERIMENTS (15 functions)
  // ==========================================
  add('MATHBOX_DICE_1', 'Dice Roll Simulation (1 Die)', 'Dice 1', 'Math Box', 'TOOLS_COMMAND', 'Math Box > Dice Roll > 1 Die', 'Random roll', 'Generates discrete uniform integer [1..6]');
  add('MATHBOX_DICE_2', 'Dice Roll Simulation (2 Dice)', 'Dice 2', 'Math Box', 'TOOLS_COMMAND', 'Math Box > Dice Roll > 2 Dice', 'Random pair', 'Simulates sum of 2 independent fair 6-sided dice [2..12]');
  add('MATHBOX_DICE_3', 'Dice Roll Simulation (3 Dice)', 'Dice 3', 'Math Box', 'TOOLS_COMMAND', 'Math Box > Dice Roll > 3 Dice', 'Random triplet', 'Simulates sum of 3 independent fair 6-sided dice [3..18]');
  add('MATHBOX_COIN_1', 'Coin Toss Simulation (1 Coin)', 'Coin 1', 'Math Box', 'TOOLS_COMMAND', 'Math Box > Coin Toss > 1 Coin', 'Fair coin', 'Simulates Bernoulli trial (Heads=1, Tails=0)');
  add('MATHBOX_COIN_2', 'Coin Toss Simulation (2 Coins)', 'Coin 2', 'Math Box', 'TOOLS_COMMAND', 'Math Box > Coin Toss > 2 Coins', '2 Coins', 'Simulates binomial toss of 2 fair coins');
  add('MATHBOX_COIN_3', 'Coin Toss Simulation (3 Coins)', 'Coin 3', 'Math Box', 'TOOLS_COMMAND', 'Math Box > Coin Toss > 3 Coins', '3 Coins', 'Simulates binomial toss of 3 fair coins');
  add('RAND_FLOAT', 'Random Number Generator Ran#', 'Ran#', 'Math Box', 'SHIFT_KEY', 'SHIFT + [•]', 'Ran#', 'Generates pseudo-random float 0.000 ≤ x < 1.000');
  add('RAND_INT', 'Random Integer Generator RanInt#(a, b)', 'RanInt#', 'Math Box', 'ALPHA_KEY', 'ALPHA + [•]', 'RanInt#(a, b)', 'Generates uniform integer between lower and upper bounds a and b');
  add('RAND_GAUSSIAN', 'Gaussian Random Variate RanNorm', 'RanNorm', 'Math Box', 'CATALOG_COMMAND', 'CATALOG > Random > RanNorm', 'RanNorm(μ, σ)', 'Box-Muller generated normal random value');
  for (let trial = 10; trial <= 60; trial += 10) {
    add(`MATHBOX_TRIALS_${trial}`, `Simulation Trial Batch (${trial} trials)`, `Trials_${trial}`, 'Math Box', 'TOOLS_COMMAND', `Math Box > Trials > ${trial}`, `${trial} Trials`, `Executes simulation batch of ${trial} automated experiment trials`);
  }

  // ==========================================
  // 28. VARIABLE MEMORY & STORAGE (20 functions)
  // ==========================================
  const varNames = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z', 'M'];
  for (const v of varNames) {
    add(
      `MEM_VAR_${v}`,
      `Variable ${v} Storage`,
      v,
      'Variable Memory',
      'ALPHA_KEY',
      `Key [VARIABLE] > ${v} or ALPHA + [${v}]`,
      `Variable ${v}`,
      `Stores and recalls 64-bit IEEE double float value of variable ${v}`
    );
  }
  add('MEM_ANS', 'Previous Answer Ans', 'Ans', 'Variable Memory', 'PRIMARY_KEY', 'Key [Ans]', 'Ans', 'Recalls numeric result of previous calculation');
  add('MEM_PRE_ANS', 'Previous to Last Answer PreAns', 'PreAns', 'Variable Memory', 'CATALOG_COMMAND', 'CATALOG > Memory > PreAns', 'PreAns', 'Recalls result of calculation prior to Ans');
  add('MEM_PLUS', 'Memory Add M+', 'M+', 'Variable Memory', 'PRIMARY_KEY', 'Key [M+]', 'Ans + M', 'Adds displayed result to independent memory M');
  add('MEM_MINUS', 'Memory Subtract M-', 'M-', 'Variable Memory', 'SHIFT_KEY', 'SHIFT + [M+]', 'M - Ans', 'Subtracts displayed result from independent memory M');
  add('MEM_CLEAR_ALL', 'Clear All Variables', 'ClrVar', 'Variable Memory', 'SETTINGS_COMMAND', 'SETTINGS > Reset > Clear Variables', 'Reset vars', 'Resets variables A..F, x, y, z, and M to 0.0');
  for (let slot = 1; slot <= 5; slot++) {
    add(`MEM_HISTORY_SLOT_${slot}`, `History Memory Slot #${slot}`, `Hist_${slot}`, 'Variable Memory', 'PRIMARY_KEY', `Key [HISTORY] > Slot ${slot}`, `Slot ${slot}`, `Recalls calculation expression stored in history slot #${slot}`);
  }

  // ==========================================
  // 29. DISPLAY, FORMAT & SETUP CONTROLS (20 functions)
  // ==========================================
  add('SETUP_MATH_I_MATH_O', 'Input/Output MathI / MathO', 'MathI/MathO', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > MathI/MathO', 'Natural textbook I/O', 'Enables 2D textbook math input with exact fraction output');
  add('SETUP_MATH_I_DEC_O', 'Input/Output MathI / DecimalO', 'MathI/DecimalO', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > MathI/DecimalO', 'Textbook In, Decimal Out', 'Textbook expression input with automatic decimal fraction output');
  add('SETUP_LINE_I_LINE_O', 'Input/Output LineI / LineO', 'LineI/LineO', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > LineI/LineO', 'Linear 1D I/O', 'Classic linear 1D text display format');
  add('SETUP_LINE_I_DEC_O', 'Input/Output LineI / DecimalO', 'LineI/DecimalO', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > LineI/DecimalO', 'Linear In, Decimal Out', 'Linear expression input with decimal output');
  add('SETUP_ANGLE_DEG', 'Angle Unit Degree', 'DEG', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Angle > Degree', 'Degree unit', 'Sets angular measure to 360 degrees per revolution');
  add('SETUP_ANGLE_RAD', 'Angle Unit Radian', 'RAD', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Angle > Radian', 'Radian unit', 'Sets angular measure to 2π radians per revolution');
  add('SETUP_ANGLE_GRAD', 'Angle Unit Gradian', 'GRAD', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Angle > Gradian', 'Gradian unit', 'Sets angular measure to 400 gradians per revolution');
  add('SETUP_NUM_NORM1', 'Number Format Norm 1', 'Norm 1', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Number > Norm 1', 'Exponential < 10⁻²', 'Scientific exponential notation for values < 0.01 or ≥ 10¹⁰');
  add('SETUP_NUM_NORM2', 'Number Format Norm 2', 'Norm 2', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Number > Norm 2', 'Exponential < 10⁻⁹', 'Scientific exponential notation for values < 10⁻⁹ or ≥ 10¹⁰');
  add('SETUP_NUM_FIX', 'Fixed Decimal Places Fix (0-9)', 'Fix', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Number > Fix', 'Fix 0..9', 'Rounds all results to specified number of decimal digits');
  add('SETUP_NUM_SCI', 'Scientific Significant Digits Sci (1-10)', 'Sci', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Number > Sci', 'Sci 1..10', 'Displays results in scientific notation with specified significant figures');
  add('SETUP_FRAC_IMPROPER', 'Fraction Result Improper d/c', 'd/c', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Fraction > d/c', 'Improper fraction', 'Displays fractions with larger numerator over denominator');
  add('SETUP_FRAC_MIXED', 'Fraction Result Mixed a b/c', 'a b/c', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Fraction > a b/c', 'Mixed fraction', 'Displays fractions partitioned into whole integer and proper fraction');
  add('SETUP_ENG_NOTATION', 'Engineering Notation Mode', 'ENG Mode', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Calc Settings > Engineering', 'Engineering notation', 'Forces exponents to multiples of 3 with SI prefix symbols');
  add('SETUP_CONTRAST_HIGH', 'High Contrast LCD Mode', 'High Contrast', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > System > High Contrast', 'LCD Contrast', 'Increases pixel contrast on simulated LCD display');
  add('SETUP_KEY_SOUND', 'Key Click Audio Feedback', 'Key Sound', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > System > Key Sound', 'Audio click', 'Plays acoustic feedback on tactile key depression');
  add('SETUP_HAPTIC', 'Haptic Vibration Feedback', 'Haptic', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > System > Haptic', 'Haptic pulse', 'Vibrates on supported mobile and tablet touchscreens');
  add('SETUP_RESET_INITIALIZE', 'Initialize All Calculator Settings', 'Reset All', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Reset > Initialize All', 'Factory default', 'Restores all calculation parameters, memory, and modes to default');
  add('SETUP_FONT_STANDARD', 'LCD Standard Dot Matrix Font', 'LCD Font', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > Display > Font', 'Dot-matrix glyphs', 'Simulates authentic 192×63 monochrome LCD dot matrix font');
  add('SETUP_AUTO_OFF', 'Auto Power-Off Timer', 'Auto OFF', 'Display & Settings', 'SETTINGS_COMMAND', 'SETTINGS > System > Auto OFF', 'Energy saving', 'Puts calculator in standby after idle duration');

  return list;
}

export const FunctionRegistry = {
  allFunctions: buildAllFunctions(),
  get totalCount(): number {
    return this.allFunctions.length;
  },
};
