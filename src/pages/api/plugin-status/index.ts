import type { APIRoute } from 'astro';
import { checkSitePluginStatus, addSizeGuidePlugin } from '../../../services/plugin-status-service';

export const GET: APIRoute = async () => {
  try {
    const status = await checkSitePluginStatus();
    return new Response(JSON.stringify({ success: true, data: status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'PLUGIN_STATUS_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async () => {
  try {
    const result = await addSizeGuidePlugin();
    return new Response(JSON.stringify({ success: result.success, error: result.error }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'ADD_PLUGIN_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

