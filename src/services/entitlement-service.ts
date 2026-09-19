import { appInstances } from '@wix/app-management';
import { BillingState, EntitlementInfo, WixAppInstanceData, PlanTier } from '../types/billing';

/**
 * Parses signed app instance token format (Base64 payload).
 */
export function parseAppInstance(token?: string | null): any | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Payload = parts[1];
    const decoded = typeof atob === 'function'
      ? atob(base64Payload)
      : typeof (globalThis as any).Buffer !== 'undefined'
      ? (globalThis as any).Buffer.from(base64Payload, 'base64').toString('utf-8')
      : '';
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

/**
 * Checks if storefront rendering is permitted for given entitlement.
 */
export function isStorefrontEntitled(entitlement?: EntitlementInfo | any): boolean {
  if (!entitlement) return false;
  if (entitlement.isEntitled !== undefined) return Boolean(entitlement.isEntitled);
  if (entitlement.canRenderChart !== undefined) return Boolean(entitlement.canRenderChart);
  if (entitlement.billingStatus === 'FREE' || entitlement.billingStatus === 'ACTIVE' || entitlement.billingStatus === 'TRIAL') {
    return true;
  }
  return false;
}

/**
 * Normalizes raw Wix App Instance metadata into internal EntitlementInfo and BillingState.
 */
export function normalizeEntitlement(appInstance?: WixAppInstanceData | null): EntitlementInfo {
  if (!appInstance) {
    // In local development or fallback when no Wix App Instance is provided
    return {
      state: 'TRIAL_ACTIVE',
      isEntitled: true,
      canManageCharts: true,
      canRenderChart: true,
      planTier: 'pro',
      daysRemaining: 14,
      isTrial: true,
      freeTrialAvailable: false,
      packageName: 'Pro Trial',
    };
  }

  const isFree = appInstance.isFree ?? true;
  const freeTrialAvailable = appInstance.freeTrialAvailable ?? false;
  const billing = appInstance.billing;
  const expirationDateStr = billing?.expirationDate;
  const expirationDate = expirationDateStr ? new Date(expirationDateStr) : null;
  const now = new Date();
  const isPastExpiration = expirationDate ? expirationDate.getTime() < now.getTime() : false;

  const freeTrialInfo = billing?.freeTrialInfo;
  const trialStatus = freeTrialInfo?.status;
  const isFreeTrial =
    trialStatus === 'IN_PROGRESS' ||
    freeTrialInfo?.isFreeTrial === true ||
    (freeTrialInfo?.endDate && trialStatus !== 'ENDED');

  let daysRemaining: number | undefined;
  if (freeTrialInfo?.daysRemaining !== undefined) {
    daysRemaining = freeTrialInfo.daysRemaining;
  } else if (freeTrialInfo?.endDate) {
    const end = new Date(freeTrialInfo.endDate);
    daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  } else if (expirationDate) {
    daysRemaining = Math.max(0, Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  const packageName = billing?.packageName?.toLowerCase() || '';
  const planTier: PlanTier = packageName.includes('enterprise')
    ? 'enterprise'
    : packageName.includes('pro')
    ? 'pro'
    : 'starter';

  // 1. Trial Ended
  if (trialStatus === 'ENDED') {
    return {
      state: 'TRIAL_EXPIRED',
      isEntitled: false,
      canManageCharts: false,
      canRenderChart: false,
      planTier,
      packageName: billing?.packageName,
      isTrial: true,
      daysRemaining: 0,
      freeTrialAvailable: false,
    };
  }

  // 2. Active Free Trial
  if (isFreeTrial) {
    if (isPastExpiration || (daysRemaining !== undefined && daysRemaining <= 0)) {
      return {
        state: 'TRIAL_EXPIRED',
        isEntitled: false,
        canManageCharts: false,
        canRenderChart: false,
        planTier,
        packageName: billing?.packageName,
        isTrial: true,
        daysRemaining: 0,
        freeTrialAvailable: false,
      };
    }
    return {
      state: 'TRIAL_ACTIVE',
      isEntitled: true,
      canManageCharts: true,
      canRenderChart: true,
      planTier,
      packageName: billing?.packageName || 'Pro Free Trial',
      isTrial: true,
      daysRemaining: daysRemaining ?? 14,
      expirationDate: freeTrialInfo?.endDate ? new Date(freeTrialInfo.endDate).toISOString() : expirationDateStr ?? undefined,
      freeTrialAvailable: false,
    };
  }

  // 3. Paid active plan
  if (!isFree) {
    if (isPastExpiration) {
      return {
        state: 'EXPIRED',
        isEntitled: false,
        canManageCharts: false,
        canRenderChart: false,
        planTier,
        packageName: billing?.packageName,
        isTrial: false,
        freeTrialAvailable: false,
      };
    }
    if (billing?.autoRenewing === false) {
      return {
        state: 'CANCEL_PENDING_EXPIRATION',
        isEntitled: true,
        canManageCharts: true,
        canRenderChart: true,
        planTier,
        packageName: billing?.packageName,
        expirationDate: expirationDateStr ?? undefined,
        isTrial: false,
        freeTrialAvailable: false,
      };
    }
    return {
      state: 'PAID_ACTIVE',
      isEntitled: true,
      canManageCharts: true,
      canRenderChart: true,
      planTier,
      packageName: billing?.packageName,
      expirationDate: expirationDateStr ?? undefined,
      isTrial: false,
      freeTrialAvailable: false,
    };
  }

  // 4. Free Tier (Free trial available to claim)
  if (isFree && freeTrialAvailable) {
    return {
      state: 'FREE_TRIAL_AVAILABLE',
      isEntitled: true,
      canManageCharts: true,
      canRenderChart: true,
      planTier: 'starter',
      isTrial: false,
      freeTrialAvailable: true,
    };
  }

  // 5. Free Tier (Free trial not available or previously used)
  if (isFree && !freeTrialAvailable) {
    return {
      state: 'FREE_NO_TRIAL',
      isEntitled: true,
      canManageCharts: true,
      canRenderChart: true,
      planTier: 'starter',
      isTrial: false,
      freeTrialAvailable: false,
    };
  }

  return {
    state: 'BILLING_UNKNOWN',
    isEntitled: false,
    canManageCharts: false,
    canRenderChart: false,
    planTier: 'starter',
    isTrial: false,
    freeTrialAvailable: false,
  };
}

/**
 * Server-side check for entitlement using current Wix App Instance API.
 */
export async function getAppEntitlement(): Promise<EntitlementInfo> {
  try {
    const res = await appInstances.getAppInstance();
    const instanceData = (res as any)?.instance ?? res;
    return normalizeEntitlement(instanceData as any);
  } catch (error) {
    console.warn('[EntitlementService] Could not fetch AppInstance from Wix SDK, falling back:', error);
    return normalizeEntitlement(null);
  }
}

/**
 * Server-side gate for protected storefront endpoints.
 */
export async function verifyStorefrontEntitlement(): Promise<boolean> {
  const entitlement = await getAppEntitlement();
  return entitlement.canRenderChart;
}
