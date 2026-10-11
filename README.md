# Brunka Bank — Backend (démo)

Un vrai backend Node.js avec authentification côté serveur, comptes et
virements. Contrairement au site de démonstration (qui simule tout dans le
navigateur via `localStorage`), ce serveur garde les mots de passe, les
soldes et les transactions dans une vraie base de données, et applique les
règles de sécurité côté serveur — un utilisateur ne peut plus simplement
modifier son solde depuis les outils de développement du navigateur.

**Ceci reste un projet de démonstration, pas un système bancaire réel.**
Avant tout hébergement public avec de vrais utilisateurs ou de vrais
fonds, il faut : un audit de sécurité indépendant, le respect des
réglementations bancaires locales (licence, DSP2, lutte anti-blanchiment),
HTTPS en production, une politique de sauvegarde, et un avocat spécialisé
en droit bancaire/fintech.

## Ce qui est réellement implémenté

- **Inscription / connexion** avec mots de passe hachés (`scrypt`, jamais
  stockés en clair), limitation du débit (anti brute-force), blocage de
  compte temporaire après 8 échecs, message d'erreur identique que l'email
  existe ou non (anti-énumération des comptes).
- **Sessions côté serveur** : un jeton aléatoire est envoyé au navigateur
  dans un cookie `HttpOnly` + `Secure`, mais seul son empreinte SHA-256 est
  stockée en base — une fuite de la base ne permet pas de réutiliser les
  sessions existantes.
- **Protection CSRF** (double-submit cookie) : toute action qui modifie des
  données (créer un compte, faire un virement) exige un jeton CSRF envoyé
  en en-tête, qui doit correspondre au cookie — empêche un site tiers
  malveillant de déclencher des actions à l'insu de l'utilisateur.
- **Comptes et virements réels** : les soldes sont stockés en centimes
  (jamais en nombres à virgule, pour éviter les erreurs d'arrondi), chaque
  virement interne crée deux écritures liées (débit + crédit), et le débit
  est garanti atomique même en cas de requêtes simultanées (testé avec 20
  virements concurrents contre un solde insuffisant pour seulement 10 —
  exactement 10 réussissent, jamais de solde négatif).
- **Clé d'idempotence** sur `POST /api/transfers` : rejouer la même requête
  réseau (par exemple après une coupure) ne débite jamais deux fois.
- **Vérification de propriété** sur chaque compte : un utilisateur ne peut
  ni consulter ni débiter le compte d'un autre (testé explicitement).
- **Validation IBAN** par la vraie somme de contrôle ISO 7064 (MOD-97) pour
  les virements externes.
- **En-têtes de sécurité** sur chaque réponse (anti-clickjacking, anti-sniffing,
  CSP stricte, HSTS) et CORS restreint à une seule origine explicite.

## Ce qui N'EST PAS implémenté (à prévoir avant une mise en production réelle)

- Pas de connexion à un vrai réseau bancaire (SEPA, SWIFT…) : les virements
  externes enregistrent seulement le débit local, l'argent ne part nulle
  part réellement.
- Pas de 2FA / authentification forte (obligatoire pour un vrai service
  bancaire en Europe sous DSP2).
- Pas d'envoi d'email (confirmation d'inscription, alerte de connexion,
  réinitialisation de mot de passe).
- Pas de journal d'audit dédié ni de détection de fraude.
- `node:sqlite` est encore une fonctionnalité expérimentale de Node.js ;
  pour une vraie mise en production, prévoir PostgreSQL ou MySQL.
- Pas de limitation de débit distribuée (le limiteur actuel est en mémoire,
  donc propre à un seul processus serveur).

## Démarrer le serveur

Nécessite Node.js 22.5 ou plus récent (pour `node:sqlite`). Aucune
dépendance externe à installer (`npm install` n'est pas nécessaire).

```bash
cd backend
PORT=3001 DB_PATH=data/bank.db CORS_ORIGIN=http://localhost:5173 node src/server.js
```

Variables d'environnement :
- `PORT` — port d'écoute (défaut `3001`)
- `DB_PATH` — chemin du fichier SQLite (défaut `data/bank.db`, utiliser
  `:memory:` pour une base éphémère)
- `CORS_ORIGIN` — la seule origine autorisée à appeler l'API avec cookies
  (défaut `http://localhost:5173`, l'URL habituelle de Vite en développement)

## Lancer les tests

```bash
npm test
# équivalent à : node --test test/*.test.js
```

27 tests (unitaires + intégration + un test de concurrence dédié), tous
passants : hachage de mot de passe, limiteur de débit, validations,
inscription/connexion/déconnexion, CSRF, création de comptes, virements
internes et externes, rejeu de clé d'idempotence, isolation entre
utilisateurs, et un test qui envoie 20 virements simultanés contre un
compte ne pouvant en couvrir que 10, pour vérifier qu'aucune situation de
compétition ne permet de passer le solde en négatif.

## Aperçu de l'API

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte utilisateur |
| POST | `/api/auth/login` | Se connecter |
| POST | `/api/auth/logout` | Se déconnecter |
| GET | `/api/auth/me` | Utilisateur courant |
| GET | `/api/accounts` | Lister mes comptes bancaires |
| POST | `/api/accounts` | Créer un compte bancaire (checking/savings/investment) |
| GET | `/api/accounts/:id/transactions` | Historique d'un compte |
| POST | `/api/transfers` | Effectuer un virement |

Toutes les routes `POST` qui modifient des données (comptes, virements)
exigent l'en-tête `X-CSRF-Token` avec la valeur du cookie `csrf_token`
reçu à la connexion.

## Brancher le site React existant

Ce backend est indépendant du site statique déjà livré (qui simule tout
dans le navigateur). Pour les connecter, il faudrait remplacer les appels
à `lib/auth.ts` (qui utilise `localStorage`) par des appels `fetch()` vers
ces routes, avec `credentials: 'include'` pour que les cookies de session
soient envoyés. C'est une étape de développement à part, non incluse ici.
