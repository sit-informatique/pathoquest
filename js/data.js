// ============================================================
//  PathoQuest — data.js
//  Contenu pédagogique complet des 6 niveaux
// ============================================================

const GAME_DATA = {

  // ── NIVEAU 1 : Réception ─────────────────────────────────────
  level1: {
    title: "Réception du Prélèvement",
    icon: "🧫",
    lieu: "Salle de réception du laboratoire",
    description: "Une pièce de lobectomie pulmonaire arrive au laboratoire. Vous devez vérifier sa conformité complète avant de l'accepter.",
    maxScore: 150,

    checklist: [
      {
        id: "cl_fixateur_type", category: "conservation",
        text: "Type de fixateur : Formol tamponné 10% (neutre)",
        required: true
      },
      {
        id: "cl_fixateur_delai", category: "conservation",
        text: "Délai de fixation adapté (6–48h selon taille du prélèvement)",
        required: true
      },
      {
        id: "cl_fixateur_volume", category: "conservation",
        text: "Volume de fixateur ≥ 10× le volume du prélèvement",
        required: true
      },
      {
        id: "cl_contenant", category: "conservation",
        text: "Contenant adapté (flacon large, hermétique, résistant)",
        required: true
      },
      {
        id: "cl_integrite", category: "conservation",
        text: "Intégrité du prélèvement (non écrasé, non fragmenté inutilement)",
        required: true
      },
      {
        id: "cl_nom", category: "etiquetage",
        text: "Nom patronymique ET marital + Prénom",
        required: true
      },
      {
        id: "cl_sexe_naissance", category: "etiquetage",
        text: "Sexe + Date de naissance du patient",
        required: true
      },
      {
        id: "cl_id_patient", category: "etiquetage",
        text: "N° d'identification du patient (Sécurité Sociale ou équivalent)",
        required: true
      },
      {
        id: "cl_adresse", category: "etiquetage",
        text: "Adresse / Service d'hospitalisation ou de consultation",
        required: true
      },
      {
        id: "cl_medecin", category: "etiquetage",
        text: "Nom + coordonnées du médecin préleveur",
        required: true
      },
      {
        id: "cl_urgence", category: "demande",
        text: "Caractère urgent ou non précisé sur la fiche",
        required: true
      },
      {
        id: "cl_clinique", category: "demande",
        text: "Renseignements cliniques + recherches particulières indiqués",
        required: true
      },
      {
        id: "cl_nature_siege", category: "demande",
        text: "Nature et siège du prélèvement précisés",
        required: true
      },
      {
        id: "cl_date_prelevement", category: "demande",
        text: "Date et heure du prélèvement notées",
        required: true
      },
      {
        id: "cl_correspondants", category: "demande",
        text: "Nom des correspondants et leurs coordonnées",
        required: true
      },
      {
        id: "cl_concordance", category: "concordance",
        text: "Concordance parfaite entre la fiche de demande et l'étiquette du flacon",
        required: true
      }
    ],

    scenario: {
      // Que l'étudiant verra sur le prélèvement simulé
      contenant: "Flacon hermétique rigide — contenu: Formol tamponné 10%",
      volume_fixateur: "Volume fixateur : INSUFFISANT (estimation ×3 seulement)",
      etiquette: "M. BENALI Karim — né 12/04/1958 — N°SS: 1 58 04 13 005 012 — Service Thoracique",
      medecin: "Dr. MEZIANE S. — Chirurgie thoracique — Tél. non renseigné",
      fiche: {
        urgence: "NON PRÉCISÉ",
        clinique: "Masse pulmonaire droite suspecte, tabagique 40 PA",
        nature: "Lobectomie pulmonaire supérieure droite",
        date: "15/04/2026 — Heure : non notée",
        correspondants: "Dr. MEZIANE S."
      }
    },

    anomalies: [
      {
        id: "an_volume_fixateur",
        categorie: "conservation",
        critical: false,
        label: "Volume de fixateur insuffisant",
        explication: "Le volume de fixateur doit être au moins 10× le volume du prélèvement. Un volume insuffisant entraîne une mauvaise pénétration et des artefacts de fixation (nécrose centrale).",
        penalite: -10
      },
      {
        id: "an_heure_manquante",
        categorie: "demande",
        critical: false,
        label: "Date et heure du prélèvement non renseignées",
        explication: "La date et l'heure du prélèvement sont essentielles pour calculer le délai de fixation et valider la qualité pré-analytique. Leur absence rend impossible la vérification du respect des délais réglementaires.",
        penalite: -10
      },
      {
        id: "an_telephone_medecin",
        categorie: "demande",
        critical: false,
        label: "Coordonnées du médecin incomplètes (tél. manquant)",
        explication: "Les coordonnées complètes du préleveur sont indispensables pour tout contact en cas de résultat urgent ou d'anomalie.",
        penalite: -10
      },
      {
        id: "an_contenant_inadequat",
        categorie: "conservation",
        critical: false,
        label: "Contenant inadapté",
        explication: "Le contenant doit être rigide, hermétique et de taille adaptée au prélèvement. Un contenant inadapté (trop petit, non hermétique, fragile) risque de compromettre l'intégrité du tissu et de provoquer une fuite de fixateur.",
        penalite: -10
      }
    ],

    anomalies_critiques: [
      {
        id: "anc_absence_id",
        label: "Absence totale d'identification",
        explication: "Un prélèvement sans identification doit être REFUSÉ. Il ne peut être analysé car aucun résultat ne peut être attribué au bon patient. Risque majeur d'erreur médicale.",
        penalite: -50
      },
      {
        id: "anc_discordance",
        label: "Discordance entre fiche et étiquette",
        explication: "Si le nom sur la fiche diffère de celui du flacon, le prélèvement DOIT être refusé ou mis en réserve jusqu'à clarification. Risque vital.",
        penalite: -50
      },
      {
        id: "anc_absence_formol",
        label: "Absence de fixateur (prélèvement envoyé en frais sans raison)",
        explication: "Sans fixateur, les protéines cellulaires se dénaturent rapidement. Le tissu devient inexploitable en moins de quelques heures. Refus obligatoire sauf pour examen extemporané.",
        penalite: -50
      }
    ],

    feedback_accept: "✅ Prélèvement accepté avec réserves. Les non-conformités mineures ont été documentées sur fiche de non-conformité. Le biologiste a été informé.",
    feedback_reject: "❌ Prélèvement refusé pour non-conformité critique. Le médecin prescripteur a été contacté et un nouveau prélèvement sera demandé si possible.",
    feedback_parfait: "🏆 Excellent ! Toutes les vérifications ont été effectuées. La traçabilité pré-analytique est garantie."
  },

  // ── NIVEAU 2 : Macroscopie ───────────────────────────────────
  level2: {
    title: "Examen Macroscopique",
    icon: "🔬",
    lieu: "Salle de macroscopie",
    description: "Examinez la pièce de lobectomie pulmonaire, décrivez la tumeur et sélectionnez les zones à prélever pour inclusion.",
    maxScore: 200,

    description_macroscopique: {
      lobe: "Lobe supérieur droit — 14 × 9 × 7 cm — 280g",
      tumeur: "Masse blanchâtre de 5,2 × 4,1 × 3,8 cm, à limites irrégulières mal définies, dure, non encapsulée, avec zones de rétraction pleurale",
      localisation: "Segment apical du lobe supérieur",
      bronche: "Bronche lobaire sectionnée, berge bronchique à 3 cm de la tumeur",
      plèvre: "Rétraction pleurale en regard de la tumeur (envahissement suspecté)",
      parenchyme: "Parenchyme résiduel de couleur rosée, aéré, avec emphysème modéré",
      ganglions: "3 ganglions hilaires identifiés (Ø 0,8 à 1,4 cm), aspect ferme et +/- anthracosés"
    },

    prelevements: [
      {
        id: "prev_tumeur",
        label: "Tumeur (centre + périphérie)",
        icon: "🎯",
        obligatoire: true,
        hotspot: { x: 38, y: 35, w: 14, h: 14 },
        explication: "Prélèvements multiples obligatoires : centre tumoral (nécrose ?) + front invasif périphérique. Minimum 1 bloc par cm de tumeur.",
        points: 50
      },
      {
        id: "prev_marge_bronchique",
        label: "Marge bronchique (limite d'exérèse)",
        icon: "✂️",
        obligatoire: true,
        hotspot: { x: 20, y: 55, w: 12, h: 12 },
        explication: "La marge bronchique conditionne la résécabilité et le pronostic. Distance à la tumeur obligatoire dans le CR.",
        points: 40
      },
      {
        id: "prev_plevre",
        label: "Interface tumeur-plèvre viscérale",
        icon: "🫁",
        obligatoire: true,
        hotspot: { x: 58, y: 28, w: 12, h: 12 },
        explication: "L'analyse de l'envahissement pleural (PL0/PL1/PL2) modifie le stade pT. Prélèvement perpendiculaire à la surface pleurale indispensable.",
        points: 40
      },
      {
        id: "prev_parenchyme_sain",
        label: "Parenchyme sain à distance",
        icon: "🌿",
        obligatoire: true,
        hotspot: { x: 72, y: 65, w: 11, h: 11 },
        explication: "Permet d'évaluer le fond lésionnel (emphysème, fibrose) et les lésions associées (bronchite, hyperplasie).",
        points: 30
      },
      {
        id: "prev_ganglions",
        label: "Ganglions hilaires (3 ganglions)",
        icon: "🔵",
        obligatoire: true,
        hotspot: { x: 56, y: 62, w: 13, h: 13 },
        explication: "L'état ganglionnaire (pN0/pN1/pN2) est un facteur pronostique et thérapeutique majeur dans les carcinomes pulmonaires.",
        points: 40
      }
    ],

    erreur_oubli_marge: "⚠️ ERREUR : Marge bronchique non prélevée ! Sans cette information, il est impossible de statuer sur la qualité de l'exérèse chirurgicale et le risque de récidive locale.",
    erreur_oubli_ganglion: "⚠️ ERREUR : Ganglions non prélevés ! L'analyse du statut ganglionnaire est indispensable pour le staging pTNM. Un pN sous-estimé peut compromettre la décision thérapeutique.",
    erreur_oubli_plevre: "⚠️ ERREUR : Interface pleurale non prélevée ! L'envahissement pleural viscéral modifie le stade pT (pT1 → pT2) et influence la stratégie thérapeutique post-opératoire."
  },

  // ── NIVEAU 3 : Traitement Technique ─────────────────────────
  level3: {
    title: "Traitement Technique",
    icon: "⚗️",
    lieu: "Laboratoire technique",
    description: "Remettez les étapes du traitement technique histologique dans le bon ordre par glisser-déposer.",
    maxScore: 150,

    etapes_correctes: [1, 2, 3, 4, 5],

    etapes: [
      {
        id: "e_fixation",
        ordre: 1,
        nom: "Fixation",
        emoji: "🧪",
        desc: "Formol tamponné 10% — 24 à 48h selon la taille",
        detail: "Stabilise les protéines, préserve la morphologie cellulaire et la réactivité antigénique. Étape fondamentale qui conditionne toutes les suivantes.",
        consequence_si_erreur: "Autolyse cellulaire, artefacts de rétraction, résultats IHC non interprétables"
      },
      {
        id: "e_deshydratation",
        ordre: 2,
        nom: "Déshydratation",
        emoji: "💧",
        desc: "Bains d'alcools graduels (70°→ 95° → 100°) + xylène",
        detail: "Élimine progressivement l'eau des tissus pour permettre l'imprégnation en paraffine (hydrophobe).",
        consequence_si_erreur: "Mauvaise imprégnation en paraffine, coupes de mauvaise qualité"
      },
      {
        id: "e_inclusion",
        ordre: 3,
        nom: "Inclusion en Paraffine",
        emoji: "🟡",
        desc: "Inclusion en paraffine liquide (56–60°C) → refroidissement",
        detail: "La paraffine remplace le xylène et enrobe le tissu dans un bloc solide permettant les coupes au microtome.",
        consequence_si_erreur: "Blocs de mauvaise dureté, tissu se détachant à la coupe"
      },
      {
        id: "e_coupe",
        ordre: 4,
        nom: "Coupe au Microtome",
        emoji: "🔪",
        desc: "Coupes en ruban de 3–5 μm d'épaisseur",
        detail: "Le microtome rotatif sectionne le bloc en coupes ultra-fines déposées sur bain-marie puis recueillies sur lames silanisées.",
        consequence_si_erreur: "Coupes trop épaisses (superposition cellulaire), artefacts de compression"
      },
      {
        id: "e_coloration",
        ordre: 5,
        nom: "Coloration HE",
        emoji: "🎨",
        desc: "Hématoxyline-Éosine : noyaux en violet, cytoplasmes en rose",
        detail: "L'hématoxyline colore les noyaux en bleu/violet. L'éosine colore les cytoplasmes et le tissu conjonctif en rose. Standard universel de la pathologie.",
        consequence_si_erreur: "Mauvaise différenciation nucléaire/cytoplasmique, diagnostic impossible"
      }
    ],

    piege_description: "Une mauvaise fixation initiale entraîne une cascade d'artefacts tout au long du traitement technique et rend les examens complémentaires (IHC, biologie moléculaire) non interprétables.",
    message_succes: "✅ Ordre parfait ! Vous maîtrisez le circuit technique histologique.",
    message_echec: "La séquence est incorrecte. Souvenez-vous : le tissu doit d'abord être fixé (stabilisé), puis déshydraté (pour accepter la paraffine), puis inclus, coupé et enfin coloré."
  },

  // ── NIVEAU 4 : Microscopie ───────────────────────────────────
  level4: {
    title: "Analyse Microscopique",
    icon: "🔭",
    lieu: "Salle de lecture",
    description: "Observez les lames histologiques et associez chaque image au bon diagnostic.",
    maxScore: 250,

    slides: [
      {
        id: "sl_adeno",
        image: "assets/histo_adeno.png",
        zone: "Tumeur principale — Obj. ×20",
        grossissement: "×20",
        diagnostic_correct: "Adénocarcinome pulmonaire",
        type: "adénocarcinome",
        criteres: [
          "Architecture glandulaire (pattern acinaire prédominant)",
          "Cellules cubiques avec noyaux vésiculeux et nucléoles proéminents",
          "Mucosécrétion intracytoplasmique",
          "Stroma desmoplastique",
          "Invasion du parenchyme pulmonaire adjacent"
        ],
        malignite: [
          "Pléomorphisme nucléaire important",
          "Mitoses atypiques présentes",
          "Nécrose tumorale focale",
          "Invasion vasculaire et lymphatique"
        ]
      },
      {
        id: "sl_epidermo",
        image: "assets/histo_epidermoide.png",
        zone: "Nodule satellite — Obj. ×40",
        grossissement: "×40",
        diagnostic_correct: "Carcinome épidermoïde",
        type: "épidermoïde",
        criteres: [
          "Nids et massifs cellulaires à différenciation malpighienne",
          "Perles cornées (kératinisation)  caractéristiques",
          "Ponts intercellulaires visibles",
          "Cytoplasme abondant éosinophile",
          "Noyaux hyperchromatiques irréguliers"
        ],
        malignite: [
          "Invasion stromale franche",
          "Mitoses nombreuses et atypiques",
          "Anisocaryose marquée",
          "Emboles lymphatiques"
        ]
      },
      {
        id: "sl_sain",
        image: "assets/histo_sain.png",
        zone: "Parenchyme sain à distance — Obj. ×10",
        grossissement: "×10",
        diagnostic_correct: "Parenchyme pulmonaire sain + Emphysème modéré",
        type: "sain",
        criteres: [
          "Alvéoles à parois fines régulières",
          "Pneumocytes de type I et II normaux",
          "Capillaires alvéolaires ouverts",
          "Absence de cellules atypiques",
          "Distension alvéolaire de fond (emphysème centrolobulaire léger)"
        ],
        malignite: []
      }
    ],

    diagnostics_choices: [
      "Adénocarcinome pulmonaire",
      "Carcinome épidermoïde",
      "Carcinome à petites cellules",
      "Carcinoïde typique",
      "Parenchyme pulmonaire sain + Emphysème modéré",
      "Métastase pulmonaire"
    ],

    message_succes: "🏆 Analyse microscopique excellente ! Vous avez correctement identifié tous les types tumoraux.",
    message_partiel: "⚠️ Quelques erreurs diagnostiques. Relisez les critères histologiques pour mieux différencier adénocarcinome et carcinome épidermoïde — une distinction cruciale pour le choix thérapeutique."
  },

  // ── NIVEAU 5 : Compte Rendu ──────────────────────────────────
  level5: {
    title: "Compte Rendu Anatomo-Pathologique",
    icon: "📋",
    lieu: "Validation finale",
    description: "Rédigez le compte rendu structuré de lobectomie pulmonaire en remplissant tous les champs obligatoires.",
    maxScore: 150,

    reponses_correctes: {
      type_histologique: "Adénocarcinome invasif",
      pattern_predominant: "Acinaire",
      taille_tumeur: "52",
      grade: "Grade 2 (modérément différencié)",
      marges: "Marges saines (R0) — distance ≥ 3cm",
      plevre: "PL1 — Invasion de la plèvre viscérale élastique",
      ganglions: "pN1 — 1 ganglion hilaire envahi / 3 prélevés",
      pt: "pT2a",
      pn: "pN1",
      pm: "pM0",
      stade: "Stade IIB"
    },

    fields: [
      {
        id: "type_histologique",
        label: "Type histologique",
        type: "select",
        options: ["--", "Adénocarcinome invasif", "Carcinome épidermoïde", "Carcinome à petites cellules", "Carcinoïde typique", "Carcinome adénosquameux"],
        correct: "Adénocarcinome invasif",
        points: 20
      },
      {
        id: "pattern_predominant",
        label: "Pattern architectural prédominant",
        type: "select",
        options: ["--", "Acinaire", "Papillaire", "Micropapillaire", "Lépidique", "Solide"],
        correct: "Acinaire",
        points: 15
      },
      {
        id: "taille_tumeur",
        label: "Taille maximale de la tumeur (mm)",
        type: "input",
        placeholder: "ex: 52",
        correct: "52",
        points: 15
      },
      {
        id: "grade",
        label: "Grade histologique",
        type: "select",
        options: ["--", "Grade 1 (bien différencié)", "Grade 2 (modérément différencié)", "Grade 3 (peu différencié)"],
        correct: "Grade 2 (modérément différencié)",
        points: 15
      },
      {
        id: "marges",
        label: "Marges chirurgicales",
        type: "select",
        options: ["--", "Marges saines (R0) — distance ≥ 3cm", "Marges saines mais < 1mm (R0 limite)", "Marge envahie (R1)", "Non évaluables"],
        correct: "Marges saines (R0) — distance ≥ 3cm",
        points: 15
      },
      {
        id: "plevre",
        label: "Statut pleural viscéral",
        type: "select",
        options: ["--", "PL0 — Sans envahissement pleural", "PL1 — Invasion de la plèvre viscérale élastique", "PL2 — Invasion au-delà de la plèvre viscérale", "PL3 — Invasion de la plèvre pariétale"],
        correct: "PL1 — Invasion de la plèvre viscérale élastique",
        points: 20
      },
      {
        id: "ganglions",
        label: "Statut ganglionnaire",
        type: "select",
        options: ["--", "pN0 — Aucun ganglion envahi", "pN1 — 1 ganglion hilaire envahi / 3 prélevés", "pN2 — Ganglions médiastinaux envahis", "pNx — Non évaluable"],
        correct: "pN1 — 1 ganglion hilaire envahi / 3 prélevés",
        points: 20
      }
    ],

    tnm_correct: { pT: "pT2a", pN: "pN1", pM: "pM0", stade: "IIB" },

    message_parfait: "🏆 Compte rendu parfait ! Votre CR est complet, structuré et cliniquement exploitable. Le chirurgien et l'oncologue pourront prendre une décision thérapeutique éclairée.",
    message_acceptable: "✅ Compte rendu acceptable avec quelques imprécisions. Veillez à la précision des marges et du statut pleural — des informations clés pour la décision thérapeutique.",
    message_insuffisant: "❌ Compte rendu insuffisant. Des éléments majeurs manquent ou sont erronés. Un CR incomplet peut conduire à une mauvaise prise en charge thérapeutique."
  }
};
