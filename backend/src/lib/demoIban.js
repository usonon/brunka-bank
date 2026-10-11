import { randomBytes } from 'node:crypto';

// Deterministic-looking but random demo IBAN. Not a real bank sort code —
// "BRKA" is just a made-up bank identifier for this fictional demo bank.
export function generateDemoIban() {
  const digits = randomBytes(8).toString('hex').replace(/[^0-9]/g, '').padEnd(16, '0').slice(0, 16);
  return `FR76BRKA${digits}`;
}

// Picks a free IBAN, retrying a few times on the astronomically unlikely
// collision. Shared by account creation and demo/starter-account seeding
// so there's only one place that knows how a demo IBAN is generated.
export function generateUniqueDemoIban(db) {
  let iban = generateDemoIban();
  for (let i = 0; i < 5; i++) {
    const clash = db.prepare('SELECT id FROM accounts WHERE iban = ?').get(iban);
    if (!clash) break;
    iban = generateDemoIban();
  }
  return iban;
}
