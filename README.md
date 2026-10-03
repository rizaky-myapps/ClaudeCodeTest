# My-Apps
Site statique (HTML/CSS/JS, aucune dépendance) de l'agence My-Apps.

**Agence** : `index`, `services`, `realisations`, `a-propos`, `contact`, `cgv`, `mentions-legales`, `confidentialite`, `maquette` (visionneuse ordinateur/tablette/mobile). Thème clair/sombre.

**Maquettes** (sites complets et fonctionnels, dossiers `maquettes/<nom>/`) :
- `chez-marthe` : carte filtrable, réservation avec créneaux, gestion des réservations
- `helene-voss` : galeries, visionneuse plein écran, estimateur de devis, demande de contact
- `nord-athletique` : abonnements, inscription, planning avec places limitées, essai gratuit
- `maison-verdure` : catalogue, recherche, fiches produit, panier, code promo `VERDURE10`, commande

Les données des maquettes sont stockées dans le navigateur (localStorage) : rien n'est envoyé.

## Déploiement (GitHub Pages)
Réglages du dépôt → Pages → Source : **GitHub Actions**. Le workflow `.github/workflows/pages.yml` publie à chaque push.
Adresse : `https://<compte>.github.io/<dépôt>/`. Tous les chemins sont relatifs.

## À compléter avant mise en production
Mentions légales et CGV contiennent des champs `[à compléter]` (SIRET, adresse, médiateur…). E-mail de contact à remplacer (`contact@my-apps.fr`).
