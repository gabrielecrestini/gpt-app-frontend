// app/page.tsx

"use client"; // <-- QUESTA RIGA È FONDAMENTALE!

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import Auth from '../components/Auth';
import Wallet from '../components/Wallet';
import Head from 'next/head';

// Ricorda di installare: npm install react-firebase-hooks

export default function HomePage() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Mio GPT Clone</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-5xl font-extrabold mb-4">Benvenuto nella Piattaforma</h1>
        <p className="text-xl text-gray-400 mb-8">Completa offerte e guadagna soldi veri.</p>

        <div className="absolute top-8 right-8">
          <Auth user={user} />
        </div>

        {loading && <p>Caricamento utente...</p>}
        {error && <p>Errore di autenticazione: {error.message}</p>}

        {user && (
          <div className="w-full max-w-2xl mt-8">
            <Wallet user={user} />
            {/* Qui in futuro potrai aggiungere l'iframe dell'offerwall */}
          </div>
        )}
      </main>
    </>
  );
}