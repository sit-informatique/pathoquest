// ============================================================
//  PathoQuest — level4.js  |  Analyse Microscopique
// ============================================================

const Level4 = (() => {

  const LEVEL_NUM = 4;
  let selectedSlide = null;    // ID de la lame sélectionnée
  let associations = {};       // { slideId: diagLabel }
  let submitted = false;
  let currentSlideIndex = 0;

  function init() {
    selectedSlide = null;
    associations = {};
    submitted = false;
    currentSlideIndex = 0;
    render();
  }

  function render() {
    const d = GAME_DATA.level4;
    document.getElementById('level4-content').innerHTML = `
      <!-- Mode : Visionneuse de lame -->
      <div class="card" id="slide-viewer-card">
        <div class="card-title"><span class="card-icon">🔬</span> Visionneuse de lames histologiques</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:20px">
          Cliquez sur une lame pour l'examiner, puis sélectionnez le diagnostic correspondant.
        </p>

        <!-- Galerie de lames -->
        <div class="slide-gallery" id="slide-gallery">
          ${d.slides.map((s, i) => `
            <div class="slide-card" id="scard-${s.id}" onclick="Level4.selectSlide('${s.id}')">
              <div class="slide-number">Lame #${i + 1} · ${s.grossissement}</div>
              <img src="${s.image}"
                   alt="${s.zone}"
                   onerror="this.src='${getPlaceholderSVG(s.type)}'">
              <div class="slide-card-label">${s.zone}</div>
            </div>
          `).join('')}
        </div>

        <!-- Détail de la lame sélectionnée -->
        <div id="slide-detail" class="hidden" style="margin-top:20px;padding:20px;background:var(--bg-glass);border:1px solid var(--border-glass);border-radius:var(--radius-md)">
          <div style="display:flex;gap:20px;flex-wrap:wrap">
            <div id="slide-img-large" style="flex-shrink:0"></div>
            <div id="slide-criteria" style="flex:1;min-width:200px"></div>
          </div>
        </div>
      </div>

      <!-- Association diagnostic -->
      <div class="card">
        <div class="card-title"><span class="card-icon">🔗</span> Associez chaque lame à son diagnostic</div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:separate;border-spacing:0 8px">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px 14px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted)">Lame</th>
                <th style="text-align:left;padding:8px 14px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted)">Zone</th>
                <th style="text-align:left;padding:8px 14px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted)">Votre diagnostic</th>
              </tr>
            </thead>
            <tbody id="diag-table-body">
              ${d.slides.map((s, i) => `
                <tr>
                  <td style="padding:6px 14px;font-family:var(--font-mono);font-size:0.85rem;color:var(--accent-cyan)">#${i+1}</td>
                  <td style="padding:6px 14px;font-size:0.85rem;color:var(--text-secondary)">${s.zone}</td>
                  <td style="padding:6px 14px">
                    <select id="diag-sel-${s.id}" class="diag-select"
                            style="background-color:white;border:1.5px solid var(--border-glass);border-radius:6px;padding:8px 12px;color:var(--text-primary);font-size:0.88rem;font-family:Inter,sans-serif;width:100%;min-width:200px;transition:all 0.3s ease"
                            onchange="Level4.selectDiag('${s.id}', this.value)">
                      <option value="">— Sélectionnez un diagnostic —</option>
                      ${d.diagnostics_choices.map(dc => `<option value="${dc}">${dc}</option>`).join('')}
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="level-actions">
        <button class="btn btn-primary btn-lg" id="btn-valider-micro" onclick="Level4.valider()">
          Valider les diagnostics →
        </button>
        <span id="micro-hint" style="font-size:0.82rem;color:var(--text-muted);align-self:center">
          Associez un diagnostic à chaque lame (les lames non renseignées comptent comme incorrectes)
        </span>
      </div>
      <div id="level4-feedback" class="hidden" style="margin-top:24px"></div>
    `;
  }

  function getPlaceholderSVG(type) {
    const colors = {
      adénocarcinome: { bg: '#feedff', accent: '#a21caf', label: 'Adénocarcinome\nGlandes · Acinaires' },
      épidermoïde:    { bg: '#fff7ed', accent: '#c2410c', label: 'Car. Épidermoïde\nPerles cornées' },
      sain:           { bg: '#f0fdfa', accent: '#0f766e', label: 'Tissu sain\nAlvéoles normaux' }
    };
    const c = colors[type] || colors['sain'];
    const encoded = encodeURIComponent(`
      <svg width="200" height="160" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="160" fill="${c.bg}"/>
        ${type === 'adénocarcinome' ? `
          <circle cx="60" cy="70" r="20" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
          <circle cx="100" cy="55" r="15" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
          <circle cx="140" cy="75" r="18" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
          <circle cx="80" cy="100" r="14" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
          <circle cx="120" cy="100" r="16" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.6"/>
        ` : type === 'épidermoïde' ? `
          <ellipse cx="80" cy="70" rx="40" ry="30" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
          <ellipse cx="80" cy="70" rx="20" ry="15" fill="${c.accent}" opacity="0.3"/>
          <ellipse cx="130" cy="90" rx="30" ry="22" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.7"/>
          <ellipse cx="130" cy="90" rx="12" ry="9" fill="${c.accent}" opacity="0.3"/>
        ` : `
          <ellipse cx="60" cy="65" rx="25" ry="20" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity="0.6"/>
          <ellipse cx="110" cy="55" rx="20" ry="16" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity="0.6"/>
          <ellipse cx="90" cy="100" rx="22" ry="18" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity="0.6"/>
          <ellipse cx="145" cy="80" rx="18" ry="14" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity="0.6"/>
          <ellipse cx="150" cy="110" rx="15" ry="12" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity="0.5"/>
        `}
        <text x="100" y="140" fill="${c.accent}" text-anchor="middle" font-size="10" font-family="Inter" opacity="0.8">HE · ${type === 'sain' ? '×10' : '×40'}</text>
      </svg>
    `);
    return `data:image/svg+xml,${encoded}`;
  }

  function selectSlide(id) {
    if (submitted) return;
    selectedSlide = id;

    // Mettre en surbrillance
    document.querySelectorAll('.slide-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('scard-' + id)?.classList.add('selected');

    // Afficher détail
    const s = GAME_DATA.level4.slides.find(x => x.id === id);
    if (!s) return;

    const detail = document.getElementById('slide-detail');
    const imgLarge = document.getElementById('slide-img-large');
    const criteria = document.getElementById('slide-criteria');

    if (imgLarge) {
      imgLarge.innerHTML = `
        <img src="${s.image}"
             alt="${s.zone}"
             onerror="this.src='${getPlaceholderSVG(s.type)}'"
             style="width:220px;height:170px;object-fit:cover;border-radius:var(--radius-md);border:1px solid var(--border-glass)">
        <div style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:8px">${s.grossissement} — ${s.zone}</div>
      `;
    }

    if (criteria) {
      criteria.innerHTML = `
        <div style="font-weight:700;font-size:0.9rem;margin-bottom:10px;color:var(--accent-cyan)">
          🔍 Éléments à identifier
        </div>
        ${s.criteres.map(c => `
          <div style="display:flex;gap:8px;margin-bottom:6px;font-size:0.83rem;color:var(--text-secondary)">
            <span style="color:var(--accent-cyan);flex-shrink:0">▸</span>${c}
          </div>
        `).join('')}
        ${s.malignite.length > 0 ? `
          <div style="font-weight:700;font-size:0.9rem;margin:12px 0 8px;color:var(--danger)">⚠️ Critères de malignité</div>
          ${s.malignite.map(c => `
            <div style="display:flex;gap:8px;margin-bottom:6px;font-size:0.83rem;color:var(--text-secondary)">
              <span style="color:var(--danger);flex-shrink:0">▸</span>${c}
            </div>
          `).join('')}
        ` : '<div style="color:var(--success);font-size:0.83rem;margin-top:10px">✅ Absence de critères de malignité</div>'}
      `;
    }

    detail.classList.remove('hidden');
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function selectDiag(slideId, value) {
    associations[slideId] = value;
    const d = GAME_DATA.level4;
    const allDone = d.slides.every(s => associations[s.id] && associations[s.id] !== '');
    const hint = document.getElementById('micro-hint');
    const done = d.slides.filter(s => associations[s.id] && associations[s.id] !== '').length;
    if (hint) hint.textContent = allDone
      ? 'Cliquez pour valider vos diagnostics'
      : `${done}/${d.slides.length} diagnostics renseignés — validez à tout moment`;
  }

  function valider() {
    if (submitted) return;
    submitted = true;

    const d = GAME_DATA.level4;
    let pts = 0;
    let correctCount = 0;
    let resultHtml = '';

    d.slides.forEach((s, i) => {
      const userDiag = associations[s.id] || '';
      const isCorrect = userDiag === s.diagnostic_correct;

      // Mettre à jour la carte
      const card = document.getElementById('scard-' + s.id);
      if (card) {
        card.classList.remove('selected');
        card.classList.add(isCorrect ? 'matched-correct' : 'matched-wrong');
      }

      if (isCorrect) {
        correctCount++;
        const slidePoints = Math.round(d.maxScore / d.slides.length);
        pts += slidePoints;
        Game.toast('success', `Lame #${i+1} correcte`, s.diagnostic_correct, slidePoints);
      } else {
        Game.addPenalty(20, LEVEL_NUM);
        Game.toast('error', `Lame #${i+1} incorrecte`, `Vous avez dit "${userDiag}" — Réponse : ${s.diagnostic_correct}`, -20);
      }

      resultHtml += `
        <div style="padding:14px 18px;background:var(--bg-glass);border:1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};border-radius:var(--radius-sm);margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:700;color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">
              ${isCorrect ? '✅' : '❌'} Lame #${i+1} — ${s.zone}
            </span>
          </div>
          <div style="font-size:0.85rem">
            <span style="color:var(--text-muted)">Votre réponse : </span>
            <span style="${isCorrect ? 'color:var(--success)' : 'color:var(--danger)'}">${userDiag || '— non renseigné —'}</span>
          </div>
          ${!isCorrect ? `<div style="font-size:0.85rem;margin-top:4px"><span style="color:var(--text-muted)">Réponse correcte : </span><span style="color:var(--success)">${s.diagnostic_correct}</span></div>` : ''}
          <div style="margin-top:10px;font-size:0.78rem;color:var(--text-secondary)">
            <strong>Critères clés :</strong> ${s.criteres.slice(0,2).join(' — ')}
          </div>
        </div>
      `;
    });

    Game.addScore(pts, LEVEL_NUM);
    const allCorrect = correctCount === d.slides.length;
    Game.setLevelPassed(LEVEL_NUM, correctCount >= 2);

    const fb = document.getElementById('level4-feedback');
    const msg = allCorrect ? d.message_succes : d.message_partiel;
    const color = allCorrect ? 'var(--success)' : 'var(--warning)';

    fb.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--border-glass);border-radius:var(--radius-lg);padding:28px">
        <div style="color:${color};font-weight:700;font-size:1rem;margin-bottom:20px">${msg}</div>
        ${resultHtml}
        <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;padding:16px;background:var(--bg-glass);border-radius:var(--radius-sm);margin:16px 0">
          <strong style="color:var(--text-primary)">🎓 Point pédagogique :</strong> La distinction adénocarcinome/carcinome épidermoïde est cruciale car elle conditionne le bilan moléculaire 
          et le choix thérapeutique. Les adénocarcinomes (TTF-1+) bénéficient du bilan EGFR/ALK/ROS1/PD-L1, contrairement aux carcinomes épidermoïdes.
        </div>
        <button class="btn btn-primary btn-lg" onclick="Game.nextLevel()">Niveau 5 : Compte rendu final →</button>
      </div>
    `;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { init, selectSlide, selectDiag, valider };
})();
