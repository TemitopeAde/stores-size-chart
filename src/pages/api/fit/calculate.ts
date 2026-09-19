import type { APIRoute } from 'astro';
import { CalculateFitRequestSchema } from '../../../lib/validation';
import { getSizeChartById } from '../../../services/chart-service';
import { calculateFitRecommendation } from '../../../lib/fit-scoring';

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

    const recommendation = calculateFitRecommendation(chart, {
      height: validated.height,
      weight: validated.weight,
      chest: validated.chest,
      waist: validated.waist,
      hip: validated.hip,
      shoulder: validated.shoulder,
      footLength: validated.footLength,
      age: validated.age,
      preference: validated.preference,
    }, validated.unit);

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

