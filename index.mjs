// index.mjs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBa5bYbUgLiluU6eCimeA8-jVx1i4_xRmA",
  authDomain: "rgukt-sgpa-cgpa-calculator.firebaseapp.com",
  projectId: "rgukt-sgpa-cgpa-calculator",
  storageBucket: "rgukt-sgpa-cgpa-calculator.firebasestorage.app",
  messagingSenderId: "71013965900",
  appId: "1:71013965900:web:9dc65476149f6ff91954e9",
  measurementId: "G-K22L37T7Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global functions for header/menu
window.refreshLogo = () => window.location.reload();
window.toggleMenu = () => {
  document.querySelector('.menu-bar').classList.toggle('open');
  document.querySelector('.menu-overlay').classList.toggle('open');
};
window.navigateTo = (page) => window.location.href = page;

window.logout = () => {
  signOut(auth).then(() => {
    alert("You have logged out.");
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error("Logout error:", error);
  });
};

// Dropdown
const dropdown = document.getElementById("user-dropdown");
const overlay = document.getElementById("user-dropdown-overlay");

window.toggleMenu = () => {
  const menu = document.querySelector('.menu-bar');
  const overlay = document.querySelector('.menu-overlay');
  if (!menu || !overlay) {
    console.warn("Menu or overlay not found in DOM.");
    return;
  }
  menu.classList.toggle('open');
  overlay.classList.toggle('open');
};


overlay.addEventListener("click", () => {
  dropdown.classList.remove("show");
  overlay.style.display = "none";
});

window.addEventListener("scroll", () => {
  dropdown.classList.remove("show");
  overlay.style.display = "none";
});

window.addEventListener("resize", () => {
  dropdown.classList.remove("show");
  overlay.style.display = "none";
});

// Firebase Auth UI Update
onAuthStateChanged(auth, (user) => {
  const signupBtn = document.getElementById("signup-btn");
  const dropdownImg = document.getElementById("dropdown-profile-img");
  const nameDisplay = document.getElementById("user-name");
  const emailDisplay = document.getElementById("user-email");

  const mobileBtn = document.getElementById("mobile-profile-btn");
  const mobileProfileContent = document.getElementById("mobile-profile-content");

  if (user) {
    const profileURL = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;

    signupBtn.innerHTML = `<img src="${profileURL}" alt="User" style="height: 30px; width: 30px; border-radius: 50%; vertical-align: middle;">`;
    signupBtn.onclick = toggleDropdown;

    mobileBtn.style.display = "inline-flex";
    mobileProfileContent.innerHTML = `<img src="${profileURL}" alt="User">`;
    mobileBtn.onclick = toggleDropdown;

    dropdownImg.src = profileURL;
    nameDisplay.textContent = user.displayName || "RGUKT User";
    emailDisplay.textContent = user.email;
  } else {
    signupBtn.textContent = "Signup";
    signupBtn.onclick = () => navigateTo('login.html');

    mobileBtn.style.display = "inline-flex";
    mobileProfileContent.textContent = "Signup";
    mobileBtn.onclick = () => navigateTo('login.html');
  }
});
