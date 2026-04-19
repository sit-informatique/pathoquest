// ============================================================
//  PathoQuest — game.js
//  Moteur de jeu : état global, score, timer, navigation
// ============================================================

const Game = (() => {

  // ── État global ──────────────────────────────────────────────
  const state = {
    currentLevel: 0,      // 0 = accueil, 1-6 = niveaux, 7 = résultats
    score: 0,
    penalties: 0,
    criticalErrors: 0,
    timerInterval: null,
    secondsElapsed: 0,
    levelScores: [0, 0, 0, 0, 0],   // score par niveau [0..4]
    levelPassed:  [false, false, false, false, false],
    surgeonShown: false,
  };

  // ── Initialisation ───────────────────────────────────────────
  function init() {
    renderHUD();
    bindNavigation();
    showScreen('home');
    updateHUD();
  }

  // ── Navigation entre écrans ──────────────────────────────────
  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) {
      el.classList.add('active');
      el.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  function goToLevel(n) {
    state.currentLevel = n;
    updateHUD();

    if (n === 0) { showScreen('home'); stopTimer(); return; }
    if (n === 6) { showScreen('results'); stopTimer(); renderResults(); return; }

    showScreen('level' + n);
    updateHUDDots();

    // Initialiser le niveau
    const levelInits = { 1: Level1.init, 2: Level2.init, 3: Level3.init, 4: Level4.init, 5: Level5.init };
    if (levelInits[n]) levelInits[n]();
  }

  function nextLevel() {
    if (state.currentLevel < 5) goToLevel(state.currentLevel + 1);
    else goToLevel(6);
  }

  // ── Score ────────────────────────────────────────────────────
  function addScore(pts, levelIndex) {
    if (pts > 0) {
      state.score += pts;
      if (levelIndex !== undefined) state.levelScores[levelIndex - 1] += pts;
    }
    animateScore();
    updateHUD();
  }

  function addPenalty(pts, levelIndex) {
    const amount = Math.abs(pts);
    state.score = Math.max(0, state.score - amount);
    state.penalties += amount;
    if (levelIndex !== undefined) state.levelScores[levelIndex - 1] = Math.max(0, state.levelScores[levelIndex - 1] - amount);
    updateHUD();
  }

  function addCriticalError() {
    state.criticalErrors++;
    updateHUD();
  }

  function setLevelPassed(levelIndex, passed) {
    state.levelPassed[levelIndex - 1] = passed;
  }

  function getState() { return state; }

  // ── Timer ────────────────────────────────────────────────────
  function startTimer() {
    if (state.timerInterval) return;
    state.timerInterval = setInterval(() => {
      state.secondsElapsed++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTimerDisplay() {
    const el = document.getElementById('hud-timer');
    if (!el) return;
    el.textContent = formatTime(state.secondsElapsed);
    if (state.secondsElapsed > 1800) el.classList.add('urgent');
    else el.classList.remove('urgent');
  }

  // ── HUD ──────────────────────────────────────────────────────
  function renderHUD() {
    const hud = document.getElementById('hud');
    hud.innerHTML = `
      <div class="hud-logo">
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="#00d4ff" stroke-width="2"/>
          <circle cx="14" cy="11" r="5" fill="#00d4ff" opacity="0.8"/>
          <rect x="11" y="17" width="6" height="8" rx="1" fill="#00d4ff" opacity="0.6"/>
          <line x1="7" y1="11" x2="3" y2="11" stroke="#00d4ff" stroke-width="2" stroke-linecap="round"/>
          <line x1="21" y1="11" x2="25" y2="11" stroke="#00d4ff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Patho<span style="color:var(--accent-cyan)">Quest</span></span>
      </div>
      <div class="hud-center" id="hud-dots">
        ${[1,2,3,4,5].map(i => `<div class="hud-level-dot" id="dot-${i}" title="Niveau ${i}"></div>`).join('')}
      </div>
      <div class="hud-right">
        <div class="hud-stat">
          <div>
            <div class="hud-stat-label">Score</div>
            <div class="hud-stat-value score" id="hud-score">0</div>
          </div>
        </div>
        <div class="hud-stat">
          <div>
            <div class="hud-stat-label">Temps</div>
            <div class="hud-stat-value timer" id="hud-timer">00:00</div>
          </div>
        </div>
        <div class="hud-stat">
          <div>
            <div class="hud-stat-label">Erreurs</div>
            <div class="hud-stat-value" id="hud-errors" style="color:var(--danger)">0</div>
          </div>
        </div>
      </div>
    `;
  }

  function updateHUD() {
    const scoreEl = document.getElementById('hud-score');
    if (scoreEl) scoreEl.textContent = state.score;
    const errEl = document.getElementById('hud-errors');
    if (errEl) errEl.textContent = state.criticalErrors;
    updateHUDDots();
  }

  function updateHUDDots() {
    for (let i = 1; i <= 5; i++) {
      const dot = document.getElementById('dot-' + i);
      if (!dot) continue;
      dot.classList.remove('active', 'done');
      if (state.levelPassed[i - 1]) dot.classList.add('done');
      else if (state.currentLevel === i) dot.classList.add('active');
    }
  }

  function animateScore() {
    const el = document.getElementById('hud-score');
    if (!el) return;
    el.classList.remove('score-pop');
    void el.offsetWidth;
    el.classList.add('score-pop');
    setTimeout(() => el.classList.remove('score-pop'), 400);
  }

  // ── Surgeon Alert ─────────────────────────────────────────────
  function showSurgeonAlert(msg) {
    const el = document.getElementById('surgeon-alert');
    const msgEl = document.getElementById('surgeon-message');
    if (!el || !msgEl) return;
    msgEl.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 6000);
  }

  // ── Toast Feedback ────────────────────────────────────────────
  function toast(type, title, message, points) {
    const container = document.getElementById('feedback-container');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
      <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
        ${points !== undefined ? `<div class="toast-points">${points > 0 ? '+' : ''}${points} pts</div>` : ''}
      </div>
    `;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(120%)';
      t.style.transition = 'all 0.4s ease';
      setTimeout(() => t.remove(), 400);
    }, 10000); // Augmenté de 4500 à 10000 pour laisser le temps de lire
  }

  // ── Bind navigation ───────────────────────────────────────────
  function bindNavigation() {
    document.getElementById('btn-start')?.addEventListener('click', () => {
      startTimer();
      goToLevel(1);
    });
  }

  // ── Results ───────────────────────────────────────────────────
  function renderResults() {
    const s = state;
    const pct = Math.round((s.score / 900) * 100);
    let trophy = '🥉', mention = 'À revoir', mentionColor = 'var(--danger)';
    if (pct >= 90) { trophy = '🏆'; mention = 'Excellent !'; mentionColor = 'var(--accent-cyan)'; }
    else if (pct >= 75) { trophy = '🥇'; mention = 'Très bien !'; mentionColor = 'var(--success)'; }
    else if (pct >= 60) { trophy = '🥈'; mention = 'Bien !'; mentionColor = 'var(--warning)'; }

    const timeBonus = s.secondsElapsed < 1800 && s.criticalErrors === 0 ? 50 : 0;
    const finalScore = s.score + timeBonus;

    const levelIcons = ['🧫', '🔬', '⚗️', '🔭', '📋'];
    const levelNames = ['Réception', 'Macroscopie', 'Technique', 'Microscopie', 'Compte Rendu'];

    document.getElementById('result-trophy').textContent = trophy;
    document.getElementById('result-mention').textContent = mention;
    document.getElementById('result-mention').style.color = mentionColor;
    document.getElementById('result-score-big').textContent = finalScore;
    document.getElementById('result-pct').textContent = `${pct}% de réussite`;
    document.getElementById('result-time').textContent = formatTime(s.secondsElapsed);
    document.getElementById('result-errors').textContent = s.criticalErrors;
    document.getElementById('result-penalties').textContent = s.penalties;
    document.getElementById('result-bonus').textContent = timeBonus > 0 ? `+${timeBonus}` : '0';

    const levelGrid = document.getElementById('result-level-grid');
    levelGrid.innerHTML = s.levelScores.map((sc, i) => `
      <div class="result-level-item ${s.levelPassed[i] ? 'passed' : 'failed'}">
        <div class="result-level-icon">${levelIcons[i]}</div>
        <div class="result-level-label">${levelNames[i]}</div>
        <div class="result-level-pts">${sc} pts</div>
      </div>
    `).join('');
  }

  // ── Public API ────────────────────────────────────────────────
  return { init, goToLevel, nextLevel, addScore, addPenalty, addCriticalError, setLevelPassed, getState, toast, showSurgeonAlert, startTimer, stopTimer };

})();
