import test from 'node:test';
import assert from 'node:assert';
import { calculateAIFitRecommendation, testDeepSeekConnection } from './deepseek-service';
import { SizeChart } from '../types/charts';

const mockChart: SizeChart = {
  _id: 'chart-tops-1',
  name: "Men's Tops",
  defaultUnit: 'cm',
  chartType: 'mens-tops',
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
    aiEnabled: true,
    askChest: true,
    askWaist: true,
    allowFitPreferences: true,
  },
};

test('deepseek-service: testDeepSeekConnection fails gracefully for empty key', async () => {
  const result = await testDeepSeekConnection('');
  assert.strictEqual(result.success, false);
  assert.ok(result.message.includes('API key is required'));
});

test('deepseek-service: calculateAIFitRecommendation falls back to deterministic engine when key is missing', async () => {
  const result = await calculateAIFitRecommendation(
    mockChart,
    { chest: 98, waist: 86, preference: 'regular' },
    'cm'
  );

  assert.ok(result !== null);
  assert.strictEqual(result?.recommendedSize, 'M');
  assert.strictEqual(result?.aiGenerated, undefined);
  assert.ok(result?.confidence !== undefined && result.confidence >= 50);
});

test('deepseek-service: handles simulated AI response parsing and validation', async () => {
  const originalFetch = global.fetch;

  // Mock successful DeepSeek OpenAI-compatible response
  global.fetch = async () => {
    return {
      ok: true,
      json: async () => ({
        model: 'deepseek-chat',
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendedSize: 'M',
                confidence: 94,
                isBetweenSizes: false,
                aiReasoning: 'Your chest measurement of 98cm is centered in size M.',
                fitTips: 'Provides a clean, tailored drape across the shoulders.',
                explanation: {
                  fitNote: 'Ideal fit for daily wear.',
                  matchingMeasurements: [
                    { name: 'chest', userValue: 98, chartRange: '96-100', status: 'exact' },
                  ],
                },
              }),
            },
          },
        ],
      }),
    } as any;
  };

  try {
    const result = await calculateAIFitRecommendation(
      mockChart,
      { chest: 98, waist: 86, preference: 'regular' },
      'cm',
      { apiKey: 'sk-mock-key', model: 'deepseek-chat' }
    );

    assert.ok(result !== null);
    assert.strictEqual(result?.recommendedSize, 'M');
    assert.strictEqual(result?.aiGenerated, true);
    assert.strictEqual(result?.confidence, 94);
    assert.ok(result?.aiReasoning?.includes('98cm'));
    assert.ok(result?.fitTips?.includes('tailored'));
  } finally {
    global.fetch = originalFetch;
  }
});

test('deepseek-service: falls back to deterministic calculation if DeepSeek returns an invalid size', async () => {
  const originalFetch = global.fetch;

  // Mock DeepSeek returning a size not in the chart (e.g. "XXXL")
  global.fetch = async () => {
    return {
      ok: true,
      json: async () => ({
        model: 'deepseek-chat',
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendedSize: 'XXXL', // Not in mockChart!
                confidence: 99,
              }),
            },
          },
        ],
      }),
    } as any;
  };

  try {
    const result = await calculateAIFitRecommendation(
      mockChart,
      { chest: 98, waist: 86, preference: 'regular' },
      'cm',
      { apiKey: 'sk-mock-key' }
    );

    // Fallback should pick 'M'
    assert.ok(result !== null);
    assert.strictEqual(result?.recommendedSize, 'M');
    assert.strictEqual(result?.aiGenerated, undefined);
  } finally {
    global.fetch = originalFetch;
  }
});
