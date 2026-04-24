import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
      const html = `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid var(--border-glass);">
        <div><strong style="color:var(--text-primary);">${data.name}</strong> <span style="color:var(--text-muted);font-size:0.85em;">(${data.email})</span></div>
        ${data.status === 'pending' ? `<button class="btn btn-primary btn-sm btn-approve" data-uid="${uid}">✅ Approuver</button>` : `<span style="color:var(--success);font-weight:bold;font-size:0.85em;">Approuvé</span>`}
      </div>`;
      if (data.status === 'pending') pendingHTML += html;
      else approvedHTML += html;
    });

    pendingEl.innerHTML = pendingHTML || '<p style="color:var(--text-muted);">Aucun étudiant en attente.</p>';
    approvedEl.innerHTML = approvedHTML || '<p style="color:var(--text-muted);">Aucun étudiant autorisé.</p>';

    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.target.getAttribute('data-uid');
        await updateDoc(doc(db, "users", uid), { status: "approved" });
        loadAdminList(); // Recharge la liste
      });
    });

  } catch (err) {
    console.error(err);
    pendingEl.innerHTML = 'Erreur de chargement de la base de données.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
        showMsg("Erreur de connexion. Vérifiez vos identifiants.");
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
        showMsg("Erreur : " + error.message);
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
        if (userDoc.exists() && userDoc.data().status === "approved") {
          console.log("Étudiant approuvé. Redirection Home.");
          document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
          document.getElementById('screen-home').classList.add('active');
        } else {
          console.warn("Utilisateur non approuvé ou inconnu. Déconnexion.");
          auth.signOut();
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
});
