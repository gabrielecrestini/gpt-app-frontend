"use client";
import { useState } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    User
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { X, LoaderCircle, Mail, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const Logo = () => (
    <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center">
            <div className="relative w-7 h-7">
                <div className="absolute w-full h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-sm" style={{ transform: 'skewX(-15deg)', clipPath: 'polygon(0 0, 100% 0, 100% 25%, 0 25%, 0 75%, 100% 75%, 100% 100%, 0 100%)' }}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm" style={{ transform: 'skewX(-15deg) translateX(3px)', clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)' }}></div>
            </div>
        </div>
        <span className="font-bold text-lg text-white">Zenith Rewards</span>
    </div>
);

type AuthModalProps = {
    onClose: () => void;
};

const DEFAULT_AVATAR_ID = 'css_nebula_aura';

export default function AuthModal({ onClose }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- FUNZIONE MANCANTE AGGIUNTA QUI ---
    const handleError = (err: any) => {
        const message = err.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : "Si è verificato un errore.";
        setError(message.charAt(0).toUpperCase() + message.slice(1));
        setIsLoading(false);
    };
    
    const handleSuccess = () => {
        setIsLoading(false);
        onClose();
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            handleSuccess();
        } catch (err) {
            handleError(err);
        }
    };
    
    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.displayName) {
                await updateProfile(userCredential.user, { 
                    displayName: email.split('@')[0],
                    photoURL: DEFAULT_AVATAR_ID 
                });
            }
            handleSuccess();
        } catch (err) {
            handleError(err);
        }
    };
    
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            handleSuccess();
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
                    <div className="flex flex-col items-center">
                        <Logo />
                        <h2 className="text-xl font-bold text-center text-white mt-2">Inizia la tua Avventura</h2>
                        <p className="text-center text-gray-400 mb-6 text-sm">Accedi o registrati per continuare.</p>
                        {error && <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 text-center w-full">{error}</p>}
                        <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-3 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors mb-4"><GoogleIcon /> Continua con Google</button>
                        <div className="my-4 flex items-center gap-4 text-xs text-gray-500 w-full"><div className="flex-grow border-t border-gray-700"></div>O<div className="flex-grow border-t border-gray-700"></div></div>
                        <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative"><Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18}/><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-purple-500"/></div>
                            <div className="relative"><KeyRound className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18}/><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-purple-500"/></div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={handleEmailLogin} disabled={isLoading} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors">Accedi</button>
                                <button type="button" onClick={handleEmailRegister} disabled={isLoading} className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold flex items-center justify-center">{isLoading ? <LoaderCircle className="animate-spin"/> : 'Registrati'}</button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}