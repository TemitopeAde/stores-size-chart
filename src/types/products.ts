export interface WixProductSummary {
  id: string;
  name: string;
  sku?: string;
  mainMediaUrl?: string;
  price?: string | number;
  formattedPrice?: string;
  currency?: string;
  visible?: boolean;
  categoryIds?: string[];
  options?: Array<{
    name: string;
    choices: Array<{ value: string; description?: string }>;
  }>;
  variants?: Array<{
    id: string;
    choices: Record<string, string>;
  }>;
}

export interface WixCategorySummary {
  id: string;
  name: string;
  numberOfProducts?: number;
}

export interface ProductCatalogFilter {
  search?: string;
  categoryId?: string;
  limit?: number;
  cursor?: string; // For V3 cursor pagination
  skip?: number; // For V1 offset pagination
}

export interface ProductCatalogResponse {
  products: WixProductSummary[];
  totalCount?: number;
  nextCursor?: string;
  hasNext: boolean;
}

