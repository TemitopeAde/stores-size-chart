import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { PluginStatus } from '../plugin-status/PluginStatus';
import { dashboardApi } from '../../api/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  FileSpreadsheet,
  Layers,
  Palette,
  Sparkles,
  Eye,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Package,
} from 'lucide-react';

export interface OverviewViewProps {
  onNavigate: (tab: string) => void;
  onCreateChart: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onCreateChart }) => {
  const { t } = useTranslation();

  const [chartsCount, setChartsCount] = useState(3);
  const [activeCount, setActiveCount] = useState(3);
  const [analytics, setAnalytics] = useState<any>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    async function load() {
      try {
        const [chartsRes, anRes] = await Promise.all([
          dashboardApi.getCharts({ limit: 1 }),
          dashboardApi.getAnalytics(30),
        ]);
        setChartsCount(chartsRes.totalCount);
        setActiveCount(chartsRes.totalCount);
        setAnalytics(anRes);
      } catch (e) {}
    }
    load();
  }, []);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const steps = [
    { num: 1, titleKey: 'onboarding.step1Title', descKey: 'onboarding.step1Desc', action: onCreateChart },
    { num: 2, titleKey: 'onboarding.step2Title', descKey: 'onboarding.step2Desc', action: () => onNavigate('assignments') },
    { num: 3, titleKey: 'onboarding.step3Title', descKey: 'onboarding.step3Desc', action: () => onNavigate('settings-widget') },
    { num: 4, titleKey: 'onboarding.step4Title', descKey: 'onboarding.step4Desc', action: () => {} },
    { num: 5, titleKey: 'onboarding.step5Title', descKey: 'onboarding.step5Desc', action: () => onNavigate('settings-widget') },
    { num: 6, titleKey: 'onboarding.step6Title', descKey: 'onboarding.step6Desc', action: () => onNavigate('fitFinder') },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Realtime Plugin Status Banner */}
      <PluginStatus />

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('overview.kpis.totalCharts')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{chartsCount}</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('overview.kpis.productsWithCharts')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">28</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('overview.kpis.sizeGuideViews')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{analytics?.views ?? 38}</h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Eye className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('overview.kpis.completionRate')}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{analytics?.completionRate ?? 85}%</h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Shortcut Cards */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('overview.quickActions')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={onCreateChart}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{t('overview.createChart')}</p>
                <p className="text-[11px] text-muted-foreground">Add new table or template</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => onNavigate('assignments')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{t('overview.assignCharts')}</p>
                <p className="text-[11px] text-muted-foreground">Products, categories, rules</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => onNavigate('settings-widget')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{t('overview.customizeWidget')}</p>
                <p className="text-[11px] text-muted-foreground">Button, colors, modal styling</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => onNavigate('fitFinder')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{t('overview.configureFitFinder')}</p>
                <p className="text-[11px] text-muted-foreground">Fit preferences & weighting</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Onboarding Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">{t('onboarding.title')}</CardTitle>
              <CardDescription>{t('onboarding.subtitle')}</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {completedSteps.length} of 6 Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {steps.map((s) => {
            const isDone = completedSteps.includes(s.num);
            return (
              <div key={s.num} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleStep(s.num)}
                    className="mt-0.5 text-muted-foreground hover:text-foreground"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {t(s.titleKey)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(s.descKey)}</p>
                  </div>
                </div>

                <Button size="sm" variant="ghost" onClick={s.action} className="h-8 gap-1 text-xs shrink-0">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

