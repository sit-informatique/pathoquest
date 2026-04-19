// ============================================================
//  PathoQuest — level1.js  |  Réception du Prélèvement
// ============================================================

const Level1 = (() => {

  const LEVEL_NUM = 1;
  const MAX_SCORE = 150;
  let checkedItems = new Set();
  let selectedAnomalies = new Set();
  let selectedCritiques = new Set();
  let submitted = false;
  let containerReplaced = false;
  let surgeonContacted = false;
  let validationPts = 0;

  function init() {
    submitted = false;
    containerReplaced = false;
    surgeonContacted = false;
    validationPts = 0;
    checkedItems.clear();
    selectedAnomalies.clear();
    selectedCritiques.clear();
    render();
  }

  function render() {
    const d = GAME_DATA.level1;
    const container = document.getElementById('level1-content');

    // Categories d'items checklist
    const cats = {
      conservation: { label: "🧪 Conservation & Transport", items: [] },
      etiquetage:   { label: "🏷️ Étiquetage du flacon",    items: [] },
      demande:      { label: "📄 Fiche de demande",         items: [] },
      concordance:  { label: "🔗 Concordance fiche / flacon", items: [] }
    };
    d.checklist.forEach(item => cats[item.category]?.items.push(item));

    // Aperçu du prélèvement simulé
    const sc = d.scenario;
    const fiche = sc.fiche;

    container.innerHTML = `
      <!-- Aperçu du prélèvement -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
        <div class="card" style="margin-bottom:0">
          <div class="card-title"><span class="card-icon">🫙</span> Prélèvement reçu</div>
          <div style="font-size:0.88rem;line-height:1.8;color:var(--text-secondary)">
            <div><strong style="color:var(--text-primary)">Contenant :</strong> ${sc.contenant}</div>
            <div style="color:var(--warning);margin-top:6px"><strong>⚠️ Volume fixateur :</strong> ${sc.volume_fixateur}</div>
            <div style="margin-top:6px"><strong style="color:var(--text-primary)">Étiquette :</strong> ${sc.etiquette}</div>
            <div style="margin-top:6px"><strong style="color:var(--text-primary)">Médecin :</strong> ${sc.medecin}</div>
          </div>
        </div>
        <div class="card" style="margin-bottom:0">
          <div class="card-title"><span class="card-icon">📋</span> Fiche de demande</div>
          <div style="font-size:0.88rem;line-height:1.8;color:var(--text-secondary)">
            <div><strong style="color:var(--text-primary)">Urgence :</strong> <span style="color:var(--warning)">${fiche.urgence}</span></div>
            <div><strong style="color:var(--text-primary)">Clinique :</strong> ${fiche.clinique}</div>
            <div><strong style="color:var(--text-primary)">Nature :</strong> ${fiche.nature}</div>
            <div><strong style="color:var(--text-primary)">Date :</strong> <span style="color:var(--warning)">${fiche.date}</span></div>
            <div><strong style="color:var(--text-primary)">Correspondants :</strong> ${fiche.correspondants}</div>
          </div>
        </div>
      </div>

      <!-- Checklist -->
      <div class="card">
        <div class="card-title"><span class="card-icon">✅</span> Étape 1 — Vérification des points de conformité</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:20px">Cochez chaque point après vérification.</p>
        ${Object.values(cats).map(cat => `
          <div class="checklist-group">
            <div class="checklist-group-title">${cat.label}</div>
            ${cat.items.map(item => `
              <div class="checklist-item" id="ci-${item.id}" onclick="Level1.toggleCheck('${item.id}')">
                <div class="check-box" id="cb-${item.id}"></div>
                <div class="checklist-item-text">${item.text}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}
        <div id="checklist-progress" style="margin-top:12px;font-size:0.82rem;color:var(--text-muted)">
          0 / ${d.checklist.length} points vérifiés
        </div>
      </div>

      <!-- Décision -->
      <div class="card">
        <div class="card-title"><span class="card-icon">⚠️</span> Étape 2 — Signalement des Non-Conformités détectées</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:20px">Sélectionnez toutes les anomalies que vous avez identifiées dans ce prélèvement.</p>

        <div class="checklist-group-title">🔴 Non-conformités CRITIQUES (refus obligatoire)</div>
        <div class="anomaly-grid" style="margin-bottom:20px">
          ${d.anomalies_critiques.map(a => `
            <div class="anomaly-option critical" id="ac-${a.id}" onclick="Level1.toggleCritique('${a.id}')">
              <div class="anomaly-tag tag-critique">Critique</div>
              <div>${a.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="checklist-group-title">🟡 Non-conformités MINEURES (signalement + acceptation)</div>
        <div class="anomaly-grid">
          ${d.anomalies.map(a => `
            <div class="anomaly-option" id="am-${a.id}" onclick="Level1.toggleAnomalie('${a.id}')">
              <div class="anomaly-tag tag-mineur">Mineur</div>
              <div>${a.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div class="level-actions" id="level1-actions">
        <button class="btn btn-success btn-lg" onclick="Level1.valider()" id="btn-valider">
          ✅ Accepter avec réserves
        </button>
        <button class="btn btn-danger btn-lg" onclick="Level1.refuser()" id="btn-refuser">
          ❌ Refuser le prélèvement
        </button>
      </div>

      <!-- Actions Correctives (cachées au début) -->
      <div class="card hidden" id="level1-correctives" style="margin-top:24px; border: 2px solid var(--primary); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2)">
        <div class="card-title"><span class="card-icon">🛠️</span> Étape 3 — Actions Correctives</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:20px">
          Avant d'envoyer ce prélèvement en technique, vous devez corriger les anomalies identifiées pour garantir la qualité pré-analytique.
        </p>

        <div style="display:flex;gap:20px;flex-wrap:wrap">
          <div class="card" style="flex:1;min-width:300px;text-align:center;margin-bottom:0" id="action-container-card">
            <h4 style="margin-bottom:15px;color:var(--text-primary)">1. Remplacement du Contenant</h4>
            <div id="container-animation-area" style="height:120px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;margin-bottom:15px;background:var(--bg-lighter);border-radius:var(--radius-md);transition:all 0.5s">
              <span id="anim-flask" style="transition:transform 0.3s">🫙</span> <span id="anim-liquid" style="font-size:1.5rem;margin-left:10px;transition:all 0.4s">💧</span>
            </div>
            <button class="btn btn-primary" onclick="Level1.remplacerContenant()" id="btn-replace-container">
              🔄 Changer le flacon et ajouter du Formol
            </button>
            <div id="container-status" style="margin-top:10px;color:var(--success);font-weight:bold;opacity:0;transition:opacity 0.3s">
              ✅ Prélèvement conditionné
            </div>
          </div>

          <div class="card" style="flex:1;min-width:300px;text-align:center;margin-bottom:0" id="action-chat-card">
            <h4 style="margin-bottom:15px;color:var(--text-primary)">2. Récupération des données</h4>
            <div id="chat-animation-area" style="height:140px;display:flex;flex-direction:column;justify-content:center;gap:8px;padding:15px;background:var(--bg-lighter);border-radius:var(--radius-md);overflow-y:auto;text-align:left;font-size:0.85rem">
              <div style="text-align:center;color:var(--text-muted);font-style:italic">Appel en attente...</div>
            </div>
            <button class="btn btn-primary" onclick="Level1.contacterChirurgien()" id="btn-call-surgeon" style="margin-top:15px">
              📞 Contacter le Dr. MEZIANE S.
            </button>
             <div id="chat-status" style="margin-top:10px;color:var(--success);font-weight:bold;opacity:0;transition:opacity 0.3s">
              ✅ Date et heure récupérées
            </div>
          </div>
        </div>

        <div class="level-actions" style="margin-top:20px;justify-content:center">
          <button class="btn btn-success btn-lg disabled" id="btn-final-accept" onclick="Level1.finaliserAcceptation()" style="opacity:0.5;cursor:not-allowed">
            ✅ Finaliser l'acceptation
          </button>
        </div>
      </div>

      <!-- Feedback zone -->
      <div id="level1-feedback" class="hidden" style="margin-top:24px"></div>
    `;
  }

  function toggleCheck(id) {
    if (submitted) return;
    const item = document.getElementById('ci-' + id);
    const box  = document.getElementById('cb-' + id);
    if (checkedItems.has(id)) {
      checkedItems.delete(id);
      item.classList.remove('checked');
      box.classList.remove('checked');
    } else {
      checkedItems.add(id);
      item.classList.add('checked');
      box.classList.add('checked');
    }
    updateProgress();
  }

  function toggleAnomalie(id) {
    if (submitted) return;
    const el = document.getElementById('am-' + id);
    if (selectedAnomalies.has(id)) { selectedAnomalies.delete(id); el.classList.remove('selected'); }
    else                           { selectedAnomalies.add(id);    el.classList.add('selected'); }
  }

  function toggleCritique(id) {
    if (submitted) return;
    const el = document.getElementById('ac-' + id);
    if (selectedCritiques.has(id)) { selectedCritiques.delete(id); el.classList.remove('selected'); }
    else                           { selectedCritiques.add(id);    el.classList.add('selected'); }
  }

  function updateProgress() {
    const total = GAME_DATA.level1.checklist.length;
    const el = document.getElementById('checklist-progress');
    if (el) el.textContent = `${checkedItems.size} / ${total} points vérifiés`;
  }

  function valider() {
    if (submitted) return;
    submitted = true;
    const d = GAME_DATA.level1;
    let pts = 0;
    let msgs = [];

    // Points pour la checklist (80 pts)
    const checkPts = Math.round((checkedItems.size / d.checklist.length) * 80);
    pts += checkPts;

    // Points pour chaque anomalie mineure correctement identifiée (10 pts chacune)
    d.anomalies.forEach(a => {
      if (selectedAnomalies.has(a.id)) {
        pts += 10;
        Game.toast('warning', 'Non-conformité signalée', `${a.label} — ${a.explication}`, 10);
      }
    });

    // Pénalités si anomalie mineure NON signalée mais réelle
    if (!selectedAnomalies.has('an_volume_fixateur')) {
      Game.addPenalty(10, LEVEL_NUM);
      Game.toast('error', 'Non-conformité manquée', 'Volume de fixateur insuffisant non signalé !', -10);
    }
    if (!selectedAnomalies.has('an_contenant_inadequat')) {
      Game.addPenalty(10, LEVEL_NUM);
      Game.toast('error', 'Non-conformité manquée', 'Contenant inadapté non signalé !', -10);
    }
    if (!selectedAnomalies.has('an_heure_manquante')) {
      Game.addPenalty(10, LEVEL_NUM);
      Game.toast('error', 'Non-conformité manquée', "Date et heure du prélèvement non signalées !", -10);
    }

    // Bonus checklist complète
    if (checkedItems.size === d.checklist.length) {
      pts += 20;
      Game.toast('success', 'Checklist complète !', 'Tous les points de conformité vérifiés.', 20);
    }

    // Ne pas donner le score immédiatement, le conserver
    validationPts = pts;
    
    // Basculer vers l'étape de correction
    document.getElementById('level1-actions').classList.add('hidden');
    const correctives = document.getElementById('level1-correctives');
    correctives.classList.remove('hidden');
    correctives.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function remplacerContenant() {
    const area = document.getElementById('container-animation-area');
    const flask = document.getElementById('anim-flask');
    const liquid = document.getElementById('anim-liquid');
    const btn = document.getElementById('btn-replace-container');
    const status = document.getElementById('container-status');

    btn.disabled = true;
    btn.innerHTML = "Opération en cours...";

    // Animation sequence
    setTimeout(() => {
      flask.style.transform = "scale(0)";
      setTimeout(() => {
        flask.textContent = "🪣"; // Grand flacon
        flask.style.transform = "scale(1.2)";
        setTimeout(() => {
          flask.style.transform = "scale(1)";
          area.style.background = "rgba(16, 185, 129, 0.1)"; // vert léger
          
          liquid.textContent = "🌊"; // Formol ajouté
          liquid.style.fontSize = "2.5rem";
          liquid.style.transform = "translateY(-10px)";
          
          setTimeout(() => {
            btn.style.display = "none";
            status.style.opacity = "1";
            containerReplaced = true;
            checkFinalizeBtn();
          }, 600);
        }, 400);
      }, 300);
    }, 300);
  }

  function contacterChirurgien() {
    const area = document.getElementById('chat-animation-area');
    const btn = document.getElementById('btn-call-surgeon');
    const status = document.getElementById('chat-status');

    btn.disabled = true;
    btn.innerHTML = "Appel en cours...";
    
    area.innerHTML = ''; // clear
    area.style.justifyContent = 'flex-start';

    const msgs = [
      { text: "Bonjour Dr. MEZIANE, je vous appelle concernant le prélèvement de M. BENALI. La date et l'heure ne sont pas renseignées.", type: "me" },
      { text: "Ah oui, pardon. Le prélèvement a été effectué ce matin à 09h30.", type: "dr" },
      { text: "C'est noté, je mets à jour la fiche pour assurer la traçabilité. Merci !", type: "me" }
    ];

    let delay = 0;
    msgs.forEach((m, i) => {
      setTimeout(() => {
        const bubble = document.createElement('div');
        const isMe = m.type === 'me';
        bubble.style.cssText = `
          padding: 8px 12px;
          border-radius: 12px;
          max-width: 85%;
          width: fit-content;
          animation: slideIn 0.3s ease-out;
          margin-bottom: 5px;
          ${isMe ? 'background: var(--primary); color: white; align-self: flex-end; border-bottom-right-radius: 4px;' : 'background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); align-self: flex-start; border-bottom-left-radius: 4px;'}
        `;
        bubble.textContent = m.text;
        area.appendChild(bubble);
        area.scrollTop = area.scrollHeight;
      }, delay);
      delay += 1500;
    });

    setTimeout(() => {
      btn.style.display = "none";
      status.style.opacity = "1";
      surgeonContacted = true;
      checkFinalizeBtn();
    }, delay + 500);
  }

  function checkFinalizeBtn() {
    if (containerReplaced && surgeonContacted) {
      const btn = document.getElementById('btn-final-accept');
      btn.classList.remove('disabled');
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    }
  }

  function finaliserAcceptation() {
    if (!containerReplaced || !surgeonContacted) return;
    Game.addScore(validationPts, LEVEL_NUM);
    Game.setLevelPassed(LEVEL_NUM, true);
    
    document.getElementById('level1-correctives').classList.add('hidden');
    showFeedback('accept', validationPts);
  }

  function refuser() {
    if (submitted) return;
    submitted = true;
    const d = GAME_DATA.level1;

    // Refus est sur-pénalisé si aucune critique réelle sélectionnée
    const hasCritique = selectedCritiques.size > 0;
    if (!hasCritique) {
      Game.addCriticalError();
      Game.addPenalty(30, LEVEL_NUM);
      Game.toast('error', 'Refus non justifié', 'Vous avez refusé un prélèvement sans non-conformité critique. Ce prélèvement pouvait être accepté avec réserves.', -30);
    } else {
      Game.addScore(50, LEVEL_NUM);
      Game.toast('success', 'Refus justifié', 'Bon réflexe ! Ce prélèvement présente des anomalies critiques nécessitant un refus.', 50);
    }

    Game.setLevelPassed(LEVEL_NUM, hasCritique);
    showFeedback('reject', hasCritique ? 50 : 0);
  }

  function showFeedback(type, pts) {
    const fb = document.getElementById('level1-feedback');
    const d = GAME_DATA.level1;
    const msg = type === 'accept' ? d.feedback_accept : d.feedback_reject;
    const color = type === 'accept' ? 'var(--success)' : 'var(--danger)';
    const borderColor = type === 'accept' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';

    fb.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid ${borderColor};border-radius:var(--radius-lg);padding:28px;">
        <div style="font-size:1.1rem;font-weight:700;color:${color};margin-bottom:12px">${msg}</div>
        <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;margin-bottom:20px">
          <strong style="color:var(--text-primary)">🎓 Point pédagogique :</strong> La phase pré-analytique est la plus critique du circuit. 
          70% des erreurs diagnostiques en anatomie pathologique trouvent leur origine dans une mauvaise prise en charge pré-analytique. 
          Un prélèvement mal fixé ou mal identifié peut rendre impossible tout diagnostic fiable.
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="Game.nextLevel()">
            Niveau 2 : Macroscopie →
          </button>
        </div>
      </div>
    `;
    fb.classList.remove('hidden');
    document.getElementById('level1-actions').classList.add('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { 
    init, 
    toggleCheck, 
    toggleAnomalie, 
    toggleCritique, 
    valider, 
    refuser, 
    remplacerContenant, 
    contacterChirurgien, 
    finaliserAcceptation 
  };
})();
