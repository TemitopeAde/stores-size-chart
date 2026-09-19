import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { AnalyticsSummary } from '../../types/analytics';
import { dashboardApi } from '../../api/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, Sparkles, CheckCircle2, TrendingUp, BarChart2, PieChart, Activity } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await dashboardApi.getAnalytics(days);
        setSummary(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [days]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Top Controls: Title & Date Range Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            {t('analytics.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t('analytics.subtitle')}</p>
        </div>

        <div className="inline-flex rounded-md border border-input p-0.5 bg-muted self-end sm:self-center">
          {[
            { label: t('analytics.dateFilter7d'), value: 7 },
            { label: t('analytics.dateFilter30d'), value: 30 },
            { label: t('analytics.dateFilter90d'), value: 90 },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDays(item.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${
                days === item.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('analytics.views')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{summary?.views ?? 0}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Eye className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('analytics.fitFinderStarts')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{summary?.fitFinderStarts ?? 0}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('analytics.fitFinderCompletions')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{summary?.fitFinderCompletions ?? 0}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('analytics.completionRate')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{summary?.completionRate ?? 0}%</h3>
            </div>
            <div className="p-2.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown & Top Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t('analytics.trends')}</CardTitle>
            <CardDescription>Daily breakdown of guide views and fit calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.dailyViews.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{item.date}</span>
                    <span className="text-muted-foreground">
                      {item.views} views &middot; {item.fitFinder} fit finder
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${Math.min(100, (item.views / 25) * 100)}%` }}
                    />
                    <div
                      className="bg-purple-500 h-full transition-all"
                      style={{ width: `${Math.min(100, (item.fitFinder / 25) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Size Charts by Views */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t('analytics.topCharts')}</CardTitle>
            <CardDescription>Most viewed size charts in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.topCharts.map((chart, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-muted-foreground font-bold">{idx + 1}.</span>
                    <span className="font-medium text-foreground text-xs">{chart.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {chart.views} views
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Sizes Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t('analytics.sizeDistribution')}</CardTitle>
            <CardDescription>Sizes most frequently recommended by Fit Finder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(summary?.sizeDistribution || {}).map(([size, count]) => (
                <div key={size} className="p-3.5 rounded-lg border border-border bg-card text-center">
                  <span className="text-xs text-muted-foreground block">Size</span>
                  <span className="text-lg font-bold text-primary block my-0.5">{size}</span>
                  <span className="text-xs font-medium text-foreground">{count} times</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t('analytics.unitPreference')}</CardTitle>
            <CardDescription>Shopper measurement unit toggles</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-around p-6">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-foreground block">{summary?.unitPreference.cm ?? 0}</span>
              <Badge variant="outline" className="mt-1 font-bold">CM (Metric)</Badge>
            </div>
            <div className="h-12 w-[1px] bg-border" />
            <div className="text-center">
              <span className="text-3xl font-extrabold text-foreground block">{summary?.unitPreference.in ?? 0}</span>
              <Badge variant="outline" className="mt-1 font-bold">IN (Imperial)</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

