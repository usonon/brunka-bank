-- Brunka Bank demo backend schema.
-- All monetary values are stored as INTEGER cents to avoid floating point
-- rounding errors. Never store money as REAL/FLOAT.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  failed_logins INTEGER NOT NULL DEFAULT 0,
  locked_until  TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN ('checking','savings','investment')),
  iban           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  balance_cents  INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);

-- Every transfer produces TWO rows here (a debit leg and a credit leg),
-- linked by transfer_id, so each account's ledger is self-contained.
CREATE TABLE IF NOT EXISTS transactions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id   TEXT NOT NULL,
  account_id    INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  direction     TEXT NOT NULL CHECK (direction IN ('debit','credit')),
  amount_cents  INTEGER NOT NULL CHECK (amount_cents > 0),
  counterparty  TEXT,
  label         TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_transfer ON transactions(transfer_id);

CREATE TABLE IF NOT EXISTS sessions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  user_agent  TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at  TEXT NOT NULL,
  revoked_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Scoped per user: (key, user_id) as a composite primary key means an
-- idempotency key is only ever matched against requests from the SAME
-- authenticated user, so one user can never collide with or read back
-- another user's cached response via a guessed/shared key.
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key            TEXT NOT NULL,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  response_body  TEXT NOT NULL,
  status_code    INTEGER NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (key, user_id)
);
