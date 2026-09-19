import type { APIRoute } from 'astro';
import { TrackAnalyticsEventSchema } from '../../../lib/validation';
import { recordAnalyticsEvent } from '../../../services/analytics-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = TrackAnalyticsEventSchema.parse(body);
    await recordAnalyticsEvent(validated as any);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'ANALYTICS_ERROR', message: error.message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

