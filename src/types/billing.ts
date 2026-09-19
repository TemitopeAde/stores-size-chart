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
  appDefId?: string;
  isFree?: boolean;
  freeTrialAvailable?: boolean;
  billing?: {
    packageName?: string;
    vendorProductId?: string;
    expirationDate?: string;
    freeTrialInfo?: {
      isFreeTrial?: boolean;
      daysRemaining?: number;
    };
    autoRenewing?: boolean;
  };
}

