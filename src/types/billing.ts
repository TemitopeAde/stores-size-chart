export type BillingState =
  | 'TRIAL_AVAILABLE'
  | 'TRIAL_ACTIVE'
  | 'TRIAL_EXPIRED'
  | 'PAID_ACTIVE'
  | 'CANCEL_PENDING_EXPIRATION'
  | 'EXPIRED'
  | 'FREE_TRIAL_AVAILABLE'
  | 'FREE_NO_TRIAL'
  | 'BILLING_UNKNOWN';

export type PlanTier = 'starter' | 'pro' | 'enterprise';

export interface EntitlementInfo {
  state: BillingState;
  isEntitled: boolean; // Can render chart on storefront & manage charts
  canManageCharts: boolean;
  canRenderChart: boolean;
  planTier: PlanTier;
  daysRemaining?: number;
  expirationDate?: string;
  isTrial: boolean;
  freeTrialAvailable: boolean;
  packageName?: string;
  vendorProductId?: string;
}

export interface WixAppInstanceData {
  instanceId?: string;
  appName?: string;
  appVersion?: string | null;
  appDefId?: string;
  isFree?: boolean;
  freeTrialAvailable?: boolean;
  billing?: {
    packageName?: string;
    vendorProductId?: string;
    billingCycle?: string;
    timeStamp?: string;
    expirationDate?: string | null;
    autoRenewing?: boolean | null;
    invoiceId?: string | null;
    source?: string | null;
    freeTrialInfo?: {
      status?: 'IN_PROGRESS' | 'ENDED' | 'NOT_AVAILABLE' | string;
      endDate?: Date | string | null;
      isFreeTrial?: boolean;
      daysRemaining?: number;
    };
  };
  permissions?: string[];
}
