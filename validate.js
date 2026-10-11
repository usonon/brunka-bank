import { ValidationError } from './errors.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireString(value, field, { min = 1, max = 254 } = {}) {
  if (typeof value !== 'string') throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length < min) throw new ValidationError(`${field} is too short`);
  if (trimmed.length > max) throw new ValidationError(`${field} is too long`);
  return trimmed;
}

export function requireEmail(value) {
  const email = requireString(value, 'email', { min: 3, max: 254 }).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new ValidationError('email is not a valid address');
  return email;
}

export function requirePositiveCents(value, field) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError(`${field} must be an integer number of cents`);
  }
  if (value <= 0) throw new ValidationError(`${field} must be positive`);
  if (value > 1_000_000_000_00) throw new ValidationError(`${field} is too large`);
  return value;
}

export function requireEnum(value, field, allowed) {
  if (!allowed.includes(value)) {
    throw new ValidationError(`${field} must be one of: ${allowed.join(', ')}`);
  }
  return value;
}

// ISO 7064 MOD-97-10 checksum, computed via chunked modulo so we never
// need BigInt even for long IBANs: process the digit string a few
// characters at a time, carrying the running remainder forward.
export function isValidIban(raw) {
  if (typeof raw !== 'string') return false;
  const iban = raw.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let digits = '';
  for (const ch of rearranged) {
    if (ch >= '0' && ch <= '9') {
      digits += ch;
    } else {
      digits += (ch.charCodeAt(0) - 55).toString();
    }
  }
  let remainder = 0;
  for (let i = 0; i < digits.length; i += 7) {
    const chunk = String(remainder) + digits.slice(i, i + 7);
    remainder = Number(chunk) % 97;
  }
  return remainder === 1;
}
