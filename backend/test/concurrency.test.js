import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

const CORS_ORIGIN = 'http://localhost:5173';
let ctx;

beforeEach(async () => {
  const { server, db } = createApp({ dbPath: ':memory:', corsOrigin: CORS_ORIGIN });
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  ctx = { server, db, baseUrl: `http://localhost:${port}` };
});

afterEach(async () => {
  await new Promise((resolve) => ctx.server.close(resolve));
  ctx.db.close();
});

function makeClient(baseUrl) {
  const jar = new Map();
  let csrfToken = null;

  function applySetCookies(res) {
    const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const cookieStr of raw) {
      const [pair] = cookieStr.split(';');
      const idx = pair.indexOf('=');
      const name = pair.slice(0, idx);
      const value = pair.slice(idx + 1);
      jar.set(name, value);
      if (name === 'csrf_token') csrfToken = value;
    }
  }

  function cookieHeader() {
    return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  }

  async function request(method, path, body, extraHeaders = {}) {
    const headers = { 'Content-Type': 'application/json', ...extraHeaders };
    const cookieStr = cookieHeader();
    if (cookieStr) headers.Cookie = cookieStr;
    const res = await fetch(baseUrl + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    applySetCookies(res);
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    return { status: res.status, body: json };
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body, csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
  };
}

// The core safety property of the transfer endpoint: under concurrent
// load, the account's balance constraint (balance_cents >= 0) must never
// be violated, and the sum of successes must exactly exhaust the funds
// available — no double-spend, no lost update.
test('concurrent transfers never overdraw an account (race-condition check)', async () => {
  const client = makeClient(ctx.baseUrl);
  await client.post('/api/auth/register', {
    email: 'race@example.com',
    password: 'correct-horse-battery',
    fullName: 'Race Tester',
  });
  const a = await client.post('/api/accounts', { type: 'checking', name: 'A' });
  const b = await client.post('/api/accounts', { type: 'savings', name: 'B' });
  ctx.db.prepare('UPDATE accounts SET balance_cents = 1000 WHERE id = ?').run(a.body.account.id);

  const attempts = 20; // 20 x 100 cents against a 1000-cent balance -> exactly 10 should succeed
  const results = await Promise.all(
    Array.from({ length: attempts }, () =>
      client.post('/api/transfers', {
        fromAccountId: a.body.account.id,
        toAccountId: b.body.account.id,
        amountCents: 100,
      })
    )
  );

  const successes = results.filter((r) => r.status === 201);
  const failures = results.filter((r) => r.status === 400);

  assert.equal(successes.length, 10);
  assert.equal(failures.length, 10);

  const list = await client.get('/api/accounts');
  const acctA = list.body.accounts.find((acc) => acc.id === a.body.account.id);
  const acctB = list.body.accounts.find((acc) => acc.id === b.body.account.id);
  assert.equal(acctA.balance_cents, 0);
  assert.equal(acctB.balance_cents, 1000);
});
