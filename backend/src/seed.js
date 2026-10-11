import { hashPassword } from './lib/password.js';
import { generateUniqueDemoIban } from './lib/demoIban.js';

export const DEMO_EMAIL = 'demo@brunka-bank.example';
export const DEMO_PASSWORD = 'DemoBrunka2026!';

// Every new user (including the seeded demo account) starts with three
// pre-funded accounts, purely so the demo is usable right after signing
// up — real banks don't hand out money on registration, this is a stand-in
// for a "deposit" endpoint this demo doesn't implement.
const STARTER_ACCOUNTS = [
  { type: 'checking', name: 'Compte Courant', balanceCents: 543250 },
  { type: 'savings', name: 'Compte Épargne', balanceCents: 1285000 },
  { type: 'investment', name: 'Compte Titres', balanceCents: 2850075 },
];

export function createStarterAccounts(db, userId) {
  for (const starter of STARTER_ACCOUNTS) {
    const iban = generateUniqueDemoIban(db);
    db.prepare(
      'INSERT INTO accounts (user_id, type, iban, name, balance_cents) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, starter.type, iban, starter.name, starter.balanceCents);
  }
}

// Idempotent: safe to call on every server start. Lets the frontend's
// "identifiants de démonstration" (see Login page) always work without
// requiring a manual registration step first.
export function seedDemoAccount(db) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(DEMO_EMAIL);
  if (existing) return;

  const passwordHash = hashPassword(DEMO_PASSWORD);
  const info = db
    .prepare('INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)')
    .run(DEMO_EMAIL, passwordHash, 'Client Démo');
  const userId = Number(info.lastInsertRowid);
  createStarterAccounts(db, userId);
}
