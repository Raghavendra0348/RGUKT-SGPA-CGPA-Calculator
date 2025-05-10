// Import necessary Firebase services
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js';

// Firebase configuration
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

// Redirect if the user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If the user is logged in, redirect to the main page
    window.location.href = 'main.html';
  }
});

// Google Sign-In function
window.signInWithGoogle = function () {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
      };
      localStorage.setItem('user', JSON.stringify(user)); // Save minimal data
      console.log("User signed in:", user);
      window.location.href = 'main.html'; // Redirect to main.html after successful sign-in
    })
    .catch((error) => {
      console.error("Error signing in:", error.message);
    });
};
