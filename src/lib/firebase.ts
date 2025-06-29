// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile // <-- Importa updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTyCLQGZcT-5lHSMltRevJesnYfO5_EEw",
  authDomain: "cashhh-52f38.firebaseapp.com",
  projectId: "cashhh-52f38",
  storageBucket: "cashhh-52f38.appspot.com",
  messagingSenderId: "950181964759",
  appId: "1:950181964759:web:1a6cc1852de6a6b57b3992",
  measurementId: "G-3F02RQXEFQ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Funzione di login con Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Errore durante il login con Google", error);
    // Potresti voler restituire l'errore per mostrarlo nell'UI
    throw error;
  }
};

export { 
  app, 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider
};