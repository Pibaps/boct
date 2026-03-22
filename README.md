# BotC Grimoire

Projet Next.js officiel de l’application Blood on the Clocktower (BOtC) : grimoire, carte des rôles, règles, stratégie, et guide de jeu.

## Liens clés

- APK stable : https://github.com/Pibaps/botc/releases/tag/APK
- Site web : https://botc-seven.vercel.app

## Démarrage rapide

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de dev :

```bash
npm run dev
```

Ouvrir http://localhost:3000

## Commandes utiles

- Génération d’assets : `npm run assets:fetch`
- Build production : `npm run build`
- Démarrage production : `npm run start`
- Build Android debug (Capacitor) : `npm run build:android:debug`

## Structure principale

- `src/app` : routes et pages (App Router)
- `src/components` : composants réutilisables
- `public/assets/botc` : ressources statiques du jeu
- `scripts` : outils d’import, crawlers et génération d’assets

## Contribution

1. Créer une branche feature.
2. Committer avec message clair.
3. PR vers main, inclure tests manuels et capture d’écran.

---

Rapide et efficace, ce README est conçu pour rester court et orienté production.
