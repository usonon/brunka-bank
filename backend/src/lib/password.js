import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

// scrypt cost parameters. N=2**14 keeps peak memory (~128 * N * r bytes)
// comfortably under Node's default 32MiB scrypt maxmem ceiling while still
// being expensive enough to resist offline brute-forcing of a DB leak.
// We also pass an explicit higher maxmem so this stays correct even if N
// is tuned up later.
const SCRYPT_N = 2 ** 14;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;

function scrypt(password, salt) {
  return scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  });
}

// Self-describing stored format so cost parameters can change later
// without breaking verification of existing hashes.
export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scrypt(password, salt);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  try {
    const parts = String(stored).split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
    const [, nStr, rStr, pStr, saltHex, hashHex] = parts;
    const n = Number(nStr);
    const r = Number(rStr);
    const p = Number(pStr);
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    if (!salt.length || !expected.length) return false;
    const actual = scryptSync(password, salt, expected.length, {
      N: n,
      r,
      p,
      maxmem: SCRYPT_MAXMEM,
    });
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
