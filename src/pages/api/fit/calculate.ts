import type { APIRoute } from 'astro';
import { CalculateFitRequestSchema } from '../../../lib/validation';
import { getSizeChartById } from '../../../services/chart-service';
import { getWidgetSettings } from '../../../services/widget-settings-service';
import { calculateAIFitRecommendation } from '../../../services/deepseek-service';
import { calculateFitRecommendation, type FitRecommendationResult } from '../../../lib/fit-scoring';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = CalculateFitRequestSchema.parse(body);

    const chart = await getSizeChartById(validated.chartId);
    if (!chart) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'CHART_NOT_FOUND' } }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const widgetSettings = await getWidgetSettings().catch(() => null);

    // Check if AI is enabled for this chart or globally
    const isAiEnabled =
      validated.useAi !== false &&
      (chart.fitFinderConfig?.aiEnabled !== false || widgetSettings?.fitFinderSettings?.aiEnabled !== false);

    const deepseekApiKey =
      chart.fitFinderConfig?.deepseekApiKey ||
      widgetSettings?.fitFinderSettings?.deepseekApiKey ||
      (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.DEEPSEEK_API_KEY) ||
      (import.meta as any).env?.DEEPSEEK_API_KEY;

    const aiModel =
      chart.fitFinderConfig?.aiModel ||
      widgetSettings?.fitFinderSettings?.aiModel ||
      'deepseek-chat';

    const customInstructions =
      chart.fitFinderConfig?.aiCustomInstructions ||
      widgetSettings?.fitFinderSettings?.aiCustomInstructions;

    const userMeasurements = {
      height: validated.height,
      weight: validated.weight,
      chest: validated.chest,
      waist: validated.waist,
      hip: validated.hip,
      shoulder: validated.shoulder,
      footLength: validated.footLength,
      age: validated.age,
      preference: validated.preference,
    };

    let recommendation: FitRecommendationResult | null = null;

    if (isAiEnabled && deepseekApiKey) {
      recommendation = await calculateAIFitRecommendation(chart, userMeasurements, validated.unit, {
        apiKey: deepseekApiKey,
        model: aiModel,
        customInstructions,
      });
    } else {
      recommendation = calculateFitRecommendation(chart, userMeasurements, validated.unit);
    }

    if (!recommendation) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'NO_RECOMMENDATION', message: 'Unable to calculate recommendation from measurements.' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: recommendation }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'CALCULATION_ERROR', message: error.message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
