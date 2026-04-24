# 🧬 PathoQuest — De la Pièce Opératoire au Diagnostic

> Serious Game pédagogique en Anatomie Pathologique

## 🌟 Nouvelles Fonctionnalités (Mise à jour 2026)

- **Refonte Visuelle du Niveau 1** : Passage d'une interface textuelle à une interface basée sur des assets graphiques réalistes.
- **Système de Zoom (Modale)** : Inspection détaillée des prélèvements et des fiches de demande au clic.
- **Authentification Sécurisée** : Intégration Firebase avec distinction entre accès Étudiant et accès Administrateur (Professeur).
- **Point Pédagogique Renforcé** : Focus sur la phase pré-analytique (source de 70% des erreurs).

## 🎯 Objectifs Pédagogiques

- Comprendre les étapes du circuit pré-analytique et analytique
- Identifier les erreurs critiques pouvant compromettre le diagnostic
- Appliquer les bonnes pratiques en macroscopie et en histologie
- Interpréter des images microscopiques de base

## 🕹️ Les 6 Niveaux

| Niveau | Titre | Mécanique |
| :--- | :--- | :--- |
| 1 | Réception du prélèvement | Checklist de conformité visuelle + Modale zoom |
| 2 | Examen macroscopique | Zones cliquables sur image |
| 3 | Traitement technique | Glisser-déposer pour ordonner |
| 4 | Analyse microscopique | Association image ↔ diagnostic |
| 5 | Examens complémentaires | Arbre de décision |
| 6 | Compte rendu final | Formulaire structuré + pTNM |

## 🚀 Lancement & Installation

PathoQuest nécessite désormais un serveur local pour le fonctionnement de l'authentification Firebase.

1. **Ouvrir avec Live Server** (VS Code) ou un serveur local (`python -m http.server`).
2. Accédez à `http://localhost:5500`.
3. **Connexion** : Utilisez vos identifiants ou demandez un accès via le formulaire d'inscription.

## 📂 Structure du Projet

```text
pathoquest/
├── index.html          # Application principale
├── css/
│   └── style.css       # Design System complet + Styles Modales
├── js/
│   ├── auth.js         # Authentification Firebase & Gestion Admin
│   ├── game.js         # Moteur de jeu (score, timer, navigation)
│   ├── data.js         # Contenu pédagogique (Checklists, Anomalies)
│   ├── level1.js       # Réception (Refonte visuelle)
│   └── ...             # Autres niveaux (2 à 6)
└── assets/
    ├── vial_insufficient.png    # Prélèvement Niveau 1
    ├── request_form.png         # Fiche de demande Niveau 1
    ├── macro_lobe.png           # Macroscopie Niveau 2
    └── ...                      # Images Histo & Micro
```

## 🎓 Message Pédagogique

> *"La phase pré-analytique est la source de plus de 70% des erreurs diagnostiques. Le prélèvement est unique et irremplaçable."*

## 🛠️ Stack Technique

- **Frontend** : HTML5 / Vanilla CSS / JavaScript (ES6 Modules)
- **Backend** : Firebase Auth & Firestore (NoSQL)
- **Design** : Glassmorphism, Dark Mode, Animations SVG custom
