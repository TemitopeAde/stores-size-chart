import type { APIRoute } from 'astro';
import { queryStoreCategories } from '../../../services/product-service';

export const GET: APIRoute = async () => {
  try {
    const data = await queryStoreCategories();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'CATALOG_CATEGORIES_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

