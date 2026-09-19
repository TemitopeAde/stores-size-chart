import test from 'node:test';
import assert from 'node:assert';
import { parseAppInstance, getAppEntitlement, isStorefrontEntitled } from './entitlement-service';

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

