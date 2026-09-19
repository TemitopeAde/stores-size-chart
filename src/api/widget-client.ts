import { SizeChart } from '../types/charts';
import { WidgetSettings } from '../types/settings';
import { FitRecommendationResult, UserMeasurements } from '../lib/fit-scoring';
import { AnalyticsEventType } from '../types/analytics';

/**
 * Executes an authenticated fetch request from the storefront site plugin.
 */
async function fetchAppEndpoint<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      console.warn(`[WidgetClient] Request to ${endpoint} returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error(`[WidgetClient] Network error fetching ${endpoint}:`, err);
    return null;
  }
}

export async function getProductChart(productId: string): Promise<{ chart: SizeChart; settings: WidgetSettings } | null> {
  return fetchAppEndpoint<{ chart: SizeChart; settings: WidgetSettings }>(
    `/api/charts/product?productId=${encodeURIComponent(productId)}`
  );
}

export async function calculateFit(
  chartId: string,
  measurements: UserMeasurements,
  unit: 'cm' | 'in' = 'cm'
): Promise<FitRecommendationResult | null> {
  return fetchAppEndpoint<FitRecommendationResult>('/api/fit/calculate', {
    method: 'POST',
    body: JSON.stringify({
      chartId,
      ...measurements,
      unit,
    }),
  });
}

export async function trackEvent(
  eventType: AnalyticsEventType,
  payload: {
    productId?: string;
    chartId?: string;
    size?: string;
    unit?: 'cm' | 'in';
    metadata?: Record<string, any>;
  } = {}
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        ...payload,
      }),
    });
  } catch {}
}

