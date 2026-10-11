# Brunka Bank

Site vitrine bancaire (React 19 + Vite + Tailwind + wouter) relié à un
vrai back-end Node.js (voir `/backend`).

## Lancer le projet complet

Deux processus séparés : le back-end (API) et le front-end (site).

```bash
# 1) Back-end — dans un premier terminal
cd backend
node src/server.js
# écoute sur http://localhost:3001, crée data/bank.db au premier lancement

# 2) Front-end — dans un second terminal, à la racine du projet
pnpm install
pnpm dev
# http://localhost:3000, avec /api/* automatiquement redirigé vers le back-end
```

Aucune configuration supplémentaire n'est nécessaire en développement : le
serveur Vite proxifie `/api/*` vers `http://localhost:3001` (voir
`vite.config.ts`), donc le navigateur ne parle qu'à une seule origine et il
n'y a pas de souci de cookies cross-site.

Identifiants de démonstration (créés automatiquement par le back-end au
démarrage) : `demo@brunka-bank.example` / `DemoBrunka2026!` — ou inscrivez-
vous directement, un compte flambant neuf reçoit aussi trois comptes de
démonstration pré-approvisionnés.

## Ce qui est maintenant réel (via le back-end)

- **Inscription / connexion** : vérifiées côté serveur, mot de passe haché
  avec `scrypt`, session par cookie `HttpOnly`.
- **Comptes et virements** : stockés dans une vraie base SQLite, soldes en
  centimes, virements atomiques et protégés contre la réutilisation
  accidentelle d'une même requête.
- Voir `backend/README.md` pour le détail des protections de sécurité et
  ce qu'il resterait à faire avant une mise en production réelle.

## Ce qui reste simulé (aucun serveur dédié)

- **Formulaire de contact** : ouvre la messagerie de l'utilisateur (`mailto:`).
- **Newsletter** : adresse conservée localement dans le navigateur.
- **Convertisseur de devises** : taux BCE via frankfurter.app, avec repli hors ligne.

## Configuration

Tout le nom, les coordonnées et les mentions légales se règlent dans
`client/src/lib/brand.ts` (mettre `demoMode: false` pour retirer le bandeau
« démonstration » une fois le site prêt pour un vrai public).

Pour déployer le front-end et le back-end sur des domaines séparés, copier
`.env.example` en `.env` et renseigner `VITE_API_URL` avec l'URL du
back-end déployé, et configurer `CORS_ORIGIN` côté back-end avec l'URL
exacte du front-end déployé (voir `backend/README.md`).

Pour un service bancaire réel, il faudrait en plus : migrer vers une base
de données de production (PostgreSQL/MySQL), ajouter une double
authentification, les mentions légales complètes et, pour une activité
bancaire ou de crédit, les agréments réglementaires correspondants.
