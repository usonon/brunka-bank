import { randomUUID } from 'node:crypto';
import { requireSession } from './auth.js';
import { ownedAccountOrThrow } from './accounts.js';
import { requirePositiveCents, requireString, isValidIban } from '../lib/validate.js';
import { ValidationError, NotFoundError, RateLimitError } from '../lib/errors.js';
import { assertCsrf, CSRF_COOKIE, CSRF_HEADER } from '../lib/csrf.js';

export function registerTransferRoutes(router, { db, limiters }) {
  router.post('/api/transfers', async (ctx) => {
    const session = requireSession(ctx, db);
    assertCsrf(ctx.cookies[CSRF_COOKIE], ctx.req.headers[CSRF_HEADER]);

    if (!limiters.transfersByUser.check(String(session.user_id), { windowMs: 60 * 1000, max: 30 })) {
      throw new RateLimitError('Too many transfer attempts. Please slow down.');
    }

    const idempotencyKey = ctx.req.headers['idempotency-key'];
    if (idempotencyKey && typeof idempotencyKey === 'string') {
      const cached = db
        .prepare('SELECT response_body, status_code FROM idempotency_keys WHERE key = ? AND user_id = ?')
        .get(idempotencyKey, session.user_id);
      if (cached) {
        return { status: cached.status_code, body: JSON.parse(cached.response_body) };
      }
    }

    const fromAccountId = Number(ctx.body.fromAccountId);
    if (!Number.isInteger(fromAccountId)) throw new ValidationError('fromAccountId is required');
    const amountCents = requirePositiveCents(ctx.body.amountCents, 'amountCents');
    const label = ctx.body.label ? requireString(ctx.body.label, 'label', { min: 0, max: 140 }) : null;

    const toAccountId = ctx.body.toAccountId != null ? Number(ctx.body.toAccountId) : null;
    const toIban = ctx.body.toIban != null ? String(ctx.body.toIban).trim() : null;
    const toName = ctx.body.toName != null ? requireString(ctx.body.toName, 'toName', { min: 0, max: 120 }) : null;

    const isInternal = toAccountId != null;
    const isExternal = !!toIban;
    if (isInternal === isExternal) {
      throw new ValidationError('Provide exactly one of toAccountId (internal) or toIban (external)');
    }
    if (isExternal && !isValidIban(toIban)) {
      throw new ValidationError('toIban is not a valid IBAN');
    }

    const fromAccount = ownedAccountOrThrow(db, fromAccountId, session.user_id);

    let toAccount = null;
    if (isInternal) {
      toAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(toAccountId);
      if (!toAccount) throw new NotFoundError('Destination account not found');
      if (toAccount.id === fromAccount.id) {
        throw new ValidationError('Cannot transfer an account to itself');
      }
    }

    const transferId = randomUUID();

    // Safe under node:sqlite's synchronous, single-threaded API: there is
    // no await between the conditional UPDATE and the COMMIT, so no other
    // request can interleave and observe a half-applied transfer. The
    // WHERE balance_cents >= ? clause makes the debit itself atomic: it
    // either updates (and reports changes=1) or doesn't, with no
    // check-then-act race window even under concurrent calls.
    db.exec('BEGIN IMMEDIATE');
    try {
      const debit = db
        .prepare('UPDATE accounts SET balance_cents = balance_cents - ? WHERE id = ? AND balance_cents >= ?')
        .run(amountCents, fromAccount.id, amountCents);

      if (debit.changes === 0) {
        db.exec('ROLLBACK');
        throw new ValidationError('Insufficient balance');
      }

      db.prepare(
        `INSERT INTO transactions (transfer_id, account_id, direction, amount_cents, counterparty, label)
         VALUES (?, ?, 'debit', ?, ?, ?)`
      ).run(transferId, fromAccount.id, amountCents, isInternal ? `Account #${toAccount.id}` : `${toName ?? ''} (${toIban})`.trim(), label);

      if (isInternal) {
        db.prepare('UPDATE accounts SET balance_cents = balance_cents + ? WHERE id = ?').run(amountCents, toAccount.id);
        db.prepare(
          `INSERT INTO transactions (transfer_id, account_id, direction, amount_cents, counterparty, label)
           VALUES (?, ?, 'credit', ?, ?, ?)`
        ).run(transferId, toAccount.id, amountCents, `Account #${fromAccount.id}`, label);
      }
      // External transfers only record the debit leg locally — the funds
      // leave the demo system, there is no real external rail here.

      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // ignore: nothing to roll back if BEGIN itself didn't commit state
      }
      throw err;
    }

    const updatedFrom = db.prepare('SELECT * FROM accounts WHERE id = ?').get(fromAccount.id);
    const responseBody = {
      transfer: {
        id: transferId,
        fromAccountId: fromAccount.id,
        toAccountId: isInternal ? toAccount.id : null,
        toIban: isExternal ? toIban : null,
        amountCents,
        label,
      },
      fromAccountBalanceCents: updatedFrom.balance_cents,
    };

    if (idempotencyKey && typeof idempotencyKey === 'string') {
      db.prepare(
        'INSERT OR IGNORE INTO idempotency_keys (key, user_id, response_body, status_code) VALUES (?, ?, ?, ?)'
      ).run(idempotencyKey, session.user_id, JSON.stringify(responseBody), 201);
    }

    return { status: 201, body: responseBody };
  });
}
