import test from 'node:test';
import assert from 'node:assert';
import { parseAppInstance, getAppEntitlement, isStorefrontEntitled, normalizeEntitlement } from './entitlement-service';

test('entitlement-service: default entitlement without token gives Free tier or Trial in dev', async () => {
  const entitlement = await getAppEntitlement();
  assert.ok(entitlement !== null);
  assert.ok(entitlement.canRenderChart === true);
});

test('entitlement-service: storefront is entitled on active plans', () => {
  assert.strictEqual(isStorefrontEntitled({
    canRenderChart: true,
    isEntitled: true,
    planTier: 'starter',
  }), true);

  assert.strictEqual(isStorefrontEntitled({
    canRenderChart: true,
    isEntitled: true,
    planTier: 'pro',
  }), true);
});

test('entitlement-service: storefront is disabled silently when canRenderChart is false', () => {
  assert.strictEqual(isStorefrontEntitled({
    canRenderChart: false,
    isEntitled: false,
    state: 'EXPIRED',
  }), false);

  assert.strictEqual(isStorefrontEntitled(null), false);
});

test('entitlement-service: parses valid signed app instance token format', () => {
  const payload = {
    instanceId: 'inst-12345',
    appDefId: '75e79d8b-f226-43d6-a8ea-caa526604417',
    packageId: 'growth-monthly',
    billingStatus: 'ACTIVE',
  };
  const token = `sig.${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
  const parsed = parseAppInstance(token);

  assert.strictEqual(parsed?.instanceId, 'inst-12345');
  assert.strictEqual(parsed?.packageId, 'growth-monthly');
  assert.strictEqual(parsed?.billingStatus, 'ACTIVE');
});

test('entitlement-service: normalizeEntitlement handles free trial in progress from Wix SDK', () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);

  const entitlement = normalizeEntitlement({
    instanceId: 'inst-abc',
    isFree: false,
    billing: {
      packageName: 'Pro Trial',
      freeTrialInfo: {
        status: 'IN_PROGRESS',
        endDate: futureDate,
        daysRemaining: 10,
      },
    },
  });

  assert.strictEqual(entitlement.state, 'TRIAL_ACTIVE');
  assert.strictEqual(entitlement.isTrial, true);
  assert.strictEqual(entitlement.daysRemaining, 10);
  assert.strictEqual(entitlement.isEntitled, true);
  assert.strictEqual(entitlement.planTier, 'pro');
});

test('entitlement-service: normalizeEntitlement handles free trial ended from Wix SDK', () => {
  const entitlement = normalizeEntitlement({
    instanceId: 'inst-abc',
    isFree: true,
    billing: {
      packageName: 'Pro Plan',
      freeTrialInfo: {
        status: 'ENDED',
      },
    },
  });

  assert.strictEqual(entitlement.state, 'TRIAL_EXPIRED');
  assert.strictEqual(entitlement.isEntitled, false);
  assert.strictEqual(entitlement.canManageCharts, false);
});

test('entitlement-service: normalizeEntitlement handles active paid plan', () => {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const entitlement = normalizeEntitlement({
    instanceId: 'inst-abc',
    isFree: false,
    billing: {
      packageName: 'Pro Annual',
      autoRenewing: true,
      expirationDate: futureDate.toISOString(),
    },
  });

  assert.strictEqual(entitlement.state, 'PAID_ACTIVE');
  assert.strictEqual(entitlement.isEntitled, true);
  assert.strictEqual(entitlement.isTrial, false);
  assert.strictEqual(entitlement.planTier, 'pro');
});

test('entitlement-service: normalizeEntitlement handles free trial available to claim', () => {
  const entitlement = normalizeEntitlement({
    instanceId: 'inst-abc',
    isFree: true,
    freeTrialAvailable: true,
  });

  assert.strictEqual(entitlement.state, 'FREE_TRIAL_AVAILABLE');
  assert.strictEqual(entitlement.freeTrialAvailable, true);
  assert.strictEqual(entitlement.isEntitled, true);
});


