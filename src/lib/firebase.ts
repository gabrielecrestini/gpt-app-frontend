// src/lib/firebase.ts

// Import delle funzioni necessarie da Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// La tua configurazione Firebase personale
// Ho corretto "firebasestorage.app" in "appspot.com" nel storageBucket, che è il formato corretto.
const firebaseConfig = {
  apiKey: "AIzaSyCTyCLQGZcT-5lHSMltRevJesnYfO5_EEw",
  authDomain: "cashhh-52f38.firebaseapp.com",
  projectId: "cashhh-52f38",
  storageBucket: "cashhh-52f38.appspot.com",
  messagingSenderId: "950181964759",
  appId: "1:950181964759:web:1a6cc1852de6a6b57b3992",
  measurementId: "G-3F02RQXEFQ"
};

// Inizializzazione di Firebase in modo sicuro per Next.js
// Questo codice controlla se un'app Firebase è già stata inizializzata.
// Se non lo è, la inizializza. Se lo è già, usa l'app esistente.
// Questo previene errori durante lo sviluppo quando la pagina si ricarica.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Esporta l'oggetto 'auth' che verrà usato in tutta l'applicazione per gestire il login.
const auth = getAuth(app);

export { app, auth };
