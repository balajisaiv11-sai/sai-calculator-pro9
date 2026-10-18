export interface UnitItem {
  id: string;
  name: string;
  symbol: string;
  toBaseFactor: number;
  baseOffset?: number;
}

export interface UnitCategory {
  name: string;
  units: UnitItem[];
}

export class UnitConversionEngine {
  static readonly categories: UnitCategory[] = [
    {
      name: 'Length',
      units: [
        { id: 'm', name: 'Meter', symbol: 'm', toBaseFactor: 1.0 },
        { id: 'km', name: 'Kilometer', symbol: 'km', toBaseFactor: 1000.0 },
        { id: 'cm', name: 'Centimeter', symbol: 'cm', toBaseFactor: 0.01 },
        { id: 'mm', name: 'Millimeter', symbol: 'mm', toBaseFactor: 0.001 },
        { id: 'in', name: 'Inch', symbol: 'in', toBaseFactor: 0.0254 },
        { id: 'ft', name: 'Foot', symbol: 'ft', toBaseFactor: 0.3048 },
        { id: 'yd', name: 'Yard', symbol: 'yd', toBaseFactor: 0.9144 },
        { id: 'mile', name: 'Mile', symbol: 'mi', toBaseFactor: 1609.344 },
        { id: 'n_mile', name: 'Nautical Mile', symbol: 'NM', toBaseFactor: 1852.0 },
      ],
    },
    {
      name: 'Area',
      units: [
        { id: 'm2', name: 'Square Meter', symbol: 'm²', toBaseFactor: 1.0 },
        { id: 'km2', name: 'Square Kilometer', symbol: 'km²', toBaseFactor: 1000000.0 },
        { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', toBaseFactor: 0.0001 },
        { id: 'ha', name: 'Hectare', symbol: 'ha', toBaseFactor: 10000.0 },
        { id: 'acre', name: 'Acre', symbol: 'ac', toBaseFactor: 4046.8564224 },
        { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', toBaseFactor: 0.09290304 },
      ],
    },
    {
      name: 'Volume',
      units: [
        { id: 'L', name: 'Liter', symbol: 'L', toBaseFactor: 0.001 },
        { id: 'mL', name: 'Milliliter', symbol: 'mL', toBaseFactor: 0.000001 },
        { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBaseFactor: 1.0 },
        { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', toBaseFactor: 0.003785411784 },
        { id: 'gal_uk', name: 'Gallon (UK)', symbol: 'gal', toBaseFactor: 0.00454609 },
        { id: 'pt', name: 'Pint (US)', symbol: 'pt', toBaseFactor: 0.000473176473 },
      ],
    },
    {
      name: 'Mass',
      units: [
        { id: 'kg', name: 'Kilogram', symbol: 'kg', toBaseFactor: 1.0 },
        { id: 'g', name: 'Gram', symbol: 'g', toBaseFactor: 0.001 },
        { id: 'mg', name: 'Milligram', symbol: 'mg', toBaseFactor: 0.000001 },
        { id: 't', name: 'Metric Ton', symbol: 't', toBaseFactor: 1000.0 },
        { id: 'lb', name: 'Pound', symbol: 'lb', toBaseFactor: 0.45359237 },
        { id: 'oz', name: 'Ounce', symbol: 'oz', toBaseFactor: 0.028349523125 },
      ],
    },
    {
      name: 'Velocity',
      units: [
        { id: 'm_s', name: 'Meter per second', symbol: 'm/s', toBaseFactor: 1.0 },
        { id: 'km_h', name: 'Kilometer per hour', symbol: 'km/h', toBaseFactor: 1.0 / 3.6 },
        { id: 'mph', name: 'Mile per hour', symbol: 'mph', toBaseFactor: 0.44704 },
        { id: 'knot', name: 'Knot', symbol: 'kn', toBaseFactor: 1852.0 / 3600.0 },
      ],
    },
    {
      name: 'Pressure',
      units: [
        { id: 'Pa', name: 'Pascal', symbol: 'Pa', toBaseFactor: 1.0 },
        { id: 'kPa', name: 'Kilopascal', symbol: 'kPa', toBaseFactor: 1000.0 },
        { id: 'bar', name: 'Bar', symbol: 'bar', toBaseFactor: 100000.0 },
        { id: 'atm', name: 'Atmosphere', symbol: 'atm', toBaseFactor: 101325.0 },
        { id: 'mmHg', name: 'Millimeter of mercury', symbol: 'mmHg', toBaseFactor: 133.322387415 },
        { id: 'psi', name: 'Pound per sq inch', symbol: 'psi', toBaseFactor: 6894.757 },
      ],
    },
    {
      name: 'Energy',
      units: [
        { id: 'J', name: 'Joule', symbol: 'J', toBaseFactor: 1.0 },
        { id: 'kJ', name: 'Kilojoule', symbol: 'kJ', toBaseFactor: 1000.0 },
        { id: 'cal', name: 'Calorie', symbol: 'cal', toBaseFactor: 4.184 },
        { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', toBaseFactor: 4184.0 },
        { id: 'kWh', name: 'Kilowatt-hour', symbol: 'kWh', toBaseFactor: 3600000.0 },
        { id: 'eV', name: 'Electronvolt', symbol: 'eV', toBaseFactor: 1.602176634e-19 },
      ],
    },
    {
      name: 'Temperature',
      units: [
        { id: 'degC', name: 'Celsius', symbol: '°C', toBaseFactor: 1.0, baseOffset: 0.0 },
        { id: 'degF', name: 'Fahrenheit', symbol: '°F', toBaseFactor: 5.0 / 9.0, baseOffset: -32.0 },
        { id: 'K', name: 'Kelvin', symbol: 'K', toBaseFactor: 1.0, baseOffset: -273.15 },
      ],
    },
  ];

  static convert(value: number, fromUnit: UnitItem, toUnit: UnitItem): number {
    if (fromUnit.id === toUnit.id) return value;

    if (['degC', 'degF', 'K'].includes(fromUnit.id) && ['degC', 'degF', 'K'].includes(toUnit.id)) {
      let celsius = value;
      if (fromUnit.id === 'degF') celsius = ((value - 32.0) * 5.0) / 9.0;
      else if (fromUnit.id === 'K') celsius = value - 273.15;

      if (toUnit.id === 'degC') return celsius;
      if (toUnit.id === 'degF') return (celsius * 9.0) / 5.0 + 32.0;
      if (toUnit.id === 'K') return celsius + 273.15;
    }

    const baseVal = value * fromUnit.toBaseFactor;
    return baseVal / toUnit.toBaseFactor;
  }
}
