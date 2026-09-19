import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SizeChart } from '../../types/charts';
import { dashboardApi } from '../../api/dashboard-client';
import { FitRecommendationResult } from '../../lib/fit-scoring';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Ruler,
  TrendingUp,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export interface TestFitFinderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chart: SizeChart | null;
}

export const TestFitFinderDialog: React.FC<TestFitFinderDialogProps> = ({
  open,
  onOpenChange,
  chart,
}) => {
  const { t } = useTranslation();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [useAi, setUseAi] = useState(true);
  const [preference, setPreference] = useState<'slim' | 'regular' | 'relaxed'>('regular');

  // Input measurements
  const [height, setHeight] = useState<string>('178');
  const [weight, setWeight] = useState<string>('75');
  const [chest, setChest] = useState<string>('100');
  const [waist, setWaist] = useState<string>('84');
  const [hip, setHip] = useState<string>('98');
  const [shoulder, setShoulder] = useState<string>('44');
  const [footLength, setFootLength] = useState<string>('27');
  const [age, setAge] = useState<string>('28');

  // Calculation state
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<FitRecommendationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  if (!chart) return null;

  const cfg = chart.fitFinderConfig || { enabled: chart.fitFinderEnabled };

  const handleUnitChange = (newUnit: 'cm' | 'in') => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    // Convert current numbers roughly for realistic test defaults
    if (newUnit === 'in') {
      if (height) setHeight((parseFloat(height) / 2.54).toFixed(1));
      if (weight) setWeight((parseFloat(weight) * 2.20462).toFixed(1));
      if (chest) setChest((parseFloat(chest) / 2.54).toFixed(1));
      if (waist) setWaist((parseFloat(waist) / 2.54).toFixed(1));
      if (hip) setHip((parseFloat(hip) / 2.54).toFixed(1));
      if (shoulder) setShoulder((parseFloat(shoulder) / 2.54).toFixed(1));
      if (footLength) setFootLength((parseFloat(footLength) / 2.54).toFixed(1));
    } else {
      if (height) setHeight(Math.round(parseFloat(height) * 2.54).toString());
      if (weight) setWeight(Math.round(parseFloat(weight) / 2.20462).toString());
      if (chest) setChest(Math.round(parseFloat(chest) * 2.54).toString());
      if (waist) setWaist(Math.round(parseFloat(waist) * 2.54).toString());
      if (hip) setHip(Math.round(parseFloat(hip) * 2.54).toString());
      if (shoulder) setShoulder(Math.round(parseFloat(shoulder) * 2.54).toString());
      if (footLength) setFootLength(Math.round(parseFloat(footLength) * 2.54).toString());
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setCalcError(null);
    setResult(null);

    try {
      const payload: Record<string, any> = {
        unit,
        preference,
      };

      if (height.trim()) payload.height = parseFloat(height);
      if (weight.trim()) payload.weight = parseFloat(weight);
      if (chest.trim()) payload.chest = parseFloat(chest);
      if (waist.trim()) payload.waist = parseFloat(waist);
      if (hip.trim()) payload.hip = parseFloat(hip);
      if (shoulder.trim()) payload.shoulder = parseFloat(shoulder);
      if (footLength.trim()) payload.footLength = parseFloat(footLength);
      if (age.trim()) payload.age = parseInt(age, 10);

      const res = await dashboardApi.calculateFit(chart._id, payload, unit, useAi);
      setResult(res);
      toast.success(t('notifications.calculationSuccess') || t('common.success'));
    } catch (err: any) {
      const msg = err.message || t('errors.generalError');
      setCalcError(msg);
      toast.error(msg);
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCalcError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClose={() => onOpenChange(false)}>
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  {t('fitFinder.testModalTitle')}
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                    {t('fitFinder.testModalBadge')}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {t('fitFinder.testModalDesc', {
                    name: chart.name,
                    sizes: chart.rows.map((r) => r.size).join(', '),
                  })}
                </DialogDescription>
              </div>
            </div>

            {/* Unit Switcher */}
            <div className="inline-flex rounded-md border border-input p-0.5 bg-muted">
              <button
                type="button"
                onClick={() => handleUnitChange('cm')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  unit === 'cm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                CM / KG
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('in')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  unit === 'in' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                IN / LBS
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Measurement Inputs Grid */}
          <div>
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2.5">
              <User className="h-3.5 w-3.5 text-primary" />
              {t('fitFinder.simulateMeasurements', { unit: unit.toUpperCase() })}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(cfg.askHeight ?? true) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.height')} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === 'cm' ? '175' : '68'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {(cfg.askWeight ?? true) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.weight')} ({unit === 'cm' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === 'cm' ? '70' : '155'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {(cfg.askChest ?? true) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.chest')} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    placeholder={unit === 'cm' ? '98' : '38'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {(cfg.askWaist ?? true) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.waist')} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder={unit === 'cm' ? '82' : '32'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {(cfg.askHip ?? true) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.hip')} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    placeholder={unit === 'cm' ? '96' : '38'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {(cfg.askShoulder ?? false) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.shoulder')} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={shoulder}
                    onChange={(e) => setShoulder(e.target.value)}
                    placeholder={unit === 'cm' ? '44' : '17'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {(cfg.askFootLength ?? false) && (
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    {t('fitFinder.footLength')} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={footLength}
                    onChange={(e) => setFootLength(e.target.value)}
                    placeholder={unit === 'cm' ? '27' : '10.5'}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  {t('fitFinder.age')}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Fit Preference */}
          {(cfg.allowFitPreferences ?? true) && (
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                {t('fitFinder.preferenceLabel')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'slim', label: t('fitFinder.prefSlim') },
                  { id: 'regular', label: t('fitFinder.prefRegular') },
                  { id: 'relaxed', label: t('fitFinder.prefRelaxed') },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setPreference(pref.id as any)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      preference === pref.id
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-background hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">{t('fitFinder.aiEngineTitle')}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t('fitFinder.aiEngineDesc')}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useAi}
                onChange={(e) => setUseAi(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Calculate Button */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {result && (
              <Button type="button" variant="outline" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                {t('common.reset')}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleCalculate}
              disabled={calculating}
              className="text-xs gap-1.5 min-w-[140px]"
            >
              {calculating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t('fitFinder.calculatingBtn')}
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('fitFinder.testRecommendationBtn')}
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {calcError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{calcError}</span>
            </div>
          )}

          {/* Calculation Result Display */}
          {result && (
            <div className="mt-4 p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background space-y-4 animate-in fade-in-50">
              {/* Header result */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {t('fitFinder.recommendedSize')}
                    </span>
                    {result.aiGenerated ? (
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1">
                        <Bot className="h-3 w-3" />
                        {t('fitFinder.aiAnalysisBadge')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">
                        {t('fitFinder.ruleMatchBadge')}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-foreground mt-1 flex items-baseline gap-2">
                    {result.recommendedSize}
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {t('fitFinder.matchRate', { confidence: result.confidence })}
                    </span>
                  </h3>
                </div>

                {result.alternativeSize && (
                  <div className="text-right">
                    <span className="text-[11px] text-muted-foreground block">{t('fitFinder.altSizeLabel')}</span>
                    <span className="text-base font-bold text-foreground">{result.alternativeSize}</span>
                  </div>
                )}
              </div>

              {/* AI Reasoning / Advice */}
              {result.aiReasoning && (
                <div className="p-3.5 rounded-lg bg-background border border-border text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                    <Info className="h-3.5 w-3.5 text-primary" />
                    {t('fitFinder.aiRationaleTitle')}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {result.aiReasoning}
                  </p>
                </div>
              )}

              {/* Fit Tips */}
              {result.fitTips && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-xs text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs">{result.fitTips}</span>
                </div>
              )}

              {/* Measurements Match Table */}
              {result.explanation?.matchingMeasurements && result.explanation.matchingMeasurements.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                    {t('fitFinder.comparisonTitle')}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.explanation.matchingMeasurements.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border text-xs"
                      >
                        <div>
                          <span className="font-semibold text-foreground capitalize">{m.name}: </span>
                          <span className="text-muted-foreground">{m.userValue} {unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {t('fitFinder.rangeLabel', { range: m.chartRange })}
                          </span>
                          {m.status === 'exact' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : m.status === 'close' ? (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded">{t('fitFinder.closeMatch')}</span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{t('fitFinder.outsideMatch')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

