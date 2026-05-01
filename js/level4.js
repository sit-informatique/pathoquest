// ============================================================
//  PathoQuest — level4.js  |  Analyse Microscopique
// ============================================================

const Level4 = (() => {
  const LEVEL_NUM = 4;
  let phase = 1;
  let submitted = false;

  // State
  let phase1_selected = new Set();
  let phase2_morpho_selected = new Set();
  let phase2_diag = "";
  let phase3_selected = new Set();

  function init() {
    phase = 1;
    submitted = false;
    phase1_selected.clear();
    phase2_morpho_selected.clear();
    phase2_diag = "";
    phase3_selected.clear();
    render();
  }

  function render() {
    const d = GAME_DATA.level4;
    const container = document.getElementById('level4-content');
    
    container.innerHTML = `
      <!-- Phase 1 -->
      <div class="card" id="card-phase1">
        <div class="card-title"><span class="card-icon">1️⃣</span> ${d.phase1.titre}</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:15px">${d.phase1.objectif}</p>
        
        <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px">
          <div style="flex:1;min-width:250px">
            <div style="width:100%;aspect-ratio:4/3;background:var(--bg-glass);border-radius:var(--r-md);border:1px solid var(--border-glass);display:flex;align-items:center;justify-content:center;overflow:hidden">
              <img src="assets/phase1_sain.jpg" style="width:100%;height:100%;object-fit:cover" alt="Parenchyme sain" onerror="this.style.display='none'">
              <span style="position:absolute;color:var(--text-muted);font-size:0.85rem;z-index:-1">Image Phase 1 (Sain)</span>
            </div>
            <div style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:5px">Parenchyme sain (x4)</div>
          </div>
          <div style="flex:1;min-width:250px">
            <div style="width:100%;aspect-ratio:4/3;background:var(--bg-glass);border-radius:var(--r-md);border:1px solid var(--border-glass);display:flex;align-items:center;justify-content:center;overflow:hidden">
              <img src="assets/phase1_tumoral.jpg" style="width:100%;height:100%;object-fit:cover" alt="Parenchyme tumoral" onerror="this.style.display='none'">
              <span style="position:absolute;color:var(--text-muted);font-size:0.85rem;z-index:-1">Image Phase 1 (Tumoral)</span>
            </div>
            <div style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:5px">Parenchyme tumoral (x4)</div>
          </div>
        </div>

        <p style="font-weight:700;font-size:0.9rem;margin-bottom:10px">${d.phase1.consigne}</p>
        <div style="font-size:0.8rem;color:var(--cyan);margin-bottom:15px;font-weight:bold">Mémo : ${d.phase1.memo}</div>
        
        <div class="anomaly-grid">
          ${d.phase1.criteres.map(c => `
            <div class="anomaly-option" id="p1-${c.id}" onclick="Level4.toggleP1('${c.id}')">
              ${c.label}
            </div>
          `).join('')}
        </div>
        
        <div class="level-actions" style="margin-top:20px">
          <button class="btn btn-primary" onclick="Level4.validerPhase1()" id="btn-p1">Valider Phase 1</button>
        </div>
      </div>

      <!-- Phase 2 -->
      <div class="card hidden" id="card-phase2" style="opacity:0.5;pointer-events:none;transition:all 0.5s">
        <div class="card-title"><span class="card-icon">2️⃣</span> ${d.phase2.titre}</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:15px">${d.phase2.objectif}</p>
        
        <div style="text-align:center;margin-bottom:20px;display:flex;justify-content:center">
           <div style="width:100%;max-width:500px;aspect-ratio:4/3;background:var(--bg-glass);border-radius:var(--r-md);border:1px solid var(--border-glass);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative">
              <img src="assets/phase2.jpg" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" alt="Carcinome épidermoïde x20" onerror="this.style.display='none'">
              <span style="color:var(--text-muted);font-size:0.85rem">Image Phase 2 (x20)</span>
           </div>
        </div>

        <p style="font-weight:700;font-size:0.9rem;margin-bottom:10px">${d.phase2.consigne1}</p>
        <div class="anomaly-grid" style="margin-bottom:20px">
          ${d.phase2.morphologie.map(c => `
            <div class="anomaly-option" id="p2-${c.id}" onclick="Level4.toggleP2('${c.id}')">
              ${c.label}
            </div>
          `).join('')}
        </div>

        <p style="font-weight:700;font-size:0.9rem;margin-bottom:10px">${d.phase2.consigne2}</p>
        <select id="p2-diag" class="diag-select" style="background-color:white;border:1.5px solid var(--border-glass);border-radius:6px;padding:8px 12px;color:var(--text-primary);font-size:0.88rem;width:100%;max-width:400px" onchange="Level4.setDiag(this.value)">
          <option value="">— Sélectionnez un diagnostic —</option>
          ${d.phase2.synthese.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>

        <div class="level-actions" style="margin-top:20px">
          <button class="btn btn-primary" onclick="Level4.validerPhase2()" id="btn-p2">Valider Phase 2</button>
        </div>
      </div>

      <!-- Phase 3 -->
      <div class="card hidden" id="card-phase3" style="opacity:0.5;pointer-events:none;transition:all 0.5s">
        <div class="card-title"><span class="card-icon">3️⃣</span> ${d.phase3.titre}</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:10px">${d.phase3.objectif}</p>
        <div style="padding:12px;background:var(--info-bg);color:var(--info);border-radius:var(--r-sm);margin-bottom:15px;font-size:0.85rem">
          ${d.phase3.intro}
        </div>

        <div style="text-align:center;margin-bottom:20px;display:flex;justify-content:center">
           <div style="width:100%;max-width:500px;aspect-ratio:4/3;background:var(--bg-glass);border-radius:var(--r-md);border:1px solid var(--border-glass);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative">
              <img src="assets/phase3.jpg" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" alt="Invasion et Agressivité x40" onerror="this.style.display='none'">
              <span style="color:var(--text-muted);font-size:0.85rem">Image Phase 3 (x40)</span>
           </div>
        </div>

        <p style="font-weight:700;font-size:0.9rem;margin-bottom:10px">${d.phase3.consigne}</p>
        <div class="anomaly-grid">
          ${d.phase3.agressivite.map(c => `
            <div class="anomaly-option" id="p3-${c.id}" onclick="Level4.toggleP3('${c.id}')">
              ${c.label}
            </div>
          `).join('')}
        </div>

        <div class="level-actions" style="margin-top:20px">
          <button class="btn btn-success btn-lg" onclick="Level4.validerFinal()" id="btn-p3">Terminer l'Analyse Microscopique</button>
        </div>
      </div>

      <div id="level4-feedback" class="hidden" style="margin-top:24px"></div>
    `;
  }

  function toggleP1(id) {
    if (phase > 1) return;
    const el = document.getElementById('p1-' + id);
    if (phase1_selected.has(id)) { phase1_selected.delete(id); el.classList.remove('selected'); }
    else                         { phase1_selected.add(id);    el.classList.add('selected'); }
  }

  function toggleP2(id) {
    if (phase > 2) return;
    const el = document.getElementById('p2-' + id);
    if (phase2_morpho_selected.has(id)) { phase2_morpho_selected.delete(id); el.classList.remove('selected'); }
    else                                { phase2_morpho_selected.add(id);    el.classList.add('selected'); }
  }

  function setDiag(val) {
    if (phase > 2) return;
    phase2_diag = val;
  }

  function toggleP3(id) {
    if (phase > 3 || submitted) return;
    const el = document.getElementById('p3-' + id);
    if (phase3_selected.has(id)) { phase3_selected.delete(id); el.classList.remove('selected'); }
    else {
      if (phase3_selected.size >= 2) {
        Game.toast('warning', 'Limite atteinte', 'Sélectionnez uniquement les DEUX signes identifiés sur les clichés.', 0);
        return;
      }
      phase3_selected.add(id);
      el.classList.add('selected');
    }
  }

  function validerPhase1() {
    if (phase1_selected.size === 0) {
      Game.toast('warning', 'Attention', 'Veuillez sélectionner au moins un critère de malignité.', 0);
      return;
    }
    const d = GAME_DATA.level4.phase1;
    let correctCount = 0;
    let errorCount = 0;
    
    d.criteres.forEach(c => {
      const isSelected = phase1_selected.has(c.id);
      const el = document.getElementById('p1-' + c.id);
      if (isSelected && c.correct) correctCount++;
      if (isSelected && !c.correct) { errorCount++; el.style.borderColor = 'var(--danger)'; }
      if (!isSelected && c.correct) { el.style.borderColor = 'var(--warning)'; }
      if (c.correct) el.style.background = 'var(--success-bg)';
      el.style.pointerEvents = 'none';
    });

    const totalCorrect = d.criteres.filter(c => c.correct).length;
    let pts = Math.max(0, (correctCount * 10) - (errorCount * 15));
    Game.addScore(pts, LEVEL_NUM);

    if (correctCount === totalCorrect && errorCount === 0) {
      Game.toast('success', 'Phase 1 validée', 'Tous les critères de malignité identifiés !', pts);
    } else {
      Game.toast('warning', 'Phase 1 terminée', "Quelques imprécisions dans l'identification des critères.", pts);
    }

    document.getElementById('btn-p1').style.display = 'none';
    
    phase = 2;
    const c2 = document.getElementById('card-phase2');
    c2.classList.remove('hidden');
    setTimeout(() => { c2.style.opacity = '1'; c2.style.pointerEvents = 'auto'; c2.scrollIntoView({behavior: 'smooth', block: 'start'}); }, 100);
  }

  function validerPhase2() {
    if (!phase2_diag) {
      Game.toast('warning', 'Attention', 'Veuillez sélectionner une synthèse diagnostique.', 0);
      return;
    }
    const d = GAME_DATA.level4.phase2;
    
    d.morphologie.forEach(c => {
      const isSelected = phase2_morpho_selected.has(c.id);
      const el = document.getElementById('p2-' + c.id);
      if (isSelected && !c.correct) el.style.borderColor = 'var(--danger)';
      if (c.correct) el.style.background = 'var(--success-bg)';
      el.style.pointerEvents = 'none';
    });
    
    document.getElementById('p2-diag').disabled = true;
    let pts = 0;
    if (phase2_diag === d.synthese_correcte) {
      pts += 50;
      Game.toast('success', 'Diagnostic correct', 'Carcinome épidermoïde formellement identifié.', 50);
    } else {
      Game.addPenalty(20, LEVEL_NUM);
      Game.toast('error', 'Erreur diagnostique', "Il s'agissait d'un Carcinome épidermoïde (Kératinisation, ponts intercellulaires).", -20);
    }
    Game.addScore(pts, LEVEL_NUM);
    
    document.getElementById('btn-p2').style.display = 'none';
    
    phase = 3;
    const c3 = document.getElementById('card-phase3');
    c3.classList.remove('hidden');
    setTimeout(() => { c3.style.opacity = '1'; c3.style.pointerEvents = 'auto'; c3.scrollIntoView({behavior: 'smooth', block: 'start'}); }, 100);
  }

  function validerFinal() {
    if (phase3_selected.size < 2) {
      Game.toast('warning', 'Attention', "Veuillez identifier les deux signes d'agressivité.", 0);
      return;
    }
    submitted = true;
    const d = GAME_DATA.level4.phase3;
    
    let correctCount = 0;
    d.agressivite.forEach(c => {
      const isSelected = phase3_selected.has(c.id);
      const el = document.getElementById('p3-' + c.id);
      if (isSelected && c.correct) { correctCount++; el.style.background = 'var(--success-bg)'; }
      if (isSelected && !c.correct) { el.style.borderColor = 'var(--danger)'; }
      el.style.pointerEvents = 'none';
    });
    
    if (correctCount === 2) {
      Game.addScore(50, LEVEL_NUM);
      Game.toast('success', 'Analyse terminée', "Signes d'agressivité correctement identifiés !", 50);
    } else {
      Game.toast('warning', 'Imprécision', "Les deux signes à identifier étaient l'invasion pleurale et la métastase ganglionnaire.", 0);
    }
    
    document.getElementById('btn-p3').style.display = 'none';
    Game.setLevelPassed(LEVEL_NUM, true);
    
    const fb = document.getElementById('level4-feedback');
    const data = GAME_DATA.level4;
    
    fb.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--border-glass);border-radius:var(--r-lg);padding:28px;box-shadow:var(--shadow-card)">
        <h3 style="color:var(--success);margin-bottom:20px">${data.message_succes}</h3>
        
        <h4 style="margin-bottom:10px;color:var(--text-primary)">Bilan d'Extension Complet</h4>
        <div style="overflow-x:auto;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
            <thead>
              <tr style="background:var(--bg-secondary);color:var(--text-secondary)">
                <th style="padding:10px;text-align:left;border:1px solid var(--border-glass)">Élément à contrôler</th>
                <th style="padding:10px;text-align:left;border:1px solid var(--border-glass)">Résultat de l'examen</th>
                <th style="padding:10px;text-align:left;border:1px solid var(--border-glass)">Impact sur le staging</th>
              </tr>
            </thead>
            <tbody>
              ${data.bilan_extension.map(b => `
                <tr>
                  <td style="padding:10px;border:1px solid var(--border-glass);font-weight:600">${b.element}</td>
                  <td style="padding:10px;border:1px solid var(--border-glass)">${b.resultat}</td>
                  <td style="padding:10px;border:1px solid var(--border-glass);color:var(--danger)">${b.impact}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;padding:16px;background:var(--bg-glass);border-radius:var(--r-sm);margin:16px 0;border-left:4px solid var(--cyan)">
          ${data.point_pedagogique}
        </div>
        <button class="btn btn-primary btn-lg" onclick="Game.nextLevel()">Niveau 5 : Compte rendu final →</button>
      </div>
    `;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return { init, toggleP1, toggleP2, toggleP3, setDiag, validerPhase1, validerPhase2, validerFinal };
})();
