import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RateLimiter } from '../src/lib/rateLimit.js';

test('allows requests under the limit', () => {
  const rl = new RateLimiter();
  for (let i = 0; i < 5; i++) {
    assert.equal(rl.check('k', { windowMs: 1000, max: 5 }), true);
  }
});

test('blocks requests over the limit within the window', () => {
  const rl = new RateLimiter();
  for (let i = 0; i < 5; i++) rl.check('k', { windowMs: 60_000, max: 5 });
  assert.equal(rl.check('k', { windowMs: 60_000, max: 5 }), false);
});

test('different keys are tracked independently', () => {
  const rl = new RateLimiter();
  for (let i = 0; i < 5; i++) rl.check('a', { windowMs: 60_000, max: 5 });
  assert.equal(rl.check('b', { windowMs: 60_000, max: 5 }), true);
});

test('sweep removes stale entries', () => {
  const rl = new RateLimiter();
  rl.check('k', { windowMs: 60_000, max: 5 });
  rl.sweep(-1); // everything is "older" than now - (-1)
  assert.equal(rl.hits.has('k'), false);
});
