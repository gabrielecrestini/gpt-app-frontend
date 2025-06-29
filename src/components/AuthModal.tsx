// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { 
    auth,
    signInWithGoogle, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    updateProfile
} from '../lib/firebase';
import { X, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { Orbitron, Poppins } from 'next/font/google';
import { useLanguage } from '../context/LanguageContext';

// --- Caratteri Stupendi ---
const orbitron = Orbitron({ subsets: ['latin'], weight: ['700', '900'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

type AuthModalProps = {
  onClose: () => void;
};

// --- Componente Logo ---
const Logo = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
        <defs>
            <linearGradient id="logo-gradient-modal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#4ade80'}} />
                <stop offset="50%" style={{stopColor: '#2dd4bf'}} />
                <stop offset="100%" style={{stopColor: '#3b82f6'}} />
            </linearGradient>
        </defs>
        <path d="M5 3H19L5 21H19" stroke="url(#logo-gradient-modal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Componente Testo Scrorrevole ---
const IncentiveMarquee = () => {
    const items = ["Guadagna con Sondaggi", "Prelievi Veloci con PayPal", "Bonus Esclusivi", "Invita i Tuoi Amici", "Nuove Offerte Ogni Giorno"];
    return (
        <div className="w-full bg-black/20 overflow-hidden relative h-10 mt-8 rounded-md">
            <div className="absolute top-0 left-0 w-max h-full flex items-center animate-marquee">
                {items.concat(items).map((item, index) => (
                    <div key={index} className="flex items-center mx-4 flex-shrink-0">
                        <span className="text-sm text-gray-300 font-semibold whitespace-nowrap">{item}</span>
                        <span className="text-green-400 mx-4">&#x2726;</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else { // Modalità Registrazione
        if (username.length < 3) throw new Error(t.auth_modal_error_username);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        onClose();
      }
    } catch (err: any) {
        const firebaseError = err.code?.replace('auth/', '').replace(/-/g, ' ') || "Si è verificato un errore.";
        setError(firebaseError.charAt(0).toUpperCase() + firebaseError.slice(1));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <style jsx global>{`
            @keyframes aurora { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-marquee {
                animation: marquee 40s linear infinite;
            }
        `}</style>
        
        <div 
            className={`${poppins.className} bg-gray-900/50 backdrop-blur-xl rounded-2xl w-full max-w-md border-2 border-transparent p-8 md:p-12 relative overflow-hidden`}
            style={{ backgroundSize: '400% 400%', backgroundImage: 'linear-gradient(120deg, #4ade801a, #3b82f61a, #8b5cf61a, #4ade801a)', animation: 'aurora 15s ease infinite' }}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"><X size={24} /></button>
            
            <div className="text-center mb-6">
                <Logo />
                <h2 className={`${orbitron.className} text-3xl font-bold text-white`}>Zenith Rewards</h2>
            </div>

            <div className="flex bg-gray-900/50 p-1 rounded-lg mb-6">
                <button onClick={() => setMode('login')} className={`w-1/2 py-2 rounded-md transition-colors font-semibold ${mode === 'login' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50'}`}>{t.login_button}</button>
                <button onClick={() => setMode('register')} className={`w-1/2 py-2 rounded-md transition-colors font-semibold ${mode === 'register' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50'}`}>{t.auth_modal_register_link}</button>
            </div>
            
            <form onSubmit={handleAuthAction} className="space-y-4">
                {mode === 'register' && (
                    <div className="relative animate-fade-in-up">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder={t.auth_modal_username_label} value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" />
                    </div>
                )}
                <div className="relative animate-fade-in-up">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div className="relative animate-fade-in-up">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="password" placeholder={t.auth_modal_password_label} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

                <button type="submit" className="w-full py-3 mt-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                    {mode === 'login' ? t.auth_modal_submit_login : t.auth_modal_submit_register}
                </button>
            </form>

            <div className="flex items-center my-6">
                <hr className="flex-grow border-t border-gray-700" />
                <span className="px-4 text-gray-500 text-sm">{t.auth_modal_or}</span>
                <hr className="flex-grow border-t border-gray-700" />
            </div>

            <button onClick={signInWithGoogle} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56,12.25c0-.78-0.07-1.53-0.2-2.25H12v4.26h5.92c-0.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57C21.74,18.01,22.56,15.37,22.56,12.25z"></path><path fill="currentColor" d="M12,23c2.97,0,5.46-0.98,7.28-2.66l-3.57-2.77c-0.98,0.66-2.23,1.06-3.71,1.06c-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23z"></path><path fill="currentColor" d="M5.84,14.09c-0.22-0.66-0.35-1.36-0.35-2.09c0-0.73,0.13-1.43,0.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12c0,1.78,0.43,3.45,1.18,4.93L5.84,14.09z"></path><path fill="currentColor" d="M12,5.38c1.62,0,3.06,0.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1C7.7,1,3.99,3.47,2.18,7.07l3.66,2.84C6.71,7.31,9.14,5.38,12,5.38z"></path></svg>
                {t.auth_modal_google_btn}
            </button>
            <IncentiveMarquee />
        </div>
    </div>
  );
}