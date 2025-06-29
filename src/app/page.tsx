// src/app/page.tsx
"use client";
import { useState, useEffect, useRef, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { LanguageProvider, useLanguage, Language } from '../context/LanguageContext';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Offerwall from '../components/Offerwall';
import Payout from '../components/Payout';
import Referral from '../components/Referral';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import ArtBattle from '../components/ArtBattle';
import AuthModal from '../components/AuthModal';
import { LoaderCircle, Wallet, UserPlus, ListChecks, ChevronDown, Sparkles, Target, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

// --- Componenti interni per la Landing Page ---
const Logo = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 flex items-center justify-center">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-10deg]">
                <div className="absolute w-full h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-sm" style={{ transform: 'skewX(-15deg)', clipPath: 'polygon(0 0, 100% 0, 100% 25%, 0 25%, 0 75%, 100% 75%, 100% 100%, 0 100%)' }}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm" style={{ transform: 'skewX(-15deg) translateX(4px)', clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)' }}></div>
            </div>
        </div>
        <span className="font-bold text-xl text-white">Zenith Rewards</span>
    </div>
);

const SpotlightBackground = () => {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (divRef.current) {
                const { clientX, clientY } = e;
                divRef.current.style.setProperty("--x", `${clientX}px`);
                divRef.current.style.setProperty("--y", `${clientY}px`);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    return <div ref={divRef} className="spotlight-bg"></div>;
};

const LanguageSwitcher = () => {
    const { lang, setLang, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = languages.find(l => l.code === lang);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <span>{currentLang?.flag}</span>
                <span className="hidden md:inline">{currentLang?.label}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-20">
                    {languages.map(l => (
                        <button key={l.code} onClick={() => { setLang(l.code); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2">
                           <span>{l.flag}</span> {l.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const LandingPage = ({ onLoginClick }: { onLoginClick: () => void }) => {
    const { t } = useLanguage();
    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
            <SpotlightBackground />
            <style jsx global>{`
                .spotlight-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; background-image: radial-gradient(circle at center, transparent, #0a0a0a 40%), radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(45, 212, 191, 0.2), transparent 40%); }
                @keyframes pulse-bright { 0%, 100% { filter: brightness(1.2); text-shadow: 0 0 10px #4ade80; } 50% { filter: brightness(1.5); text-shadow: 0 0 20px #2dd4bf; } }
                .feature-card { background: radial-gradient(circle at 50% 0, rgba(14, 165, 233, 0.1), transparent 50%); border-image-source: radial-gradient(circle at 50% 0, #0ea5e9, transparent 40%); border-image-slice: 1; transition: all 0.3s ease-in-out; }
                .feature-card:hover { border-image-source: radial-gradient(circle at 50% 0, #34d399, transparent 50%); transform: translateY(-5px); }
            `}</style>
            <header className="w-full px-8 py-4 flex justify-between items-center z-10">
                <Logo />
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button onClick={onLoginClick} className="font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">{t.login_button}</button>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold pb-3 animate-fade-in-up">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500" style={{animation: 'pulse-bright 3s infinite'}}>Crea.</span> Vota. Guadagna.
                </h1>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl animate-fade-in-up animation-delay-200">Entra in Zenith Rewards e trasforma la tua creatività in premi reali con le nostre Art Battles basate su IA.</p>
                <button onClick={onLoginClick} className="relative overflow-hidden mt-8 px-8 py-4 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 animate-fade-in-up animation-delay-400">
                    {t.cta_button} <ArrowRight className="inline-block ml-2"/>
                </button>
            </main>
            <section className="w-full py-20 bg-black/20 flex justify-center z-10 backdrop-blur-sm border-t border-white/5">
                <div className="w-full max-w-6xl px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white/5 rounded-xl border feature-card">
                            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="text-purple-400 h-10 w-10"/></div>
                            <h3 className="text-xl font-bold">Art Battles Uniche</h3><p className="text-gray-400 mt-2">Partecipa a contest creativi giornalieri e vinci premi con la tua immaginazione.</p>
                        </div>
                        <div className="text-center p-8 bg-white/5 rounded-xl border feature-card">
                            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Target className="text-teal-400 h-10 w-10"/></div>
                            <h3 className="text-xl font-bold">Missioni Quotidiane</h3><p className="text-gray-400 mt-2">Completa task giornalieri e sblocca ricompense speciali per accelerare i tuoi guadagni.</p>
                        </div>
                        <div className="text-center p-8 bg-white/5 rounded-xl border feature-card">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Wallet className="text-green-400 h-10 w-10"/></div>
                            <h3 className="text-xl font-bold">Prelievi Flessibili</h3><p className="text-gray-400 mt-2">Converti i tuoi Zenith Coins in denaro su PayPal o nelle tue criptovalute preferite.</p>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="w-full text-center p-6 text-sm text-gray-500 z-10"><p>&copy; {new Date().getFullYear()} Zenith Rewards. {t.footer_text}</p></footer>
        </div>
    );
};

// Componente principale che gestisce la logica
function AppContent() {
    const [user, loading, error] = useAuthState(auth);
    const [activePage, setActivePage] = useState('dashboard');
    const [isSynced, setIsSynced] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const refId = urlParams.get('ref');
      if (refId) sessionStorage.setItem('referrerId', refId);
    }, []);
    
    useEffect(() => {
      if (user && !isSynced) {
        const syncUser = async () => {
          const referrerId = sessionStorage.getItem('referrerId');
          try {
            const res = await fetch(`${BACKEND_URL}/sync_user`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  user_id: user.uid, 
                  email: user.email,
                  displayName: user.displayName,
                  referrer_id: referrerId,
                  avatar_url: user.photoURL
              }),
            });
            if (res.ok) {
              setIsSynced(true);
              setShowAuthModal(false);
              if (referrerId) sessionStorage.removeItem('referrerId');
            }
          } catch (syncError) {
            console.error("Errore sync:", syncError);
          }
        };
        syncUser();
      }
    }, [user, isSynced]);
  
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white"><LoaderCircle className="animate-spin h-12 w-12" /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500">Errore di Autenticazione: {error.message}</p>;
    }
    
    if (!user) {
      return (
          <>
              <LandingPage onLoginClick={() => setShowAuthModal(true)} />
              {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
          </>
      );
    }
  
    const renderContent = () => {
      const commonProps = { user, isSynced };
      switch (activePage) {
        case 'dashboard': return <Dashboard {...commonProps} onNavigate={setActivePage} />;
        case 'guadagna': return <Offerwall />;
        case 'portafoglio': return <Payout {...commonProps} />;
        case 'invita': return <Referral user={user} />;
        case 'profile': return <Profile user={user} />;
        case 'settings': return <Settings user={user} />;
        case 'art-battles': return <ArtBattle {...commonProps} />;
        default: return <Dashboard {...commonProps} onNavigate={setActivePage} />;
      }
    };
  
    return (
      <>
        <div className="flex min-h-screen bg-gray-900 text-white">
          <Sidebar user={user} setActivePage={setActivePage} onLoginClick={() => setShowAuthModal(true)} />
          <main className="flex-1 p-0 flex flex-col items-center justify-center bg-gray-900">{renderContent()}</main>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
}

// Il componente esportato ora è solo un wrapper per il Provider
export default function HomePage() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}
