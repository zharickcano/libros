import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8Fcb60NXBVnfoIqYy903loTapqrVWc4g",
  authDomain: "mi-biblioteca-web-47e11.firebaseapp.com",
  projectId: "mi-biblioteca-web-47e11",
  storageBucket: "mi-biblioteca-web-47e11.firebasestorage.app",
  messagingSenderId: "152963035735",
  appId: "1:152963035735:web:203b25f135e75f5f8ae912"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('nav-auth-container');

  if (!authContainer) return;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let rol = "lector";
      try {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          rol = userDoc.data().rol;
        }
      } catch (error) {
        console.error("Error consultando rol:", error);
      }

      const destino = rol === 'admin' ? 'cuenta-admin.html' : 'cuenta-lector.html';
      const etiqueta = rol === 'admin' ? 'Panel Admin' : 'Mi Cuenta';

      // Estructura unificada con menú desplegable
      authContainer.innerHTML = `
        <div class="nav-dropdown">
          <button class="nav-user-btn active-session" id="dropdown-trigger">
            <span class="user-icon">👤</span>
            <span class="user-text">${etiqueta}</span>
            <span class="arrow-icon">▾</span>
          </button>
          
          <div class="dropdown-menu" id="dropdown-menu">
            <a href="${destino}" class="dropdown-item">
              <span class="item-icon">⚙️</span> Ir a ${etiqueta}
            </a>
            <button id="btn-logout-nav" class="dropdown-item logout-item">
              <span class="item-icon">🚪</span> Cerrar Sesión
            </button>
          </div>
        </div>
      `;

      // Lógica para abrir/cerrar desplegable
      const trigger = document.getElementById('dropdown-trigger');
      const menu = document.getElementById('dropdown-menu');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
      });

      // Cerrar al hacer clic fuera del menú
      document.addEventListener('click', () => {
        menu.classList.remove('show');
      });

      // Evento para cerrar sesión
      document.getElementById('btn-logout-nav')?.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = 'index.html';
      });

    } else {
      // Estado de visitante (sin iniciar sesión)
      authContainer.innerHTML = `
        <a href="login.html" class="nav-user-btn">
          <span class="user-icon">👤</span>
          <span class="user-text">Mi Cuenta</span>
        </a>
      `;
    }
  });
});