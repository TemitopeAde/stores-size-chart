import { ChartAssignment, AssignmentFilter, AssignmentCondition } from '../types/assignments';
import { SizeChart, PaginatedResponse } from '../types/charts';
import { getSizeChartById, getSizeCharts } from './chart-service';
import { getStoreProduct } from './product-service';

let memoryAssignments: ChartAssignment[] = [
  {
    _id: 'assign-1',
    chartId: 'chart-mens-tops-default',
    assignmentType: 'category',
    categoryId: 'cat-mens',
    priority: 10,
    active: true,
    createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'assign-2',
    chartId: 'chart-womens-dresses-default',
    assignmentType: 'category',
    categoryId: 'cat-womens',
    priority: 10,
    active: true,
    createdDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'assign-3',
    chartId: 'chart-shoes-default',
    assignmentType: 'category',
    categoryId: 'cat-shoes',
    priority: 10,
    active: true,
    createdDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'assign-default',
    chartId: 'chart-mens-tops-default',
    assignmentType: 'default',
    priority: 0,
    active: true,
    createdDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

/**
 * Backend search, sort, and pagination for chart assignments.
 */
export async function getAssignments(filter: AssignmentFilter = {}): Promise<PaginatedResponse<ChartAssignment>> {
  const page = Math.max(1, filter.page || 1);
  const limit = Math.max(1, Math.min(100, filter.limit || 10));

  let results = [...memoryAssignments];

  // 1. Filter by Assignment Type
  if (filter.assignmentType && filter.assignmentType !== 'all') {
    results = results.filter((a) => a.assignmentType === filter.assignmentType);
  }

  // 2. Filter by Chart ID
  if (filter.chartId) {
    results = results.filter((a) => a.chartId === filter.chartId);
  }

  // 3. Filter by Active status
  if (filter.active !== undefined) {
    results = results.filter((a) => a.active === filter.active);
  }

  // 4. Backend Sort
  const sortBy = filter.sortBy || 'priority';
  const sortOrder = filter.sortOrder || 'desc';

  results.sort((a, b) => {
    let aVal = a[sortBy] ?? 0;
    let bVal = b[sortBy] ?? 0;
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const startIndex = (page - 1) * limit;
  const items = results.slice(startIndex, startIndex + limit);

  return {
    items,
    totalCount,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export async function createAssignment(payload: Partial<ChartAssignment>): Promise<ChartAssignment> {
  const now = new Date().toISOString();
  const newAssign: ChartAssignment = {
    _id: payload._id || `assign-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    chartId: payload.chartId || '',
    assignmentType: payload.assignmentType || 'product',
    productId: payload.productId,
    productIds: payload.productIds || (payload.productId ? [payload.productId] : []),
    categoryId: payload.categoryId,
    categoryIds: payload.categoryIds || (payload.categoryId ? [payload.categoryId] : []),
    conditions: payload.conditions || [],
    priority: payload.priority ?? 10,
    active: payload.active ?? true,
    createdDate: now,
    updatedDate: now,
  };

  memoryAssignments.unshift(newAssign);
  return newAssign;
}

export async function updateAssignment(id: string, updates: Partial<ChartAssignment>): Promise<ChartAssignment | null> {
  const index = memoryAssignments.findIndex((a) => a._id === id);
  if (index === -1) return null;

  const existing = memoryAssignments[index];
  const updated: ChartAssignment = {
    ...existing,
    ...updates,
    _id: id,
    updatedDate: new Date().toISOString(),
  };

  memoryAssignments[index] = updated;
  return updated;
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const initial = memoryAssignments.length;
  memoryAssignments = memoryAssignments.filter((a) => a._id !== id);
  return memoryAssignments.length < initial;
}

function evaluateCondition(cond: AssignmentCondition, product: any): boolean {
  let actualValue = '';
  if (cond.field === 'name') actualValue = (product.name || '').toLowerCase();
  else if (cond.field === 'sku') actualValue = (product.sku || '').toLowerCase();
  else if (cond.field === 'price') actualValue = String(product.price || '');
  else if (cond.field === 'category') {
    return (product.categoryIds || []).includes(cond.value);
  }

  const target = (cond.value || '').toLowerCase();

  switch (cond.operator) {
    case 'equals':
      return actualValue === target;
    case 'contains':
      return actualValue.includes(target);
    case 'startsWith':
      return actualValue.startsWith(target);
    case 'endsWith':
      return actualValue.endsWith(target);
    case 'greaterThan':
      return parseFloat(actualValue) > parseFloat(target);
    case 'lessThan':
      return parseFloat(actualValue) < parseFloat(target);
    default:
      return false;
  }
}

/**
 * Deterministically resolves the correct size chart for a given product ID.
 * Priority order:
 * 1. Product Assignment (highest)
 * 2. Advanced Rule Assignment
 * 3. Category Assignment
 * 4. Default Fallback Chart
 */
export async function resolveChartForProduct(productId: string): Promise<SizeChart | null> {
  const activeAssignments = memoryAssignments.filter((a) => a.active);

  // Fetch product info from Wix Stores
  const product = await getStoreProduct(productId);

  // Level 1: Product-specific assignment
  const productAssign = activeAssignments.find(
    (a) =>
      a.assignmentType === 'product' &&
      (a.productId === productId || (a.productIds && a.productIds.includes(productId)))
  );

  if (productAssign) {
    const chart = await getSizeChartById(productAssign.chartId);
    if (chart && chart.status === 'ACTIVE') return chart;
  }

  // Level 2: Advanced Rule assignment
  if (product) {
    const ruleAssignments = activeAssignments
      .filter((a) => a.assignmentType === 'rule' && a.conditions && a.conditions.length > 0)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of ruleAssignments) {
      const allMatch = rule.conditions!.every((c) => evaluateCondition(c, product));
      if (allMatch) {
        const chart = await getSizeChartById(rule.chartId);
        if (chart && chart.status === 'ACTIVE') return chart;
      }
    }
  }

  // Level 3: Category assignment
  if (product && product.categoryIds && product.categoryIds.length > 0) {
    const catAssignments = activeAssignments
      .filter((a) => a.assignmentType === 'category')
      .sort((a, b) => b.priority - a.priority);

    for (const catAssign of catAssignments) {
      const matches =
        (catAssign.categoryId && product.categoryIds.includes(catAssign.categoryId)) ||
        (catAssign.categoryIds && catAssign.categoryIds.some((cid) => product.categoryIds!.includes(cid)));

      if (matches) {
        const chart = await getSizeChartById(catAssign.chartId);
        if (chart && chart.status === 'ACTIVE') return chart;
      }
    }
  }

  // Level 4: Default fallback assignment
  const defaultAssign = activeAssignments.find((a) => a.assignmentType === 'default');
  if (defaultAssign) {
    const chart = await getSizeChartById(defaultAssign.chartId);
    if (chart && chart.status === 'ACTIVE') return chart;
  }

  // Fallback to first active chart if no explicit default
  const allCharts = await getSizeCharts({ status: 'ACTIVE', limit: 1 });
  return allCharts.items[0] || null;
}

