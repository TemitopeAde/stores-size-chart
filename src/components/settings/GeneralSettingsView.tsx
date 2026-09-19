import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { dashboardApi } from '../../api/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export const GeneralSettingsView: React.FC = () => {
  const { t } = useTranslation();
  const [defaultUnit, setDefaultUnit] = useState<'cm' | 'in'>('cm');
  const [syncTheme, setSyncTheme] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const s = await dashboardApi.getWidgetSettings();
        setDefaultUnit(s.defaultUnit);
        setSyncTheme(s.syncWithSiteTheme);
      } catch (e) {}
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const current = await dashboardApi.getWidgetSettings().catch(() => null);
      await dashboardApi.updateWidgetSettings({
        defaultUnit,
        syncWithSiteTheme: syncTheme,
        fitFinderSettings: current?.fitFinderSettings,
      });
      toast.success(t('notifications.settingsSaved'));
    } catch (err: any) {
      toast.error(err.message || t('errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            {t('settings.generalTitle')}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t('settings.generalDesc')}</p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-1.5 text-xs">
          <Save className="h-4 w-4" />
          {t('common.save')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Storefront Defaults</CardTitle>
          <CardDescription>Default measurement unit and theme synchronization</CardDescription>
          <CardTitle className="text-base font-semibold">{t('settings.storefrontDefaults')}</CardTitle>
          <CardDescription>{t('settings.storefrontDefaultsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">{t('builder.defaultUnitLabel')}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Initial unit shown to shoppers before they toggle.</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('settings.initialUnitDesc')}</p>
            </div>
            <div className="inline-flex rounded-md border border-input p-0.5 bg-muted">
              <button
                type="button"
                onClick={() => setDefaultUnit('cm')}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  defaultUnit === 'cm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => setDefaultUnit('in')}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  defaultUnit === 'in' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                IN
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-xs font-semibold text-foreground">{t('settings.themeSync')}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Automatically inherit fonts and colors from the active Wix site theme.
                {t('settings.themeSyncDesc')}
              </p>
            </div>
            <Switch checked={syncTheme} onCheckedChange={setSyncTheme} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

