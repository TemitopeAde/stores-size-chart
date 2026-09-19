import test from 'node:test';
import assert from 'node:assert';
import { cmToInches, inchesToCm, convertMeasurementString, formatMeasurement } from './units';

test('units: cmToInches and inchesToCm conversion', () => {
  assert.strictEqual(cmToInches(2.54), 1);
  assert.strictEqual(cmToInches(100), 39.4);
  assert.strictEqual(inchesToCm(1), 2.5);
  assert.strictEqual(inchesToCm(39.4), 100.1);
});

test('units: convertMeasurementString single number', () => {
  assert.strictEqual(convertMeasurementString('100', 'cm', 'in'), '39.4');
  assert.strictEqual(convertMeasurementString('100 cm', 'cm', 'in'), '39.4 in');
  assert.strictEqual(convertMeasurementString('40 in', 'in', 'cm'), '101.6 cm');
});

test('units: convertMeasurementString range', () => {
  assert.strictEqual(convertMeasurementString('90-95', 'cm', 'in'), '35.4-37.4');
  assert.strictEqual(convertMeasurementString('90 - 95 cm', 'cm', 'in'), '35.4 - 37.4 in');
  assert.strictEqual(convertMeasurementString('36 - 38 in', 'in', 'cm'), '91.4 - 96.5 cm');
});

test('units: convertMeasurementString preserving non-numeric text', () => {
  assert.strictEqual(convertMeasurementString('Free Size', 'cm', 'in'), 'Free Size');
  assert.strictEqual(convertMeasurementString('One Size', 'in', 'cm'), 'One Size');
  assert.strictEqual(convertMeasurementString('', 'cm', 'in'), '');
});

test('units: formatMeasurement with unit label', () => {
  assert.strictEqual(formatMeasurement(100, 'cm', true), '100 cm');
  assert.strictEqual(formatMeasurement(39.4, 'in', true), '39.4 in');
  assert.strictEqual(formatMeasurement(100, 'cm', false), '100');
});

