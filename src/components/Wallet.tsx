// components/Wallet.tsx
import { useState, useEffect } from 'react';

// IMPORTANTISSIMO: Sostituisci questo URL con l'URL del tuo backend su Render!
const BACKEND_URL = "https://freecash-clone-backend.onrender.com";

export default function Wallet({ user }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return; // Non fare nulla se l'utente non è loggato

    const fetchBalance = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get_user_balance/${user.uid}`);
        if (!response.ok) {
          // Se l'utente non è ancora nel nostro DB, il backend darà 404. È normale all'inizio.
          if (response.status === 404) {
              setBalance(0); // Mostra 0 se l'utente è nuovo
              throw new Error("Utente nuovo, saldo impostato a 0.");
          }
          throw new Error('Errore nel recuperare il saldo');
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (err) {
        setError(err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]); // Questo hook si attiva ogni volta che l'oggetto 'user' cambia

  if (!user) return <p>Fai il login per vedere il tuo wallet.</p>;
  if (loading) return <p>Caricamento saldo...</p>;

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-xl">
      <h2 className="text-2xl font-bold text-white">Il Tuo Wallet</h2>
      {error && balance === null && <p className="text-red-400">{error}</p>}
      <p className="text-4xl font-bold text-green-400 mt-2">
        ${balance !== null ? balance.toFixed(2) : 'N/D'}
      </p>
    </div>
  );
}