import type { APIRoute } from 'astro';
import { getWidgetSettings, updateWidgetSettings } from '../../../services/widget-settings-service';

export const GET: APIRoute = async () => {
  try {
    const settings = await getWidgetSettings();
    return new Response(JSON.stringify({ success: true, data: settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'SETTINGS_FETCH_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const updated = await updateWidgetSettings(body);
    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'SETTINGS_UPDATE_ERROR', message: error.message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

