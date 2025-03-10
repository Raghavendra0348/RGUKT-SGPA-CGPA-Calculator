// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
