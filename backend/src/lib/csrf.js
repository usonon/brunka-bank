import { randomBytes, timingSafeEqual } from 'node:crypto';
import { ForbiddenError } from './errors.js';

export const CSRF_COOKIE = 'csrf_token';
export const CSRF_HEADER = 'x-csrf-token';

export function generateCsrfToken() {
  return randomBytes(24).toString('hex');
}

// Double-submit-cookie pattern: the csrf cookie is NOT httpOnly (the
// frontend JS must be able to read it) but a cross-site attacker can't
// read it either due to the same-origin policy, so requiring the header
// to match the cookie proves the request came from our own JS.
export function assertCsrf(cookieValue, headerValue) {
  if (!cookieValue || !headerValue) {
    throw new ForbiddenError('Missing CSRF token');
  }
  const a = Buffer.from(String(cookieValue));
  const b = Buffer.from(String(headerValue));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new ForbiddenError('Invalid CSRF token');
  }
}
