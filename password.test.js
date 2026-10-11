import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../src/lib/password.js';

test('hashPassword produces a self-describing scrypt string', () => {
  const hash = hashPassword('correct horse battery staple');
  assert.ok(hash.startsWith('scrypt$'));
  assert.equal(hash.split('$').length, 6);
});

test('verifyPassword accepts the correct password', () => {
  const hash = hashPassword('my-secret-pw');
  assert.equal(verifyPassword('my-secret-pw', hash), true);
});

test('verifyPassword rejects the wrong password', () => {
  const hash = hashPassword('my-secret-pw');
  assert.equal(verifyPassword('not-the-password', hash), false);
});

test('verifyPassword returns false (not throw) on malformed stored hash', () => {
  assert.equal(verifyPassword('anything', 'not-a-valid-hash'), false);
  assert.equal(verifyPassword('anything', ''), false);
  assert.equal(verifyPassword('anything', 'scrypt$garbage'), false);
});
