import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { dashboardApi } from '../../api/dashboard-client';
import { PluginStatusResult } from '../../services/plugin-status-service';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CheckCircle2, AlertCircle, RefreshCw, PlusCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export interface PluginStatusProps {
  onStatusChange?: (status: string) => void;
  compact?: boolean;
}

export const PluginStatus: React.FC<PluginStatusProps> = ({ onStatusChange, compact = false }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PluginStatusResult>({ status: 'CHECKING' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getPluginStatus();
      setData(res);
      onStatusChange?.(res.status);
    } catch (err: any) {
      setData({ status: 'ERROR', errorMessage: err.message });
      onStatusChange?.('ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAddPlugin = async () => {
    setAdding(true);
    try {
      const ok = await dashboardApi.addPlugin();
      if (ok) {
        toast.success(t('pluginStatus.addSuccess'));
        await fetchStatus();
      } else {
        toast.error(t('pluginStatus.addError'));
      }
    } catch (err) {
      toast.error(t('pluginStatus.addError'));
    } finally {
      setAdding(false);
    }
  };

  if (compact) {
    if (data.status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {t('pluginStatus.active')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        {t('pluginStatus.notAdded')}
      </span>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5">
              {loading || data.status === 'CHECKING' ? (
                <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
              ) : data.status === 'ACTIVE' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : data.status === 'NOT_ADDED' ? (
                <AlertCircle className="h-6 w-6 text-amber-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{t('pluginStatus.title')}</h4>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    data.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : data.status === 'NOT_ADDED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {data.status === 'ACTIVE'
                    ? `● ${t('pluginStatus.active')}`
                    : data.status === 'NOT_ADDED'
                    ? `○ ${t('pluginStatus.notAdded')}`
                    : data.status === 'CHECKING'
                    ? t('pluginStatus.checking')
                    : t('pluginStatus.error')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {data.status === 'ACTIVE'
                  ? t('pluginStatus.descriptionActive')
                  : data.status === 'NOT_ADDED'
                  ? t('pluginStatus.descriptionNotAdded')
                  : t('pluginStatus.descriptionError')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {data.status === 'NOT_ADDED' && (
              <Button size="sm" onClick={handleAddPlugin} disabled={adding} className="gap-1.5">
                <PlusCircle className="h-4 w-4" />
                {t('pluginStatus.add')}
              </Button>
            )}

            {data.status === 'ACTIVE' && (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.open('https://www.wix.com/dashboard', '_blank')}>
                <ExternalLink className="h-4 w-4" />
                {t('pluginStatus.manage')}
              </Button>
            )}

            {(data.status === 'ERROR' || data.status === 'CHECKING') && (
              <Button size="sm" variant="outline" onClick={fetchStatus} disabled={loading} className="gap-1.5">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {t('pluginStatus.retry')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

