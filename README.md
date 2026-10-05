# My-Apps
Site statique (HTML/CSS/JS, aucune dépendance) de l'agence My-Apps.

**Agence** (pleine largeur, thème clair/sombre automatique) : `index`, `services` (alimentés par l'administration), `realisations`, `a-propos`, `contact`, `cgv`, `mentions-legales`, `confidentialite`, `maquette` (visionneuse ordinateur/tablette/mobile).

**Espace client** : `connexion` (connexion + création de compte), `commande` (ticket de commande d'un site), `espace` (suivi des demandes, échanges, clôture, profil, suppression du compte).

**Administration** (`admin*.html`, réservée aux administrateurs ; démo : `admin@my-apps.fr` / `myapps-admin`) :
- `admin` : tableau de bord (tickets par statut, par jour, activité récente)
- `admin-tickets` : traitement des tickets (réponse, réponses rapides, statut en attente / en cours / traité / fermé, priorité, notes internes, réouverture, suppression)
- `admin-services` : gestion des services (nom, catégorie, prix, préfixe, périodicité, délai, description, points inclus, mise en avant, visibilité, ordre, suppression) — reflétés sur le site
- `admin-comptes` : comptes clients (rôle, suppression)
- `admin-journal` : journal de toutes les actions (comptes, tickets, services, Discord, réglages), filtres, export CSV, purge tracée
- `admin-parametres` : webhook Discord (URL, nom et avatar du « bot », mention, événements notifiés, message de test, historique des envois), informations de l'agence, export et réinitialisation des données

**Notifications Discord** : un webhook (Discord → Paramètres du salon → Intégrations → Webhooks) reçoit un message pour chaque événement coché (nouveau ticket, message, changement de statut, fermeture, création / suppression de compte, modification d'un service). Un webhook par défaut gère tous les événements ; un webhook spécifique peut être défini par événement. Sans webhook valide, l’envoi est simulé et tracé dans le journal.

Toutes les données de l'agence (comptes, tickets, services, journal) sont stockées dans le navigateur (`localStorage`, préfixe `ma_`) : c'est une démonstration sans serveur. Un vrai déploiement nécessiterait une base de données et une authentification côté serveur.

**Maquettes** (sites complets et fonctionnels, dossiers `maquettes/<nom>/`) :
- `le-tablier-bavard` : carte filtrable, réservation avec créneaux, gestion des réservations
- `helene-voss` : galeries, visionneuse plein écran, estimateur de devis, demande de contact
- `rouille-fonte` : abonnements, inscription, planning avec places limitées, essai gratuit
- `oyat-mousse` : catalogue, recherche, fiches produit, panier, code promo `OYAT10`, commande

**Visionneuse** (`maquette.html`) : l'ordinateur, la tablette (pivotable avec animation de rotation) et le téléphone s'affichent dans un cadre d'appareil ; le site s'y affiche à la vraie taille d'écran, donc en vrai responsive.

**Animations** des maquettes : `maquettes/fx.css` + `maquettes/fx.js` (fondu entre pages, apparition au défilement, ondulation et retour au clic, défilement doux). Désactivées si l'utilisateur demande « réduire les animations ».
- `le-carnet-egare` : blog (articles filtrables, recherche, commentaires, « j'aime », lettre d'information)
- `orbelune-wiki` : wiki (sommaire, infobox, modification en ligne, historique et restauration)
- `comptoir-des-curieux` : forum (catégories, sujets, réponses, citations, membres)
- `pilotis-admin` : panneau d'administration (graphiques, utilisateurs, paramètres, journal)
- `tribord-gestion` : comptabilité (factures avec TVA, clients, salariés, bulletins de paie)
- `cendrelune-serveur` : serveur de jeu complet (comptes, liaison Discord simulée, carte interactive, clans, événements, boutique, vote, panneau d'administration)

Les données des maquettes sont stockées dans le navigateur (localStorage) : rien n'est envoyé.

## Déploiement (GitHub Pages)
Réglages du dépôt → Pages → Source : **GitHub Actions**. Le workflow `.github/workflows/pages.yml` publie à chaque push.
Adresse : `https://<compte>.github.io/<dépôt>/`. Tous les chemins sont relatifs.

## À compléter avant mise en production
Mentions légales et CGV contiennent des champs `[à compléter]` (SIRET, adresse, médiateur…). E-mail de contact à remplacer (`contact@my-apps.fr`).

## Crédits photos
Les photos des maquettes (`maquettes/*/img/`) proviennent d'[Unsplash](https://unsplash.com), utilisables gratuitement (licence Unsplash, attribution non obligatoire). Elles sont enregistrées dans le dépôt : aucun lien externe.

## Identité visuelle (My-Apps)
Direction artistique « Brutal » : bordures noires épaisses, ombres décalées, violet `#6C4DFF` + jaune `#FFD84A`, titres *Space Grotesk*, étiquettes *Space Mono*, boutons qui s’enfoncent au clic, transitions de page en volet ; mode sombre bleu nuit.
Logo : un écran d'ordinateur et un téléphone qui se chevauchent, suivis du nom en traits arrondis. Fichiers dans `img/` : `logo.svg` (fond clair), `logo-dark.svg` (fond sombre), `logo-mark.svg`, `favicon.svg`, `logo.png`, `favicon-512.png`, `apple-touch-icon.png`.
