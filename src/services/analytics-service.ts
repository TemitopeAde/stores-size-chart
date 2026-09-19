import { AnalyticsEvent, AnalyticsSummary } from '../types/analytics';

let memoryEvents: AnalyticsEvent[] = [];

export async function recordAnalyticsEvent(event: Omit<AnalyticsEvent, '_id' | 'timestamp'>): Promise<void> {
  memoryEvents.push({
    ...event,
    _id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  });
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const cutoff = new Date(Date.now() - days * 86400000);
  const relevant = memoryEvents.filter((e) => new Date(e.timestamp) >= cutoff);

  let views = 0;
  let fitFinderStarts = 0;
  let fitFinderCompletions = 0;
  const productViewsMap: Record<string, { name: string; count: number }> = {};
  const chartViewsMap: Record<string, { name: string; count: number }> = {};
  const sizeDistribution: Record<string, number> = {};
  let cmCount = 0;
  let inCount = 0;

  // Build a lookup for daily views
  const dailyMap: Record<string, { views: number; fitFinder: number }> = {};
  for (let i = Math.min(days, 7) - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyMap[dateStr] = { views: 0, fitFinder: 0 };
  }

  relevant.forEach((e) => {
    const dStr = new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (e.eventType === 'SIZE_GUIDE_OPENED' || e.eventType === 'CHART_VIEWED') {
      views++;
      if (dailyMap[dStr]) dailyMap[dStr].views++;
      if (e.productId) {
        if (!productViewsMap[e.productId]) {
          productViewsMap[e.productId] = { name: e.productName || e.productId, count: 0 };
        }
        productViewsMap[e.productId].count++;
      }
      if (e.chartId) {
        if (!chartViewsMap[e.chartId]) {
          chartViewsMap[e.chartId] = { name: e.chartName || e.chartId, count: 0 };
        }
        chartViewsMap[e.chartId].count++;
      }
    } else if (e.eventType === 'FIT_FINDER_STARTED') {
      fitFinderStarts++;
      if (dailyMap[dStr]) dailyMap[dStr].fitFinder++;
    } else if (e.eventType === 'FIT_FINDER_COMPLETED') {
      fitFinderCompletions++;
      if (e.size) {
        sizeDistribution[e.size] = (sizeDistribution[e.size] || 0) + 1;
      }
    } else if (e.eventType === 'UNIT_CHANGED') {
      if (e.unit === 'cm') cmCount++;
      else if (e.unit === 'in') inCount++;
    }
  });

  const completionRate = fitFinderStarts > 0 ? Math.round((fitFinderCompletions / fitFinderStarts) * 100) : 0;

  const topProducts = Object.entries(productViewsMap)
    .map(([id, data]) => ({ id, name: data.name, views: data.count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const topCharts = Object.entries(chartViewsMap)
    .map(([id, data]) => ({ id, name: data.name, views: data.count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const dailyViews = Object.entries(dailyMap).map(([date, counts]) => ({
    date,
    views: counts.views,
    fitFinder: counts.fitFinder,
  }));

  return {
    views,
    fitFinderStarts,
    fitFinderCompletions,
    completionRate,
    topProducts,
    topCharts,
    sizeDistribution,
    unitPreference: { cm: cmCount, in: inCount },
    dailyViews,
  };
}

