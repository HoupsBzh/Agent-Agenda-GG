# 📱 Déploiement PWA sur GitHub Pages

## Ce que tu obtiens
Une vraie icône sur ton écran d'accueil iPhone/Android qui ouvre l'app
en plein écran, sans barre de navigateur.

---

## ÉTAPE 1 — Créer le repo GitHub

1. Va sur **github.com** → **New repository**
2. Nom : `agent-agenda` (ou ce que tu veux)
3. Coche **Public** (requis pour GitHub Pages gratuit)
4. Clique **Create repository**

---

## ÉTAPE 2 — Uploader les fichiers

Dans ton nouveau repo, clique **Add file → Upload files** et ajoute :

```
index.html
manifest.json
sw.js
icons/
  ├── icon-192.png
  ├── icon-512.png
  └── icon-180.png
```

Clique **Commit changes**.

---

## ÉTAPE 3 — Activer GitHub Pages

1. Dans le repo → **Settings → Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** → dossier **/ (root)**
4. Clique **Save**

Ton URL sera : `https://TON_USERNAME.github.io/agent-agenda/`
(disponible après ~2 min)

---

## ÉTAPE 4 — Connecter l'app à ton agent GAS

1. Ouvre l'URL GitHub Pages sur ton téléphone
2. Au premier lancement → une fenêtre te demande l'URL GAS
3. Colle ton URL Google Apps Script (celle avec `/exec` à la fin)
4. Appuie ⚙ en haut à droite pour y revenir si besoin

**Important** : dans GAS, vérifie que le déploiement est en mode
"Tout le monde peut y accéder" (pas seulement toi).

---

## ÉTAPE 5 — Ajouter à l'écran d'accueil

### iPhone (Safari)
1. Ouvre l'URL dans **Safari** (pas Chrome ni Firefox)
2. Icône **Partager** (carré avec flèche) en bas de l'écran
3. **"Sur l'écran d'accueil"**
4. Renomme en "Agent Agenda" → **Ajouter**

### Android (Chrome)
1. Ouvre l'URL dans **Chrome**
2. Menu ⋮ → **"Ajouter à l'écran d'accueil"**
3. Une bannière peut aussi apparaître automatiquement

---

## Résultat

- Icône violette sur ton écran d'accueil
- Ouvre en plein écran (sans barre du navigateur)
- Fonctionne hors ligne pour la navigation
- Les données se rechargent dès que tu as du réseau

---

## Mettre à jour l'app

Si tu modifies les fichiers dans GitHub :
- **index.html** → commit → l'app se met à jour automatiquement au prochain chargement
- Pas besoin de réinstaller sur le téléphone

---

## Résolution de problèmes

**L'app ne se connecte pas au GAS**
→ Vérifie que l'URL dans ⚙ est bien celle en `/exec`
→ Dans GAS : Déployer → Gérer les déploiements → vérifier "Tout le monde"

**Le badge "hors ligne" est toujours affiché**
→ Vérifie ta connexion puis rafraîchis manuellement

**L'icône ne s'installe pas sur iPhone**
→ Utilise Safari uniquement (pas Chrome iOS) pour l'installation
