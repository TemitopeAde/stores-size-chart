export type AnalyticsEventType =
  | 'SIZE_GUIDE_OPENED'
  | 'SIZE_GUIDE_CLOSED'
  | 'CHART_VIEWED'
  | 'UNIT_CHANGED'
  | 'FIT_FINDER_OPENED'
  | 'FIT_FINDER_STARTED'
  | 'FIT_FINDER_COMPLETED'
  | 'SIZE_RECOMMENDED';

export interface AnalyticsEvent {
  _id?: string;
  eventType: AnalyticsEventType;
  productId?: string;
  productName?: string;
  chartId?: string;
  chartName?: string;
  size?: string;
  unit?: 'cm' | 'in';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  views: number;
  fitFinderStarts: number;
  fitFinderCompletions: number;
  completionRate: number; // percentage (0 - 100)
  topProducts: Array<{ id: string; name: string; views: number }>;
  topCharts: Array<{ id: string; name: string; views: number }>;
  sizeDistribution: Record<string, number>;
  unitPreference: { cm: number; in: number };
  dailyViews: Array<{ date: string; views: number; fitFinder: number }>;
}

