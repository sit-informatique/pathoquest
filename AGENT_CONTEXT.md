# 🤖 AGENT CONTEXT — PathoQuest
> **Ce fichier est le point d'entrée obligatoire pour tout agent AI travaillant sur ce projet.**
> **Lis ce fichier EN PREMIER avant de faire quoi que ce soit.**
> Dernière mise à jour : 2026-05-06

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
| **Écran admin** | ✅ Complet | Approve/reject/delete étudiants depuis Firestore |
| **Écran "Demande reçue"** | ✅ Complet | Confirmation après inscription |
| **Suppression étudiants** | ✅ Complet | Bouton 🗑️ Supprimer dans Espace Professeur |
| **Bilan étudiant (admin)** | ✅ Complet | Bouton 📄 Voir Bilan + fenêtre modale détaillée |
| **Sauvegarde scores Firestore** | ✅ Complet | Scores/stats sauvegardés automatiquement en fin de jeu |
| **Ré-inscription après suppression** | ✅ Complet | Parcours guidé pour demander un nouvel accès |
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
    ├── vial_insufficient_real.jpg ← Prélèvement Niveau 1 (tube insuffisant)
    ├── request_form_real.jpg      ← Fiche de demande d'examen Niveau 1
    ├── formol.png               ← Flacon formol Niveau 1
    ├── cassettes.png            ← Cassettes histologiques (Niveau 2)
    ├── etapes techniques.png    ← Schéma étapes traitement technique (Niveau 3)
    ├── microscopie.jpg          ← Photo double lecture microscopique (Niveau 4)
    ├── phase1_sain.jpg          ← Microscopie parenchyme sain (Niveau 4 Phase 2)
    ├── phase1_tumoral.jpg       ← Microscopie parenchyme tumoral (Niveau 4 Phase 2)
    ├── phase1_real.jpg          ← Microscopie globale (Niveau 4 Phase 1)
    ├── phase3_real.jpg          ← Microscopie x40 invasion pleurale (Niveau 4 Phase 3)
    ├── lobe_macroscopie_real.jpg← Pièce opératoire réelle (Niveau 2 orientation)
    ├── lobe_macroscopie_inked.jpg← Pièce opératoire annotée (Niveau 2 mesure)
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

### Session 2026-05-06
- **Gestion avancée des étudiants (Espace Professeur)** :
  - Ajout d'un bouton **🗑️ Supprimer** pour chaque étudiant approuvé. Supprime le document Firestore (efface profil + scores), ce qui coupe immédiatement l'accès au jeu.
  - Ajout d'un bouton **📄 Voir Bilan** qui ouvre une fenêtre modale affichant : score total, % de réussite, temps de jeu, erreurs critiques, et le **détail des scores par niveau** (Niveaux 1 à 5).
  - Le score et le pourcentage s'affichent désormais en ligne dans la liste des étudiants autorisés.
- **Sauvegarde automatique des résultats** (`js/game.js` + `js/auth.js`) :
  - Création de `window.saveUserScore(results)` dans `auth.js` pour sauvegarder un objet complet dans Firestore (`totalScore`, `percent`, `time`, `errors`, `levelScores`, `levelPassed`).
  - Appel de cette fonction dans `renderResults()` de `game.js` après l'affichage des résultats.
  - Les données sont stockées dans le champ `results` du document utilisateur dans la collection `users`.
- **Parcours de ré-inscription après suppression** :
  - Problème initial : après suppression, l'étudiant voyait une erreur Firebase "email already in use" s'il tentait de se réinscrire.
  - Solution : quand un utilisateur authentifié n'a plus de document Firestore (car supprimé), il est redirigé vers un écran `#form-re-request-block` avec un champ "Nom Complet" et un bouton "Demander l'accès".
  - Un clic sur ce bouton recrée son document Firestore avec `status: "pending"`, le faisant réapparaître dans la liste "En attente" de l'administrateur.
  - Ajout du bloc HTML `#form-re-request-block` dans `index.html` avec un champ de saisie (fond blanc, texte noir).
  - Logique dans `onAuthStateChanged` mise à jour pour gérer 4 cas : `approved`, `pending`, `deleted (no doc)`, `statut inconnu`.
  - Message d'erreur amélioré : si inscription avec email existant → message explicite invitant à se connecter.
- **Mise à jour `DEPLOY_GITHUB.bat`** : message de commit mis à jour pour refléter les nouvelles fonctionnalités.

### Session 2026-05-05
- **Niveau 4 (Phase 1)** :
  - Ajout d'une validation visuelle (ligne pointillée verte) représentant le véritable front tumoral lors du clic sur "Valider".
  - Affichage conditionnel du mémo (AANMP) uniquement après validation.
  - Recadrage et floutage partiel de la photo d'intro "Double lecture" (microscopie) pour préserver l'anonymat (CSS `object-fit: cover` + `filter: blur()`).
- **Niveau 4 (Phase 3)** :
  - Modification de la consigne et suppression de la limite de deux choix. Ajout de mauvaises réponses pièges dans `data.js`.
  - Ajout d'une question 2 (liste déroulante) pour identifier précisément la métastase ganglionnaire sur la coupe.
- **Niveau 2 (Macroscopie)** :
  - Modification du dialogue du Dr. Senior lors de la mesure.
  - Intégration de l'image de la pièce ouverte (`lobe_macroscopie_open_real.jpg`) au moment de l'action "Ouvrir la pièce".
- **Niveau 5 (Compte Rendu)** :
  - Ajout de l'option `pMx` au menu déroulant pM.
  - Modification de la consigne finale pour l'établissement du stade pTNM.
  - Ajout de l'intégration de l'image du tableau pTNM (`tbb.jpg`) juste au-dessus du sélecteur.
  - Amélioration de la mise en valeur du point pédagogique (ajout de l'icône "🎓 Point pédagogique :").
- **Général** :
  - Mise à jour de `copy_images.bat` pour intégrer dynamiquement les nouvelles images uploadées en cours de session.

### Session 2026-05-04
- **Intégration d'images réelles cliniques/histologiques** :
  - Niveau 1 : `request_form_real.jpg` et `vial_insufficient_real.jpg`
  - Niveau 2 : Remplacement du schéma par `lobe_macroscopie_real.jpg` (orientation) et `lobe_macroscopie_inked.jpg` (mesure)
  - Niveau 4 : Modification architecture images
    - Phase 1 devient une vue unique large (`phase1_real.jpg`)
    - Phase 2 récupère l'ancienne vue side-by-side (`phase1_sain.jpg` & `phase1_tumoral.jpg`)
    - Phase 3 utilise `phase3_real.jpg` (invasion pleurale)
- **Outil de transfert** : Mise à jour du script `copy_images.bat`

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
