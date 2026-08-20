# OM Live (version statique)

Site de suivi de l'Olympique de Marseille — calendrier, résultats, classement, stats joueurs, actus/mercato.

**Aucune installation nécessaire.** C'est du HTML/CSS/JavaScript simple, sans étape de build.

## Tester en local

Double-clique sur `index.html` — il s'ouvre dans ton navigateur. Tu peux naviguer entre les pages normalement.

## Mettre en ligne gratuitement avec GitHub Pages

1. Crée un nouveau dépôt sur GitHub (ex: `om-app`).
2. Glisse-dépose tous les fichiers de ce dossier dans le dépôt (bouton "Add file" → "Upload files" sur la page GitHub).
3. Valide ("Commit changes").
4. Va dans **Settings → Pages** du dépôt, choisis la branche `main` et le dossier `/ (root)`, puis sauvegarde.
5. Après une minute ou deux, ton site est en ligne à une adresse du type `https://ton-pseudo.github.io/om-app/`.

## Brancher les vraies données

Le site tourne avec des données de démonstration par défaut. Pour utiliser les vraies données :

- **Calendrier / résultats / classement** : ouvre `js/data.js`, crée un compte gratuit sur https://www.football-data.org, et colle ta clé API dans la variable `FOOTBALL_DATA_KEY` en haut du fichier.
- **Stats joueurs** : aucune API gratuite fiable n'existe pour la Ligue 1 — modifie directement la liste `mockPlayers` dans `js/data.js` à la main.
- **Actus/mercato** : renseigne l'URL d'un flux RSS dans `RSS_FEED_URL` (dans `js/data.js`) et décommente le bloc indiqué dans `getNews()`.

## Structure

```
index.html        Accueil (prochain match, derniers résultats, actus)
calendrier.html    Prochains matchs
resultats.html     Derniers résultats
classement.html    Classement Ligue 1
stats.html         Stats joueurs
actus.html         Actus & mercato
css/style.css      Tous les styles
js/data.js         Données (mock + branchement API réelle)
js/nav.js          Navigation partagée + gabarits de cartes
```
