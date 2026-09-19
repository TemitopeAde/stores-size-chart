import { MeasurementUnit } from '../types/charts';

const CM_PER_INCH = 2.54;

export function cmToInches(cm: number, precision = 1): number {
  return convertNumber(cm, 'cm', 'in', precision);
}

export function inchesToCm(inches: number, precision = 1): number {
  return convertNumber(inches, 'in', 'cm', precision);
}

export function formatMeasurement(value: number, unit: MeasurementUnit, includeUnit = true): string {
  const formatted = String(value);
  return includeUnit ? `${formatted} ${unit}` : formatted;
}

/**
 * Converts a numeric value between CM and IN.
 */
export function convertNumber(value: number, from: MeasurementUnit, to: MeasurementUnit, precision = 1): number {
  if (from === to) return value;
  let result: number;
  if (from === 'cm' && to === 'in') {
    result = value / CM_PER_INCH;
  } else {
    result = value * CM_PER_INCH;
  }
  const factor = Math.pow(10, precision);
  return Math.round(result * factor) / factor;
}

/**
 * Converts a measurement string (e.g. "91-97", "86 - 91", "68", "102.5") from one unit to another.
 * Non-numeric strings (like "Free Size", "One Size", "EU 38") are left untouched.
 */
export function convertMeasurementString(val: string, from: MeasurementUnit, to: MeasurementUnit): string {
  if (!val || from === to) return val;
  const trimmed = val.trim();

  // Check for range pattern "min-max" or "min–max" (en-dash / hyphen)
  const rangeMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*([-–—])\s*(\d+(?:\.\d+)?)(?:\s*(cm|in))?$/i);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const separator = rangeMatch[2];
    const max = parseFloat(rangeMatch[3]);
    const hadUnit = Boolean(rangeMatch[4]);
    const convertedMin = convertNumber(min, from, to);
    const convertedMax = convertNumber(max, from, to);
    return hadUnit ? `${convertedMin} ${separator} ${convertedMax} ${to}` : `${convertedMin}${separator}${convertedMax}`;
  }

  // Check for single number with optional unit
  const singleMatch = trimmed.match(/^(\d+(?:\.\d+)?)(?:\s*(cm|in))?$/i);
  if (singleMatch) {
    const num = parseFloat(singleMatch[1]);
    const hadUnit = Boolean(singleMatch[2]);
    const converted = convertNumber(num, from, to);
    return hadUnit ? `${converted} ${to}` : String(converted);
  }

  return trimmed;
}

/**
 * Parses a measurement string into a min/max numeric range for calculation.
 */
export function parseMeasurementRange(val: string): { min: number; max: number } | null {
  if (!val) return null;
  const trimmed = val.trim();

  const rangeMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
    };
  }

  const singleMatch = trimmed.match(/^(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const num = parseFloat(singleMatch[1]);
    return { min: num, max: num };
  }

  return null;
}

