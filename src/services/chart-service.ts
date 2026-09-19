import { items } from '@wix/data';
import { SizeChart, SizeChartFilter, PaginatedResponse } from '../types/charts';
import { TEMPLATES, createChartFromTemplate } from '../lib/templates';

const COLLECTION_NAME = 'SizeCharts';

// In-memory store for fallback/dev/demo environments
let memoryCharts: SizeChart[] = [
  {
    _id: 'chart-mens-tops-default',
    name: "Men's Classic Tops & Shirts",
    description: "Standard fit for men's casual and formal shirts.",
    chartType: 'mens-tops',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-chest', name: 'Chest', presetKey: 'chest' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-shoulder', name: 'Shoulder', presetKey: 'shoulder' },
      { id: 'col-length', name: 'Length', presetKey: 'length' },
    ],
    rows: [
      { id: 'r1', size: 'XS', values: { 'col-chest': '81-86', 'col-waist': '66-71', 'col-shoulder': '42', 'col-length': '66' } },
      { id: 'r2', size: 'S', values: { 'col-chest': '86-91', 'col-waist': '71-76', 'col-shoulder': '44', 'col-length': '68' } },
      { id: 'r3', size: 'M', values: { 'col-chest': '91-97', 'col-waist': '76-81', 'col-shoulder': '46', 'col-length': '70' } },
      { id: 'r4', size: 'L', values: { 'col-chest': '97-102', 'col-waist': '81-86', 'col-shoulder': '48', 'col-length': '72' } },
      { id: 'r5', size: 'XL', values: { 'col-chest': '102-107', 'col-waist': '86-91', 'col-shoulder': '50', 'col-length': '74' } },
      { id: 'r6', size: '2XL', values: { 'col-chest': '107-112', 'col-waist': '91-97', 'col-shoulder': '52', 'col-length': '76' } },
    ],
    measurementGuide: [
      { id: 'm1', title: 'Chest', description: 'Measure around the fullest part of the chest, keeping the tape straight across the back.' },
      { id: 'm2', title: 'Waist', description: 'Measure around the natural waistline where trousers sit.' },
    ],
    fitFinderEnabled: true,
    fitFinderConfig: {
      enabled: true,
      askChest: true,
      askWaist: true,
      askHeight: true,
      askWeight: true,
      allowFitPreferences: true,
    },
    templateId: 'mens-tops',
    status: 'ACTIVE',
    createdDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'chart-womens-dresses-default',
    name: "Women's Dresses & Gowns",
    description: "Tailored fit guide for evening and summer dresses.",
    chartType: 'dresses',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-bust', name: 'Bust', presetKey: 'bust' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-hip', name: 'Hip', presetKey: 'hip' },
      { id: 'col-length', name: 'Total Length', presetKey: 'length' },
    ],
    rows: [
      { id: 'r1', size: 'S', values: { 'col-bust': '82-86', 'col-waist': '64-68', 'col-hip': '90-94', 'col-length': '110' } },
      { id: 'r2', size: 'M', values: { 'col-bust': '87-91', 'col-waist': '69-73', 'col-hip': '95-99', 'col-length': '112' } },
      { id: 'r3', size: 'L', values: { 'col-bust': '92-96', 'col-waist': '74-78', 'col-hip': '100-104', 'col-length': '114' } },
      { id: 'r4', size: 'XL', values: { 'col-bust': '97-101', 'col-waist': '79-83', 'col-hip': '105-109', 'col-length': '116' } },
    ],
    measurementGuide: [
      { id: 'm1', title: 'Bust', description: 'Measure around the fullest part of the bust.' },
      { id: 'm2', title: 'Waist', description: 'Measure around the narrowest part of the waist.' },
      { id: 'm3', title: 'Hips', description: 'Measure around the widest part of the hips.' },
    ],
    fitFinderEnabled: true,
    fitFinderConfig: {
      enabled: true,
      askChest: true,
      askWaist: true,
      askHip: true,
      allowFitPreferences: true,
    },
    templateId: 'dresses',
    status: 'ACTIVE',
    createdDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'chart-shoes-default',
    name: 'Unisex Footwear Conversion & Guide',
    description: 'International shoe sizing and foot length guide.',
    chartType: 'shoes',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-eu', name: 'EU Size', presetKey: 'eu', isSizeColumn: true },
      { id: 'col-us', name: 'US Size', presetKey: 'us' },
      { id: 'col-uk', name: 'UK Size', presetKey: 'uk' },
      { id: 'col-foot', name: 'Foot Length', presetKey: 'footLength' },
    ],
    rows: [
      { id: 'r1', size: '36', values: { 'col-us': '5.5', 'col-uk': '3.5', 'col-foot': '22.5' } },
      { id: 'r2', size: '37', values: { 'col-us': '6', 'col-uk': '4', 'col-foot': '23.0' } },
      { id: 'r3', size: '38', values: { 'col-us': '7', 'col-uk': '5', 'col-foot': '24.0' } },
      { id: 'r4', size: '39', values: { 'col-us': '7.5', 'col-uk': '5.5', 'col-foot': '24.5' } },
      { id: 'r5', size: '40', values: { 'col-us': '8.5', 'col-uk': '6.5', 'col-foot': '25.0' } },
      { id: 'r6', size: '41', values: { 'col-us': '9', 'col-uk': '7', 'col-foot': '26.0' } },
      { id: 'r7', size: '42', values: { 'col-us': '10', 'col-uk': '8', 'col-foot': '26.5' } },
      { id: 'r8', size: '43', values: { 'col-us': '10.5', 'col-uk': '8.5', 'col-foot': '27.5' } },
      { id: 'r9', size: '44', values: { 'col-us': '11.5', 'col-uk': '9.5', 'col-foot': '28.0' } },
    ],
    fitFinderEnabled: true,
    fitFinderConfig: {
      enabled: true,
      askFootLength: true,
    },
    templateId: 'shoes',
    status: 'ACTIVE',
    createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedDate: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

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

