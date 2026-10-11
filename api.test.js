import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

const CORS_ORIGIN = 'http://localhost:5173';

let ctx;

// Each test gets its own fresh app (fresh in-memory DB, fresh rate
// limiters) so tests never bleed state into each other via shared
// rate-limit counters or shared rows.
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

// Hand-rolled cookie jar: fetch() in Node doesn't persist cookies across
// calls automatically, so each test client tracks and replays them itself.
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
    post: (path, body, { csrf = true } = {}) =>
      request('POST', path, body, csrf && csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    postNoCsrf: (path, body) => request('POST', path, body),
    postIdempotent: (path, body, key) =>
      request('POST', path, body, {
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        'Idempotency-Key': key,
      }),
  };
}

async function registerUser(client, overrides = {}) {
  const email = overrides.email ?? `user${Math.random().toString(36).slice(2)}@example.com`;
  const res = await client.post('/api/auth/register', {
    email,
    password: overrides.password ?? 'correct-horse-battery',
    fullName: overrides.fullName ?? 'Alice Example',
  });
  return { email, res };
}

test('register -> me -> logout -> me fails', async () => {
  const client = makeClient(ctx.baseUrl);
  const { res } = await registerUser(client);
  assert.equal(res.status, 201);

  const me = await client.get('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, res.body.user.email);

  const logout = await client.post('/api/auth/logout', {});
  assert.equal(logout.status, 200);

  const meAfter = await client.get('/api/auth/me');
  assert.equal(meAfter.status, 401);
});

test('duplicate email registration is rejected', async () => {
  const client = makeClient(ctx.baseUrl);
  const email = 'dup@example.com';
  await registerUser(client, { email });

  const client2 = makeClient(ctx.baseUrl);
  const { res } = await registerUser(client2, { email });
  assert.equal(res.status, 409);
});

test('login fails identically for unknown email and wrong password', async () => {
  const client = makeClient(ctx.baseUrl);
  const email = 'known@example.com';
  await registerUser(client, { email, password: 'correct-horse-battery' });

  const freshClient = makeClient(ctx.baseUrl);
  const wrongPassword = await freshClient.post('/api/auth/login', { email, password: 'wrong' });
  const unknownEmail = await freshClient.post('/api/auth/login', {
    email: 'nobody@example.com',
    password: 'whatever',
  });

  assert.equal(wrongPassword.status, 401);
  assert.equal(unknownEmail.status, 401);
  assert.equal(wrongPassword.body.error, unknownEmail.body.error);
});

test('login success sets session and csrf cookies', async () => {
  const client = makeClient(ctx.baseUrl);
  const email = 'login-success@example.com';
  await registerUser(client, { email, password: 'correct-horse-battery' });
  await client.post('/api/auth/logout', {});

  const loginClient = makeClient(ctx.baseUrl);
  const login = await loginClient.post('/api/auth/login', { email, password: 'correct-horse-battery' });
  assert.equal(login.status, 200);

  const me = await loginClient.get('/api/auth/me');
  assert.equal(me.status, 200);
});

test('state-changing requests require a matching CSRF token', async () => {
  const client = makeClient(ctx.baseUrl);
  await registerUser(client);

  const withoutCsrf = await client.postNoCsrf('/api/accounts', { type: 'checking', name: 'Main' });
  assert.equal(withoutCsrf.status, 403);

  const withCsrf = await client.post('/api/accounts', { type: 'checking', name: 'Main' });
  assert.equal(withCsrf.status, 201);
});

test('new accounts start at a zero balance and list correctly', async () => {
  const client = makeClient(ctx.baseUrl);
  await registerUser(client);
  await client.post('/api/accounts', { type: 'checking', name: 'Main' });
  await client.post('/api/accounts', { type: 'savings', name: 'Savings' });

  const list = await client.get('/api/accounts');
  assert.equal(list.status, 200);
  assert.equal(list.body.accounts.length, 2);
  for (const acc of list.body.accounts) assert.equal(acc.balance_cents, 0);
});

test('transfer with insufficient balance is rejected and moves nothing', async () => {
  const client = makeClient(ctx.baseUrl);
  await registerUser(client);
  const a = await client.post('/api/accounts', { type: 'checking', name: 'A' });
  const b = await client.post('/api/accounts', { type: 'savings', name: 'B' });

  const transfer = await client.post('/api/transfers', {
    fromAccountId: a.body.account.id,
    toAccountId: b.body.account.id,
    amountCents: 500,
  });
  assert.equal(transfer.status, 400);

  const list = await client.get('/api/accounts');
  for (const acc of list.body.accounts) assert.equal(acc.balance_cents, 0);
});

test('internal transfer atomically moves money and records both legs', async () => {
  const client = makeClient(ctx.baseUrl);
  await registerUser(client);
  const a = await client.post('/api/accounts', { type: 'checking', name: 'A' });
  const b = await client.post('/api/accounts', { type: 'savings', name: 'B' });

  // Fund account A directly via the DB (no deposit endpoint in this demo).
  ctx.db.prepare('UPDATE accounts SET balance_cents = 1000 WHERE id = ?').run(a.body.account.id);

  const transfer = await client.post('/api/transfers', {
    fromAccountId: a.body.account.id,
    toAccountId: b.body.account.id,
    amountCents: 400,
    label: 'Test transfer',
  });
  assert.equal(transfer.status, 201);
  assert.equal(transfer.body.fromAccountBalanceCents, 600);

  const list = await client.get('/api/accounts');
  const byId = Object.fromEntries(list.body.accounts.map((acc) => [acc.id, acc]));
  assert.equal(byId[a.body.account.id].balance_cents, 600);
  assert.equal(byId[b.body.account.id].balance_cents, 400);

  const aTx = await client.get(`/api/accounts/${a.body.account.id}/transactions`);
  const bTx = await client.get(`/api/accounts/${b.body.account.id}/transactions`);
  assert.equal(aTx.body.transactions[0].direction, 'debit');
  assert.equal(bTx.body.transactions[0].direction, 'credit');
  assert.equal(aTx.body.transactions[0].transfer_id, bTx.body.transactions[0].transfer_id);
});

test('external transfer requires a valid IBAN', async () => {
  const client = makeClient(ctx.baseUrl);
  await registerUser(client);
  const a = await client.post('/api/accounts', { type: 'checking', name: 'A' });
  ctx.db.prepare('UPDATE accounts SET balance_cents = 1000 WHERE id = ?').run(a.body.account.id);

  const bad = await client.post('/api/transfers', {
    fromAccountId: a.body.account.id,
    toIban: 'not-an-iban',
    toName: 'Bob',
    amountCents: 100,
  });
  assert.equal(bad.status, 400);

  const good = await client.post('/api/transfers', {
    fromAccountId: a.body.account.id,
    toIban: 'DE89370400440532013000',
    toName: 'Bob',
    amountCents: 100,
  });
  assert.equal(good.status, 201);
});

test('idempotency key replay prevents double-charging', async () => {
  const client = makeClient(ctx.baseUrl);
  await registerUser(client);
  const a = await client.post('/api/accounts', { type: 'checking', name: 'A' });
  const b = await client.post('/api/accounts', { type: 'savings', name: 'B' });
  ctx.db.prepare('UPDATE accounts SET balance_cents = 1000 WHERE id = ?').run(a.body.account.id);

  const key = 'idem-key-123';
  const payload = { fromAccountId: a.body.account.id, toAccountId: b.body.account.id, amountCents: 300 };

  const first = await client.postIdempotent('/api/transfers', payload, key);
  const second = await client.postIdempotent('/api/transfers', payload, key);

  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.deepEqual(first.body, second.body);

  const list = await client.get('/api/accounts');
  const acctA = list.body.accounts.find((acc) => acc.id === a.body.account.id);
  assert.equal(acctA.balance_cents, 700); // debited exactly once, not twice
});

test('a user cannot view or transfer from another user\'s account', async () => {
  const alice = makeClient(ctx.baseUrl);
  await registerUser(alice, { email: 'alice@example.com' });
  const aliceAcc = await alice.post('/api/accounts', { type: 'checking', name: 'Alice Main' });
  ctx.db.prepare('UPDATE accounts SET balance_cents = 1000 WHERE id = ?').run(aliceAcc.body.account.id);

  const bob = makeClient(ctx.baseUrl);
  await registerUser(bob, { email: 'bob@example.com' });
  const bobAcc = await bob.post('/api/accounts', { type: 'checking', name: 'Bob Main' });

  const bobViewsAlice = await bob.get(`/api/accounts/${aliceAcc.body.account.id}/transactions`);
  assert.equal(bobViewsAlice.status, 403);

  const bobStealsFromAlice = await bob.post('/api/transfers', {
    fromAccountId: aliceAcc.body.account.id,
    toAccountId: bobAcc.body.account.id,
    amountCents: 500,
  });
  assert.equal(bobStealsFromAlice.status, 403);
});

test('unauthenticated requests to protected routes are rejected', async () => {
  const client = makeClient(ctx.baseUrl);
  const me = await client.get('/api/auth/me');
  assert.equal(me.status, 401);

  const accounts = await client.get('/api/accounts');
  assert.equal(accounts.status, 401);
});
