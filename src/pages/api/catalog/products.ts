import type { APIRoute } from 'astro';
import { queryStoreProducts } from '../../../services/product-service';

export const GET: APIRoute = async ({ url }) => {
  try {
    const search = url.searchParams.get('search') || undefined;
    const categoryId = url.searchParams.get('categoryId') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const cursor = url.searchParams.get('cursor') || undefined;
    const skip = url.searchParams.get('skip') ? parseInt(url.searchParams.get('skip')!, 10) : undefined;

    const data = await queryStoreProducts({
      search,
      categoryId,
      limit,
      cursor,
      skip,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'CATALOG_PRODUCTS_ERROR', message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

