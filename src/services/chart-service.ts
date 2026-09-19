import { items } from '@wix/data';
import { SizeChart, SizeChartFilter, PaginatedResponse } from '../types/charts';
import { TEMPLATES, createChartFromTemplate } from '../lib/templates';

const COLLECTION_NAME = 'SizeCharts';

// In-memory store for fallback/dev/demo environments
let memoryCharts: SizeChart[] = [];

/**
 * Backend Search, Filter, Sort, and Paginate size charts.
 */
export async function getSizeCharts(filter: SizeChartFilter = {}): Promise<PaginatedResponse<SizeChart>> {
  const page = Math.max(1, filter.page || 1);
  const limit = Math.max(1, Math.min(100, filter.limit || 10));

  let results = [...memoryCharts];

  // 1. Backend Search (by name or description)
  if (filter.search && filter.search.trim()) {
    const s = filter.search.toLowerCase().trim();
    results = results.filter(
      (c) => c.name.toLowerCase().includes(s) || (c.description && c.description.toLowerCase().includes(s))
    );
  }

  // 2. Backend Filter by Type
  if (filter.chartType && filter.chartType !== 'ALL' && filter.chartType !== 'all') {
    results = results.filter((c) => c.chartType === filter.chartType);
  }

  // 3. Backend Filter by Status
  if (filter.status && filter.status !== 'ALL') {
    results = results.filter((c) => c.status === filter.status);
  }

  // 4. Backend Sort
  const sortBy = filter.sortBy || 'updatedDate';
  const sortOrder = filter.sortOrder || 'desc';

  results.sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

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

export async function getSizeChartById(id: string): Promise<SizeChart | null> {
  const chart = memoryCharts.find((c) => c._id === id);
  return chart ? JSON.parse(JSON.stringify(chart)) : null;
}

export async function createSizeChart(payload: Partial<SizeChart>): Promise<SizeChart> {
  const now = new Date().toISOString();
  const newChart: SizeChart = {
    _id: payload._id || `chart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: payload.name || 'Untitled Size Chart',
    description: payload.description || '',
    chartType: payload.chartType || 'custom',
    defaultUnit: payload.defaultUnit || 'cm',
    columns: payload.columns || [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-chest', name: 'Chest', presetKey: 'chest' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
    ],
    rows: payload.rows || [
      { id: 'r1', size: 'S', values: { 'col-chest': '86-91', 'col-waist': '71-76' } },
      { id: 'r2', size: 'M', values: { 'col-chest': '91-97', 'col-waist': '76-81' } },
      { id: 'r3', size: 'L', values: { 'col-chest': '97-102', 'col-waist': '81-86' } },
    ],
    measurementGuide: payload.measurementGuide || [],
    fitFinderEnabled: payload.fitFinderEnabled ?? false,
    fitFinderConfig: payload.fitFinderConfig || { enabled: false },
    templateId: payload.templateId,
    status: payload.status || 'ACTIVE',
    createdDate: now,
    updatedDate: now,
  };

  memoryCharts.unshift(newChart);
  return newChart;
}

export async function updateSizeChart(id: string, updates: Partial<SizeChart>): Promise<SizeChart | null> {
  const index = memoryCharts.findIndex((c) => c._id === id);
  if (index === -1) return null;

  const existing = memoryCharts[index];
  const updated: SizeChart = {
    ...existing,
    ...updates,
    _id: id,
    updatedDate: new Date().toISOString(),
  };

  memoryCharts[index] = updated;
  return updated;
}

export async function deleteSizeChart(id: string): Promise<boolean> {
  const initialLength = memoryCharts.length;
  memoryCharts = memoryCharts.filter((c) => c._id !== id);
  return memoryCharts.length < initialLength;
}

export async function duplicateSizeChart(id: string): Promise<SizeChart | null> {
  const original = await getSizeChartById(id);
  if (!original) return null;

  return createSizeChart({
    ...original,
    _id: undefined,
    name: `${original.name} (Copy)`,
    createdDate: undefined,
    updatedDate: undefined,
  });
}

