import React from 'react';
import { useTranslation } from '../../i18n';
import { EntitlementInfo } from '../../types/billing';
import { Button } from '../ui/button';
import { Sparkles, AlertTriangle, Clock, RefreshCcw } from 'lucide-react';

export interface BillingStatusBannerProps {
  entitlement: EntitlementInfo;
  onRefresh?: () => void;
  onUpgradeClick?: () => void;
}

export const BillingStatusBanner: React.FC<BillingStatusBannerProps> = ({
  entitlement,
  onRefresh,
  onUpgradeClick,
}) => {
  const { t, formatDate } = useTranslation();

  if (entitlement.state === 'PAID_ACTIVE') {
    return null; // Paid active users don't need an obtrusive top banner
  }

  if (entitlement.state === 'TRIAL_ACTIVE') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-200/80 dark:border-blue-900/60 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong className="font-semibold">{t('billing.trialActive')}</strong> &middot;{' '}
              {t('billing.daysRemaining', { count: entitlement.daysRemaining ?? 14 })}
            </span>
          </div>
          <Button size="sm" variant="outline" className="h-8 border-blue-300 text-blue-800 dark:text-blue-200 hover:bg-blue-100" onClick={onUpgradeClick}>
            {t('billing.subscribeBtn')}
          </Button>
        </div>
      </div>
    );
  }

  if (entitlement.state === 'TRIAL_AVAILABLE' || entitlement.state === 'FREE_TRIAL_AVAILABLE') {
    return (
      <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-b border-amber-300/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong className="font-semibold">{t('billing.trialAvailable')}</strong> &middot;{' '}
              {t('overview.subtitle')}
            </span>
          </div>
          <Button size="sm" className="h-8 bg-amber-600 hover:bg-amber-700 text-white" onClick={onUpgradeClick}>
            {t('billing.startTrialBtn')}
          </Button>
        </div>
      </div>
    );
  }

  if (entitlement.state === 'CANCEL_PENDING_EXPIRATION') {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong className="font-semibold">{t('billing.subscriptionCancelled')}</strong> &middot;{' '}
              {t('billing.activeUntil', { date: formatDate(entitlement.expirationDate || new Date()) })}
            </span>
          </div>
          <Button size="sm" variant="outline" className="h-8" onClick={onUpgradeClick}>
            {t('billing.reactivateBtn')}
          </Button>
        </div>
      </div>
    );
  }

  if (entitlement.state === 'EXPIRED' || entitlement.state === 'TRIAL_EXPIRED' || entitlement.state === 'FREE_NO_TRIAL') {
    return (
      <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-destructive">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{t('billing.trialExpiredTitle')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('billing.trialExpiredDesc')}</p>
            </div>
          </div>
          <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shrink-0" onClick={onUpgradeClick}>
            {t('billing.choosePlanBtn')}
          </Button>
        </div>
      </div>
    );
  }

  if (entitlement.state === 'BILLING_UNKNOWN') {
    return (
      <div className="bg-muted border-b border-border px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{t('billing.billingUnknown')}</span>
          </div>
          {onRefresh && (
            <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={onRefresh}>
              <RefreshCcw className="h-3.5 w-3.5" />
              {t('common.retry')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
