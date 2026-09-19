import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { SizeChart } from '../../types/charts';
import { dashboardApi } from '../../api/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Sparkles, Sliders, Save, Bot, Play } from 'lucide-react';
import { toast } from 'sonner';
import { TestFitFinderDialog } from './TestFitFinderDialog';

export const FitFinderConfigurator: React.FC = () => {
  const { t } = useTranslation();

  const [charts, setCharts] = useState<SizeChart[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // Configuration state
  const [enabled, setEnabled] = useState(true);
  const [askHeight, setAskHeight] = useState(true);
  const [askWeight, setAskWeight] = useState(true);
  const [askChest, setAskChest] = useState(true);
  const [askWaist, setAskWaist] = useState(true);
  const [askHip, setAskHip] = useState(true);
  const [askShoulder, setAskShoulder] = useState(false);
  const [askFootLength, setAskFootLength] = useState(false);
  const [allowFitPreferences, setAllowFitPreferences] = useState(true);

  // Measurement Weights
  const [chestWeight, setChestWeight] = useState<'high' | 'medium' | 'low'>('high');
  const [waistWeight, setWaistWeight] = useState<'high' | 'medium' | 'low'>('high');
  const [heightWeight, setHeightWeight] = useState<'high' | 'medium' | 'low'>('medium');
  const [weightWeight, setWeightWeight] = useState<'high' | 'medium' | 'low'>('low');

  // AI Configuration state
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiCustomInstructions, setAiCustomInstructions] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await dashboardApi.getCharts({ limit: 50 });
        setCharts(res.items);
        if (res.items.length > 0) {
          const first = res.items[0];
          setSelectedChartId(first._id);
          applyChartConfig(first);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const applyChartConfig = (chart: SizeChart) => {
    const cfg = chart.fitFinderConfig || { enabled: chart.fitFinderEnabled };
    setEnabled(chart.fitFinderEnabled);
    setAskHeight(cfg.askHeight ?? true);
    setAskWeight(cfg.askWeight ?? true);
    setAskChest(cfg.askChest ?? true);
    setAskWaist(cfg.askWaist ?? true);
    setAskHip(cfg.askHip ?? true);
    setAskShoulder(cfg.askShoulder ?? false);
    setAskFootLength(cfg.askFootLength ?? false);
    setAllowFitPreferences(cfg.allowFitPreferences ?? true);

    // AI Config
    setAiEnabled(cfg.aiEnabled ?? true);
    setAiCustomInstructions(cfg.aiCustomInstructions || '');
  };

  const handleSelectChart = (id: string) => {
    setSelectedChartId(id);
    const target = charts.find((c) => c._id === id);
    if (target) applyChartConfig(target);
  };

  const handleSave = async () => {
    if (!selectedChartId) return;
    setSaving(true);
    try {
      await dashboardApi.updateChart(selectedChartId, {
        fitFinderEnabled: enabled,
        fitFinderConfig: {
          enabled,
          askHeight,
          askWeight,
          askChest,
          askWaist,
          askHip,
          askShoulder,
          askFootLength,
          allowFitPreferences,
          weights: [
            { measurement: 'chest', weight: chestWeight },
            { measurement: 'waist', weight: waistWeight },
            { measurement: 'height', weight: heightWeight },
            { measurement: 'weight', weight: weightWeight },
          ],
          aiEnabled,
          aiCustomInstructions: aiCustomInstructions.trim() || undefined,
        },
      });
      toast.success(t('notifications.settingsSaved'));
    } catch (err: any) {
      toast.error(err.message || t('errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  const selectedChart = charts.find((c) => c._id === selectedChartId) || null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('fitFinder.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t('fitFinder.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTestModal(true)}
            disabled={!selectedChart}
            className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Play className="h-3.5 w-3.5 fill-primary text-primary" />
            {t('fitFinder.testFinder')}
          </Button>

          <Button onClick={handleSave} disabled={saving} className="gap-1.5 text-xs">
            <Save className="h-4 w-4" />
            {t('common.save')}
          </Button>
        </div>
      </div>

      {/* Choose Chart Target */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">{t('assignments.selectChart')}</label>
            <select
              value={selectedChartId}
              onChange={(e) => handleSelectChart(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary min-w-[240px]"
            >
              {charts.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <span className="text-xs font-medium text-foreground">{t('fitFinder.statusToggle')}</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} aria-label={t('fitFinder.statusToggle')} />
          </div>
        </CardContent>
      </Card>

      {/* AI Smart Finder Section */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  {t('fitFinder.aiCardTitle')}
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    {t('fitFinder.aiPoweredBadge')}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-0.5">
                  {t('fitFinder.aiCardDesc')}
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
              aria-label={t('fitFinder.aiCardTitle')}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          {aiEnabled ? (
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                {t('fitFinder.aiCustomInstructionsLabel')}
              </label>
              <textarea
                value={aiCustomInstructions}
                onChange={(e) => setAiCustomInstructions(e.target.value)}
                rows={2}
                placeholder={t('fitFinder.aiCustomInstructionsPlaceholder')}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary resize-y"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                {t('fitFinder.aiCustomInstructionsDesc')}
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-muted/30 border border-border text-xs text-muted-foreground">
              {t('fitFinder.aiDisabledNotice')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurement Questions Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{t('fitFinder.questionConfig')}</CardTitle>
          <CardDescription>{t('fitFinder.questionsIncluded')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: t('fitFinder.height'), checked: askHeight, setter: setAskHeight },
            { label: t('fitFinder.weight'), checked: askWeight, setter: setAskWeight },
            { label: t('fitFinder.chest'), checked: askChest, setter: setAskChest },
            { label: t('fitFinder.waist'), checked: askWaist, setter: setAskWaist },
            { label: t('fitFinder.hip'), checked: askHip, setter: setAskHip },
            { label: t('fitFinder.shoulder'), checked: askShoulder, setter: setAskShoulder },
            { label: t('fitFinder.footLength'), checked: askFootLength, setter: setAskFootLength },
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.setter(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium text-foreground">{item.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Fit Preferences Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{t('fitFinder.fitPreferencesTitle')}</CardTitle>
          <CardDescription>{t('fitFinder.fitPreferenceDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-xs font-semibold text-foreground">{t('fitFinder.fitPreferencesTitle')}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('fitFinder.allowPreferences')}</p>
            </div>
            <Switch checked={allowFitPreferences} onCheckedChange={setAllowFitPreferences} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded border border-border bg-card text-xs">
              <span className="font-bold text-foreground block mb-1">1. {t('fitFinder.slim')}</span>
              <p className="text-[11px] text-muted-foreground">{t('fitFinder.slim')}</p>
            </div>
            <div className="p-3 rounded border border-border bg-card text-xs">
              <span className="font-bold text-foreground block mb-1">2. {t('fitFinder.regular')}</span>
              <p className="text-[11px] text-muted-foreground">{t('fitFinder.regular')}</p>
            </div>
            <div className="p-3 rounded border border-border bg-card text-xs">
              <span className="font-bold text-foreground block mb-1">3. {t('fitFinder.relaxed')}</span>
              <p className="text-[11px] text-muted-foreground">{t('fitFinder.relaxed')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Measurement Weighting Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{t('fitFinder.weightsTitle')}</CardTitle>
          <CardDescription>{t('fitFinder.weightsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">{t('fitFinder.chest')}</label>
            <select
              value={chestWeight}
              onChange={(e) => setChestWeight(e.target.value as any)}
              className="h-8 rounded border border-input bg-background px-2 text-xs w-full"
            >
              <option value="high">{t('fitFinder.weightHigh')}</option>
              <option value="medium">{t('fitFinder.weightMedium')}</option>
              <option value="low">{t('fitFinder.weightLow')}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">{t('fitFinder.waist')}</label>
            <select
              value={waistWeight}
              onChange={(e) => setWaistWeight(e.target.value as any)}
              className="h-8 rounded border border-input bg-background px-2 text-xs w-full"
            >
              <option value="high">{t('fitFinder.weightHigh')}</option>
              <option value="medium">{t('fitFinder.weightMedium')}</option>
              <option value="low">{t('fitFinder.weightLow')}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">{t('fitFinder.height')}</label>
            <select
              value={heightWeight}
              onChange={(e) => setHeightWeight(e.target.value as any)}
              className="h-8 rounded border border-input bg-background px-2 text-xs w-full"
            >
              <option value="high">{t('fitFinder.weightHigh')}</option>
              <option value="medium">{t('fitFinder.weightMedium')}</option>
              <option value="low">{t('fitFinder.weightLow')}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">{t('fitFinder.weight')}</label>
            <select
              value={weightWeight}
              onChange={(e) => setWeightWeight(e.target.value as any)}
              className="h-8 rounded border border-input bg-background px-2 text-xs w-full"
            >
              <option value="high">{t('fitFinder.weightHigh')}</option>
              <option value="medium">{t('fitFinder.weightMedium')}</option>
              <option value="low">{t('fitFinder.weightLow')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Smart Fit Finder Test Simulator Dialog */}
      <TestFitFinderDialog
        open={showTestModal}
        onOpenChange={setShowTestModal}
        chart={selectedChart}
      />
    </div>
  );
};
