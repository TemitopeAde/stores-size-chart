import type { APIRoute } from 'astro';
import { getAnalyticsSummary } from '../../../services/analytics-service';

export const GET: APIRoute = async ({ url }) => {
  try {
    const days = parseInt(url.searchParams.get('days') || '30', 10);
    const summary = await getAnalyticsSummary(days);

    return new Response(JSON.stringify({ success: true, data: summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'ANALYTICS_FETCH_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

