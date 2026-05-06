// ============================================================
//  PathoQuest — level5.js  |  Compte Rendu Final
// ============================================================

const Level5 = (() => {

  const LEVEL_NUM = 5;
  let submitted = false;
  let answers = {};

  function init() {
    submitted = false;
    answers = {};
    render();
  }

  function render() {
    const d = GAME_DATA.level5;
    document.getElementById('level5-content').innerHTML = `

      <!-- Header CR -->
      <div class="card" style="background:#ffffff;border:1px solid var(--border-glass);box-shadow:var(--shadow-card)">
        <div class="card-title"><span class="card-icon">🏥</span> Compte Rendu Anatomo-Pathologique</div>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:16px">${d.sous_titre}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;font-size:0.83rem">
          <div style="background:var(--bg-glass);padding:12px;border-radius:var(--radius-sm);border-left:3px solid var(--accent-cyan)">
            <div style="color:var(--text-muted);margin-bottom:3px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em">Patient</div>
            <div style="font-weight:700;color:var(--text-primary)">${d.patient.nom}</div>
          </div>
          <div style="background:var(--bg-glass);padding:12px;border-radius:var(--radius-sm);border-left:3px solid var(--accent-cyan)">
            <div style="color:var(--text-muted);margin-bottom:3px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em">Prélèvement</div>
            <div style="font-weight:700;color:var(--text-primary)">${d.patient.prelevement}</div>
          </div>
          <div style="background:var(--bg-glass);padding:12px;border-radius:var(--radius-sm);border-left:3px solid var(--accent-cyan)">
            <div style="color:var(--text-muted);margin-bottom:3px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em">Demandeur</div>
            <div style="font-weight:700;color:var(--text-primary)">${d.patient.medecin} — Chirurgie thoracique</div>
          </div>
        </div>
      </div>

      <!-- Formulaire CR -->
      <div class="card">
        <div class="card-title"><span class="card-icon">📋</span> Renseignez les éléments du compte rendu</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:24px">
          Complétez tous les champs en vous basant sur vos analyses des niveaux précédents.
          Les champs marqués <span style="color:var(--danger)">*</span> sont obligatoires.
        </p>

        <div class="report-grid">
          ${d.fields.map(f => `
            <div class="report-field">
              <label for="rf-${f.id}">
                ${f.label} <span style="color:var(--danger)">*</span>
              </label>
              ${f.type === 'select' ? `
                <select id="rf-${f.id}" onchange="Level5.updateField('${f.id}', this.value)"
                        style="background-color:white;border:1.5px solid var(--border-glass);border-radius:6px;padding:10px 14px;color:var(--text-primary);font-size:0.88rem;width:100%">
                  ${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}
                </select>
              ` : `
                <input type="text" id="rf-${f.id}" placeholder="${f.placeholder}"
                       oninput="Level5.updateField('${f.id}', this.value)"
                       style="background-color:white;border:1.5px solid var(--border-glass);border-radius:6px;padding:10px 14px;color:var(--text-primary);font-size:0.88rem;width:100%;box-sizing:border-box">
              `}
              <div id="rf-hint-${f.id}" style="font-size:0.72rem;margin-top:4px;min-height:16px"></div>
            </div>
          `).join('')}

          <!-- Statut ganglionnaire DONNÉ -->
          <div class="report-field" style="grid-column:1/-1">
            <label>${d.ganglions_donnes.label}</label>
            <div style="background:rgba(0,212,255,0.07);border:1.5px solid rgba(0,212,255,0.3);border-radius:6px;padding:12px 16px;display:flex;align-items:center;gap:12px">
              <span style="font-size:1.2rem">ℹ️</span>
              <div>
                <div style="font-weight:700;color:var(--accent-cyan);font-size:0.95rem">${d.ganglions_donnes.valeur}</div>
                <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px">${d.ganglions_donnes.detail}</div>
              </div>
              <div style="margin-left:auto;font-size:0.75rem;color:var(--text-muted);font-style:italic">Donné par le chirurgien</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calculateur pTNM -->
      <div class="card">
        <div class="card-title"><span class="card-icon">📊</span> Classification pTNM (IASLC 9th Edition, 2025)</div>
        <p style="font-weight:700;font-size:0.9rem;margin-bottom:15px">
          2-En vous basant sur la 9ème édition du TNM fournie, établissez la classification pTNM finale.
        </p>
        <div style="margin-bottom: 25px; width: 100%; max-width: 800px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-glass); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
           <img src="assets/tbb.jpg" style="width: 100%; height: auto; display: block;" alt="Tableau pTNM 9ème édition" onerror="this.src='assets/tbb.png'">
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;margin-bottom:20px">
          ${['pT', 'pN', 'pM'].map(t => `
            <div>
              <label style="display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:8px;font-weight:600">${t}</label>
              <select id="tnm-${t.toLowerCase()}"
                      style="width:100%;background-color:white;border:1.5px solid var(--border-glass);border-radius:6px;padding:11px 14px;color:var(--text-primary);font-family:'JetBrains Mono',monospace;font-size:1rem;font-weight:700"
                      onchange="Level5.updateTNM()">
                ${getTNMOptions(t)}
              </select>
            </div>
          `).join('')}
          <div>
            <label style="display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:8px;font-weight:600">Stade</label>
            <div id="tnm-stade" style="padding:11px 14px;background:var(--bg-glass);border:1px solid var(--border-glass);border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:1rem;font-weight:700;color:var(--accent-cyan)">
              —
            </div>
          </div>
        </div>

        <div class="tnm-display">
          <div class="tnm-label">Classification finale</div>
          <div class="tnm-value" id="tnm-full">— · — · —</div>
        </div>
      </div>

      <div class="level-actions">
        <button class="btn btn-primary btn-lg" id="btn-valider-cr" onclick="Level5.valider()">
          🏁 Valider le compte rendu final
        </button>
      </div>
      <div id="level5-feedback" class="hidden" style="margin-top:24px"></div>
    `;

    // Init pM0 par défaut et calcul stade
    updateTNM();
  }

  function getTNMOptions(type) {
    const opts = {
      pT:  ['pTx','pT0','pTis','pT1a','pT1b','pT1c','pT2a','pT2b','pT3','pT4'],
      pN:  ['pNx','pN0','pN1','pN2','pN3'],
      pM:  ['pMx','pM0','pM1a','pM1b','pM1c']
    };
    return (opts[type] || []).map(o => `<option value="${o}">${o}</option>`).join('');
  }

  function updateField(id, value) {
    answers[id] = value;
    const d = GAME_DATA.level5;
    const field = d.fields.find(f => f.id === id);
    const hintEl = document.getElementById('rf-hint-' + id);
    if (!field || !hintEl) return;

    const correct = field.correct.toLowerCase().trim();
    const userVal = value.toLowerCase().trim().replace(',', '.');

    if (userVal === '--' || userVal === '') {
      hintEl.textContent = '';
      return;
    }

    if (userVal === correct || correct.includes(userVal) || userVal.includes(correct.split(' ')[0])) {
      hintEl.style.color = 'var(--success)';
      hintEl.textContent = '✓ Correct';
    } else {
      hintEl.style.color = 'var(--text-muted)';
      hintEl.textContent = '';
    }
  }

  function updateTNM() {
    const ptEl = document.getElementById('tnm-pt');
    const pnEl = document.getElementById('tnm-pn');
    const pmEl = document.getElementById('tnm-pm');
    const stadeEl = document.getElementById('tnm-stade');
    const fullEl = document.getElementById('tnm-full');
    if (!ptEl || !pnEl || !pmEl) return;

    const pt = ptEl.value;
    const pn = pnEl.value;
    const pm = pmEl.value;

    const stade = calculerStade(pt, pn, pm);

    if (fullEl) fullEl.textContent = `${pt} · ${pn} · ${pm}`;
    if (stadeEl) {
      stadeEl.textContent = stade;
      stadeEl.style.color = stade === 'IIB' ? 'var(--warning)' :
                             stade.startsWith('I') ? 'var(--success)' : 'var(--danger)';
    }
  }

  function calculerStade(pt, pn, pm) {
    if (pm === 'pM1a' || pm === 'pM1b' || pm === 'pM1c') return 'IV';
    const stageMap = {
      'pT1a-pN0': 'IA1', 'pT1b-pN0': 'IA2', 'pT1c-pN0': 'IA3',
      'pT2a-pN0': 'IB',  'pT2b-pN0': 'IIA',
      'pT1a-pN1': 'IIB', 'pT1b-pN1': 'IIB', 'pT1c-pN1': 'IIB',
      'pT2a-pN1': 'IIB', 'pT2b-pN1': 'IIB',
      'pT3-pN0':  'IIB',
      'pT3-pN1':  'IIIA','pT4-pN0':  'IIIA','pT4-pN1':  'IIIA',
      'pT1a-pN2': 'IIIA','pT1b-pN2': 'IIIA','pT1c-pN2': 'IIIA',
      'pT2a-pN2': 'IIIA','pT2b-pN2': 'IIIA','pT3-pN2':  'IIIB',
      'pT4-pN2':  'IIIB',
      'pTx-pN3':  'IIIC', 'pT4-pN3': 'IIIC'
    };
    return stageMap[`${pt}-${pn}`] || '—';
  }

  function valider() {
    if (submitted) return;
    submitted = true;

    const d = GAME_DATA.level5;
    let pts = 0;
    let correctCount = 0;
    let resultRows = '';

    // Vérification des champs
    d.fields.forEach(f => {
      const userVal = (answers[f.id] || '').toLowerCase().trim().replace(',', '.');
      const correctVal = f.correct.toLowerCase().trim();
      const isCorrect = userVal === correctVal || correctVal.includes(userVal);

      if (isCorrect && userVal !== '' && userVal !== '--') {
        pts += f.points;
        correctCount++;
        Game.toast('success', f.label, 'Réponse correcte ✓', f.points);
      } else if (userVal === '' || userVal === '--') {
        Game.toast('warning', f.label, 'Champ non renseigné — information manquante dans le CR.', 0);
      } else {
        Game.addPenalty(Math.round(f.points * 0.5), LEVEL_NUM);
        Game.toast('error', f.label, `Votre réponse : "${answers[f.id]}" — Attendu : "${f.correct}"`, -Math.round(f.points * 0.5));
      }

      resultRows += `
        <tr>
          <td style="padding:10px 14px;font-size:0.85rem;font-weight:600;color:var(--text-secondary)">${f.label}</td>
          <td style="padding:10px 14px;font-size:0.85rem;color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">${answers[f.id] || '—'}</td>
          <td style="padding:10px 14px;font-size:0.85rem;color:var(--success)">${f.correct}</td>
          <td style="padding:10px 14px;font-family:var(--font-mono);font-size:0.85rem;color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">${isCorrect ? '+'+f.points : '0'} pts</td>
        </tr>
      `;
    });

    // Vérification pTNM
    const tnmCorrect = d.tnm_correct;
    const ptUser = document.getElementById('tnm-pt')?.value;
    const pnUser = document.getElementById('tnm-pn')?.value;
    const tnmOk = ptUser === tnmCorrect.pT && pnUser === tnmCorrect.pN;

    if (tnmOk) {
      pts += 30;
      Game.toast('success', 'Classification pTNM correcte !',
        `${tnmCorrect.pT} · ${tnmCorrect.pN} · ${tnmCorrect.pM} — Stade ${tnmCorrect.stade}`, 30);
    } else {
      Game.addPenalty(15, LEVEL_NUM);
      Game.toast('error', 'pTNM incorrect',
        `Attendu : ${tnmCorrect.pT} · ${tnmCorrect.pN} · ${tnmCorrect.pM} (Stade ${tnmCorrect.stade})`, -15);
    }

    Game.addScore(pts, LEVEL_NUM);
    const pct = Math.round((correctCount / d.fields.length) * 100);
    const perfect = pct >= 85 && tnmOk;
    const acceptable = pct >= 60;
    Game.setLevelPassed(LEVEL_NUM, acceptable);

    const msg = perfect ? d.message_parfait : acceptable ? d.message_acceptable : d.message_insuffisant;
    const color = perfect ? 'var(--success)' : acceptable ? 'var(--warning)' : 'var(--danger)';

    const fb = document.getElementById('level5-feedback');
    fb.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--border-glass);border-radius:var(--radius-lg);padding:28px">
        <div style="color:${color};font-weight:700;font-size:1.05rem;margin-bottom:20px">${msg}</div>

        <div style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">📊 Détail des réponses :</div>
        <div style="overflow-x:auto;margin-bottom:20px">
          <table style="width:100%;border-collapse:separate;border-spacing:0 4px;font-size:0.85rem">
            <thead>
              <tr style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted)">
                <th style="text-align:left;padding:6px 14px">Champ</th>
                <th style="text-align:left;padding:6px 14px">Votre réponse</th>
                <th style="text-align:left;padding:6px 14px">Réponse correcte</th>
                <th style="text-align:left;padding:6px 14px">Points</th>
              </tr>
            </thead>
            <tbody>${resultRows}</tbody>
          </table>
        </div>

        <!-- CR de référence -->
        <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:var(--radius-md);padding:16px;margin-bottom:20px">
          <div style="font-weight:700;color:var(--accent-cyan);margin-bottom:10px">📋 Compte rendu de référence</div>
          <div style="font-family:var(--font-mono);font-size:0.82rem;line-height:1.9;color:var(--text-secondary)">
            <strong style="color:var(--text-primary)">Patient :</strong> ${d.patient.nom} — ${d.patient.prelevement}<br>
            <strong style="color:var(--text-primary)">Type :</strong> Carcinome épidermoïde — Pattern organoïde (nids et palissades)<br>
            <strong style="color:var(--text-primary)">Taille :</strong> 5,5 cm dans sa plus grande dimension<br>
            <strong style="color:var(--text-primary)">Différenciation :</strong> Bien différencié kératinisant (globes cornés, ponts intercellulaires)<br>
            <strong style="color:var(--text-primary)">Marges :</strong> Recoupe bronchique saine<br>
            <strong style="color:var(--text-primary)">Statut ganglionnaire :</strong> N1 — 2 ganglions hilaires positifs / 5 prélevés<br>
            <strong style="color:var(--text-primary)">Classification :</strong> <span style="color:var(--warning);font-weight:700">pT3 · pN1 · pMx — Stade IIIA</span> (IASLC 9th ed., 2025)
          </div>
        </div>

        <!-- Message pédagogique -->
        <div style="font-size:0.85rem;color:var(--text-secondary);padding:16px;background:var(--bg-glass);border-radius:var(--radius-sm);margin-bottom:24px;line-height:1.7;border-left:4px solid var(--accent-cyan)">
          <strong style="color:var(--text-primary);display:block;margin-bottom:8px">🎓 Message pédagogique final :</strong>
          <em style="color:var(--accent-cyan);font-size:0.92rem;">"${d.message_pedagogique}"</em>
        </div>

        <button class="btn btn-primary btn-lg" onclick="Game.goToLevel(6)">
          🏆 Voir mon bilan final →
        </button>
      </div>
    `;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { init, updateField, updateTNM, valider };
})();
