import type { APIRoute } from 'astro';
import { getSizeCharts, createSizeChart } from '../../../services/chart-service';
import { SizeChartPayloadSchema } from '../../../lib/validation';

export const GET: APIRoute = async ({ url }) => {
  try {
    const search = url.searchParams.get('search') || undefined;
    const chartType = url.searchParams.get('chartType') || undefined;
    const status = (url.searchParams.get('status') as any) || undefined;
    const sortBy = (url.searchParams.get('sortBy') as any) || undefined;
    const sortOrder = (url.searchParams.get('sortOrder') as any) || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const result = await getSizeCharts({
      search,
      chartType,
      status,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'CHARTS_FETCH_ERROR', message: error.message },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = SizeChartPayloadSchema.parse(body);
    const created = await createSizeChart(validated as any);

    return new Response(JSON.stringify({ success: true, data: created }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'CHART_CREATE_ERROR', message: error.message },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

