import { httpClient } from '@wix/essentials';
import { SizeChart, SizeChartFilter, PaginatedResponse } from '../types/charts';
import { ChartAssignment, AssignmentFilter } from '../types/assignments';
import { WidgetSettings } from '../types/settings';
import { EntitlementInfo } from '../types/billing';
import { AnalyticsSummary } from '../types/analytics';
import { ProductCatalogResponse, WixCategorySummary } from '../types/products';
import { PluginStatusResult } from '../services/plugin-status-service';

/**
 * Perform authenticated request using Wix httpClient.fetchWithAuth with fallback to standard fetch.
 */
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    if (typeof httpClient !== 'undefined' && typeof httpClient.fetchWithAuth === 'function') {
      return await httpClient.fetchWithAuth(url, options);
    }
  } catch (err) {
    console.warn('[dashboard-client] httpClient.fetchWithAuth fallback to fetch:', err);
  }
  return await fetch(url, options);
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await authenticatedFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || `Request to ${url} failed with status ${res.status}`);
  }

  return body.data as T;
}

export const dashboardApi = {
  // Size Charts
  async getCharts(filter: SizeChartFilter = {}): Promise<PaginatedResponse<SizeChart>> {
    const params = new URLSearchParams();
    if (filter.search) params.set('search', filter.search);
    if (filter.chartType) params.set('chartType', filter.chartType);
    if (filter.status) params.set('status', filter.status);
    if (filter.sortBy) params.set('sortBy', filter.sortBy);
    if (filter.sortOrder) params.set('sortOrder', filter.sortOrder);
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));

    return apiRequest<PaginatedResponse<SizeChart>>(`/api/charts?${params.toString()}`);
  },

  async getChartById(id: string): Promise<SizeChart> {
    return apiRequest<SizeChart>(`/api/charts/${id}`);
  },

  async createChart(chart: Partial<SizeChart>): Promise<SizeChart> {
    return apiRequest<SizeChart>('/api/charts', {
      method: 'POST',
      body: JSON.stringify(chart),
    });
  },

  async updateChart(id: string, updates: Partial<SizeChart>): Promise<SizeChart> {
    return apiRequest<SizeChart>(`/api/charts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteChart(id: string): Promise<boolean> {
    const res = await authenticatedFetch(`/api/charts/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async duplicateChart(id: string): Promise<SizeChart> {
    return apiRequest<SizeChart>(`/api/charts/${id}?action=duplicate`, {
      method: 'POST',
    });
  },

  // Assignments
  async getAssignments(filter: AssignmentFilter = {}): Promise<PaginatedResponse<ChartAssignment>> {
    const params = new URLSearchParams();
    if (filter.assignmentType) params.set('assignmentType', filter.assignmentType);
    if (filter.chartId) params.set('chartId', filter.chartId);
    if (filter.sortBy) params.set('sortBy', filter.sortBy);
    if (filter.sortOrder) params.set('sortOrder', filter.sortOrder);
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));

    return apiRequest<PaginatedResponse<ChartAssignment>>(`/api/assignments?${params.toString()}`);
  },

  async createAssignment(assignment: Partial<ChartAssignment>): Promise<ChartAssignment> {
    return apiRequest<ChartAssignment>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  },

  async updateAssignment(id: string, updates: Partial<ChartAssignment>): Promise<ChartAssignment> {
    return apiRequest<ChartAssignment>(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteAssignment(id: string): Promise<boolean> {
    const res = await authenticatedFetch(`/api/assignments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Catalog
  async getProducts(params: { search?: string; categoryId?: string; limit?: number; cursor?: string; skip?: number } = {}): Promise<ProductCatalogResponse> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.cursor) query.set('cursor', params.cursor);
    if (params.skip) query.set('skip', String(params.skip));

    return apiRequest<ProductCatalogResponse>(`/api/catalog/products?${query.toString()}`);
  },

  async getCategories(): Promise<WixCategorySummary[]> {
    return apiRequest<WixCategorySummary[]>('/api/catalog/categories');
  },

  // Widget Settings
  async getWidgetSettings(): Promise<WidgetSettings> {
    return apiRequest<WidgetSettings>('/api/settings/widget');
  },

  async updateWidgetSettings(settings: Partial<WidgetSettings>): Promise<WidgetSettings> {
    return apiRequest<WidgetSettings>('/api/settings/widget', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Plugin Status
  async getPluginStatus(): Promise<PluginStatusResult> {
    return apiRequest<PluginStatusResult>('/api/plugin-status');
  },

  async addPlugin(): Promise<boolean> {
    const res = await authenticatedFetch('/api/plugin-status', { method: 'POST' });
    const data = await res.json();
    return data.success;
  },

  // Analytics
  async getAnalytics(days = 30): Promise<AnalyticsSummary> {
    return apiRequest<AnalyticsSummary>(`/api/analytics/summary?days=${days}`);
  },

  // Billing
  async getEntitlement(): Promise<EntitlementInfo> {
    return apiRequest<EntitlementInfo>('/api/billing/entitlement');
  },
};

export const getWidgetSettings = dashboardApi.getWidgetSettings;
export const updateWidgetSettings = dashboardApi.updateWidgetSettings;
export const getCharts = dashboardApi.getCharts;
export const getChartById = dashboardApi.getChartById;
export const createChart = dashboardApi.createChart;
export const updateChart = dashboardApi.updateChart;
export const deleteChart = dashboardApi.deleteChart;
export const duplicateChart = dashboardApi.duplicateChart;
export const getAssignments = dashboardApi.getAssignments;
export const createAssignment = dashboardApi.createAssignment;
export const updateAssignment = dashboardApi.updateAssignment;
export const deleteAssignment = dashboardApi.deleteAssignment;
export const getProducts = dashboardApi.getProducts;
export const getCategories = dashboardApi.getCategories;
export const getPluginStatus = dashboardApi.getPluginStatus;
export const addPlugin = dashboardApi.addPlugin;
export const getAnalytics = dashboardApi.getAnalytics;
export const getEntitlement = dashboardApi.getEntitlement;
