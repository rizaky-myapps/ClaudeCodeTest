# My-Apps
Site statique (HTML/CSS/JS, aucune dépendance) de l'agence My-Apps.

**Agence** : `index`, `services`, `realisations`, `a-propos`, `contact`, `cgv`, `mentions-legales`, `confidentialite`, `maquette` (visionneuse ordinateur/tablette/mobile). Thème clair/sombre.

**Maquettes** (sites complets et fonctionnels, dossiers `maquettes/<nom>/`) :
- `chez-marthe` : carte filtrable, réservation avec créneaux, gestion des réservations
- `helene-voss` : galeries, visionneuse plein écran, estimateur de devis, demande de contact
- `nord-athletique` : abonnements, inscription, planning avec places limitées, essai gratuit
- `oyat-mousse` : catalogue, recherche, fiches produit, panier, code promo `OYAT10`, commande

**Visionneuse** (`maquette.html`) : l'ordinateur, la tablette (pivotable avec animation de rotation) et le téléphone s'affichent dans un cadre d'appareil ; le site s'y affiche à la vraie taille d'écran, donc en vrai responsive.

**Animations** des maquettes : `maquettes/fx.css` + `maquettes/fx.js` (fondu entre pages, apparition au défilement, ondulation et retour au clic, défilement doux). Désactivées si l'utilisateur demande « réduire les animations ».

Les données des maquettes sont stockées dans le navigateur (localStorage) : rien n'est envoyé.

## Déploiement (GitHub Pages)
Réglages du dépôt → Pages → Source : **GitHub Actions**. Le workflow `.github/workflows/pages.yml` publie à chaque push.
Adresse : `https://<compte>.github.io/<dépôt>/`. Tous les chemins sont relatifs.

## À compléter avant mise en production
Mentions légales et CGV contiennent des champs `[à compléter]` (SIRET, adresse, médiateur…). E-mail de contact à remplacer (`contact@my-apps.fr`).

## Crédits photos
Les photos des maquettes (`maquettes/*/img/`) proviennent d'[Unsplash](https://unsplash.com), utilisables gratuitement (licence Unsplash, attribution non obligatoire). Elles sont enregistrées dans le dépôt : aucun lien externe.

## Identité visuelle (My-Apps)
Direction artistique « Atelier cobalt » : papier chaud / encre, bleu cobalt `#2147FF`, jaune signal `#FFC83D`, titres en *Instrument Serif*, étiquettes en *JetBrains Mono*, texte en *Inter*, ombres décalées.
Logo : une grille d’applications, trois carrés cobalt et un rond jaune (l’application « à vous »). Fichiers dans `img/` : `logo.svg` (fond clair), `logo-dark.svg` (fond sombre), `logo-mark.svg`, `favicon.svg`, `logo.png`, `favicon-512.png`, `apple-touch-icon.png`.
