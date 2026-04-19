# 🧬 PathoQuest — De la Pièce Opératoire au Diagnostic

> Serious Game pédagogique en Anatomie Pathologique

## Description

PathoQuest est un jeu sérieux interactif destiné aux étudiants en **Anatomie Pathologique (DCEM / Techniciens de laboratoire)**. Il simule la prise en charge complète d'une pièce de **lobectomie pulmonaire**, du pré-analytique jusqu'au diagnostic microscopique et au compte rendu final.

## 🎯 Objectifs Pédagogiques

- Comprendre les étapes du circuit pré-analytique et analytique
- Identifier les erreurs critiques pouvant compromettre le diagnostic
- Appliquer les bonnes pratiques en macroscopie et en histologie
- Interpréter des images microscopiques de base

## 🕹️ Les 6 Niveaux

| Niveau | Titre | Mécanique |
|--------|-------|-----------|
| 1 | Réception du prélèvement | Checklist de conformité |
| 2 | Examen macroscopique | Zones cliquables sur image |
| 3 | Traitement technique | Glisser-déposer pour ordonner |
| 4 | Analyse microscopique | Association image ↔ diagnostic |
| 5 | Examens complémentaires | Arbre de décision |
| 6 | Compte rendu final | Formulaire structuré + pTNM |

## 🚀 Lancement

Ouvrir `index.html` dans un navigateur moderne. Aucune installation requise.

## 📂 Structure

```
pathoquest/
├── index.html          # Application principale
├── css/
│   └── style.css       # Design System complet
├── js/
│   ├── game.js         # Moteur de jeu (score, timer, navigation)
│   ├── data.js         # Contenu pédagogique des 6 niveaux
│   ├── level1.js       # Réception
│   ├── level2.js       # Macroscopie
│   ├── level3.js       # Technique (Drag & Drop)
│   ├── level4.js       # Microscopie
│   ├── level5.js       # Complémentaires
│   └── level6.js       # Compte rendu
└── assets/
    ├── macro_lobe.png
    ├── histo_adeno.png
    ├── histo_epidermoide.png
    └── histo_sain.png
```

## 🏆 Système de Score

- Score maximum : **1000 points** + 145 points bonus
- Pénalités pour erreurs (-10 à -50 selon gravité)
- Bonus de rapidité et de précision

## 🎓 Message Pédagogique

> *"Un bon diagnostic commence bien avant le microscope : il débute dès la prise en charge du prélèvement."*

## GitHub Pages

Ce projet peut être déployé directement sur GitHub Pages sans configuration supplémentaire.
