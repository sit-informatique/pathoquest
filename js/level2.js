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
          <div style="text-align:center;z-index:2;display:flex;flex-direction:column;justify-content:center;align-items:center;width:165px">
            <div style="position:relative;width:155px;margin-bottom:5px;animation:fadeIn 1s ease-out">
              <img src="assets/char_etudiant.png" alt="Étudiante" style="height:195px;width:155px;object-fit:cover;object-position:10% top;display:block;border-radius:10px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.22));">
              <div id="student-macroscopy" style="position:absolute;bottom:-4px;right:-4px;font-size:1.4rem;background:rgba(255,255,255,0.95);border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.2);"></div>
            </div>
            <div style="font-size:0.8rem;font-weight:bold;color:var(--text-primary);margin-bottom:10px">Vous</div>
            
            <div id="action-selector" style="width:100%">
              <select class="btn btn-sm btn-ghost" id="student-action-select" style="width:100%;font-size:0.75rem;padding:6px;margin-bottom:8px" onchange="Level2.requestAction(this)">
                <option value="">-- Que faire ? --</option>
                <option value="decrire">Décrire les lésions</option>
                <option value="orienter">Orienter la pièce</option>
                <option value="ouvrir">Ouvrir la pièce</option>
                <option value="mesurer">Mesurer et encrer</option>
              </select>
            </div>

            <button class="btn btn-danger" style="font-size:0.75rem;padding:8px;width:100%;display:none;margin-top:5px" onclick="Level2.askPrelevements()" id="btn-prelever">
              🎯 Effectuer les prélèvements
            </button>
          </div>

          <!-- Table de macroscopie -->
          <div style="flex:1;text-align:center;position:relative;margin:0 20px;padding:20px;background:#ffffff;border:1.5px solid var(--border-glass);border-radius:12px;box-shadow:var(--shadow-card)">
            <div id="table-anim" style="margin-bottom:10px;transition:all 0.5s;height:250px;display:flex;align-items:center;justify-content:center;">
              <img id="macro-main-img" src="assets/lobe_macroscopie_real.jpg" style="max-height:100%;max-width:100%;object-fit:contain;border-radius:15px;box-shadow:0 4px 10px rgba(0,0,0,0.15)">
            </div>
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

          <!-- Senior — Silhouette réelle -->
          <div style="text-align:center;z-index:2;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;width:165px">
            <img src="assets/doc_senior1.png"
                 alt="Dr. Pathologiste Senior"
                 style="
                   height:195px;
                   width:155px;
                   object-fit:cover;
                   object-position:center top;
                   display:block;
                   border-radius:10px;
                   filter:drop-shadow(0 4px 12px rgba(0,0,0,0.22));
                   animation:fadeIn 1s ease-out;
                 ">
            <div style="font-size:0.82rem;font-weight:700;color:var(--primary,#38bdf8);letter-spacing:0.04em;margin-top:6px">Senior</div>
          </div>
          
        </div>
        
        <!-- Dialogue du senior -->
        <div id="senior-dialogue" style="background:rgba(56, 189, 248, 0.08);border-left:4px solid var(--primary);padding:15px;border-radius:0 8px 8px 0;font-size:0.95rem;color:var(--text-primary);line-height:1.6;transition:all 0.5s">
          <strong><img src="assets/doc_senior1.png" alt="Senior" style="width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:center top;vertical-align:middle;margin-right:6px;border:1.5px solid #38bdf8;"> Dr. Pathologiste (Senior) :</strong><br>
          « Regarde bien cette pièce opératoire. Ici, la macroscopie n'est pas une simple formalité : c'est l'acte qui dicte le stade pTNM et l'avenir thérapeutique du patient. Une erreur maintenant, et tout le reste sera faussé.<br>
          La pièce est là, fixée et prête. Par quel geste décides-tu de commencer ? »
        </div>
      </div>

      <!-- Zone Interactive Cachée avant pesée -->
      <div id="macro-interactive-section" style="opacity:0;pointer-events:none;transition:opacity 0.5s">
        <!-- Cassettes -->
        <div class="card" style="margin-top:20px;text-align:center">
          <div style="font-size:1.05rem; font-weight:600; color:var(--text-primary); margin-bottom:15px; line-height:1.6; padding:10px; border-left:4px solid var(--primary); background:rgba(56,189,248,0.1); border-radius:4px;">
            <span style="font-size:1.2rem;">🎯</span> Théorie validée, pratique achevée. Voici sur la table le résultat de ton travail : les blocs sont numérotés et placés dans des cassettes. En envoyant ces prélèvements à l'histologie, tu transformes la matière en diagnostic.
          </div>
          
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

    const sequence = ["orienter", "mesurer", "ouvrir", "decrire"];
    const expected = sequence[macroPhase];

    if (val === expected) {
      select.disabled = true;
      if (val === "orienter") {
        Game.toast('success', 'Étape 1 validée', "On commence par bien orienter la pièce.", 5);
        orientPiece(select);
      } else if (val === "mesurer") {
        Game.toast('success', 'Étape 2 validée', "Très bien. On identifie, on mesure et on encre la pièce.", 5);
        measurePiece(select);
      } else if (val === "ouvrir") {
        Game.toast('success', 'Étape 3 validée', "Exact. On ouvre la pièce anatomique pour exposer les plans profonds.", 5);
        openPiece(select);
      } else if (val === "decrire") {
        Game.toast('success', 'Étape 4 validée', "Parfait. On repère et on décrit précisément les lésions observées.", 5);
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

  function orientPiece(select) {
    const student = document.getElementById('student-macroscopy');
    const tableAnim = document.getElementById('table-anim');
    const tableContainer = tableAnim.parentElement;

    student.textContent = "🧭";
    
    // Hide standard texts temporarily
    Array.from(tableContainer.children).forEach(child => {
      if (child.id !== 'table-anim' && child.id !== 'student-action-select' && child.tagName !== 'BUTTON') {
        if (child.style) child.style.display = 'none';
      }
    });
    tableAnim.style.display = 'none';

    // Create D&D game container
    const dndContainer = document.createElement('div');
    dndContainer.id = "dnd-container";
    dndContainer.style.textAlign = "center";
    dndContainer.innerHTML = `
      <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:15px;line-height:1.5;background:rgba(56,189,248,0.1);padding:10px;border-radius:8px;border:1px solid rgba(56,189,248,0.3);text-align:left">
        <strong style="color:var(--primary)">🧭 Orientation : Placez les étiquettes au bon endroit (Glisser-Déposer)</strong>
        <div id="dnd-pedago-text" style="display:none;margin-top:10px;">
          <ul style="margin:5px 0 0 15px;padding:0">
            <li>L’apex présente souvent un aspect convexe et parfois des dystrophies bulleuses.</li>
            <li>La face diaphragmatique présente un aspect concave.</li>
            <li>Les scissures sont fréquemment repérées par des rangées d’agrafes.</li>
          </ul>
        </div>
      </div>
      
      <div style="display:flex;gap:10px;margin-bottom:20px;justify-content:center;flex-wrap:wrap">
        <div class="dnd-draggable" style="padding:6px 12px; background:#0ea5e9; color:#ffffff; border-radius:6px; cursor:grab; font-size:0.85rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.1); user-select:none; z-index:10; position:relative;" draggable="true" ondragstart="Level2.dragStart(event)" id="lbl-apex">Apex</div>
        <div class="dnd-draggable" style="padding:6px 12px; background:#0ea5e9; color:#ffffff; border-radius:6px; cursor:grab; font-size:0.85rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.1); user-select:none; z-index:10; position:relative;" draggable="true" ondragstart="Level2.dragStart(event)" id="lbl-hile">Hile</div>
        <div class="dnd-draggable" style="padding:6px 12px; background:#0ea5e9; color:#ffffff; border-radius:6px; cursor:grab; font-size:0.85rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.1); user-select:none; z-index:10; position:relative;" draggable="true" ondragstart="Level2.dragStart(event)" id="lbl-plevre">Plèvre viscérale</div>
        <div class="dnd-draggable" style="padding:6px 12px; background:#0ea5e9; color:#ffffff; border-radius:6px; cursor:grab; font-size:0.85rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.1); user-select:none; z-index:10; position:relative;" draggable="true" ondragstart="Level2.dragStart(event)" id="lbl-parenchyme">Parenchyme pulmonaire</div>
      </div>

      <div style="position:relative;width:100%;max-width:300px;height:350px;margin:0 auto;background:#f8fafc;border-radius:20px;border:2px dashed var(--border);display:flex;align-items:center;justify-content:center">
        <!-- Real Lung Image -->
        <img src="assets/lobe_macroscopie_real.jpg" alt="Pièce opératoire" style="width:90%;height:90%;object-fit:contain;border-radius:15px;box-shadow:0 4px 10px rgba(0,0,0,0.15)">

        <!-- Drop zones -->
        <div class="dnd-dropzone" ondragover="Level2.dragOver(event)" ondragleave="Level2.dragLeave(event)" ondrop="Level2.drop(event, 'lbl-apex')" style="position:absolute;top:2%;left:50%;transform:translateX(-50%);width:80px;height:35px"></div>
        
        <div class="dnd-dropzone" ondragover="Level2.dragOver(event)" ondragleave="Level2.dragLeave(event)" ondrop="Level2.drop(event, 'lbl-hile')" style="position:absolute;top:40%;right:2%;width:70px;height:50px"></div>
        
        <div class="dnd-dropzone" ondragover="Level2.dragOver(event)" ondragleave="Level2.dragLeave(event)" ondrop="Level2.drop(event, 'lbl-plevre')" style="position:absolute;bottom:5%;left:15%;width:90px;height:40px"></div>
        
        <div class="dnd-dropzone" ondragover="Level2.dragOver(event)" ondragleave="Level2.dragLeave(event)" ondrop="Level2.drop(event, 'lbl-parenchyme')" style="position:absolute;top:40%;left:25%;width:90px;height:50px"></div>
      </div>
      <div id="dnd-success-msg" style="display:none;color:var(--success);font-weight:bold;margin-top:15px;font-size:1.1rem;animation:pulse 1s infinite">✅ Orientation réussie !</div>
    `;

    if (!document.getElementById('dnd-styles')) {
      const style = document.createElement('style');
      style.id = "dnd-styles";
      style.innerHTML = `
        .dnd-draggable:active { cursor:grabbing !important; }
        .dnd-draggable.placed { background:transparent !important; color:var(--text-primary) !important; box-shadow:none !important; padding:2px !important; font-size:0.75rem !important; pointer-events:none; text-shadow:0 0 3px white; font-weight:900 !important; }
        .dnd-dropzone { border:2px dashed rgba(0,0,0,0.3); border-radius:8px; background:rgba(255,255,255,0.6); display:flex; align-items:center; justify-content:center; }
        .dnd-dropzone.drag-over { background:rgba(16,185,129,0.3); border-color:var(--success); }
        .dnd-dropzone.filled { border:none; background:transparent; }
      `;
      document.head.appendChild(style);
    }

    tableContainer.insertBefore(dndContainer, document.getElementById('description-form'));

    Level2.currentSelect = select;
    Level2.placedLabels = 0;
  }

  function dragStart(ev) { ev.dataTransfer.setData("text", ev.target.id); }
  function dragOver(ev) { ev.preventDefault(); ev.currentTarget.classList.add('drag-over'); }
  function dragLeave(ev) { ev.currentTarget.classList.remove('drag-over'); }
  
  function drop(ev, expectedId) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    var data = ev.dataTransfer.getData("text");
    
    if (data === expectedId) {
      const draggedEl = document.getElementById(data);
      draggedEl.classList.add('placed');
      
      ev.currentTarget.classList.add('filled');
      ev.currentTarget.innerHTML = "";
      ev.currentTarget.appendChild(draggedEl);
      
      Level2.placedLabels++;
      
      if (Level2.placedLabels === 4) {
        document.getElementById('dnd-success-msg').style.display = 'block';
        document.getElementById('dnd-pedago-text').style.display = 'block'; // Show pedagogical text
        
        // Mettre en évidence les règles d'orientation apprises
        Game.toast('success', 'Orientation validée', 'Lisez bien les points de repère avant de continuer.', 10);
        
        // Add continue button
        const continueBtn = document.createElement('button');
        continueBtn.className = "btn btn-primary";
        continueBtn.style.marginTop = "15px";
        continueBtn.innerHTML = "Continuer →";
        continueBtn.onclick = () => {
          document.getElementById('dnd-container').style.display = 'none';
          document.getElementById('table-anim').style.display = 'block';
          
          const tableContainer = document.getElementById('table-anim').parentElement;
          Array.from(tableContainer.children).forEach(child => {
            if (child.id === 'table-measurements') child.style.display = 'inline-block';
            else if (child.tagName === 'DIV' && !child.id.includes('form') && !child.id.includes('details') && child.id !== 'dnd-container') {
              child.style.display = 'block';
            }
          });
          
          macroPhase = 1;
          Level2.currentSelect.disabled = false;
          Level2.currentSelect.focus();
          document.getElementById('senior-dialogue').innerHTML = "<strong><img src='assets/doc_senior1.png' alt='Senior' style='width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:center top;vertical-align:middle;margin-right:6px;border:1.5px solid #38bdf8;'> Dr. Pathologiste (Senior) :</strong><br>« L'orientation est juste. Maintenant, que faisons-nous sur cette pièce orientée ? »";
          
          Game.addScore(20, LEVEL_NUM);
        };
        
        document.getElementById('dnd-container').appendChild(continueBtn);
      }
    } else {
      Game.toast('error', "Erreur d'orientation", 'Mauvais emplacement pour cette étiquette.', -5);
      Game.addPenalty(5, LEVEL_NUM);
    }
  }

  function measurePiece(select) {
    const student = document.getElementById('student-macroscopy');
    const tableAnim = document.getElementById('table-anim');
    const measurements = document.getElementById('table-measurements');
    const d = GAME_DATA.level2;

    student.textContent = "📏";
    
    setTimeout(() => {
      student.textContent = "";
      const mainImg = document.getElementById('macro-main-img');
      if(mainImg) mainImg.src = "assets/lobe_macroscopie_inked.jpg";
      tableAnim.style.transform = "scale(1.05)";
      
      setTimeout(() => {
        tableAnim.style.transform = "scale(1)";
        measurements.innerHTML = d.description_macroscopique.lobe.split('—').slice(1).join('—');
        measurements.style.background = "var(--primary-dark)";
        measurements.style.color = "#fff";
        
        macroPhase = 2;
        select.disabled = false;
        select.focus();
        document.getElementById('senior-dialogue').innerHTML = `<strong><img src='assets/doc_senior1.png' alt='Senior' style='width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:center top;vertical-align:middle;margin-right:6px;border:1.5px solid #38bdf8;'> Dr. Pathologiste (Senior) :</strong><br>« Très bien. Maintenant que nous avons le poids et les dimensions, il nous faut exposer la tumeur. Quelle est la prochaine étape ? »`;
      }, 600);
    }, 600);
  }

  function openPiece(select) {
    const student = document.getElementById('student-macroscopy');
    const tableAnim = document.getElementById('table-anim');

    student.textContent = "🔪";
    
    setTimeout(() => {
      student.textContent = "";
      const mainImg = document.getElementById('macro-main-img');
      if(mainImg) {
          mainImg.style.filter = "contrast(1.2) sepia(0.2)";
      }
      tableAnim.style.transform = "scale(1.1)";
      tableAnim.style.boxShadow = "inset 0 0 20px rgba(239,68,68,0.5)";
      
      setTimeout(() => {
        tableAnim.style.transform = "scale(1)";
        tableAnim.style.boxShadow = "none";
        if(mainImg) mainImg.style.filter = "none";
        
        macroPhase = 3;
        select.disabled = false;
        select.focus();
        document.getElementById('senior-dialogue').innerHTML = `<strong><img src='assets/doc_senior1.png' alt='Senior' style='width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:center top;vertical-align:middle;margin-right:6px;border:1.5px solid #38bdf8;'> Dr. Pathologiste (Senior) :</strong><br>« Parfait. Tes coupes sont nettes. Décris-moi ces lésions, évalue leurs rapports tumoraux et mesure bien tes distances aux marges. »`;
      }, 600);
    }, 600);
  }

  function describePiece(select) {
    const student = document.getElementById('student-macroscopy');
    const form = document.getElementById('description-form');

    student.textContent = "✍️";
    
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
    student.textContent = "";

    // Enable next action
    document.getElementById('action-selector').style.display = 'none';
    document.getElementById('btn-prelever').style.display = 'block';
    document.getElementById('senior-dialogue').innerHTML = `<strong><img src='assets/doc_senior1.png' alt='Senior' style='width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:center top;vertical-align:middle;margin-right:6px;border:1.5px solid #38bdf8;'> Dr. Pathologiste (Senior) :</strong><br>« Ton plan macroscopique est validé. À toi de jouer. Identifie et prélève les zones stratégiques. Un bloc inutile encombre le labo, mais un bloc oublié fausse le diagnostic. Sois sélectif et précis. »`;
  }

  function askPrelevements() {
    const btn = document.getElementById('btn-prelever');
    const student = document.getElementById('student-macroscopy');
    const form = document.getElementById('prelevement-form');
    
    btn.style.display = 'none';
    student.textContent = "💭";
    
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
    
    student.textContent = "🎯";
    
    interactive.style.opacity = "1";
    interactive.style.pointerEvents = "auto";
    
    document.getElementById('senior-dialogue').innerHTML = `<strong><img src='assets/doc_senior1.png' alt='Senior' style='width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:center top;vertical-align:middle;margin-right:6px;border:1.5px solid #38bdf8;'> Dr. Pathologiste (Senior) :</strong><br>« Ton plan macroscopique est validé. À toi de jouer. Identifie et prélève les zones stratégiques. Un bloc inutile encombre le labo, mais un bloc oublié fausse le diagnostic. Sois sélectif et précis. »`;
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
          <strong style="color:var(--text-primary)">🎓 Point pédagogique : La Macroscopie, fondement du diagnostic</strong><br>
          <span style="color:var(--primary); font-style:italic;">« Gardez ceci à l'esprit : le microscope ne corrige jamais les oublis de la macroscopie. »</span><br>
          La qualité de l'examen macroscopique conditionne directement la pertinence du diagnostic histologique.<br>
          Les cassettes numérotées sont prêtes. Elles quittent maintenant vos mains pour subir différentes étapes techniques.
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

  return { init, valider, requestAction, measurePiece, openPiece, describePiece, submitDescription, askPrelevements, submitPrelevementQuestion, unlockPrelevements, dragStart, dragOver, dragLeave, drop, placedLabels: 0, currentSelect: null };
})();
