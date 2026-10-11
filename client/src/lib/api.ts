// Client HTTP pour le vrai back-end (voir /backend). Toutes les requêtes
// passent par un proxy Vite en développement (`/api/...` → backend sur
// VITE_API_URL ou http://localhost:3001, voir vite.config.ts), ce qui
// évite tout problème de cookies cross-site en local. En production,
// définir VITE_API_URL avec l'URL absolue du back-end déployé.

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

function readCookie(name: string): string | null {
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (method !== 'GET') {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers.set(CSRF_HEADER, csrf);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, method, headers, credentials: 'include' });
  } catch {
    throw new ApiError(0, 'Impossible de contacter le serveur. Vérifiez votre connexion.');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, (data && data.error) || 'Une erreur est survenue');
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown, extraHeaders?: Record<string, string>) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: extraHeaders,
    }),
};

// Traduit les messages d'erreur du back-end (en anglais) vers un message
// en français adapté à l'interface. Les messages non reconnus retombent
// sur un texte générique plutôt que d'afficher de l'anglais brut.
const ERROR_TRANSLATIONS: Record<string, string> = {
  'Insufficient balance': 'Solde insuffisant sur le compte sélectionné',
  'toIban is not a valid IBAN': "L'IBAN saisi n'est pas valide",
  'Destination account not found': 'Compte de destination introuvable',
  'Cannot transfer an account to itself': 'Choisissez un compte de destination différent',
  'Provide exactly one of toAccountId (internal) or toIban (external)': 'Choisissez une destination valide',
  'Account not found': 'Compte introuvable',
  'You do not have access to this account': "Vous n'avez pas accès à ce compte",
  'Missing CSRF token': 'Session expirée, merci de vous reconnecter.',
  'Invalid CSRF token': 'Session expirée, merci de vous reconnecter.',
  'Too many transfer attempts. Please slow down.': 'Trop de tentatives, merci de patienter un instant.',
  'Too many registration attempts. Please try again later.': 'Trop de tentatives, merci de réessayer plus tard.',
  'Too many login attempts. Please try again later.': 'Trop de tentatives, merci de réessayer plus tard.',
  'Invalid email or password': 'E-mail ou mot de passe incorrect',
  'An account with this email already exists': 'Un compte existe déjà avec cet e-mail',
  'Authentication required': 'Veuillez vous connecter',
};

export function translateApiError(err: unknown): string {
  if (err instanceof ApiError) {
    return ERROR_TRANSLATIONS[err.message] ?? err.message ?? 'Une erreur est survenue';
  }
  return 'Une erreur est survenue. Veuillez réessayer.';
}

// --- Types reflétant exactement les réponses du back-end (voir backend/src/routes) ---

export type AccountType = 'checking' | 'savings' | 'investment';

export interface ApiAccount {
  id: number;
  type: AccountType;
  iban: string;
  name: string;
  balance_cents: number;
  created_at: string;
}

export interface ApiTransaction {
  id: number;
  transfer_id: string;
  direction: 'debit' | 'credit';
  amount_cents: number;
  counterparty: string | null;
  label: string | null;
  created_at: string;
}

export function listAccounts() {
  return api.get<{ accounts: ApiAccount[] }>('/api/accounts');
}

export function createAccount(input: { type: AccountType; name: string }) {
  return api.post<{ account: ApiAccount }>('/api/accounts', input);
}

export function listTransactions(accountId: number, limit = 20) {
  return api.get<{ transactions: ApiTransaction[] }>(`/api/accounts/${accountId}/transactions?limit=${limit}`);
}

export interface TransferInput {
  fromAccountId: number;
  amountCents: number;
  label?: string | null;
  toAccountId?: number;
  toIban?: string;
  toName?: string;
}

export function createTransfer(input: TransferInput, idempotencyKey: string) {
  return api.post<{ transfer: unknown; fromAccountBalanceCents: number }>('/api/transfers', input, {
    'Idempotency-Key': idempotencyKey,
  });
}
