// components/Auth.tsx
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Auth({ user }) {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Errore durante il login con Google", error);
    }
  };

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <img src={user.photoURL} alt="User photo" className="w-10 h-10 rounded-full" />
          <span>Ciao, {user.displayName}!</span>
          <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Accedi con Google
        </button>
      )}
    </div>
  );
}