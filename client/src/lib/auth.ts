import { useEffect, useState } from 'react';
import { api, ApiError, translateApiError } from './api';

// Authentification RÉELLE côté serveur (voir /backend). Le mot de passe
// n'est jamais stocké dans le navigateur, la session repose sur un cookie
// HttpOnly géré par le serveur, et les soldes ne peuvent plus être modifiés
// depuis les outils de développement du navigateur comme avec l'ancienne
// version (simulée en localStorage).

export interface SessionUser {
  id: number;
  email: string;
  name: string;
}

interface ApiUser {
  id: number;
  email: string;
  fullName: string;
}

const SESSION_EVENT = 'brunka:session';

// Identifiants du compte de démonstration pré-créé par le back-end au
// démarrage (voir backend/src/seed.js) — toujours utilisables sans avoir
// à s'inscrire d'abord.
export const DEMO_ACCOUNT = { email: 'demo@brunka-bank.example', password: 'DemoBrunka2026!' };

let currentUser: SessionUser | null = null;
let sessionKnown = false; // true once the initial /api/auth/me check has resolved
let initPromise: Promise<void> | null = null;

function toSessionUser(u: ApiUser): SessionUser {
  return { id: u.id, email: u.email, name: u.fullName };
}

function setSession(user: SessionUser | null) {
  currentUser = user;
  sessionKnown = true;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

async function loadSession(): Promise<void> {
  try {
    const data = await api.get<{ user: ApiUser }>('/api/auth/me');
    setSession(toSessionUser(data.user));
  } catch {
    setSession(null);
  }
}

// Dedupe concurrent callers (Header + Dashboard both mount useSession on
// the same page) into a single network request.
function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = loadSession();
  return initPromise;
}

export function getSession(): SessionUser | null {
  return currentUser;
}

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
    const data = await api.post<{ user: ApiUser }>('/api/auth/register', {
      email: input.email,
      password: input.password,
      fullName,
    });
    setSession(toSessionUser(data.user));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateApiError(err) };
  }
}

export async function login(
  emailInput: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const data = await api.post<{ user: ApiUser }>('/api/auth/login', { email: emailInput, password });
    setSession(toSessionUser(data.user));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: translateApiError(err) };
  }
}

// Synchronous-looking (like the old localStorage version) so existing
// call sites (`logout()` without await) still update the UI instantly;
// the network call to revoke the server session happens in the background.
export function logout() {
  setSession(null);
  api.post('/api/auth/logout', {}).catch(() => {
    /* la session est déjà effacée côté client, l'appel réseau est au mieux */
  });
}

export function useSession(): SessionUser | null | undefined {
  const [user, setUser] = useState<SessionUser | null | undefined>(sessionKnown ? currentUser : undefined);

  useEffect(() => {
    let active = true;
    ensureInit().then(() => {
      if (active) setUser(getSession());
    });
    const sync = () => setUser(getSession());
    window.addEventListener(SESSION_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(SESSION_EVENT, sync);
    };
  }, []);

  return user;
}

export { ApiError };
