// ============================================================
//  PathoQuest — level3.js  |  Traitement Technique (Drag & Drop)
// ============================================================

const Level3 = (() => {

  const LEVEL_NUM = 3;
  let orderInZone = [];   // IDs des cartes dans la zone de réponse
  let submitted = false;
  let dragSrcId = null;

  function init() {
    orderInZone = [];
    submitted = false;
    dragSrcId = null;
    render();
  }

  function render() {
    const d = GAME_DATA.level3;
    // Mélanger les étapes
    const shuffled = [...d.etapes].sort(() => Math.random() - 0.5);

    document.getElementById('level3-content').innerHTML = `
      <div class="card">
        <div class="card-title"><span class="card-icon">📌</span> Contexte</div>
        <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6">${d.piege_description}</p>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">🔀</span> Remettez les étapes dans le bon ordre</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:24px">
          Faites glisser les étapes depuis la zone de gauche vers la zone de droite dans le bon ordre.
        </p>

        <div class="dnd-container">
          <!-- Zone source -->
          <div class="dnd-column">
            <div class="dnd-column-title">Étapes disponibles</div>
            <div class="dnd-zone" id="dnd-source"
                 ondragover="Level3.onDragOver(event,'source')"
                 ondrop="Level3.onDrop(event,'source')"
                 ondragleave="Level3.onDragLeave(event)">
              ${shuffled.map(e => renderCard(e)).join('')}
            </div>
          </div>

          <!-- Flèche -->
          <div style="display:flex;align-items:center;padding-top:40px;font-size:2rem;color:var(--text-muted)">→</div>

          <!-- Zone cible -->
          <div class="dnd-column">
            <div class="dnd-column-title">Ordre correct (1 → 5)</div>
            <div class="dnd-zone" id="dnd-target"
                 ondragover="Level3.onDragOver(event,'target')"
                 ondrop="Level3.onDrop(event,'target')"
                 ondragleave="Level3.onDragLeave(event)">
              <div id="dnd-placeholder" style="display:flex;align-items:center;justify-content:center;height:100%;min-height:200px;color:var(--text-muted);font-size:0.85rem;text-align:center;gap:8px">
                <span>⬅️</span> Déposez les étapes ici dans l'ordre
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="level-actions">
        <button class="btn btn-primary btn-lg" id="btn-valider-tech" onclick="Level3.valider()">
          Vérifier l'ordre →
        </button>
        <button class="btn btn-ghost" onclick="Level3.reset()">🔄 Recommencer</button>
        <span id="tech-hint" style="font-size:0.82rem;color:var(--text-muted);align-self:center">
          Placez les étapes dans l'ordre (vous pouvez valider même incomplet)
        </span>
      </div>

      <div id="level3-feedback" class="hidden" style="margin-top:24px"></div>
    `;

    // Bind drag events
    bindDragEvents();
  }

  function renderCard(e, showNum) {
    return `
      <div class="step-card" id="sc-${e.id}" draggable="true"
           ondragstart="Level3.onDragStart(event,'${e.id}')">
        ${showNum ? `<div class="step-card-num">${showNum}</div>` : `<div class="step-card-num" style="color:var(--text-muted)">?</div>`}
        <div class="step-card-content">
          <div class="step-card-name">${e.emoji} ${e.nom}</div>
          <div class="step-card-desc">${e.desc}</div>
        </div>
      </div>
    `;
  }

  function bindDragEvents() {
    // Touch support (mobile)
    document.querySelectorAll('.step-card').forEach(card => {
      card.addEventListener('touchstart', handleTouchStart, { passive: true });
      card.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
  }

  // -- Drag & Drop handlers --
  function onDragStart(e, id) {
    dragSrcId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setTimeout(() => {
      const el = document.getElementById('sc-' + id);
      if (el) el.classList.add('dragging');
    }, 0);
  }

  function onDragOver(e, zone) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const zoneEl = document.getElementById('dnd-' + zone);
    if (zoneEl) zoneEl.classList.add('drag-over');
  }

  function onDragLeave(e) {
    const zones = document.querySelectorAll('.dnd-zone');
    zones.forEach(z => z.classList.remove('drag-over'));
  }

  function onDrop(e, zone) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragSrcId;
    if (!id) return;

    const zoneEl = document.getElementById('dnd-' + zone);
    if (zoneEl) zoneEl.classList.remove('drag-over');

    const card = document.getElementById('sc-' + id);
    if (!card) return;
    card.classList.remove('dragging');

    const targetZone = document.getElementById('dnd-' + zone);
    const placeholder = document.getElementById('dnd-placeholder');

    if (zone === 'target') {
      // Ajouter à la zone cible
      if (!orderInZone.includes(id)) {
        orderInZone.push(id);
        if (placeholder) placeholder.style.display = 'none';
        // Renuméroter dans la zone cible
        targetZone.appendChild(card);
        // Mettre à jour le numéro
        const numEl = card.querySelector('.step-card-num');
        if (numEl) {
          numEl.textContent = orderInZone.length;
          numEl.style.color = 'var(--accent-cyan)';
        }
      }
    } else if (zone === 'source') {
      // Retirer de la zone cible
      if (orderInZone.includes(id)) {
        orderInZone = orderInZone.filter(x => x !== id);
        document.getElementById('dnd-source').appendChild(card);
        const numEl = card.querySelector('.step-card-num');
        if (numEl) { numEl.textContent = '?'; numEl.style.color = 'var(--text-muted)'; }
        // Renuméroter les cartes restantes dans target
        renumberTarget();
        if (orderInZone.length === 0 && placeholder) placeholder.style.display = '';
      }
    }

    // Activer le bouton si 5 cartes
    const btn = document.getElementById('btn-valider-tech');
    const hint = document.getElementById('tech-hint');
    if (orderInZone.length === 5) {
      if (hint) hint.textContent = 'Ordre défini — cliquez pour vérifier !';
    } else {
      if (hint) hint.textContent = `${orderInZone.length}/5 étapes placées — vous pouvez valider à tout moment`;
    }

    dragSrcId = null;
  }

  function renumberTarget() {
    orderInZone.forEach((id, i) => {
      const card = document.getElementById('sc-' + id);
      if (card) {
        const numEl = card.querySelector('.step-card-num');
        if (numEl) numEl.textContent = i + 1;
      }
    });
  }

  function reset() {
    if (submitted) return;
    init();
  }

  // Touch fallback (click-to-move)
  let pendingMove = null;
  function handleTouchStart(e) {
    const id = this.id.replace('sc-', '');
    if (pendingMove === id) {
      pendingMove = null;
      this.style.border = '';
      return;
    }
    if (pendingMove) {
      document.getElementById('sc-' + pendingMove)?.style.setProperty('border', '');
    }
    pendingMove = id;
    this.style.border = '2px solid var(--accent-cyan)';
  }

  function handleTouchEnd(e) { /* handled by touchstart logic */ }

  // Click-to-move for non-drag environments
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.step-card');
    if (!card || submitted) return;
    const id = card.id.replace('sc-', '');
    const sourceZone = document.getElementById('dnd-source');
    const targetZone = document.getElementById('dnd-target');
    const placeholder = document.getElementById('dnd-placeholder');

    if (sourceZone?.contains(card)) {
      // Move to target
      orderInZone.push(id);
      if (placeholder) placeholder.style.display = 'none';
      targetZone?.appendChild(card);
      const numEl = card.querySelector('.step-card-num');
      if (numEl) { numEl.textContent = orderInZone.length; numEl.style.color = 'var(--accent-cyan)'; }
    } else if (targetZone?.contains(card)) {
      // Move back to source
      orderInZone = orderInZone.filter(x => x !== id);
      sourceZone?.appendChild(card);
      const numEl = card.querySelector('.step-card-num');
      if (numEl) { numEl.textContent = '?'; numEl.style.color = 'var(--text-muted)'; }
      renumberTarget();
      if (orderInZone.length === 0 && placeholder) placeholder.style.display = '';
    }

    const btn = document.getElementById('btn-valider-tech');
    const hint = document.getElementById('tech-hint');
    if (orderInZone.length === 5) {
      if (hint) hint.textContent = 'Ordre défini — cliquez pour vérifier !';
    } else {
      if (hint) hint.textContent = `${orderInZone.length}/5 étapes placées — vous pouvez valider à tout moment`;
    }
  });

  function valider() {
    if (submitted) return;
    submitted = true;

    const d = GAME_DATA.level3;
    const correct = d.etapes.map(e => e.id);
    let correctCount = 0;
    let allCorrect = true;

    // Si l'étudiant n'a placé aucune ou peu de cartes, pénalité maximale
    if (orderInZone.length < 5) {
      const missing = 5 - orderInZone.length;
      const penalty = missing * 20;
      Game.addPenalty(penalty, LEVEL_NUM);
      Game.toast('warning', 'Étapes manquantes', `${missing} étape(s) non placée(s). -${penalty} pts de pénalité.`, -penalty);
    }

    orderInZone.forEach((id, idx) => {
      const card = document.getElementById('sc-' + id);
      if (id === correct[idx]) {
        correctCount++;
        card?.classList.add('correct');
      } else {
        allCorrect = false;
        card?.classList.add('wrong');
        const etape = d.etapes.find(e => e.id === id);
        if (etape) {
          Game.toast('error', `Étape ${idx+1} incorrecte`, etape.consequence_si_erreur, -15);
        }
      }
    });

    let pts = 0;
    if (orderInZone.length === 5 && allCorrect) {
      pts = d.maxScore;
      Game.toast('success', 'Ordre parfait !', d.message_succes, pts);
    } else {
      pts = Math.round((correctCount / 5) * d.maxScore * 0.7);
      if (orderInZone.length === 5) {
        const penalty = (5 - correctCount) * 15;
        Game.addPenalty(penalty, LEVEL_NUM);
      }
    }

    Game.addScore(pts, LEVEL_NUM);
    Game.setLevelPassed(LEVEL_NUM, allCorrect && orderInZone.length === 5);

    const fb = document.getElementById('level3-feedback');
    const color = allCorrect ? 'var(--success)' : 'var(--warning)';
    const borderColor = allCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)';
    const msg = allCorrect ? d.message_succes : d.message_echec;

    // Afficher le bon ordre avec détails
    const detailsHtml = d.etapes.map((e, i) => `
      <div style="display:flex;gap:12px;align-items:flex-start;padding:10px;background:var(--bg-glass);border-radius:var(--radius-sm);margin-bottom:8px">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--success-bg);border:1px solid rgba(16,185,129,0.3);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--success);flex-shrink:0">${e.ordre}</div>
        <div>
          <div style="font-weight:600;font-size:0.9rem">${e.emoji} ${e.nom}</div>
          <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px">${e.detail}</div>
        </div>
      </div>
    `).join('');

    fb.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid ${borderColor};border-radius:var(--radius-lg);padding:28px">
        <div style="color:${color};font-weight:700;font-size:1rem;margin-bottom:16px">${msg}</div>
        
        <!-- Image synthétique des étapes -->
        <div style="text-align:center;margin: 20px 0;">
          <img src="assets/etapes%20techniques.png" alt="Étapes techniques" style="width:100%;max-width:800px;border-radius:8px;border:2px solid var(--border)">
        </div>

        <div style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">📚 Ordre correct et détails :</div>
        ${detailsHtml}
        <div style="margin-top:20px">
          <button class="btn btn-primary btn-lg" onclick="Game.nextLevel()">Niveau 4 : Microscopie →</button>
        </div>
      </div>
    `;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { init, onDragStart, onDragOver, onDragLeave, onDrop, valider, reset };
})();
