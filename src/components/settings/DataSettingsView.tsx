import React from 'react';
import { useTranslation } from '../../i18n';
import { dashboardApi } from '../../api/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Database, Download, Upload, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const DataSettingsView: React.FC = () => {
  const { t } = useTranslation();

  const handleExportAll = async () => {
    try {
      const [chartsRes, assignRes, settingsRes] = await Promise.all([
        dashboardApi.getCharts({ limit: 100 }),
        dashboardApi.getAssignments({ limit: 100 }),
        dashboardApi.getWidgetSettings(),
      ]);

      const backup = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        sizeCharts: chartsRes.items,
        assignments: assignRes.items,
        widgetSettings: settingsRes,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `size-charts-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success('Full catalog backup downloaded');
    } catch (e: any) {
      toast.error('Failed to export backup data');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {t('settings.dataTitle')}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t('settings.dataDesc')}</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Catalog Backup & Restore</CardTitle>
          <CardDescription>
            Export all size charts, rules, assignments, and widget customizations in JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm">Download JSON Backup</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Save a snapshot of all size charts and assignments to your computer.
              </p>
            </div>
            <Button onClick={handleExportAll} className="gap-1.5 text-xs shrink-0">
              <Download className="h-4 w-4" />
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

