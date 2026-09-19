import type { APIRoute } from 'astro';
import { resolveChartForProduct } from '../../../services/assignment-service';
import { getWidgetSettings } from '../../../services/widget-settings-service';
import { verifyStorefrontEntitlement } from '../../../services/entitlement-service';

export const GET: APIRoute = async ({ url }) => {
  try {
    const productId = url.searchParams.get('productId');
    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'PRODUCT_ID_REQUIRED' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mandatory Server-Side Entitlement Check
    const isEntitled = await verifyStorefrontEntitlement();
    if (!isEntitled) {
      // Quietly return null data when merchant is not entitled, avoiding breaking Product Page
      return new Response(
        JSON.stringify({ success: true, data: null, message: 'Unentitled store' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resolve matching chart deterministically: Product -> Rule -> Category -> Default
    const chart = await resolveChartForProduct(productId);
    const settings = await getWidgetSettings();

    if (!chart) {
      return new Response(
        JSON.stringify({ success: true, data: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chart,
          settings,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[API charts/product] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

