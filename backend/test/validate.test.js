import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireString, requireEmail, requirePositiveCents, requireEnum, isValidIban } from '../src/lib/validate.js';
import { ValidationError } from '../src/lib/errors.js';

test('requireString enforces min/max length', () => {
  assert.equal(requireString('hello', 'f'), 'hello');
  assert.throws(() => requireString('', 'f', { min: 1 }), ValidationError);
  assert.throws(() => requireString('x'.repeat(300), 'f', { max: 254 }), ValidationError);
});

test('requireEmail normalizes and validates', () => {
  assert.equal(requireEmail('User@Example.com'), 'user@example.com');
  assert.throws(() => requireEmail('not-an-email'), ValidationError);
});

test('requirePositiveCents enforces integer and positivity', () => {
  assert.equal(requirePositiveCents(100, 'amount'), 100);
  assert.throws(() => requirePositiveCents(0, 'amount'), ValidationError);
  assert.throws(() => requirePositiveCents(-50, 'amount'), ValidationError);
  assert.throws(() => requirePositiveCents(1.5, 'amount'), ValidationError);
  assert.throws(() => requirePositiveCents('100', 'amount'), ValidationError);
});

test('requireEnum restricts to an allowed list', () => {
  assert.equal(requireEnum('savings', 'type', ['checking', 'savings']), 'savings');
  assert.throws(() => requireEnum('bogus', 'type', ['checking', 'savings']), ValidationError);
});

test('isValidIban validates ISO 7064 checksum against known-good IBANs', () => {
  assert.equal(isValidIban('FR1420041010050500013M02606'), true);
  assert.equal(isValidIban('DE89370400440532013000'), true);
  assert.equal(isValidIban('GB29NWBK60161331926819'), true);
});

test('isValidIban rejects malformed or bad-checksum IBANs', () => {
  assert.equal(isValidIban('FR1420041010050500013M02607'), false); // checksum off by one
  assert.equal(isValidIban('not-an-iban'), false);
  assert.equal(isValidIban(''), false);
  assert.equal(isValidIban(123), false);
});
