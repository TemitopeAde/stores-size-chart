import { catalogVersioning, products, productsV3, collections } from '@wix/stores';
import { WixProductSummary, WixCategorySummary, ProductCatalogFilter, ProductCatalogResponse } from '../types/products';

export type CatalogVersion = 'V1_CATALOG' | 'V3_CATALOG' | 'STORES_NOT_INSTALLED';
let cachedVersion: CatalogVersion | undefined;

export async function getCatalogVersion(): Promise<CatalogVersion> {
  if (cachedVersion) return cachedVersion;
  try {
    const res = await catalogVersioning.getCatalogVersion();
    cachedVersion = (res.catalogVersion as CatalogVersion) || 'V3_CATALOG';
    return cachedVersion;
  } catch (err) {
    console.warn('[ProductService] getCatalogVersion fallback to V3:', err);
    return 'V3_CATALOG';
  }
}

/**
 * Backend query for products supporting both Wix Stores V1 and V3 with search and pagination.
 */
export async function queryStoreProducts(filter: ProductCatalogFilter = {}): Promise<ProductCatalogResponse> {
  const version = await getCatalogVersion();
  const limit = filter.limit || 20;

  if (version === 'STORES_NOT_INSTALLED') {
    return { products: [], hasNext: false };
  }

  try {
    if (version === 'V3_CATALOG') {
      // V3 Catalog implementation
      let query: any = productsV3.queryProducts().limit(limit);

      if (filter.search && filter.search.trim()) {
        query = query.startsWith('name', filter.search.trim());
      }

      if (filter.cursor) {
        query = query.skipTo(filter.cursor);
      }

      const result = await query.find();

      const items: WixProductSummary[] = (result.items || []).map((p: any) => ({
        id: p._id || p.id,
        name: p.name || 'Untitled Product',
        sku: p.variantsInfo?.variants?.[0]?.sku || p.sku || undefined,
        mainMediaUrl: p.media?.main?.image || p.media?.main?.url || p.media?.mainMedia?.image?.url || undefined,
        price: p.variantsInfo?.variants?.[0]?.price?.actualPrice?.amount || '0',
        currency: p.currency || 'USD',
        visible: p.visible !== false,
        categoryIds: (p.directCategoriesInfo?.categories || p.directCategories || []).map((c: any) => c.id || c._id) || [],
        options: p.options?.map((opt: any) => ({
          name: opt.name,
          choices: opt.choices?.map((c: any) => ({ value: c.value, description: c.description })) || [],
        })) || [],
      }));

      return {
        products: items,
        nextCursor: result.cursors?.next || undefined,
        hasNext: typeof result.hasNext === 'function' ? result.hasNext() : false,
      };
    } else {
      // V1 Catalog implementation
      let query: any = products.queryProducts().limit(limit);

      if (filter.search && filter.search.trim()) {
        query = query.startsWith('name', filter.search.trim());
      }

      if (filter.skip) {
        query = query.skip(filter.skip);
      }

      const result = await query.find();

      const items: WixProductSummary[] = (result.items || []).map((p: any) => ({
        id: p._id || p.id,
        name: p.name || 'Untitled Product',
        sku: p.sku || undefined,
        mainMediaUrl: p.media?.mainMedia?.image?.url || undefined,
        price: p.priceData?.price || p.price || 0,
        formattedPrice: p.priceData?.formatted?.price || undefined,
        currency: p.priceData?.currency || 'USD',
        visible: p.visible !== false,
        categoryIds: p.collectionIds || [],
        options: p.productOptions?.map((opt: any) => ({
          name: opt.name,
          choices: opt.choices?.map((c: any) => ({ value: c.value, description: c.description })) || [],
        })) || [],
      }));

      return {
        products: items,
        totalCount: result.totalCount || items.length,
        hasNext: typeof result.hasNext === 'function' ? result.hasNext() : false,
      };
    }
  } catch (error) {
    console.error('[ProductService] Error querying products:', error);
    return getMockProducts(filter);
  }
}

/**
 * Backend query for store categories/collections supporting both V1 and V3.
 */
export async function queryStoreCategories(): Promise<WixCategorySummary[]> {
  const version = await getCatalogVersion();

  if (version === 'STORES_NOT_INSTALLED') {
    return [];
  }

  try {
    const result = await collections.queryCollections().find();
    return (result.items || []).map((c: any) => ({
      id: c._id || c.id,
      name: c.name || 'Unnamed Collection',
      numberOfProducts: c.numberOfProducts || 0,
    }));
  } catch (error) {
    console.error('[ProductService] Error querying categories:', error);
    return getMockCategories();
  }
}

/**
 * Retrieve single product with options, choices and variants for chart matching.
 */
export async function getStoreProduct(productId: string): Promise<WixProductSummary | null> {
  const version = await getCatalogVersion();

  try {
    if (version === 'V3_CATALOG') {
      const p: any = await productsV3.getProduct(productId);
      if (!p) return null;
      return {
        id: p._id || productId,
        name: p.name || '',
        sku: p.variantsInfo?.variants?.[0]?.sku || undefined,
        mainMediaUrl: p.media?.main?.image || p.media?.main?.url || undefined,
        price: p.variantsInfo?.variants?.[0]?.price?.actualPrice?.amount || '0',
        currency: p.currency || 'USD',
        visible: p.visible !== false,
        categoryIds: (p.directCategoriesInfo?.categories || p.directCategories || []).map((c: any) => c.id || c._id) || [],
        options: p.options?.map((opt: any) => ({
          name: opt.name,
          choices: opt.choices?.map((c: any) => ({ value: c.value, description: c.description })) || [],
        })) || [],
      };
    } else {
      const res: any = await products.getProduct(productId);
      const p = res?.product || res;
      if (!p) return null;
      return {
        id: p._id || productId,
        name: p.name || '',
        sku: p.sku || undefined,
        mainMediaUrl: p.media?.mainMedia?.image?.url || undefined,
        price: p.priceData?.price || 0,
        formattedPrice: p.priceData?.formatted?.price || undefined,
        currency: p.priceData?.currency || 'USD',
        visible: p.visible !== false,
        categoryIds: p.collectionIds || [],
        options: p.productOptions?.map((opt: any) => ({
          name: opt.name,
          choices: opt.choices?.map((c: any) => ({ value: c.value, description: c.description })) || [],
        })) || [],
      };
    }
  } catch (error) {
    console.error(`[ProductService] Error getting product ${productId}:`, error);
    return null;
  }
}

// Development and test fallback data
function getMockProducts(filter: ProductCatalogFilter): ProductCatalogResponse {
  const allMock = [
    {
      id: 'prod-shirt-001',
      name: 'Classic Oxford Cotton Shirt',
      sku: 'OXF-001-BLU',
      mainMediaUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      price: 49.99,
      formattedPrice: '$49.99',
      currency: 'USD',
      visible: true,
      categoryIds: ['cat-men-tops'],
      options: [
        {
          name: 'Size',
          choices: [
            { value: 'S', description: 'Small' },
            { value: 'M', description: 'Medium' },
            { value: 'L', description: 'Large' },
            { value: 'XL', description: 'Extra Large' },
          ],
        },
        {
          name: 'Color',
          choices: [
            { value: 'Blue', description: 'Light Blue' },
            { value: 'White', description: 'Crisp White' },
          ],
        },
      ],
    },
    {
      id: 'prod-dress-002',
      name: 'Floral Summer Maxi Dress',
      sku: 'DRS-002-FLR',
      mainMediaUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
      price: 79.0,
      formattedPrice: '$79.00',
      currency: 'USD',
      visible: true,
      categoryIds: ['cat-women-dresses'],
      options: [
        {
          name: 'Size',
          choices: [
            { value: 'XS', description: 'Extra Small (US 0-2)' },
            { value: 'S', description: 'Small (US 4-6)' },
            { value: 'M', description: 'Medium (US 8-10)' },
            { value: 'L', description: 'Large (US 12-14)' },
          ],
        },
      ],
    },
    {
      id: 'prod-jean-003',
      name: 'Slim Fit Denim Jeans',
      sku: 'JNS-003-DNM',
      mainMediaUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      price: 65.0,
      formattedPrice: '$65.00',
      currency: 'USD',
      visible: true,
      categoryIds: ['cat-men-bottoms'],
      options: [
        {
          name: 'Waist Size',
          choices: [
            { value: '30', description: '30 inches' },
            { value: '32', description: '32 inches' },
            { value: '34', description: '34 inches' },
            { value: '36', description: '36 inches' },
          ],
        },
      ],
    },
  ];

  let filtered = allMock;
  if (filter.search) {
    const s = filter.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(s) || (p.sku && p.sku.toLowerCase().includes(s)));
  }

  return {
    products: filtered,
    totalCount: filtered.length,
    hasNext: false,
  };
}

function getMockCategories(): WixCategorySummary[] {
  return [
    { id: 'cat-men-tops', name: "Men's Tops & Shirts", numberOfProducts: 14 },
    { id: 'cat-men-bottoms', name: "Men's Pants & Jeans", numberOfProducts: 9 },
    { id: 'cat-women-dresses', name: "Women's Dresses", numberOfProducts: 22 },
    { id: 'cat-women-tops', name: "Women's Tops & Blouses", numberOfProducts: 18 },
    { id: 'cat-shoes', name: 'Footwear & Shoes', numberOfProducts: 12 },
  ];
}

