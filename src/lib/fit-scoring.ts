import { SizeChart, FitFinderConfig } from '../types/charts';
import { parseMeasurementRange } from './units';

export interface UserMeasurements {
  height?: number; // in cm
  weight?: number; // in kg
  chest?: number; // in cm
  waist?: number; // in cm
  hip?: number; // in cm
  shoulder?: number; // in cm
  footLength?: number; // in cm
  age?: number;
  preference?: 'slim' | 'regular' | 'relaxed';
}

export interface FitRecommendationResult {
  recommendedSize: string;
  confidence: number; // 0 to 100
  isBetweenSizes: boolean;
  alternativeSize?: string;
  explanation: {
    matchingMeasurements: Array<{
      name: string;
      userValue: number;
      chartRange: string;
      status: 'exact' | 'close' | 'outside';
    }>;
    fitNote?: string;
  };
}

const WEIGHT_MULTIPLIERS = {
  high: 3.0,
  medium: 2.0,
  low: 1.0,
};

export function calculateFitRecommendation(
  chart: SizeChart,
  user: UserMeasurements,
  unit: 'cm' | 'in' = 'cm'
): FitRecommendationResult | null {
  if (!chart.rows || chart.rows.length === 0 || !chart.columns || chart.columns.length === 0) {
    return null;
  }

  const preference = user.preference || 'regular';
  const config = chart.fitFinderConfig || { enabled: true };

  // Map columns to standard measurement types
  const colMap = new Map<string, string>(); // measurementKey -> columnId
  chart.columns.forEach((col) => {
    const key = (col.presetKey || col.name || '').toLowerCase();
    if (key.includes('chest') || key.includes('bust')) colMap.set('chest', col.id);
    else if (key.includes('waist')) colMap.set('waist', col.id);
    else if (key.includes('hip')) colMap.set('hip', col.id);
    else if (key.includes('shoulder')) colMap.set('shoulder', col.id);
    else if (key.includes('foot') || key.includes('shoe')) colMap.set('footLength', col.id);
    else if (key.includes('height')) colMap.set('height', col.id);
    else if (key.includes('weight')) colMap.set('weight', col.id);
  });

  // Calculate scores for each size row
  const sizeScores: Array<{
    size: string;
    score: number;
    details: Array<{
      name: string;
      userValue: number;
      chartRange: string;
      status: 'exact' | 'close' | 'outside';
    }>;
  }> = [];

  for (const row of chart.rows) {
    let totalScore = 0;
    let totalWeight = 0;
    const details: Array<{
      name: string;
      userValue: number;
      chartRange: string;
      status: 'exact' | 'close' | 'outside';
    }> = [];

    const checkMeasurement = (
      key: 'chest' | 'waist' | 'hip' | 'shoulder' | 'footLength' | 'height' | 'weight',
      userVal?: number
    ) => {
      if (userVal === undefined || userVal === null || isNaN(userVal)) return;

      const colId = colMap.get(key);
      const rawVal = colId ? row.values[colId] : undefined;
      if (!rawVal) return;

      const range = parseMeasurementRange(rawVal);
      if (!range) return;

      // Determine weight
      const configuredWeight = config.weights?.find((w) => w.measurement === key)?.weight || 'high';
      const weightMult = WEIGHT_MULTIPLIERS[configuredWeight] || 2.0;

      let score = 0;
      let status: 'exact' | 'close' | 'outside' = 'outside';

      if (userVal >= range.min && userVal <= range.max) {
        score = 100;
        status = 'exact';
      } else {
        // Distance penalty
        const diff = userVal < range.min ? range.min - userVal : userVal - range.max;
        const tolerance = Math.max(3, (range.max - range.min) || 3);
        const penalty = (diff / tolerance) * 35;
        score = Math.max(0, 100 - penalty);
        status = score >= 60 ? 'close' : 'outside';
      }

      totalScore += score * weightMult;
      totalWeight += weightMult;

      details.push({
        name: key,
        userValue: userVal,
        chartRange: rawVal,
        status,
      });
    };

    checkMeasurement('chest', user.chest);
    checkMeasurement('waist', user.waist);
    checkMeasurement('hip', user.hip);
    checkMeasurement('shoulder', user.shoulder);
    checkMeasurement('footLength', user.footLength);
    checkMeasurement('height', user.height);
    checkMeasurement('weight', user.weight);

    if (totalWeight > 0) {
      let finalScore = totalScore / totalWeight;

      // Adjust for user fit preference
      if (preference === 'slim') {
        // Slightly favor tighter fit
        finalScore += 2;
      } else if (preference === 'relaxed') {
        // Slightly favor looser fit
        finalScore += 2;
      }

      sizeScores.push({
        size: row.size,
        score: finalScore,
        details,
      });
    }
  }

  if (sizeScores.length === 0) {
    return null;
  }

  // Sort by score descending
  sizeScores.sort((a, b) => b.score - a.score);

  const best = sizeScores[0];
  const second = sizeScores[1];

  const isBetweenSizes = second !== undefined && Math.abs(best.score - second.score) <= 8 && second.score >= 65;

  let recommended = best.size;
  let alternative = isBetweenSizes ? second.size : undefined;

  // If between sizes and user prefers relaxed, pick the larger size if detectable
  if (isBetweenSizes && preference === 'relaxed') {
    // If second size appears later in the chart rows, it's larger
    const bestIndex = chart.rows.findIndex((r) => r.size === best.size);
    const secondIndex = chart.rows.findIndex((r) => r.size === second.size);
    if (secondIndex > bestIndex) {
      recommended = second.size;
      alternative = best.size;
    }
  }

  return {
    recommendedSize: recommended,
    confidence: Math.round(best.score),
    isBetweenSizes,
    alternativeSize: alternative,
    explanation: {
      matchingMeasurements: best.details,
      fitNote: isBetweenSizes
        ? `You are between sizes ${recommended} and ${alternative}.`
        : `Size ${recommended} is your closest match based on body measurements.`,
    },
  };
}

