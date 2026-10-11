import { requireSession } from './auth.js';
import { requireString, requireEnum } from '../lib/validate.js';
import { NotFoundError, ForbiddenError } from '../lib/errors.js';
import { assertCsrf, CSRF_COOKIE, CSRF_HEADER } from '../lib/csrf.js';
import { randomBytes } from 'node:crypto';

const ACCOUNT_TYPES = ['checking', 'savings', 'investment'];

// Deterministic-looking but random demo IBAN. Not a real bank sort code.
function generateDemoIban() {
  const digits = randomBytes(8).toString('hex').replace(/[^0-9]/g, '').padEnd(16, '0').slice(0, 16);
  return `FR76BRKA${digits}`;
}

export function ownedAccountOrThrow(db, accountId, userId) {
  const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId);
  if (!account) throw new NotFoundError('Account not found');
  if (account.user_id !== userId) throw new ForbiddenError('You do not have access to this account');
  return account;
}

export function registerAccountRoutes(router, { db }) {
  router.get('/api/accounts', async (ctx) => {
    const session = requireSession(ctx, db);
    const accounts = db
      .prepare('SELECT id, type, iban, name, balance_cents, created_at FROM accounts WHERE user_id = ? ORDER BY id')
      .all(session.user_id);
    return { status: 200, body: { accounts } };
  });

  router.post('/api/accounts', async (ctx) => {
    const session = requireSession(ctx, db);
    assertCsrf(ctx.cookies[CSRF_COOKIE], ctx.req.headers[CSRF_HEADER]);

    const type = requireEnum(ctx.body.type, 'type', ACCOUNT_TYPES);
    const name = requireString(ctx.body.name, 'name', { min: 1, max: 80 });

    let iban = generateDemoIban();
    // Extremely unlikely collision loop, bounded for safety.
    for (let i = 0; i < 5; i++) {
      const clash = db.prepare('SELECT id FROM accounts WHERE iban = ?').get(iban);
      if (!clash) break;
      iban = generateDemoIban();
    }

    const info = db
      .prepare('INSERT INTO accounts (user_id, type, iban, name, balance_cents) VALUES (?, ?, ?, ?, 0)')
      .run(session.user_id, type, iban, name);

    const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(Number(info.lastInsertRowid));
    return { status: 201, body: { account } };
  });

  router.get('/api/accounts/:id/transactions', async (ctx) => {
    const session = requireSession(ctx, db);
    const accountId = Number(ctx.params.id);
    ownedAccountOrThrow(db, accountId, session.user_id);

    let limit = Number(ctx.query.get('limit') ?? 50);
    if (!Number.isFinite(limit) || limit <= 0) limit = 50;
    limit = Math.min(limit, 200);

    const transactions = db
      .prepare(
        `SELECT id, transfer_id, direction, amount_cents, counterparty, label, created_at
         FROM transactions WHERE account_id = ? ORDER BY id DESC LIMIT ?`
      )
      .all(accountId, limit);

    return { status: 200, body: { transactions } };
  });
}
