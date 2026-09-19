import type { APIRoute } from 'astro';
import { getAppEntitlement } from '../../../services/entitlement-service';

export const GET: APIRoute = async () => {
  try {
    const entitlement = await getAppEntitlement();
    return new Response(JSON.stringify({ success: true, data: entitlement }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'ENTITLEMENT_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

