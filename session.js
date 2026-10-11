import { randomBytes, createHash } from 'node:crypto';

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

// Only the SHA-256 hash of the session token is ever persisted, so a
// database leak can't be replayed as a live session cookie.
export function createSession(db, userId, userAgent) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_TTL_MS).toISOString();
  db.prepare(
    `INSERT INTO sessions (user_id, token_hash, user_agent, expires_at) VALUES (?, ?, ?, ?)`
  ).run(userId, tokenHash, userAgent ?? null, expiresAt);
  return { token, expiresAt };
}

export function resolveSession(db, token) {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const row = db
    .prepare(
      `SELECT s.id as session_id, s.user_id, s.expires_at, s.revoked_at, u.email, u.full_name
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`
    )
    .get(tokenHash);
  if (!row) return null;
  if (row.revoked_at) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  return row;
}

export function revokeSession(db, token) {
  if (!token) return;
  const tokenHash = hashToken(token);
  db.prepare(
    `UPDATE sessions SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE token_hash = ?`
  ).run(tokenHash);
}
