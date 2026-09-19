import React from 'react';
import { useTranslation } from '../../i18n';
import { EntitlementInfo } from '../../types/billing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CreditCard, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export interface BillingSettingsViewProps {
  entitlement: EntitlementInfo;
  onUpgradeClick?: () => void;
}

export const BillingSettingsView: React.FC<BillingSettingsViewProps> = ({
  entitlement,
  onUpgradeClick,
}) => {
  const { t, formatDate } = useTranslation();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {t('settings.billingTitle')}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t('settings.billingDesc')}</p>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{t('billing.currentPlanTitle')}</CardTitle>
            <Badge
              variant={
                entitlement.state === 'PAID_ACTIVE' || entitlement.state === 'TRIAL_ACTIVE'
                  ? 'success'
                  : 'destructive'
              }
              className="text-xs"
            >
              {entitlement.state === 'PAID_ACTIVE' && t('billing.subscriptionActive')}
              {entitlement.state === 'TRIAL_ACTIVE' && t('billing.trialActive')}
              {entitlement.state === 'TRIAL_AVAILABLE' && t('billing.trialAvailable')}
              {entitlement.state === 'CANCEL_PENDING_EXPIRATION' && t('billing.subscriptionCancelled')}
              {entitlement.state === 'EXPIRED' && t('billing.paidExpired')}
              {entitlement.state === 'FREE_NO_TRIAL' && t('billing.trialExpired')}
              {entitlement.state === 'BILLING_UNKNOWN' && t('billing.billingUnknown')}
            </Badge>
          </div>
          <CardDescription>
            {entitlement.isTrial && entitlement.daysRemaining !== undefined
              ? t('billing.daysRemaining', { count: entitlement.daysRemaining })
              : entitlement.expirationDate
              ? t('billing.activeUntil', { date: formatDate(entitlement.expirationDate) })
              : 'Managed through Wix App Market'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="p-4 rounded-lg border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  {entitlement.planTier === 'pro' ? t('billing.proPlan') : t('billing.starterPlan')}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Unlimited size charts, category assignments, Smart Fit Finder, and 20 languages.
                </p>
              </div>
            </div>

            <Button onClick={onUpgradeClick} className="shrink-0 text-xs">
              {entitlement.state === 'TRIAL_AVAILABLE'
                ? t('billing.startTrialBtn')
                : entitlement.state === 'EXPIRED' || entitlement.state === 'FREE_NO_TRIAL'
                ? t('billing.subscribeBtn')
                : 'Manage Subscription'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Starter Plan</CardTitle>
            <CardDescription>Basic chart tables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Up to 5 Size Charts</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Product Page Site Plugin</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>CM / IN Conversion</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-primary">Pro Plan (All Features)</CardTitle>
              <Badge variant="default" className="text-[10px]">Recommended</Badge>
            </div>
            <CardDescription>Full conversion suite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Unlimited Size Charts & Measurements</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Category & Advanced Rule Assignments</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Smart Fit Finder (Deterministic recommendations)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Realtime Variant-Aware Highlighting</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>20 Languages + Full RTL Support</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

