import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: Replace with the user's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBog9YTKGsbW0V9jV2G9Dc-2NDrPPag17w",
  authDomain: "pathoquest-7dc83.firebaseapp.com",
  projectId: "pathoquest-7dc83",
  storageBucket: "pathoquest-7dc83.firebasestorage.app",
  messagingSenderId: "465764695160",
  appId: "1:465764695160:web:9bff60d36ea59e1cab018d"
};

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
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        
        if (userDoc.exists() && userDoc.data().status === "approved") {
          // Access granted
          document.getElementById('screen-auth').classList.remove('active');
          document.getElementById('screen-home').classList.add('active');
        } else {
          auth.signOut();
          showMsg("Votre compte est en attente de validation par l'administrateur.");
        }
      } catch (error) {
        showMsg("Erreur de connexion. Vérifiez vos identifiants.");
      }
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
      if (!auth) return showMsg("Firebase non configuré. Veuillez entrer les clés dans js/auth.js");
      const name = document.getElementById('auth-reg-name').value;
      const email = document.getElementById('auth-reg-email').value;
      const pw = document.getElementById('auth-reg-pw').value;
      if (!name || !email || !pw) return showMsg("Veuillez remplir tous les champs.");
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pw);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          status: "pending",
          createdAt: new Date().toISOString()
        });
        auth.signOut();
        showMsg("Inscription réussie ! En attente de validation par l'administrateur.");
        document.getElementById('form-register-block').style.display='none'; 
        document.getElementById('form-login-block').style.display='block';
      } catch (error) {
        showMsg("Erreur lors de l'inscription : " + error.message);
      }
    });
  }
});
