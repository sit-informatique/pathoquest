# 🤖 AGENT CONTEXT — PathoQuest
> **Ce fichier est le point d'entrée obligatoire pour tout agent AI travaillant sur ce projet.**
> **Lis ce fichier EN PREMIER avant de faire quoi que ce soit.**
> Dernière mise à jour : 2026-05-01

---

## 📌 Résumé du projet

**PathoQuest** est un Serious Game pédagogique en Anatomie Pathologique (HAEM).  
Il simule la prise en charge complète d'une pièce de **lobectomie pulmonaire droite**,  
du laboratoire de réception jusqu'au compte rendu anatomo-pathologique final.

- **Public cible** : Étudiants en médecine / internes en anatomie pathologique
- **Accès** : Portail Firebase sécurisé (inscription + validation admin)
- **Déploiement** : GitHub Pages (via Live Server en dev)
- **URL dev** : `http://localhost:8000`

---

## ✅ État actuel du projet (Mai 2026)

### Ce qui est TERMINÉ et FONCTIONNEL

| Composant | État | Notes |
|-----------|------|-------|
| **Authentification Firebase** | ✅ Complet | Login, inscription, validation admin |
| **Système de rôles** | ✅ Complet | Étudiant vs Admin (Professeur) |
| **Écran admin** | ✅ Complet | Approve/reject étudiants depuis Firestore |
| **Écran "Demande reçue"** | ✅ Complet | Confirmation après inscription |
| **Niveau 1 (Réception)** | ✅ Refonte complète | Interface graphique avec images réelles |
| **Niveau 2 (Macroscopie)** | ✅ Fonctionnel | Photos réelles étudiante + Dr Senior |
| **Niveau 3 (Technique)** | ✅ Fonctionnel | Drag & drop pour ordonner étapes |
| **Niveau 4 (Microscopie)** | ✅ Fonctionnel | Association image ↔ diagnostic |
| **Niveau 5 (Compte rendu)** | ✅ Fonctionnel | Formulaire structuré + pTNM |
| **Photos personnages réels** | ✅ Complet | `char_etudiant.png` + `doc_senior1.png` |
| **Fond flottant 3 photos** | ✅ Complet | lab_bg1, lab_bg2, manipulation.jpeg |
| **Particules background** | ✅ Complet | Canvas animé (ambient) |
| **HUD (score/timer)** | ✅ Complet | Géré par `game.js` |
| **Écran résultats finaux** | ✅ Complet | Score, stats, message pédagogique |

### Ce qui est EN COURS ou À FAIRE

| Tâche | Priorité | Notes |
|-------|---------|-------|
| **Niveau 6 (Examens complémentaires)** | 🟡 Manquant | Pas encore dans le README ni le code |
| **Responsive mobile** | 🟡 Partiel | Personnages cachés < 900px |
| **Tests cross-browser** | 🔵 Basse | Non validé sur Safari |

---

## 🗂️ Architecture des fichiers

```
pathoquest/
├── AGENT_CONTEXT.md          ← CE FICHIER (lis-le en premier !)
├── README.md                 ← Documentation publique du projet
├── index.html                ← Application entière — SPA
├── labo.html                 ← Page auxiliaire (labo de référence)
├── COPIER_IMAGES.bat         ← Script Windows pour copier les assets
├── get_colors.py             ← Utilitaire extraction palette couleurs
│
├── css/
│   └── style.css             ← Design System complet (dark mode, glassmorphism)
│
├── js/
│   ├── auth.js               ← Firebase Auth + Firestore
│   ├── game.js               ← Moteur de jeu : score, timer, navigation
│   ├── data.js               ← Contenu pédagogique : checklists, anomalies
│   ├── level1.js             ← Niveau 1 réception
│   ├── level2.js             ← Niveau 2 macroscopie (photos réelles personnages)
│   ├── level3.js             ← Niveau 3 technique histologique
│   ├── level4.js             ← Niveau 4 microscopie
│   └── level5.js             ← Niveau 5 compte rendu
│
└── assets/
    ├── vial_insufficient.png    ← Prélèvement Niveau 1 (tube insuffisant)
    ├── request_form.png         ← Fiche de demande d'examen Niveau 1
    ├── formol.png               ← Flacon formol Niveau 1
    ├── cassettes.png            ← Cassettes histologiques (Niveau 2)
    ├── etapes techniques.png    ← Schéma étapes traitement technique (Niveau 3)
    ├── microscopie.jpg          ← Photo double lecture microscopique (Niveau 4)
    ├── phase1_sain.jpg          ← Microscopie parenchyme sain (Niveau 4)
    ├── phase1_tumoral.jpg       ← Microscopie parenchyme tumoral (Niveau 4)
    ├── phase2.jpg               ← Microscopie x20 (Niveau 4)
    ├── phase3.jpg               ← Microscopie x40 invasion (Niveau 4)
    ├── char_etudiant.png        ← ⭐ Photo réelle étudiante macroscopie (Niveau 2)
    ├── doc_senior1.png          ← ⭐ Photo réelle Dr Pathologiste Senior (Niveau 2)
    ├── lab_bg1.jpeg             ← Fond flottant haut droite
    ├── lab_bg2.jpeg             ← Fond flottant bas gauche
    ├── manipulation.jpeg        ← ⭐ Fond flottant haut gauche (ajouté 2026-05-01)
    └── Gemini_Generated_Image_vvrm8vvvrm8vvvrm.png ← Fond cellules microscopiques
```

---

## 🎭 Personnages Niveau 2 (IMPORTANT)

Le Niveau 2 utilise maintenant des **photos réelles** (pas d'emojis) :

### Étudiante (gauche)
- **Fichier** : `assets/char_etudiant.png`
- **Taille** : 195px × 155px, `object-fit:cover`, `object-position:10% top`
- **Badge action** : Petit emoji overlay (30px) en bas à droite de la photo
- Montre : étudiante de gauche + pièce opératoire + couteau

### Dr. Pathologiste Senior (droite)
- **Fichier** : `assets/doc_senior1.png`
- **Taille** : 195px × 155px, `object-fit:cover`, `object-position:center top`
- Même hauteur et même alignement que l'étudiante

---

## 🌄 Fond Flottant (index.html)

3 photos flottantes avec masque radial et animation CSS :
| ID | Fichier | Position | Animation |
|----|---------|----------|-----------|
| `#micro-bg-lab1` | `lab_bg1.jpeg` | Haut droite | float1 (8s) |
| `#micro-bg-lab2` | `lab_bg2.jpeg` | Bas gauche | float2 (10s) |
| `#micro-bg-lab3` | `manipulation.jpeg` | Haut gauche | float3 (12s) |

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
- **Variables CSS** : Définies dans `css/style.css` — toujours utiliser les variables CSS

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

---

### Session 2026-05-03
- **Annulation Test** : Suppression de l'écran "Briefing/Test" de préparation avant le niveau 1. Redirection de l'authentification directement vers l'accueil (`screen-home`).

### Session 2026-05-01 (Dernière)
- **Correction image Dr Senior** : chemin `doc_senior.jpeg` → `doc_senior1.png`
- **Niveau 2 — Étudiante** : remplacement emoji 🧑‍🎓 par photo réelle `char_etudiant.png`
  - Photo 195×155px, cadrage gauche (étudiante + pièce + couteau)
  - Badge emoji action (30px) en overlay bas-droite
- **Niveau 2 — Dr Senior** : agrandissement à 195×155px pour aligner avec étudiante
- **Fond** : ajout de `manipulation.jpeg` comme 3ème photo flottante (haut gauche, float3 12s)

### Session 2026-04-30
- Correction assets background (lab_bg1, lab_bg2)
- Synchronisation noms de fichiers images

### Session 2026-04-29
- Finalisation Niveaux 4 et 5
- Intégration images microscopiques réelles (phase1/2/3)
- Contenu pédagogique IASLC 9th ed.

### Session 2026-04-26
- Finalisation textes pédagogiques Niveaux 2 et 3
- Ajout étape "Montage" en Niveau 3
- Amélioration lisibilité headers

### Session 2026-04-24
- Suppression personnages SVG statiques
- Déploiement GitHub Pages

### Session 2026-04-22
- Création fichier `AGENT_CONTEXT.md`

### Session 2026-04-21
- Refonte visuelle Niveau 1 (assets réels)
- Ajout écran "Demande reçue"

### Session 2026-04-20
- Intégration Firebase Auth + Firestore
- Validation admin

---

## ⚠️ Points d'attention critiques

1. **Ne jamais exposer les clés Firebase** dans un dépôt public
2. **L'ordre des scripts** dans `index.html` est critique — `data.js` doit précéder `game.js`
3. **auth.js** est chargé en `type="module"` dans le `<head>`
4. **Images assets** : `char_etudiant.png` et `doc_senior1.png` doivent être dans `assets/`
5. **Niveau 6** mentionné dans le README mais pas implémenté

---

*Ce fichier est maintenu automatiquement. Mets-le à jour à la fin de chaque session.*
