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
      { id: "cl_cons_fix", category: "conservation", text: "<b>Présence d'un fixateur :</b> Vérifier que la pièce n'est pas reçue à sec (risque d'autolyse irréversible des tissus).", required: true },
      { id: "cl_cons_nat", category: "conservation", text: "<b>Nature du fixateur :</b> Confirmer l'usage du Formol neutre tamponné à 10% (seul fixateur standard pour l'histologie).", required: true },
      { id: "cl_cons_vol", category: "conservation", text: "<b>Volume du fixateur :</b> Le liquide recouvre-t-il entièrement la pièce ? (Règle : volume ≥ 10 fois le volume du prélèvement).", required: true },
      { id: "cl_cons_recip", category: "conservation", text: "<b>Récipient adapté :</b> Utilisation d'un flacon à large ouverture.", required: true },
      { id: "cl_cons_etanche", category: "conservation", text: "<b>Étanchéité du récipient :</b> S'assurer de l'absence de fuite de liquide biologique ou de vapeurs toxiques de formol.", required: true },
      { id: "cl_cons_delai", category: "conservation", text: "<b>Délai d'acheminement :</b> Vérifier le respect du temps d'ischémie froide (délai entre exérèse et fixation le plus court possible).", required: true },
      
      { id: "cl_etiq_nom", category: "etiquetage", text: "<b>Vérifier nom et prénom</b> sur l'étiquette du flacon.", required: true },
      { id: "cl_etiq_siege", category: "etiquetage", text: "<b>Siège et latéralité :</b> Vérifier que le côté (droit ou gauche) et le lobe spécifique sont mentionnés.", required: true },
      { id: "cl_etiq_pres", category: "etiquetage", text: "<b>Identification du prescripteur :</b> nom et coordonnées du préleveur.", required: true },
      
      { id: "cl_dem_cliniq", category: "demande", text: "<b>Renseignements cliniques :</b> Motif de l'exérèse, antécédents pertinents, données d'imagerie (taille de la lésion).", required: true },
      { id: "cl_dem_pres", category: "demande", text: "<b>Identification du prescripteur :</b> nom et coordonnées du préleveur.", required: true },
      { id: "cl_dem_date", category: "demande", text: "<b>Date et heure de prélèvement</b> notées.", required: true },
      { id: "cl_dem_nature", category: "demande", text: "<b>Nature et siège</b> du prélèvement précisés.", required: true },
      
      { id: "cl_conc_parfaite", category: "concordance", text: "<b>Concordance parfaite</b> entre la fiche de demande et l’étiquette du flacon.", required: true },
      { id: "cl_conc_discordance", category: "concordance", text: "<b>Discordance</b> entre la fiche de demande et l’étiquette du flacon.", required: true }
    ],

    scenario: {
      contenant: "Petit flacon — Lobectomie occupant tout l'espace",
      volume_fixateur: "Volume de formol dérisoire (fixation à sec suspectée)",
      etiquette: "M. BENALI Karim — Lobectomie supérieure droite — Dr. MEZIANE S.",
      fiche: {
        urgence: "Non précisée",
        clinique: "Masse suspecte, tabagique - Absence de date/heure",
        nature: "Pièce de lobectomie supérieure droite",
        date: "Date : 15/04/2026 — Heure : NON NOTÉE",
        correspondants: "Dr. MEZIANE S."
      }
    },

    anomalies: [
      {
        id: "an_cons_inapproprie",
        categorie: "conservation",
        critical: false,
        label: "Fixateur inapproprié (Utilisation d'alcool, d'eau ou de liquide physiologique au lieu du formol)."
      },
      {
        id: "an_vol_insuffisant",
        categorie: "conservation",
        critical: false,
        label: "Volume de fixateur insuffisant (Ratio < 20 fois le volume de la pièce)."
      },
      {
        id: "an_cons_recipient",
        categorie: "conservation",
        critical: false,
        label: "Récipient inadapté (Ouverture trop étroite pour l'extraction de la pièce fixée/ flacon trop petit)."
      },
      {
        id: "an_cons_etancheite",
        categorie: "conservation",
        critical: false,
        label: "Défaut d'étanchéité (Fuite constatée ou odeur de formol suspecte)."
      },
      {
        id: "an_id_etiquetage",
        categorie: "identitovigilance",
        critical: false,
        label: "Étiquetage illisible ou absent sur le flacon."
      },
      {
        id: "an_renseignements_vagues",
        categorie: "identitovigilance",
        critical: false,
        label: "Absence de renseignements cliniques (Motif d'examen ou antécédents manquants)."
      },
      {
        id: "an_id_prescripteur",
        categorie: "identitovigilance",
        critical: false,
        label: "Absence d'identification du prescripteur (Impossible de joindre le chirurgien)."
      },
      {
        id: "an_absence_heure",
        categorie: "identitovigilance",
        critical: false,
        label: "Absence de la date et l’heure de l’intervention."
      }
    ],

    anomalies_critiques: [
      {
        id: "anc_absence_fixateur",
        categorie: "conservation",
        critical: true,
        label: "Absence de fixateur (Pièce reçue à sec)."
      },
      {
        id: "anc_discordance_identite",
        categorie: "identitovigilance",
        critical: true,
        label: "Discordance d'identité (Nom ou prénom différent entre le bon et le flacon)."
      },
      {
        id: "anc_erreur_lateralite",
        categorie: "identitovigilance",
        critical: true,
        label: "Erreur de latéralité/siège (Ex: \"Poumon Droit\" sur le bon vs \"Poumon Gauche\" sur le flacon)."
      }
    ],

    feedback_accept: "✅ Prélèvement accepté avec réserves. Les non-conformités mineures ont été documentées sur fiche de non-conformité. Le chirurgien a été informé.",
    feedback_reject: "❌ Prélèvement refusé pour non-conformité critique. Le médecin prescripteur a été contacté et un nouveau prélèvement sera demandé si possible.",
    feedback_parfait: "🏆 Excellent ! Toutes les vérifications ont été effectuées. La traçabilité pré-analytique est garantie."
  },

  // ── NIVEAU 2 : Macroscopie ───────────────────────────────────
  level2: {
    title: "Examen Macroscopique : « L’œil du pathologiste »",
    icon: "🔬",
    lieu: "Salle de macroscopie",
    description: "La conformité est validée. La pièce de lobectomie supérieure droite est sur votre paillasse de macroscopie. À ce stade, aucun microscope ne peut vous aider : seul votre regard et votre rigueur guideront vos décisions.<br><br><b>Votre mission :</b> Explorer la pièce opératoire et réaliser l’échantillonnage stratégique qui scellera le diagnostic histologique.<br><br><span style='color:var(--danger)'><b>Attention :</b></span> Un prélèvement oublié est une information perdue à jamais. Soyez méthodique.",
    maxScore: 200,

    description_macroscopique: {
      lobe: "Lobe supérieur droit — 14 × 9 × 7 cm — 280g",
      tumeur: "La taille de la formation tumorale est 5,5x3 cm située à 3 cm de la recoupe bronchique. Masse blanchâtre à limites irrégulières mal définies, dure, non encapsulée, avec zones de rétraction pleurale",
      localisation: "Segment apical du lobe supérieur",
      bronche: "Bronche lobaire sectionnée",
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

    etapes_correctes: [1, 2, 3, 4, 5, 6],

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
        desc: "Bains d'alcools croissants + solvant (xylène)",
        detail: "Élimine progressivement l'eau des tissus via des bains d'alcools croissants. Indispensable pour permettre l'imprégnation par la paraffine qui est hydrophobe.",
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
        desc: "Coupes ultra-fines (3 à 5 microns)",
        detail: "Le microtome sectionne le bloc en coupes ultra-fines (3 à 5 micron). Ces rubans sont étalés sur un bain-marie avant d'être recueillis sur des lames de verre.",
        consequence_si_erreur: "Coupes trop épaisses (superposition cellulaire), artefacts de compression"
      },
      {
        id: "e_coloration",
        ordre: 5,
        nom: "Coloration HE",
        emoji: "🎨",
        desc: "Hématoxyline (noyaux) et Éosine (cytoplasmes)",
        detail: "L'hématoxyline colore les noyaux en bleu. L'éosine colore les cytoplasmes en rose. Standard universel de la pathologie.",
        consequence_si_erreur: "Mauvaise différenciation nucléaire/cytoplasmique, diagnostic impossible"
      },
      {
        id: "e_montage",
        ordre: 6,
        nom: "Montage",
        emoji: "🖼️",
        desc: "Résine transparente et lamelle de verre",
        detail: "Application d'une résine transparente et d'une lamelle de verre. Cette étape assure la protection définitive de la coupe et une clarté optique optimale sous l'objectif.",
        consequence_si_erreur: "Dégradation de la coupe dans le temps, mauvaise qualité optique"
      }
    ],

    piege_description: "Une mauvaise fixation initiale entraîne une cascade d'artefacts tout au long du traitement technique et rend les examens complémentaires (IHC, biologie moléculaire) non interprétables.",
    message_succes: "✅ Ordre parfait ! Vous maîtrisez le circuit technique histologique.",
    message_echec: "La séquence est incorrecte. Souvenez-vous : le tissu doit d'abord être fixé (stabilisé), puis déshydraté (pour accepter la paraffine), puis inclus, coupé et enfin coloré."
  },

  // ── NIVEAU 4 : Microscopie ───────────────────────────────────
  level4: {
    title: "Analyse Microscopique : La vérité tumorale",
    icon: "🔭",
    lieu: "Salle de lecture",
    description: "Les lames histologiques issues de la lobectomie pulmonaire ont été validées sur le plan technique. Vous êtes maintenant au cœur du diagnostic : l'analyse microscopique.<br><br><strong>👨‍⚕️ Dr. Pathologiste (Senior) :</strong><br>« Gardez l'œil ouvert : une seule cellule peut changer le stade de pT1 à pT4. Vous devez identifier la nature de la lésion, évaluer son agressivité et rechercher les critères essentiels au staging tumoral. »",
    maxScore: 250,

    phase1: {
      titre: "Phase 1 : Le balayage tactique (faible grossissement x4)",
      objectif: "Reconnaissance du tissu tumoral",
      consigne: "En vous appuyant sur cette vue à faible grossissement, citez les critères histologiques de malignité que vous devrez confirmer lors de la descente d'objectifs.",
      memo: "A.A.N.M.P (Architecture, Atypies, Noyaux, Mitoses, Polarité)",
      criteres: [
        { id: "p1_c1", label: "Désorganisation architecturale", correct: true },
        { id: "p1_c2", label: "Atypies cellulaires", correct: true },
        { id: "p1_c3", label: "Noyaux hyperchromatiques", correct: true },
        { id: "p1_c4", label: "Mitoses atypiques", correct: true },
        { id: "p1_c5", label: "Perte de polarité", correct: true },
        { id: "p1_c6", label: "Anisocytose, anisocaryose", correct: true },
        { id: "p1_c7", label: "Fibrose régulière", correct: false },
        { id: "p1_c8", label: "Nappes régulières ciliées", correct: false }
      ]
    },

    phase2: {
      titre: "Phase 2 : Le profilage cellulaire (Grossissement x20)",
      objectif: "Identification du type histologique",
      consigne1: "Analyse morphologique : En observant votre zone d'intérêt, identifiez le ou les critère(s) spécifique(s) présent(s) sur cette lame :",
      morphologie: [
        { id: "p2_m1", label: "Globe corné", correct: true },
        { id: "p2_m2", label: "Structures glandulaires (lumières)", correct: false },
        { id: "p2_m3", label: "Nappes de cellules indifférenciées", correct: false },
        { id: "p2_m4", label: "Architecture organoïde (nids, palissades)", correct: false },
        { id: "p2_m5", label: "Ponts intercellulaires / Kératinisation", correct: true },
        { id: "p2_m6", label: "Phénomène de moulage ou d'écrasement nucléaire", correct: false }
      ],
      consigne2: "Synthèse diagnostique : Au vu de ces critères, quel est le type histologique dominant ?",
      synthese: [
        "Adénocarcinome pulmonaire",
        "Carcinome épidermoïde",
        "Carcinome à petites cellules",
        "Carcinome à grandes cellules",
        "Carcinoïde atypique",
        "Carcinome neuroendocrine à grandes cellules"
      ],
      synthese_correcte: "Carcinome épidermoïde"
    },

    phase3: {
      titre: "Phase 3 : La Traque des Critères TNM & Facteurs Pronostiques (x40)",
      objectif: "Analyse de l'invasion tumorale",
      intro: "Le diagnostic de carcinome épidermoïde est posé. Maintenant, vous devez identifier les signes d'extension locale et les facteurs de mauvais pronostic qui modifieront le pTNM.",
      consigne: "1- Cochez les signes d'agressivité (facteurs histo-pronostiques) que vous devez impérativement rechercher pour établir le stade de la maladie et le pronostic.",
      consigne2: "2- Observez les champs microscopiques. Parmi les critères cités précédemment, quel est le signe d'agressivité identifié sur cette image ?",
      agressivite_identifiee_options: [
        "Invasion pleurale",
        "Invasion bronchique",
        "STAS (Diffusion aérienne)",
        "Métastase ganglionnaire",
        "Emboles vasculaires",
        "Engainement péri-nerveux"
      ],
      agressivite_identifiee_correcte: "Métastase ganglionnaire",
      agressivite: [
        { id: "p3_a1", label: "Invasion pleurale", correct: true },
        { id: "p3_a2", label: "Invasion bronchique", correct: true },
        { id: "p3_a3", label: "STAS (Diffusion aérienne)", correct: true },
        { id: "p3_a4", label: "Métastase ganglionnaire", correct: true },
        { id: "p3_a5", label: "Emboles vasculaires", correct: true },
        { id: "p3_a6", label: "Engainement péri-nerveux", correct: true },
        { id: "p3_a7", label: "Anthracose", correct: false },
        { id: "p3_a8", label: "Métaplasie malpighienne régulière", correct: false },
        { id: "p3_a9", label: "Hyperplasie des cellules caliciformes", correct: false }
      ]
    },

    bilan_extension: [
      { element: "Invasion Pleurale", resultat: "Présente (franchissement de la limitante élastique)", impact: "Classe le dossier en pT2 minimum" },
      { element: "Invasion Bronchique", resultat: "Absente", impact: "Pas d'extension à la bronche souche" },
      { element: "STAS (Diffusion aérienne)", resultat: "Présent", impact: "Facteur de risque élevé de récidive locale" },
      { element: "Emboles Vasculaires", resultat: "Nombreux", impact: "Risque accru de métastases à distance" },
      { element: "Engainements péri-nerveux", resultat: "Absents", impact: "-" },
      { element: "Métastase ganglionnaire", resultat: "N1 (2 ganglions hilaires positifs sur 5)", impact: "Modifie le stade pN" }
    ],

    point_pedagogique: `🎓 Point pédagogique : <b>La précision du diagnostic histologique n'est pas qu'une simple rigueur académique ; elle constitue le pilier fondamental de la médecine personnalisée.</b><br><br>Un diagnostic morphologique exact est l'étape décisive qui permet d'orienter sans délai :<ul><li style='margin-bottom:6px'><b>Le bilan moléculaire :</b> En sélectionnant les biomarqueurs pertinents (NGS, FISH) pour préserver le matériel tumoral.</li><li style='margin-bottom:6px'><b>La stratégie thérapeutique :</b> En dictant le choix entre thérapies ciblées, immunothérapies ou protocoles conventionnels.</li><li style='margin-bottom:6px'><b>Le pronostic :</b> En évaluant précisément l'agressivité et l'extension tumorale (Staging pTNM).</li></ul>
    <div style="overflow-x:auto; margin-top:20px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
        <thead>
          <tr style="background:var(--bg-secondary); color:var(--text-secondary);">
            <th style="padding:10px; border:1px solid var(--border-glass);">Entité Histologique</th>
            <th style="padding:10px; border:1px solid var(--border-glass);">Architecture (x20)</th>
            <th style="padding:10px; border:1px solid var(--border-glass);">Morphologie cellulaire</th>
            <th style="padding:10px; border:1px solid var(--border-glass);">Indices "clés"</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Carcinome épidermoïde</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Massifs, lobules, ponts intercellulaires</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Cellules polygonales, limites nettes</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Kératinisation (globes cornés, dyskératose)</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Adénocarcinome</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Glandes, papilles, acini</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Cellules cubiques/cylindriques</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Lumières ou vacuoles de mucus</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Carcinome à petites cellules</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Nappes diffuses, zones d'écrasement</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Cellules petite taille, indifférenciée, cytoplasme rare</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Ecrasement / moulage nucléaire</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Carcinome à grandes cellules</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Massifs solides, architecture anarchique</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Grandes cellules pléomorphes</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Diagnostic d'exclusion (ni glandulaire, ni malpighien)</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Carcinome neuroendocrine à grandes cellules</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Nids, palissades, architecture organoïde</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Grandes cellules</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Nécrose abondante + IM > 10 mitoses / 2 mm²</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Carcinoïde typique</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Organoïde, trabéculaire, très vasculaire</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Cellules régulières, monomorphes</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Chromatine "Sel et Poivre", < 2 mitoses, absence de nécrose</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid var(--border-glass); font-weight:bold; color:var(--cyan);">Carcinoïde Atypique</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Idem Typique, mais plus désorganisé</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Idem Typique</td>
            <td style="padding:10px; border:1px solid var(--border-glass);">Nécrose ponctuée ou 2-10 mitoses</td>
          </tr>
        </tbody>
      </table>
    </div>`,
    
    message_succes: "🏆 Analyse microscopique excellente ! Le diagnostic de Carcinome Épidermoïde avec ses facteurs pronostiques est validé."
  },

  // ── NIVEAU 5 : Compte Rendu ──────────────────────────────────
  level5: {
    title: "Compte Rendu Anatomo-Pathologique",
    icon: "📋",
    lieu: "Validation finale",
    description: "Rédigez le compte rendu structuré complet et établissez la classification pTNM définitive en vous appuyant sur la 9ème édition de l'IASLC.",
    sous_titre: "Du microscope à la thérapeutique",
    maxScore: 200,

    patient: {
      nom: "Tounsi Ben Tounsi",
      prelevement: "LSD — Lobe Supérieur Droit",
      medecin: "Dr Meziane"
    },

    fields: [
      {
        id: "type_histologique",
        label: "Type histologique",
        type: "select",
        options: ["--", "Adénocarcinome pulmonaire", "Carcinome épidermoïde", "Carcinome à petites cellules", "Carcinome à grandes cellules", "Carcinoïde atypique", "Carcinome neuroendocrine à grandes cellules"],
        correct: "Carcinome épidermoïde",
        points: 30
      },
      {
        id: "pattern_architectural",
        label: "Pattern architectural prédominant",
        type: "select",
        options: ["--", "Acinaire", "Papillaire", "Organoïde", "Lobulaire"],
        correct: "Lobulaire",
        points: 20
      },
      {
        id: "taille_tumorale",
        label: "Taille maximale de la tumeur (cm)",
        type: "input",
        placeholder: "ex: 5.5",
        correct: "5.5",
        points: 20
      },
      {
        id: "differenciation",
        label: "Différenciation",
        type: "select",
        options: ["--", "Bien différencié kératinisant", "Moyennement différencié", "Peu différencié"],
        correct: "Bien différencié kératinisant",
        points: 20
      },
      {
        id: "marges_chirurgicales",
        label: "Marges chirurgicales",
        type: "select",
        options: ["--", "Recoupe bronchique saine", "Recoupe bronchique tumorale"],
        correct: "Recoupe bronchique saine",
        points: 20
      }
    ],

    ganglions_donnes: {
      label: "Statut ganglionnaire (donné)",
      valeur: "N1",
      detail: "2 ganglions hilaires positifs sur 5 prélevés"
    },

    tnm_correct: { pT: "pT2b", pN: "pN1", pM: "pM0", stade: "IIB" },

    message_parfait: "🏆 Félicitations, Docteur. Votre compte rendu est validé et le dossier peut maintenant passer en RCP (Réunion de Concertation Pluridisciplinaire) pour décider du traitement adjuvant.",
    message_acceptable: "✅ Compte rendu acceptable avec quelques imprécisions. Vérifiez la différenciation et le pattern architectural — éléments clés pour la stratégie thérapeutique.",
    message_insuffisant: "❌ Compte rendu insuffisant. Des éléments majeurs manquent ou sont erronés. Un CR incomplet peut conduire à une mauvaise prise en charge thérapeutique.",
    message_pedagogique: "Le compte rendu anatomo-pathologique est le document médico-légal central qui oriente toutes les décisions thérapeutiques. Sa précision et son exhaustivité conditionnent directement la survie du patient."
  }
};
