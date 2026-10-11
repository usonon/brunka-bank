import { hashPassword, verifyPassword } from '../lib/password.js';
import { createSession, resolveSession, revokeSession } from '../lib/session.js';
import { requireEmail, requireString } from '../lib/validate.js';
import { ValidationError, AuthError, ConflictError, RateLimitError } from '../lib/errors.js';
import { serializeCookie, clearCookie, appendSetCookie } from '../lib/http.js';
import { generateCsrfToken, CSRF_COOKIE } from '../lib/csrf.js';
import { createStarterAccounts } from '../seed.js';

export const SESSION_COOKIE = 'session';
const LOCK_THRESHOLD = 8;
const LOCK_MS = 5 * 60 * 1000;

function setAuthCookies(res, token, expiresAt) {
  const maxAgeSeconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  appendSetCookie(res, serializeCookie(SESSION_COOKIE, token, { maxAgeSeconds, httpOnly: true, secure: true }));
  appendSetCookie(
    res,
    serializeCookie(CSRF_COOKIE, generateCsrfToken(), { maxAgeSeconds, httpOnly: false, secure: true })
  );
}

function publicUser(row) {
  return { id: row.id ?? row.user_id, email: row.email, fullName: row.full_name };
}

export function registerAuthRoutes(router, { db, limiters }) {
  router.post('/api/auth/register', async (ctx) => {
    if (!limiters.registerByIp.check(ctx.ip, { windowMs: 60 * 60 * 1000, max: 10 })) {
      throw new RateLimitError('Too many registration attempts. Please try again later.');
    }
    const email = requireEmail(ctx.body.email);
    const password = requireString(ctx.body.password, 'password', { min: 8, max: 128 });
    const fullName = requireString(ctx.body.fullName, 'fullName', { min: 1, max: 120 });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) throw new ConflictError('An account with this email already exists');

    const passwordHash = hashPassword(password);
    const info = db
      .prepare('INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)')
      .run(email, passwordHash, fullName);
    const userId = Number(info.lastInsertRowid);
    createStarterAccounts(db, userId);

    const { token, expiresAt } = createSession(db, userId, ctx.req.headers['user-agent'] ?? null);
    setAuthCookies(ctx.res, token, expiresAt);

    return { status: 201, body: { user: { id: userId, email, fullName } } };
  });

  router.post('/api/auth/login', async (ctx) => {
    const email = requireEmail(ctx.body.email);
    const password = requireString(ctx.body.password, 'password', { min: 1, max: 128 });

    const byIpOk = limiters.loginByIp.check(ctx.ip, { windowMs: 15 * 60 * 1000, max: 20 });
    const byEmailOk = limiters.loginByEmail.check(email, { windowMs: 15 * 60 * 1000, max: 10 });
    if (!byIpOk || !byEmailOk) {
      throw new RateLimitError('Too many login attempts. Please try again later.');
    }

    // Deliberately identical error for "no such user" and "wrong password"
    // so a caller can't use this endpoint to enumerate registered emails.
    const genericFailure = () => new AuthError('Invalid email or password');

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) throw genericFailure();

    if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
      throw genericFailure();
    }

    const ok = verifyPassword(password, user.password_hash);
    if (!ok) {
      const failedLogins = user.failed_logins + 1;
      if (failedLogins >= LOCK_THRESHOLD) {
        const lockedUntil = new Date(Date.now() + LOCK_MS).toISOString();
        db.prepare('UPDATE users SET failed_logins = ?, locked_until = ? WHERE id = ?').run(
          failedLogins,
          lockedUntil,
          user.id
        );
      } else {
        db.prepare('UPDATE users SET failed_logins = ? WHERE id = ?').run(failedLogins, user.id);
      }
      throw genericFailure();
    }

    db.prepare('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ?').run(user.id);

    const { token, expiresAt } = createSession(db, user.id, ctx.req.headers['user-agent'] ?? null);
    setAuthCookies(ctx.res, token, expiresAt);

    return { status: 200, body: { user: publicUser(user) } };
  });

  router.post('/api/auth/logout', async (ctx) => {
    const token = ctx.cookies[SESSION_COOKIE];
    if (token) revokeSession(db, token);
    appendSetCookie(ctx.res, clearCookie(SESSION_COOKIE, { httpOnly: true, secure: true }));
    appendSetCookie(ctx.res, clearCookie(CSRF_COOKIE, { httpOnly: false, secure: true }));
    return { status: 200, body: { ok: true } };
  });

  router.get('/api/auth/me', async (ctx) => {
    const session = requireSession(ctx, db);
    return { status: 200, body: { user: publicUser(session) } };
  });
}

export function requireSession(ctx, db) {
  const token = ctx.cookies[SESSION_COOKIE];
  const session = resolveSession(db, token);
  if (!session) throw new AuthError();
  return session;
}
