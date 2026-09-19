import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { WidgetSettings, DEFAULT_WIDGET_SETTINGS, TriggerStyle, DisplayMode } from '../../types/settings';
import { dashboardApi } from '../../api/dashboard-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import {
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Type,
  Layout,
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

export const WidgetSettingsView: React.FC = () => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_WIDGET_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewUnit, setPreviewUnit] = useState<'cm' | 'in'>('cm');
  const [selectedPreviewVariant, setSelectedPreviewVariant] = useState<string>('M');

  useEffect(() => {
    async function load() {
      try {
        const res = await dashboardApi.getWidgetSettings();
        setSettings(res);
        setPreviewUnit(res.defaultUnit);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dashboardApi.updateWidgetSettings(settings);
      toast.success(t('notifications.settingsSaved'));
    } catch (err: any) {
      toast.error(err.message || t('errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_WIDGET_SETTINGS);
    toast.success('Reset to default widget styling');
    toast.success(t('widget.resetSuccess'));
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  const trigger = settings.triggerSettings;
  const modal = settings.modalSettings;
  const table = settings.tableSettings;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto pb-12">
      {/* Left Column: Settings Controls (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{t('settings.widgetTitle')}</h2>
            <p className="text-xs text-muted-foreground">{t('settings.widgetDesc')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleResetDefaults} className="h-8 gap-1 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              {t('common.reset')}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 gap-1.5 text-xs">
              <Save className="h-3.5 w-3.5" />
              {t('common.save')}
            </Button>
          </div>
        </div>

        {/* Trigger Button Design */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              {t('widget.triggerSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">{t('widget.triggerText')}</label>
                <Input
                  value={trigger.text}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      triggerSettings: { ...trigger, text: e.target.value },
                    })
                  }
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">{t('widget.triggerStyle')}</label>
                <select
                  value={trigger.style}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      triggerSettings: { ...trigger, style: e.target.value as TriggerStyle },
                    })
                  }
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full"
                >
                  <option value="button">{t('widget.button')}</option>
                  <option value="textLink">{t('widget.textLink')}</option>
                  <option value="underlinedLink">{t('widget.underlinedLink')}</option>
                  <option value="iconText">{t('widget.iconText')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.primaryColor')}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={trigger.backgroundColor || '#f1f5f9'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        triggerSettings: { ...trigger, backgroundColor: e.target.value },
                      })
                    }
                    className="h-7 w-7 rounded cursor-pointer border border-border p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono">{trigger.backgroundColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.textColor')}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={trigger.textColor || '#1e293b'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        triggerSettings: { ...trigger, textColor: e.target.value },
                      })
                    }
                    className="h-7 w-7 rounded cursor-pointer border border-border p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono">{trigger.textColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Border Radius</label>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.borderRadius')}</label>
                <Input
                  value={trigger.borderRadius || '6px'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      triggerSettings: { ...trigger, borderRadius: e.target.value },
                    })
                  }
                  className="h-7 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Padding</label>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.padding')}</label>
                <Input
                  value={trigger.padding || '8px 16px'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      triggerSettings: { ...trigger, padding: e.target.value },
                    })
                  }
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Mode & Container Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layout className="h-4 w-4 text-primary" />
              {t('widget.modalSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">{t('widget.displayMode')}</label>
                <select
                  value={modal.displayMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      modalSettings: { ...modal, displayMode: e.target.value as DisplayMode },
                    })
                  }
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full"
                >
                  <option value="modal">{t('widget.modal')}</option>
                  <option value="drawer">{t('widget.drawer')}</option>
                  <option value="bottomSheet">{t('widget.bottomSheet')}</option>
                  <option value="inline">{t('widget.inline')}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">{t('widget.modalWidth')}</label>
                <Input
                  value={modal.maxWidth}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      modalSettings: { ...modal, maxWidth: e.target.value },
                    })
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table & Highlight Styling */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              {t('widget.tableSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.tableHeaderBg')}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={table.headerBackground || '#f8fafc'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tableSettings: { ...table, headerBackground: e.target.value },
                      })
                    }
                    className="h-7 w-7 rounded cursor-pointer border border-border p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono">{table.headerBackground}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.highlightColor')}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={table.highlightBackground || '#eff6ff'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tableSettings: { ...table, highlightBackground: e.target.value },
                      })
                    }
                    className="h-7 w-7 rounded cursor-pointer border border-border p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono">{table.highlightBackground}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Highlight Text</label>
                <label className="text-[11px] text-muted-foreground block mb-1">{t('widget.highlightTextColor')}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={table.highlightTextColor || '#1d4ed8'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tableSettings: { ...table, highlightTextColor: e.target.value },
                      })
                    }
                    className="h-7 w-7 rounded cursor-pointer border border-border p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono">{table.highlightTextColor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-foreground font-medium">{t('widget.stickyHeader')}</span>
              <Switch
                checked={table.stickyHeader}
                onCheckedChange={(val) =>
                  setSettings({
                    ...settings,
                    tableSettings: { ...table, stickyHeader: val },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Live Interactive Storefront Preview (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
            <Monitor className="h-4 w-4 text-primary" />
            {t('settings.previewMode')}
          </h3>

          {/* Device viewport toggle */}
          <div className="inline-flex rounded-md border border-input p-0.5 bg-muted">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              title={t('settings.desktop')}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              title={t('settings.tablet')}
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              title={t('settings.mobile')}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Live Device Frame */}
        <div
          className={`border-2 border-border rounded-xl bg-background shadow-md overflow-hidden transition-all mx-auto ${
            previewDevice === 'mobile'
              ? 'max-w-[320px]'
              : previewDevice === 'tablet'
              ? 'max-w-[440px]'
              : 'w-full'
          }`}
        >
          {/* Simulated Product Page Mockup */}
          <div className="p-4 bg-muted/20 border-b border-border space-y-3">
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-muted rounded" />

            {/* Variant selector */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Select Size:</label>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">{t('widget.selectSize')}</label>
              <div className="flex gap-1.5">
                {['S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedPreviewVariant(s)}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                      selectedPreviewVariant === s
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Styled Trigger Preview */}
            <div className="pt-2">
              {trigger.style === 'button' ? (
                <button
                  style={{
                    backgroundColor: trigger.backgroundColor,
                    color: trigger.textColor,
                    borderRadius: trigger.borderRadius,
                    padding: trigger.padding,
                    fontSize: trigger.fontSize,
                    fontWeight: trigger.fontWeight as any,
                  }}
                  className="border border-border font-medium inline-flex items-center gap-1.5 shadow-sm"
                >
                  {trigger.text}
                </button>
              ) : (
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ color: trigger.textColor, fontSize: trigger.fontSize }}
                  className={trigger.style === 'underlinedLink' ? 'underline font-medium' : 'hover:underline font-medium'}
                >
                  {trigger.text}
                </a>
              )}
            </div>
          </div>

          {/* Live Rendered Size Chart Table with Variant Highlighting */}
          <div className="p-3 space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-foreground">Men's Oxford Shirt Guide</h4>
              <h4 className="font-bold text-xs text-foreground">{t('widget.sampleGuideTitle')}</h4>
              {/* Unit Switcher */}
              <div className="inline-flex rounded border p-0.5 bg-muted text-[10px]">
                <button
                  type="button"
                  onClick={() => setPreviewUnit('cm')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    previewUnit === 'cm' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewUnit('in')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    previewUnit === 'in' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  IN
                </button>
              </div>
            </div>

            <div className="rounded border border-border overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: table.headerBackground }}>
                    <th className="p-2 text-left font-bold">Size</th>
                    <th className="p-2 text-left font-bold">Chest</th>
                    <th className="p-2 text-left font-bold">Waist</th>
                    <th className="p-2 text-left font-bold">{t('presets.size')}</th>
                    <th className="p-2 text-left font-bold">{t('presets.chest')}</th>
                    <th className="p-2 text-left font-bold">{t('presets.waist')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { size: 'S', chest: previewUnit === 'cm' ? '86–91' : '33.9–35.8', waist: previewUnit === 'cm' ? '71–76' : '28.0–29.9' },
                    { size: 'M', chest: previewUnit === 'cm' ? '91–97' : '35.8–38.2', waist: previewUnit === 'cm' ? '76–81' : '29.9–31.9' },
                    { size: 'L', chest: previewUnit === 'cm' ? '97–102' : '38.2–40.2', waist: previewUnit === 'cm' ? '81–86' : '31.9–33.9' },
                    { size: 'XL', chest: previewUnit === 'cm' ? '102–107' : '40.2–42.1', waist: previewUnit === 'cm' ? '86–91' : '33.9–35.8' },
                  ].map((row) => {
                    const isSelected = selectedPreviewVariant === row.size;
                    return (
                      <tr
                        key={row.size}
                        style={{
                          backgroundColor: isSelected ? table.highlightBackground : 'transparent',
                          color: isSelected ? table.highlightTextColor : 'inherit',
                          fontWeight: isSelected ? '600' : 'normal',
                        }}
                        className="transition-colors"
                      >
                        <td className="p-2 font-bold">{row.size}</td>
                        <td className="p-2 font-mono">{row.chest}</td>
                        <td className="p-2 font-mono">{row.waist}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Smart Fit Finder teaser */}
            <div className="p-2.5 rounded border border-blue-200 bg-blue-50/60 dark:bg-blue-950/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Not sure? Find your exact size</span>
                <span>{t('widget.notSureFindSize')}</span>
              </div>
              <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">
                Calculate
                {t('widget.calculate')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

