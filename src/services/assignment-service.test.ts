import test from 'node:test';
import assert from 'node:assert';
import { getAssignments, createAssignment, resolveChartForProduct } from './assignment-service';

test('assignment-service: getAssignments pagination and filtering', async () => {
  const result = await getAssignments({ page: 1, limit: 10 });
  assert.ok(result.items.length > 0);
  assert.strictEqual(result.page, 1);
  assert.ok(result.totalCount >= result.items.length);
});

test('assignment-service: createAssignment adds assignment to memory', async () => {
  const initial = await getAssignments();
  const created = await createAssignment({
    chartId: 'chart-mens-tops-default',
    assignmentType: 'product',
    productId: 'prod-test-custom',
    active: true,
  });

  assert.ok(created._id);
  assert.strictEqual(created.productId, 'prod-test-custom');

  const after = await getAssignments();
  assert.strictEqual(after.totalCount, initial.totalCount + 1);
});

test('assignment-service: resolves chart for product id', async () => {
  const resolved = await resolveChartForProduct('prod-shirt-001');
  assert.ok(resolved !== null);
  assert.ok(resolved._id);
});

