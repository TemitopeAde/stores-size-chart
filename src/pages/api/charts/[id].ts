import type { APIRoute } from 'astro';
import { getSizeChartById, updateSizeChart, deleteSizeChart, duplicateSizeChart } from '../../../services/chart-service';
import { SizeChartPayloadSchema } from '../../../lib/validation';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_ID' } }), { status: 400 });
  }

  const chart = await getSizeChartById(id);
  if (!chart) {
    return new Response(JSON.stringify({ success: false, error: { code: 'CHART_NOT_FOUND' } }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, data: chart }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_ID' } }), { status: 400 });
  }

  try {
    const body = await request.json();
    const validated = SizeChartPayloadSchema.partial().parse(body);
    const updated = await updateSizeChart(id, validated as any);

    if (!updated) {
      return new Response(JSON.stringify({ success: false, error: { code: 'CHART_NOT_FOUND' } }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: { code: 'CHART_UPDATE_ERROR', message: error.message } }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_ID' } }), { status: 400 });
  }

  const success = await deleteSizeChart(id);
  return new Response(JSON.stringify({ success }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ params, url }) => {
  const id = params.id;
  const action = url.searchParams.get('action');

  if (action === 'duplicate' && id) {
    const duplicated = await duplicateSizeChart(id);
    if (!duplicated) {
      return new Response(JSON.stringify({ success: false, error: { code: 'CHART_NOT_FOUND' } }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: duplicated }), { status: 201 });
  }

  return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_ACTION' } }), { status: 400 });
};

