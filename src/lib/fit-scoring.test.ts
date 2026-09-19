import test from 'node:test';
import assert from 'node:assert';
import { calculateFitRecommendation } from './fit-scoring';
import { SizeChart } from '../types/charts';

const mockChart: SizeChart = {
  _id: 'chart-tops-1',
  name: "Men's Tops",
  defaultUnit: 'cm',
  chartType: 'standard',
  status: 'ACTIVE',
  fitFinderEnabled: true,
  createdDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  columns: [
    { id: 'size', name: 'Size', isSizeColumn: true },
    { id: 'chest', name: 'Chest (cm)', presetKey: 'chest' },
    { id: 'waist', name: 'Waist (cm)', presetKey: 'waist' },
  ],
  rows: [
    { id: 'r1', size: 'S', values: { chest: '88-92', waist: '76-80' } },
    { id: 'r2', size: 'M', values: { chest: '96-100', waist: '84-88' } },
    { id: 'r3', size: 'L', values: { chest: '104-108', waist: '92-96' } },
    { id: 'r4', size: 'XL', values: { chest: '112-116', waist: '100-104' } },
  ],
  fitFinderConfig: {
    enabled: true,
    askChest: true,
    askWaist: true,
    allowFitPreferences: true,
  },
};

test('fit-scoring: exact match for Medium size with regular preference', () => {
  const result = calculateFitRecommendation(
    mockChart,
    { chest: 98, waist: 86, preference: 'regular' },
    'cm'
  );

  assert.ok(result !== null);
  assert.strictEqual(result?.recommendedSize, 'M');
  assert.ok(result?.confidence !== undefined && result.confidence >= 50);
});

test('fit-scoring: fit preference slim selects smaller size or adjusts threshold', () => {
  const result = calculateFitRecommendation(
    mockChart,
    { chest: 95, preference: 'slim' },
    'cm'
  );

  assert.ok(result !== null);
  assert.ok(result?.recommendedSize === 'S' || result?.recommendedSize === 'M');
});

test('fit-scoring: returns null recommendation when chart has no rows', () => {
  const emptyChart: SizeChart = {
    ...mockChart,
    rows: [],
  };

  const result = calculateFitRecommendation(emptyChart, { chest: 100 }, 'cm');
  assert.strictEqual(result, null);
});
