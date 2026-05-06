import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, updateDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: Replace with the user's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBog9YTKGsbW0V9jV2G9Dc-2NDrPPag17w",
  authDomain: "pathoquest-7dc83.firebaseapp.com",
  projectId: "pathoquest-7dc83",
  storageBucket: "pathoquest-7dc83.firebasestorage.app",
  messagingSenderId: "465764695160",
  appId: "1:465764695160:web:9bff60d36ea59e1cab018d"
};

const ADMIN_EMAILS = ["nizartaboubi@gmail.com", "laboatfkamoun@gmail.com"];

let app, auth, db;

try {
  if (firebaseConfig.apiKey !== "TODO") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase error", e);
}

function showMsg(msg) {
  const el = document.getElementById('auth-error-msg');
  el.textContent = msg;
  setTimeout(() => el.textContent = '', 4000);
}

async function loadAdminList() {
  const pendingEl = document.getElementById('admin-pending-list');
  const approvedEl = document.getElementById('admin-approved-list');
  if (!pendingEl) return;
  pendingEl.innerHTML = 'Chargement...';
  approvedEl.innerHTML = 'Chargement...';

  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    let pendingHTML = '';
    let approvedHTML = '';

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const uid = docSnap.id;
      
      const results = data.results || null;
      const scoreInfo = results ? `<span style="color:var(--cyan);font-weight:bold;margin-left:10px;">${results.totalScore}/900 (${results.percent}%)</span>` : '';
      
      const html = `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid var(--border-glass);">
        <div>
          <strong style="color:var(--text-primary);">${data.name}</strong> 
          <span style="color:var(--text-muted);font-size:0.85em;">(${data.email})</span>
          ${scoreInfo}
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          ${data.status === 'pending' ? 
            `<button class="btn btn-primary btn-sm btn-approve" data-uid="${uid}">✅ Approuver</button>` : 
            `<span style="color:var(--success);font-weight:bold;font-size:0.85em;">Approuvé</span>
             ${results ? `<button class="btn btn-ghost btn-sm btn-bilan" data-uid="${uid}">📄 Voir Bilan</button>` : ''}
             <button class="btn btn-danger btn-sm btn-delete" data-uid="${uid}" style="padding:4px 8px;font-size:0.7rem;">🗑️ Supprimer</button>`
          }
        </div>
      </div>`;
      
      if (data.status === 'pending') pendingHTML += html;
      else approvedHTML += html;
    });

    pendingEl.innerHTML = pendingHTML || '<p style="color:var(--text-muted);">Aucun étudiant en attente.</p>';
    approvedEl.innerHTML = approvedHTML || '<p style="color:var(--text-muted);">Aucun étudiant autorisé.</p>';

    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.currentTarget.getAttribute('data-uid');
        await updateDoc(doc(db, "users", uid), { status: "approved" });
        loadAdminList(); // Recharge la liste
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.currentTarget.getAttribute('data-uid');
        if (confirm("Voulez-vous vraiment supprimer cet étudiant et lui couper l'accès ?")) {
          await deleteDoc(doc(db, "users", uid));
          loadAdminList();
        }
      });
    });

    document.querySelectorAll('.btn-bilan').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.currentTarget.getAttribute('data-uid');
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          showStudentBilan(userData.name, userData.results);
        }
      });
    });

  } catch (err) {
    console.error(err);
    pendingEl.innerHTML = 'Erreur de chargement de la base de données.';
  }
}

// The script is loaded as type="module", so it executes after the DOM is parsed.
// We can directly attach listeners without waiting for DOMContentLoaded.

const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
  
  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      if (!auth) return showMsg("Firebase non configuré. Veuillez entrer les clés dans js/auth.js");
      const email = document.getElementById('auth-login-email').value;
      const pw = document.getElementById('auth-login-pw').value;
      if (!email || !pw) return showMsg("Veuillez remplir tous les champs.");
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pw);
        const userEmail = userCredential.user.email.toLowerCase();
        
        if (ADMIN_EMAILS.includes(userEmail)) {
          // Admin Access
          document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
          document.getElementById('screen-admin').classList.add('active');
          loadAdminList();
          return;
        }

        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        
        if (userDoc.exists() && userDoc.data().status === "approved") {
          // Student Access granted
          document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
          document.getElementById('screen-home').classList.add('active');
          Game.init(); // Réinitialiser l'HUD au login
        } else {
          auth.signOut();
          document.getElementById('form-login-block').style.display='none'; 
          document.getElementById('form-pending-block').style.display='block';
        }
      } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          showMsg("Email ou mot de passe incorrect.");
        } else {
          showMsg("Erreur de connexion. Vérifiez vos identifiants.");
        }
      }
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
      console.log("Tentative d'inscription démarrée...");
      if (!auth) return showMsg("Firebase non configuré. Veuillez entrer les clés dans js/auth.js");
      
      const name = document.getElementById('auth-reg-name').value;
      const email = document.getElementById('auth-reg-email').value;
      const pw = document.getElementById('auth-reg-pw').value;
      
      if (!name || !email || !pw) return showMsg("Veuillez remplir tous les champs.");
      
      const originalBtnText = btnRegister.textContent;
      btnRegister.textContent = "Création du compte...";
      btnRegister.disabled = true;

      try {
        console.log("Création de l'utilisateur dans Firebase Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, pw);
        console.log("Utilisateur créé. UID:", userCredential.user.uid);
        
        console.log("Enregistrement du profil dans Firestore...");
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          status: "pending",
          createdAt: new Date().toISOString()
        });
        
        console.log("Déconnexion immédiate...");
        await auth.signOut();
        
        console.log("Affichage de l'écran de succès.");
        document.getElementById('form-register-block').style.display='none'; 
        document.getElementById('form-pending-block').style.display='block';
      } catch (error) {
        console.error("Erreur durant l'inscription:", error);
        if (error.code === 'auth/email-already-in-use') {
          showMsg("Cet email est déjà utilisé. Veuillez vous connecter pour demander un nouvel accès.");
        } else {
          showMsg("Erreur : " + error.message);
        }
      } finally {
        btnRegister.textContent = originalBtnText;
        btnRegister.disabled = false;
      }
    });
  }


  // Observer l'état de l'utilisateur (garder la session active)
  if (auth) {
    onAuthStateChanged(auth, async (user) => {
      console.log("État Auth changé :", user ? "Connecté (" + user.email + ")" : "Déconnecté");
      if (user) {
        const userEmail = user.email.toLowerCase();
        
        if (ADMIN_EMAILS.includes(userEmail)) {
          console.log("Accès Admin détecté.");
          document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
          document.getElementById('screen-admin').classList.add('active');
          loadAdminList();
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        // Cacher tous les blocs par défaut pour éviter les superpositions
        document.getElementById('form-login-block').style.display='none';
        document.getElementById('form-register-block').style.display='none';
        document.getElementById('form-pending-block').style.display='none';
        document.getElementById('form-re-request-block').style.display='none';

        if (userDoc.exists() && userDoc.data().status === "approved") {
          console.log("Étudiant approuvé. Redirection Home.");
          document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
          document.getElementById('screen-home').classList.add('active');
        } else if (userDoc.exists() && userDoc.data().status === "pending") {
          console.log("Étudiant en attente.");
          document.getElementById('form-pending-block').style.display='block';
        } else if (!userDoc.exists()) {
          console.warn("Utilisateur authentifié mais sans profil (supprimé).");
          document.getElementById('form-re-request-block').style.display='block';
        } else {
          console.warn("Statut inconnu. Déconnexion.");
          auth.signOut();
          document.getElementById('form-login-block').style.display='block';
        }
      }
    });
  }


  // Déconnexion Admin
  const btnLogoutAdmin = document.getElementById('btn-logout-admin');
  if (btnLogoutAdmin) {
    btnLogoutAdmin.addEventListener('click', () => {
      auth.signOut();
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screen-auth').classList.add('active');
    });
  }

  // Déconnexion Etudiant
  const btnLogoutStudent = document.getElementById('btn-logout-student');
  if (btnLogoutStudent) {
    btnLogoutStudent.addEventListener('click', () => {
      auth.signOut();
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screen-auth').classList.add('active');
      location.reload(); // Refresh to stop the game state
    });
  }
  // Global function to save results
  window.saveUserScore = async (results) => {
    if (auth.currentUser && db) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          results: results,
          lastCompleted: new Date().toISOString()
        });
        console.log("Résultats détaillés enregistrés.");
      } catch (e) {
        console.error("Erreur lors de l'enregistrement des résultats:", e);
      }
    }
  };

  function showStudentBilan(name, results) {
    if (!results) return;
    const overlay = document.createElement('div');
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);";
    
    const levelNames = ["Réception", "Macroscopie", "Technique", "Microscopie", "Compte Rendu"];
    const levelIcons = ["🧫", "🔬", "⚗️", "🔭", "📋"];
    
    let levelsHTML = results.levelScores.map((s, i) => `
      <div style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #eee;background:white;">
        <span style="font-weight:600;color:var(--text-secondary);">${levelIcons[i]} ${levelNames[i]}</span>
        <span style="font-weight:800;color:${results.levelPassed[i] ? '#65e209' : '#dc2626'}">${s} pts</span>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div style="background:white;padding:32px;border-radius:20px;max-width:500px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,0.4);position:relative;animation:screenEnter 0.3s ease;">
        <button class="close-bilan" style="position:absolute;top:20px;right:20px;border:none;background:#f1f5f9;width:32px;height:32px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>
        
        <h2 style="color:var(--cyan);margin-bottom:24px;font-size:1.5rem;font-weight:900;">📊 Bilan de ${name}</h2>
        
        <div style="background:#f8fafc;padding:20px;border-radius:14px;margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:16px;border:1px solid #e2e8f0;">
          <div><div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;font-weight:700;">Score Total</div><div style="font-weight:900;font-size:1.3rem;color:var(--cyan);">${results.totalScore}/900</div></div>
          <div><div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;font-weight:700;">Réussite</div><div style="font-weight:900;font-size:1.3rem;color:#65e209;">${results.percent}%</div></div>
          <div><div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;font-weight:700;">Temps Total</div><div style="font-weight:700;color:var(--text-primary);">${results.time}</div></div>
          <div><div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;font-weight:700;">Erreurs Critiques</div><div style="font-weight:700;color:#dc2626;">${results.errors}</div></div>
        </div>

        <div style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.02);">
          <div style="background:#f1f5f9;padding:10px 12px;font-size:0.7rem;text-transform:uppercase;font-weight:800;color:#64748b;letter-spacing:0.05em;">Détail par niveau</div>
          ${levelsHTML}
        </div>

        <button class="btn btn-primary" style="width:100%;margin-top:28px;justify-content:center;border-radius:100px;padding:14px;" id="close-bilan-btn">Fermer le bilan</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.close-bilan').onclick = close;
    overlay.querySelector('#close-bilan-btn').onclick = close;
  }

  // Gérer la nouvelle demande d'accès (après suppression)
  const btnReRequest = document.getElementById('btn-re-request');
  if (btnReRequest) {
    btnReRequest.addEventListener('click', async () => {
      const name = document.getElementById('auth-re-name').value;
      if (!name) return showMsg("Veuillez entrer votre nom.");
      
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            name: name,
            email: auth.currentUser.email,
            status: "pending",
            createdAt: new Date().toISOString()
          });
          document.getElementById('form-re-request-block').style.display='none'; 
          document.getElementById('form-pending-block').style.display='block';
        } catch (e) {
          showMsg("Erreur lors de la demande.");
        }
      }
    });
  }

