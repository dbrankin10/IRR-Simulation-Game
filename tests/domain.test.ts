import { test } from 'node:test';
import assert from 'node:assert/strict';
import { consume } from '../packages/domain/inventory.ts';
import { advanceBoundary } from '../packages/domain/time.ts';

test('canonical interceptor example and rejection of extra expenditure', () => {
  const original = { campaignId: 'a', resourceId: 'interceptor', quantity: 1032n, reserved: 0n };
  const remaining = consume(original, 'a', 700n);
  assert.equal(remaining.quantity, 332n);
  assert.equal(original.quantity, 1032n);
  assert.throws(() => consume(remaining, 'a', 333n), /INSUFFICIENT_STOCK/);
});
test('campaign identity and reservations constrain consumption', () => {
  const stock = { campaignId: 'a', resourceId: 'fuel', quantity: 100n, reserved: 80n };
  assert.throws(() => consume(stock, 'b', 1n), /CAMPAIGN_MISMATCH/);
  assert.throws(() => consume(stock, 'a', 21n), /INSUFFICIENT_STOCK/);
  assert.throws(() => consume(stock, 'a', -1n), /INVALID_QUANTITY/);
});
test('crisis stops at detection, never hidden occurrence or unrelated events', () => {
  const day = (d: number) => Date.UTC(2030, 5, d);
  const crises = [
    { occurredAt: day(3), learnedAt: null, severity: 5, decisionRelevant: true },
    { occurredAt: day(5), learnedAt: day(5), severity: 5, decisionRelevant: false },
    { occurredAt: day(10), learnedAt: day(12), severity: 4, decisionRelevant: true }
  ];
  assert.equal(advanceBoundary(day(1), day(30), crises), day(12));
  assert.equal(advanceBoundary(day(1), day(9), crises), day(9));
});
test('invalid detection and backwards time are rejected', () => {
  assert.throws(() => advanceBoundary(10, 9, []), /INVALID_INTERVAL/);
  assert.throws(() => advanceBoundary(1, 20, [{ occurredAt: 10, learnedAt: 9, severity: 4, decisionRelevant: true }]), /INVALID_DETECTION_TIME/);
});
