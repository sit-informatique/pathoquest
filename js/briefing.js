/**
 * js/briefing.js
 * Gère le cours rapide et le quiz initial
 */

const Briefing = (() => {
  let currentStep = 0;
  
  const courseSteps = [
    {
      title: "Étape 1 : Réception & Conformité 🧫",
      content: `
        <p><strong>La sécurité avant tout :</strong> À l'arrivée d'un prélèvement, la première mission du pathologiste est de vérifier la <strong>Triple Conformité</strong> :</p>
        <ul>
          <li><strong>Identité :</strong> Le nom sur le flacon doit être identique à celui sur la fiche.</li>
          <li><strong>Nature :</strong> Le prélèvement décrit (ex: lobe supérieur droit) doit correspondre à ce qu'il y a dans le flacon.</li>
          <li><strong>Fixation :</strong> Le tissu doit baigner dans du <strong>Formol à 10%</strong> (fixateur standard). Un volume de fixateur 10 fois supérieur au volume de la pièce est recommandé.</li>
        </ul>
        <div style="background:rgba(0,229,255,0.1);padding:15px;border-radius:10px;margin-top:20px;border-left:4px solid var(--cyan)">
          ⚠️ Un prélèvement non identifié est une <strong>erreur critique</strong>. Il doit être refusé.
        </div>
      `
    },
    {
      title: "Étape 2 : L'Examen Macroscopique 🔬",
      content: `
        <p>C'est l'étape de l'examen à l'œil nu. On ne regarde pas encore les cellules, mais la structure.</p>
        <ul>
          <li><strong>Mesurer :</strong> On note le poids et les dimensions (3 axes) de la pièce.</li>
          <li><strong>Décrire :</strong> On cherche la tumeur. Est-elle solide ? Nécrotique ? Hémorragique ?</li>
          <li><strong>Marges :</strong> On mesure la distance entre la tumeur et les limites de résection (bronches, vaisseaux, plèvre).</li>
          <li><strong>Échantillonner :</strong> On prélève des morceaux stratégiques (cassettes) qui seront analysés au microscope.</li>
        </ul>
      `
    },
    {
      title: "Étape 3 : Le Traitement Technique ⚗️",
      content: `
        <p>Pour voir au microscope, le tissu doit être transformé en une lame fine de 4 microns. Le cycle dure environ 12h :</p>
        <ol>
          <li><strong>Déshydratation :</strong> Passage dans des bains d'alcool croissants.</li>
          <li><strong>Inclusion :</strong> Le tissu est imprégné de <strong>paraffine</strong> chaude pour devenir un bloc solide.</li>
          <li><strong>Coupe :</strong> Utilisation d'un <strong>microtome</strong> pour faire des tranches ultra-fines.</li>
          <li><strong>Coloration :</strong> On utilise classiquement l'<strong>Hémateine-Éosine (HE)</strong> pour colorer les noyaux et le cytoplasme.</li>
        </ol>
      `
    },
    {
      title: "Étape 4 : Analyse Microscopique 🔭",
      content: `
        <p>C'est ici que l'on confirme le cancer. Le pathologiste cherche des signes de malignité :</p>
        <ul>
          <li><strong>Architecture :</strong> Les cellules forment-elles des glandes (adénocarcinome) ou des ponts intercellulaires (carcinome épidermoïde) ?</li>
          <li><strong>Agressivité :</strong> On définit le grade (IASLC pour le poumon) du plus différencié au moins différencié.</li>
          <li><strong>Invasion :</strong> On vérifie si les cellules franchissent la plèvre ou envahissent les vaisseaux (emboles).</li>
        </ul>
      `
    },
    {
      title: "Étape 5 : Compte Rendu & pTNM 📋",
      content: `
        <p>La synthèse finale. Le compte rendu doit être structuré pour le clinicien.</p>
        <ul>
          <li><strong>Type Histologique :</strong> Ex: Adénocarcinome invasif.</li>
          <li><strong>pT (Tumeur) :</strong> Défini par la taille et l'extension locale.</li>
          <li><strong>pN (Nodes) :</strong> Défini par l'envahissement des ganglions lymphatiques.</li>
          <li><strong>Marges :</strong> Indiquer si la résection est complète (R0) ou incomplète (R1/R2).</li>
        </ul>
      `
    }
  ];

  const quizQuestions = [
    {
      q: "Quel est le fixateur standard utilisé en Anatomie Pathologique ?",
      options: ["Alcool 90%", "Eau distillée", "Formol 10%", "Sérum physiologique"],
      correct: 2
    },
    {
      q: "Que signifie une marge de résection 'R0' ?",
      options: ["Tumeur touchant la limite", "Absence de tumeur à la limite", "Tumeur visible à l'oeil nu à la limite", "Marge non évaluable"],
      correct: 1
    },
    {
      q: "Quelle substance utilise-t-on pour l'inclusion des tissus afin de les couper au microtome ?",
      options: ["Résine époxy", "Cire d'abeille", "Paraffine", "Glace carbonique"],
      correct: 2
    }
  ];

  let currentQuizIdx = 0;

  function init() {
    currentStep = 0;
    currentQuizIdx = 0;
    document.getElementById('briefing-intro').style.display = 'block';
    document.getElementById('briefing-course').style.display = 'none';
    document.getElementById('briefing-quiz').style.display = 'none';
  }

  function startCourse() {
    document.getElementById('briefing-intro').style.display = 'none';
    document.getElementById('briefing-course').style.display = 'block';
    renderStep();
  }

  function renderStep() {
    const step = courseSteps[currentStep];
    document.getElementById('course-step-title').textContent = step.title;
    document.getElementById('course-progress').textContent = `${currentStep + 1} / ${courseSteps.length}`;
    document.getElementById('course-content').innerHTML = step.content;
    
    document.getElementById('btn-course-prev').style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    document.getElementById('btn-course-next').textContent = currentStep === courseSteps.length - 1 ? "Passer le test →" : "Continuer →";
  }

  function nextStep() {
    if (currentStep < courseSteps.length - 1) {
      currentStep++;
      renderStep();
    } else {
      startQuiz();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  }

  function startQuiz() {
    document.getElementById('briefing-course').style.display = 'none';
    document.getElementById('briefing-quiz').style.display = 'block';
    renderQuiz();
  }

  function renderQuiz() {
    const q = quizQuestions[currentQuizIdx];
    document.getElementById('quiz-question').textContent = q.q;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost quiz-opt';
      btn.style.textAlign = 'left';
      btn.style.justifyContent = 'flex-start';
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(idx);
      optionsContainer.appendChild(btn);
    });
    
    document.getElementById('quiz-feedback').textContent = '';
  }

  function checkAnswer(idx) {
    const q = quizQuestions[currentQuizIdx];
    const feedback = document.getElementById('quiz-feedback');
    const options = document.querySelectorAll('.quiz-opt');
    
    options.forEach(opt => opt.disabled = true);
    
    if (idx === q.correct) {
      options[idx].style.background = 'rgba(74, 222, 128, 0.2)';
      options[idx].style.borderColor = 'var(--success)';
      feedback.innerHTML = '<span style="color:var(--success)">✨ Excellente réponse !</span>';
      
      setTimeout(() => {
        if (currentQuizIdx < quizQuestions.length - 1) {
          currentQuizIdx++;
          renderQuiz();
        } else {
          finishBriefing();
        }
      }, 1500);
    } else {
      options[idx].style.background = 'rgba(248, 113, 113, 0.2)';
      options[idx].style.borderColor = 'var(--danger)';
      feedback.innerHTML = '<span style="color:var(--danger)">❌ Ce n\'est pas tout à fait ça. Relisez bien l\'option correcte.</span>';
      
      setTimeout(() => {
        options.forEach(opt => opt.disabled = false);
        options[idx].style.background = '';
        options[idx].style.borderColor = '';
        feedback.textContent = '';
      }, 2000);
    }
  }

  function finishBriefing() {
    document.getElementById('screen-briefing').classList.remove('active');
    document.getElementById('screen-home').classList.add('active');
    // On pourrait donner un petit bonus de score ici
    Game.toast('success', 'Préparation terminée', 'Vous avez brillamment réussi le test initial. Bienvenue au labo !', 10);
    Game.addScore(10);
  }

  return { init, startCourse, nextStep, prevStep };
})();
