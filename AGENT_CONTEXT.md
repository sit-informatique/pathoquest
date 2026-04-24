# 🤖 AGENT CONTEXT — PathoQuest
> **Ce fichier est le point d'entrée obligatoire pour tout agent AI travaillant sur ce projet.**
> **Lis ce fichier EN PREMIER avant de faire quoi que ce soit.**
> Dernière mise à jour : 2026-04-22

---

## 📌 Résumé du projet

**PathoQuest** est un Serious Game pédagogique en Anatomie Pathologique (HAEM).  
Il simule la prise en charge complète d'une pièce de **lobectomie pulmonaire droite**,  
du laboratoire de réception jusqu'au compte rendu anatomo-pathologique final.

- **Public cible** : Étudiants en médecine / internes en anatomie pathologique
- **Accès** : Portail Firebase sécurisé (inscription + validation admin)
- **Déploiement** : GitHub Pages (via Live Server en dev)
- **URL dev** : `http://localhost:5500` (Live Server VS Code)

---

## ✅ État actuel du projet (Avril 2026)

### Ce qui est TERMINÉ et FONCTIONNEL

| Composant | État | Notes |
|-----------|------|-------|
| **Authentification Firebase** | ✅ Complet | Login, inscription, validation admin |
| **Système de rôles** | ✅ Complet | Étudiant vs Admin (Professeur) |
| **Écran admin** | ✅ Complet | Approve/reject étudiants depuis Firestore |
| **Écran "Demande reçue"** | ✅ Complet | Confirmation après inscription |
| **Niveau 1 (Réception)** | ✅ Refonte complète | Interface graphique avec images réelles |
| **Niveau 2 (Macroscopie)** | ✅ Fonctionnel | Zones cliquables sur image lobe |
| **Niveau 3 (Technique)** | ✅ Fonctionnel | Drag & drop pour ordonner étapes |
| **Niveau 4 (Microscopie)** | ✅ Fonctionnel | Association image ↔ diagnostic |
| **Niveau 5 (Compte rendu)** | ✅ Fonctionnel | Formulaire structuré + pTNM |
| **Personnages médicaux animés** | ✅ Complet | SVG custom, animations CSS |
| **Particules background** | ✅ Complet | Canvas animé (ambient) |
| **HUD (score/timer)** | ✅ Complet | Géré par `game.js` |
| **Écran résultats finaux** | ✅ Complet | Score, stats, message pédagogique |

### Ce qui est EN COURS ou À FAIRE

| Tâche | Priorité | Notes |
|-------|---------|-------|
| **Niveau 6 (Examens complémentaires)** | 🟡 Manquant | Pas encore dans le README ni le code |
| **Responsive mobile** | 🟡 Partiel | Personnages cachés < 900px, scène < 600px |
| **Tests cross-browser** | 🔵 Basse | Non validé sur Safari |

---

## 🗂️ Architecture des fichiers

```
pathoquest/
├── AGENT_CONTEXT.md          ← CE FICHIER (lis-le en premier !)
├── README.md                 ← Documentation publique du projet
├── index.html                ← Application entière (54 KB) — SPA
├── labo.html                 ← Page auxiliaire (labo de référence)
├── COPIER_IMAGES.bat         ← Script Windows pour copier les assets
├── get_colors.py             ← Utilitaire extraction palette couleurs
│
├── css/
│   └── style.css             ← Design System complet (dark mode, glassmorphism)
│
├── js/
│   ├── auth.js               ← Firebase Auth + Firestore (8 KB)
│   ├── game.js               ← Moteur de jeu : score, timer, navigation (10.8 KB)
│   ├── data.js               ← Contenu pédagogique : checklists, anomalies (18.7 KB)
│   ├── level1.js             ← Niveau 1 refonte visuelle assets (18 KB)
│   ├── level2.js             ← Niveau 2 macroscopie (20.2 KB)
│   ├── level3.js             ← Niveau 3 technique histologique (12.7 KB)
│   ├── level4.js             ← Niveau 4 microscopie (13.5 KB)
│   └── level5.js             ← Niveau 5 compte rendu (14 KB)
│
└── assets/
    ├── vial_insufficient.png    ← Prélèvement Niveau 1 (tube insuffisant)
    ├── request_form.png         ← Fiche de demande d'examen Niveau 1
    ├── cassettes.png            ← Cassettes histologiques (Niveau 3)
    ├── etapes techniques.png    ← Schéma étapes traitement technique
    ├── char_doctor.png          ← Personnage médecin (non utilisé — remplacé SVG)
    ├── char_nurse.png           ← Personnage infirmière (non utilisé — remplacé SVG)
    ├── char_pathologist.png     ← Personnage pathologiste (non utilisé — remplacé SVG)
    └── char_surgeon.png         ← Personnage chirurgien (non utilisé — remplacé SVG)
```

> ⚠️ **Note importante** : Les fichiers `char_*.png` dans assets/ **ne sont pas utilisés**.  
> Les personnages sont désormais des **SVG inline** dans `index.html` (lignes 22–270).

---

## 🔧 Configuration technique

### Firebase
```javascript
// Fichier : js/auth.js — lignes 6-13
const firebaseConfig = {
  apiKey: "AIzaSyBog9YTKGsbW0V9jV2G9Dc-2NDrPPag17w",
  authDomain: "pathoquest-7dc83.firebaseapp.com",
  projectId: "pathoquest-7dc83",
  storageBucket: "pathoquest-7dc83.firebasestorage.app",
  messagingSenderId: "465764695160",
  appId: "1:465764695160:web:9bff60d36ea59e1cab018d"
};
```

### Emails Admin (accès Professeur)
```javascript
// Fichier : js/auth.js — ligne 15
const ADMIN_EMAILS = ["nizartaboubi@gmail.com", "laboatfkamoun@gmail.com"];
```

### Écrans HTML (navigation par `screen.active`)
| ID Écran | Description |
|----------|-------------|
| `screen-auth` | Login / Inscription (affiché par défaut) |
| `screen-admin` | Tableau de bord professeur |
| `screen-home` | Accueil avec les 5 cartes niveau |
| `screen-level1` à `screen-level5` | Les 5 niveaux du jeu |
| `screen-results` | Résultats finaux |

### Ordre de chargement des scripts (IMPORTANT)
```html
<script type="module" src="js/auth.js"></script>  <!-- dans <head> -->
<!-- En bas de body : -->
<script src="js/data.js"></script>
<script src="js/game.js"></script>
<script src="js/level1.js"></script>
<script src="js/level2.js"></script>
<script src="js/level3.js"></script>
<script src="js/level4.js"></script>
<script src="js/level5.js"></script>
```

---

## 🎨 Design System

- **Thème** : Dark Mode (fond `#030F1E`), glassmorphism
- **Couleur principale** : Cyan `#00E5FF` (`var(--cyan)`)
- **Police** : `Outfit` (Google Fonts) + `JetBrains Mono` (mono)
- **Variables CSS** : Définies dans `css/style.css` — toujours utiliser les variables CSS plutôt que des couleurs en dur

---

## 📋 Logique de jeu

### Score par niveau
| Niveau | Points max |
|--------|-----------|
| Niveau 1 | 150 pts |
| Niveau 2 | 200 pts |
| Niveau 3 | 150 pts |
| Niveau 4 | 250 pts |
| Niveau 5 | 150 pts |
| **Total** | **900 pts** |

### Flux d'authentification
```
Utilisateur → Inscription (status: "pending") → Admin approuve (status: "approved") → Accès jeu
Admin → Login avec email admin → Tableau de bord directement
```

---

## 🚀 Comment lancer le projet

```bash
# Option 1 : VS Code Live Server
# → Clic droit sur index.html → "Open with Live Server"
# → URL : http://localhost:5500

# Option 2 : Python
python -m http.server 5500
# → URL : http://localhost:5500
```

> ⚠️ **Obligatoire** : Un serveur local est requis pour Firebase. `file://` ne fonctionne pas.

---

## 📝 Historique des sessions de travail

### Session 2026-04-22 (Dernière)
- Lu et analysé l'état complet du projet
- Création de ce fichier `AGENT_CONTEXT.md` pour la mémoire des agents

### Session 2026-04-21 à 2026-04-22
- Refonte visuelle complète du Niveau 1 (assets graphiques réels)
- Système de zoom modale pour inspecter prélèvement et fiche
- Résolution bugs authentification Firebase
- Ajout écran "Demande reçue" post-inscription

### Session 2026-04-20
- Intégration Firebase Auth + Firestore
- Système de validation admin pour les étudiants
- Distinction rôles Étudiant / Admin

### Session 2026-04-19
- Lancement serveur local et tests
- Correction système navigation inter-niveaux

### Session 2026-04-17
- Refonte UI globale dark mode + glassmorphism
- Intégration personnages médicaux animés SVG
- Animations particles canvas

### Avant Avril 2026
- Création initiale du projet
- Développement des 5 niveaux du jeu
- Contenu pédagogique (`data.js`)

---

## ⚠️ Points d'attention critiques

1. **Ne jamais exposer les clés Firebase** dans un dépôt public — elles sont déjà dans `.gitignore`? Vérifier.
2. **L'ordre des scripts** dans `index.html` est critique — `data.js` doit précéder `game.js` et les levels
3. **auth.js** est chargé en `type="module"` dans le `<head>` — les autres en `<script>` classiques en bas
4. **Les images assets** utilisées en Niveau 1 : `vial_insufficient.png` et `request_form.png` doivent être dans `assets/`
5. **Niveau 6** mentionné dans le README mais pas implémenté — ne pas promettre cette fonctionnalité à l'utilisateur

---

*Ce fichier est maintenu automatiquement. Mets-le à jour à la fin de chaque session de travail.*
