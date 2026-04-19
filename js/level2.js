// ============================================================
//  PathoQuest — level2.js  |  Examen Macroscopique
// ============================================================

const Level2 = (() => {

  const LEVEL_NUM = 2;
  let collected = new Set();
  let submitted = false;
  let macroPhase = 0;

  function init() {
    collected.clear();
    submitted = false;
    macroPhase = 0;
    render();
  }

  function render() {
    const d = GAME_DATA.level2;
    const container = document.getElementById('level2-content');

    container.innerHTML = `
      <!-- Description macroscopique -->
      <div class="card">
        <div class="card-title"><span class="card-icon">🔬</span> Salle de Macroscopie</div>
        <div style="display:flex;align-items:stretch;justify-content:space-between;background:var(--bg-lighter);padding:20px;border-radius:var(--radius-md);margin-bottom:15px;position:relative;overflow:hidden">
          
          <!-- Etudiant -->
          <div style="text-align:center;z-index:2;display:flex;flex-direction:column;justify-content:center;align-items:center;width:150px">
            <div id="student-macroscopy" style="font-size:3.5rem;margin-bottom:5px;animation:fadeIn 1s ease-out">🧑‍🎓</div>
            <div style="font-size:0.8rem;font-weight:bold;color:var(--text-primary);margin-bottom:10px">Vous</div>
            
            <div id="action-selector" style="width:100%">
              <select class="btn btn-sm btn-ghost" id="student-action-select" style="width:100%;font-size:0.75rem;padding:6px;margin-bottom:8px" onchange="Level2.requestAction(this)">
                <option value="">-- Que faire ? --</option>
                <option value="ouvrir">Ouvrir la pièce</option>
                <option value="decrire">Décrire les lésions</option>
                <option value="mesurer">Mesurer et Peser</option>
              </select>
            </div>

            <button class="btn btn-danger" style="font-size:0.75rem;padding:8px;width:100%;display:none;margin-top:5px" onclick="Level2.askPrelevements()" id="btn-prelever">
              🎯 Effectuer les prélèvements
            </button>
          </div>

          <!-- Table de macroscopie -->
          <div style="flex:1;text-align:center;position:relative;margin:0 20px;padding:20px;background:#ffffff;border:1.5px solid var(--border-glass);border-radius:12px;box-shadow:var(--shadow-card)">
            <div id="table-anim" style="font-size:3rem;margin-bottom:10px;transition:all 0.5s">🫁</div>
            <div style="font-size:0.9rem;color:var(--text-primary);font-weight:bold">${d.description_macroscopique.lobe.split('—')[0]}</div>
            <div id="table-measurements" style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;letter-spacing:0.05em;background:var(--bg-secondary);display:inline-block;padding:4px 12px;border-radius:10px">Poids: ??? | Dimensions: ???</div>
            
            <div id="description-form" style="display:none;margin-top:15px;text-align:left;background:var(--bg-primary);padding:15px;border-radius:8px;border:1px solid var(--cyan)">
              <label style="font-size:0.85rem;color:var(--cyan);font-weight:bold;margin-bottom:8px;display:block">📝 Quels éléments devez-vous décrire formellement sur cette pièce ?</label>
              <textarea id="student-description" rows="3" class="form-control" style="width:100%;background:white;color:var(--text-primary);border:1.5px solid var(--border-glass);border-radius:6px;padding:8px;font-size:0.85rem;resize:vertical" placeholder="Saisissez votre liste ici..."></textarea>
              <button class="btn btn-sm btn-info" style="margin-top:10px" onclick="Level2.submitDescription(event)">✅ Valider ma réponse</button>
            </div>

            <div id="prelevement-form" style="display:none;margin-top:15px;text-align:left;background:var(--bg-primary);padding:15px;border-radius:8px;border:1px solid var(--danger)">
              <label style="font-size:0.85rem;color:var(--danger);font-weight:bold;margin-bottom:8px;display:block">🎯 Qu'est-ce qu'on doit prélever sur cette pièce ?</label>
              <textarea id="student-prelevement" rows="3" class="form-control" style="width:100%;background:white;color:var(--text-primary);border:1.5px solid var(--border-glass);border-radius:6px;padding:8px;font-size:0.85rem;resize:vertical" placeholder="Énumérez les zones anatomiques ciblées..."></textarea>
              <button class="btn btn-sm btn-danger" style="margin-top:10px" onclick="Level2.submitPrelevementQuestion(event)">✅ Soumettre mon plan</button>
            </div>

            <div id="table-details" style="opacity:0;transition:opacity 0.5s;margin-top:15px;display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left">
               <div style="background:var(--bg-glass);padding:10px;border-radius:8px;font-size:0.75rem;border-left:3px solid var(--danger)">
                 <strong style="color:var(--text-primary);display:block;margin-bottom:3px">Tumeur</strong> 
                 ${d.description_macroscopique.tumeur}
               </div>
               <div style="background:var(--bg-glass);padding:10px;border-radius:8px;font-size:0.75rem;border-left:3px solid var(--warning)">
                 <strong style="color:var(--text-primary);display:block;margin-bottom:3px">Plèvre & Bronche</strong> 
                 ${d.description_macroscopique.plèvre} / ${d.description_macroscopique.bronche}
               </div>
               <div style="background:var(--bg-glass);padding:10px;border-radius:8px;font-size:0.75rem;border-left:3px solid var(--info)">
                 <strong style="color:var(--text-primary);display:block;margin-bottom:3px">Ganglions</strong> 
                 ${d.description_macroscopique.ganglions}
               </div>
               <div style="background:var(--bg-glass);padding:10px;border-radius:8px;font-size:0.75rem;border-left:3px solid var(--success)">
                 <strong style="color:var(--text-primary);display:block;margin-bottom:3px">Parenchyme</strong> 
                 ${d.description_macroscopique.parenchyme}
               </div>
            </div>
          </div>

          <!-- Senior -->
          <div style="text-align:center;z-index:2;display:flex;flex-direction:column;justify-content:center;width:100px">
            <div style="font-size:3.5rem;margin-bottom:5px;animation:fadeIn 1s ease-out">👨‍⚕️</div>
            <div style="font-size:0.8rem;font-weight:bold;color:var(--primary)">Senior</div>
          </div>
          
        </div>
        
        <!-- Dialogue du senior -->
        <div id="senior-dialogue" style="background:rgba(56, 189, 248, 0.08);border-left:4px solid var(--primary);padding:15px;border-radius:0 8px 8px 0;font-size:0.95rem;color:var(--text-primary);line-height:1.6;transition:all 0.5s">
          <strong>👨‍⚕️ Dr. Pathologiste (Senior) :</strong> "Observe bien cette pièce anatomique. La qualité de notre macroscopie conditionne l'entièreté de notre diagnostic final et le stade pTNM du patient. Par quoi décides-tu de commencer ?"
        </div>
      </div>

      <!-- Zone Interactive Cachée avant pesée -->
      <div id="macro-interactive-section" style="opacity:0;pointer-events:none;transition:opacity 0.5s">
        <!-- Cassettes -->
        <div class="card" style="margin-top:20px;text-align:center">
          <div class="card-title" style="margin-bottom:15px"><span class="card-icon">🎯</span> Prélèvements réalisés (Mise en Cassettes)</div>
          
          <img src="assets/cassettes.png" alt="Cassettes d'inclusion" style="max-width:100%;border-radius:8px;border:2px solid var(--border);margin-bottom:15px">
          
          <div style="background:var(--bg-lighter);padding:15px;border-radius:8px;text-align:left;font-size:0.9rem;line-height:1.6;border-left:4px solid var(--success)">
            <h4 style="color:var(--text-primary);margin-bottom:12px">Descriptif des blocs (H26/162) :</h4>
            <ul style="color:var(--text-secondary);list-style-type:none;padding-left:0">
              <li style="margin-bottom:6px"><strong>• Cassette A1-A2 :</strong> Recoupe bronchique et pédicule vasculaire</li>
              <li style="margin-bottom:6px"><strong>• Cassette A3 :</strong> Ganglions du hile</li>
              <li style="margin-bottom:6px"><strong>• Cassette A4-A5 :</strong> Tumeur (centre et périphérie / front d'invasion)</li>
              <li style="margin-bottom:6px"><strong>• Cassette A6 :</strong> Tumeur au contact de la plèvre</li>
              <li style="margin-bottom:6px"><strong>• Cassette A7-A8 :</strong> Parenchyme pulmonaire sain (à distance)</li>
            </ul>
          </div>
        </div>

        <!-- Actions -->
        <div class="level-actions" style="margin-top:20px">
          <button class="btn btn-primary btn-lg" id="btn-valider-macro" onclick="Level2.valider()">
            Terminer la Macroscopie →
          </button>
        </div>
        <div id="level2-feedback" class="hidden" style="margin-top:24px"></div>
      </div> <!-- Fin zone interactive -->

      </div> <!-- Fin zone interactive -->
    `;
  }

  function requestAction(select) {
    const val = select.value;
    select.value = ""; // reset
    if (!val) return;

    const sequence = ["mesurer", "ouvrir", "decrire"];
    const expected = sequence[macroPhase];

    if (val === expected) {
      select.disabled = true;
      if (val === "mesurer") {
        Game.toast('success', 'Étape 1 validée', "Très bien. Avant toute chose, on identifie, on pèse et on mesure la pièce.", 5);
        measurePiece(select);
      } else if (val === "ouvrir") {
        Game.toast('success', 'Étape 2 validée', "Exact. On ouvre la pièce anatomique (au scalpel/macrotome) pour exposer les plans profonds.", 5);
        openPiece(select);
      } else if (val === "decrire") {
        Game.toast('success', 'Étape 3 validée', "Parfait. On repère et on décrit précisément les lésions observées.", 5);
        describePiece(select);
      }
    } else {
      const currentIdx = sequence.indexOf(val);
      if (currentIdx !== -1 && currentIdx < macroPhase) {
        Game.toast('warning', 'Déjà fait', "Vous avez déjà réalisé cette étape.", 0);
      } else {
        Game.toast('error', 'Mauvais ordre', "L'ordre formel d'un examen macroscopique doit être scrupuleusement respecté !", -10);
        Game.addPenalty(10, LEVEL_NUM);
      }
    }
  }

  function measurePiece(select) {
    const student = document.getElementById('student-macroscopy');
    const tableAnim = document.getElementById('table-anim');
    const measurements = document.getElementById('table-measurements');
    const d = GAME_DATA.level2;

    student.textContent = "🧑‍🎓📏";
    
    setTimeout(() => {
      student.textContent = "🧑‍🎓";
      tableAnim.innerHTML = "⚖️ 🫁 📏";
      tableAnim.style.transform = "scale(1.1)";
      
      setTimeout(() => {
        tableAnim.style.transform = "scale(1)";
        measurements.innerHTML = d.description_macroscopique.lobe.split('—').slice(1).join('—');
        measurements.style.background = "var(--primary-dark)";
        measurements.style.color = "#fff";
        
        macroPhase = 1;
        select.disabled = false;
        select.focus();
        document.getElementById('senior-dialogue').innerHTML = `<strong>👨‍⚕️ Dr. Pathologiste :</strong> "Très bien. Maintenant que nous avons le poids et les dimensions, il nous faut exposer la tumeur. Quelle est la prochaine étape ?"`;
      }, 600);
    }, 600);
  }

  function openPiece(select) {
    const student = document.getElementById('student-macroscopy');
    const tableAnim = document.getElementById('table-anim');

    student.textContent = "🧑‍🎓🔪";
    
    setTimeout(() => {
      student.textContent = "🧑‍🎓";
      tableAnim.innerHTML = "🫁 🫁 🫁";
      tableAnim.style.transform = "scale(1.2)";
      tableAnim.style.textShadow = "0 0 10px rgba(239,68,68,0.5)";
      
      setTimeout(() => {
        tableAnim.style.transform = "scale(1)";
        tableAnim.style.textShadow = "none";
        
        macroPhase = 2;
        select.disabled = false;
        select.focus();
        document.getElementById('senior-dialogue').innerHTML = `<strong>👨‍⚕️ Dr. Pathologiste :</strong> "Parfait. Tes coupes sont nettes. Décris-moi ces lésions, évalue leurs rapports tumoraux et mesure bien tes distances aux marges."`;
      }, 600);
    }, 600);
  }

  function describePiece(select) {
    const student = document.getElementById('student-macroscopy');
    const form = document.getElementById('description-form');

    student.textContent = "🧑‍🎓✍️";
    
    setTimeout(() => {
      form.style.display = "block";
      document.getElementById('student-description').focus();
    }, 300);
  }

  function submitDescription(event) {
    const text = document.getElementById('student-description').value.toLowerCase();
    
    if (text.length < 10) {
      Game.toast('warning', 'Réponse trop courte', 'Veuillez énumérer tous les éléments anatomiques essentiels à décrire.', 0);
      return;
    }

    let penalty = 0;
    let missingInfo = [];
    
    const hasTumeur = text.match(/tumeur|masse|lésion|lesion/);
    const hasPlevre = text.match(/plevre|plèvre|pleural/);
    const hasParenchyme = text.match(/parenchyme|pulmonaire/);
    const hasHile = text.match(/hile|ganglion|nœud|noeud/);
    const hasDistance = text.match(/distance|recoupe|marge|berge|bronchique|bronche/);

    if (!hasTumeur) { penalty += 5; missingInfo.push("la tumeur/masse"); }
    if (!hasPlevre) { penalty += 5; missingInfo.push("la plèvre"); }
    if (!hasParenchyme) { penalty += 5; missingInfo.push("le parenchyme"); }
    if (!hasHile) { penalty += 5; missingInfo.push("le hile/ganglions"); }
    if (!hasDistance) { penalty += 5; missingInfo.push("la distance tumeur-recoupe"); }

    const correctResponse = "<i>Attendons : Tumeur, Plèvre, Parenchyme pulmonaire, Hile (ganglions), Distance tumeur/recoupe.</i>";

    if (penalty === 0) {
      Game.toast('success', "Réponse parfaite !", "Excellent ! Vous avez identifié tous les éléments clés (+20 pts).<br><br>" + correctResponse, 20);
      Game.addScore(20, LEVEL_NUM);
    } else {
      Game.toast('warning', "Réponse incomplète", `Oublis : ${missingInfo.join(', ')}.<br>Pénalité logicielle (-${penalty} pts).<br><br>${correctResponse}`, -penalty);
      Game.addPenalty(penalty, LEVEL_NUM);
    }

    // Lock input
    document.getElementById('student-description').disabled = true;
    event.target.style.display = 'none';

    // Reveal correction
    const details = document.getElementById('table-details');
    details.style.opacity = "1";
    
    const student = document.getElementById('student-macroscopy');
    student.textContent = "🧑‍🎓";

    // Enable next action
    document.getElementById('action-selector').style.display = 'none';
    document.getElementById('btn-prelever').style.display = 'block';
    document.getElementById('senior-dialogue').innerHTML = `<strong>👨‍⚕️ Dr. Pathologiste :</strong> "Bonne analyse, ton plan macroscopique est formellement établi. À ton tour, sélectionne les zones cruciales à prélever sur la pièce."`;
  }

  function askPrelevements() {
    const btn = document.getElementById('btn-prelever');
    const student = document.getElementById('student-macroscopy');
    const form = document.getElementById('prelevement-form');
    
    btn.style.display = 'none';
    student.textContent = "🧑‍🎓💭";
    
    form.style.display = 'block';
    document.getElementById('student-prelevement').focus();
    
    document.getElementById('senior-dialogue').innerHTML = `<strong>👨‍⚕️ Dr. Pathologiste :</strong> "Avant de procéder physiquement, énumère-moi précisément ton plan d'échantillonnage."`;
  }

  function submitPrelevementQuestion(event) {
    const text = document.getElementById('student-prelevement').value.toLowerCase();
    
    if (text.length < 10) {
      Game.toast('warning', 'Réponse trop courte', 'Veuillez lister les zones anatomiques ciblées.', 0);
      return;
    }

    let penalty = 0;
    let missingInfo = [];
    
    const hasBronche = text.match(/recoupe|bronche|bronchique/);
    const hasVasculaire = text.match(/vasculaire|pedicule|pédicule|vaisseau/);
    const hasTumeur = text.match(/tumeur|masse|lésion/);
    const hasPlevre = text.match(/plevre|plèvre|pleural/);
    const hasParenchyme = text.match(/parenchyme|sain|pulmonaire/);
    const hasGanglion = text.match(/ganglion|hile/);

    if (!hasBronche) { penalty += 5; missingInfo.push("recoupe bronchique"); }
    if (!hasVasculaire) { penalty += 5; missingInfo.push("pédicule vasculaire"); }
    if (!hasTumeur) { penalty += 5; missingInfo.push("tumeur"); }
    if (!hasPlevre) { penalty += 5; missingInfo.push("tumeur avec plèvre"); }
    if (!hasParenchyme) { penalty += 5; missingInfo.push("parenchyme pulmonaire"); }
    if (!hasGanglion) { penalty += 5; missingInfo.push("ganglions du hile"); }

    const correctResponse = "<i>Rappel du plan : Recoupe bronchique, Pédicule vasculaire, Tumeur (centre/périphérie), Tumeur avec plèvre, Parenchyme pulmonaire, et Ganglions du hile.</i>";

    if (penalty === 0) {
      Game.toast('success', "Plan parfait !", "Excellent (+20 pts).<br><br>" + correctResponse, 20);
      Game.addScore(20, LEVEL_NUM);
    } else {
      Game.toast('warning', "Plan incomplet", `Oublis : ${missingInfo.join(', ')}.<br>Pénalité (-${penalty} pts).<br><br>${correctResponse}`, -penalty);
      Game.addPenalty(penalty, LEVEL_NUM);
    }

    document.getElementById('student-prelevement').disabled = true;
    event.target.style.display = 'none';
    
    unlockPrelevements();
  }

  function unlockPrelevements() {
    const student = document.getElementById('student-macroscopy');
    const interactive = document.getElementById('macro-interactive-section');
    
    student.textContent = "🧑‍🎓🎯";
    
    interactive.style.opacity = "1";
    interactive.style.pointerEvents = "auto";
    
    document.getElementById('senior-dialogue').innerHTML = `<strong>👨‍⚕️ Dr. Pathologiste :</strong> "Le plan théorique est validé. Voici sur la table le résultat de ton travail : les blocs sont numérotés et placés dans des cassettes ! Tu peux maintenant valider pour envoyer le tout au laboratoire d'histologie."`;
  }

  function valider() {
    if (submitted) return;
    submitted = true;

    // Ajouter des points pour l'étape validée
    Game.addScore(50, LEVEL_NUM);

    // Toujours marqué comme passé pour permettre la progression
    Game.setLevelPassed(LEVEL_NUM, true);

    const fb = document.getElementById('level2-feedback');
    fb.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-lg);padding:28px">
        <div style="font-size:1rem;font-weight:700;color:var(--success);margin-bottom:12px">✅ Excellent ! La macroscopie est complète.</div>
        <div style="font-size:0.86rem;color:var(--text-secondary);line-height:1.7;margin-bottom:20px">
          <strong style="color:var(--text-primary)">🎓 Point pédagogique :</strong> La qualité de l'examen macroscopique conditionne directement la pertinence du diagnostic histologique. 
          Les cassettes numérotées sont prêtes — elles vont suivre tout un traitement tissulaire (fixation, déshydratation, inclusion en paraffine) au laboratoire.
        </div>
        <button class="btn btn-primary btn-lg" onclick="Game.nextLevel()">
          Niveau 3 : Traitement technique →
        </button>
      </div>
    `;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    document.getElementById('btn-valider-macro').style.display = 'none';
  }

  return { init, valider, requestAction, measurePiece, openPiece, describePiece, submitDescription, askPrelevements, submitPrelevementQuestion, unlockPrelevements };
})();
