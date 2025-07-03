"use client";
import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// Nota: Assicurati di importare 'auth' e 'User' dalla tua configurazione di Firebase
// CORRETTA
// CORRETTE
import { auth } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { motion, useInView, useAnimate, AnimatePresence } from 'framer-motion';

// Importa i componenti delle pagine
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Offerwall from '../components/Offerwall';
import Payout from '../components/Payout';
import Referral from '../components/Referral';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import ArtBattle from '../components/ArtBattle';
import Fucina from '../components/Fucina';
import AuthModal from '../components/AuthModal';
import NotificationToast from '../components/NotificationToast';
import AIStudioPage from '../components/AIStudioPage';

// Importa le icone necessarie
import { LoaderCircle, Wallet, Sparkles, Target, ArrowRight, Menu, ChevronDown, Award, Users, Bot, Palette, ShoppingCart, AlertTriangle } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

// --- Definizioni dei Tipi ---
type LeaderboardUser = { name: string; earnings: number; avatar: string; };
type StreakInfo = { days: number; canClaim: boolean; };
type Mission = { id: number; title: string; progress: number; target: number; reward: number; };
type Notification = { id: number; message: string; type: 'success' | 'error'; };

// --- Sotto-componenti UI & Animazioni Raffinati ---

const Logo = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-3 group ${className}`}>
        <div className="w-10 h-10 flex items-center justify-center">
            <div className="relative w-8 h-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-12deg]">
                <div className="absolute w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-lg" style={{ transform: 'skew(-15deg)' }}></div>
                <div className="absolute w-[90%] h-[90%] top-[5%] left-[5%] bg-gray-900 rounded-md" style={{ transform: 'skew(-15deg)' }}></div>
                <div className="absolute w-1.5 h-full bg-gradient-to-b from-teal-400 to-blue-500 rounded-lg top-0 left-1/2 -translate-x-1/2" style={{ transform: 'skew(-15deg)' }}></div>
            </div>
        </div>
        <span className="font-bold text-xl text-white">Zenith Rewards</span>
    </div>
);

const LanguageSwitcher = () => {
    const { lang, setLang, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = languages.find(l => l.code === lang);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-white">
                <span>{currentLang?.flag}</span>
                <span className="hidden md:inline">{currentLang?.label}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-0 mt-2 w-40 bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-20 overflow-hidden">
                        {languages.map(l => (
                            <button key={l.code} onClick={() => { setLang(l.code); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-600/30 transition-colors flex items-center gap-3">
                                <span>{l.flag}</span> {l.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AuroraBackground = () => (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <style jsx global>{`
            @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
            .animate-blob { animation: blob 8s infinite alternate; }
            .animation-delay-2000 { animation-delay: -4s; }
            .animation-delay-4000 { animation-delay: -2s; }
        `}</style>
        <div className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-500/20 rounded-full filter blur-3xl animate-blob top-[-10%] left-[-5%] animation-delay-2000"></div>
        <div className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-500/20 rounded-full filter blur-3xl animate-blob bottom-[-10%] right-[-5%]"></div>
        <div className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-green-500/10 rounded-full filter blur-2xl animate-blob animation-delay-4000 bottom-[20%] left-[20%]"></div>
        <div className="absolute inset-0 bg-gray-950/90"></div>
    </div>
);

const AnimatedCounter = ({ to }: { to: number }) => {
    const [scope, animate] = useAnimate<HTMLSpanElement>();
    const isInView = useInView(scope, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            animate(0, to, {
                duration: 2,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (scope.current) {
                        scope.current.textContent = Math.round(latest).toLocaleString('it-IT');
                    }
                }
            });
        }
    }, [isInView, animate, to, scope]);

    return <span ref={scope}>0</span>;
};

const FadeInOnScroll = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }} transition={{ duration: 0.7, delay }} className={className}>
            {children}
        </motion.div>
    );
};

// --- Landing Page Ricostruita e Potenziata ---
const LandingPage = ({ onLoginClick }: { onLoginClick: () => void }) => {
    const { t } = useLanguage();

    const features = [
        { icon: <Palette size={28} className="text-teal-400" />, title: "Art Battles", description: "Partecipa a sfide creative, vota le opere migliori e scala le classifiche per vincere premi." },
        { icon: <Sparkles size={28} className="text-purple-400" />, title: "AI Studio", description: "Usa la nostra IA avanzata per generare opere d'arte uniche partendo da semplici idee." },
        { icon: <ShoppingCart size={28} className="text-green-400" />, title: "Offerwall & Guadagni", description: "Completa semplici task e sondaggi per accumulare punti e aumentare i tuoi guadagni." },
    ];
    
    const steps = [
        { icon: <Bot size={32} />, title: "1. CREA", description: "Sfrutta l'intelligenza artificiale per dare vita a immagini e concetti unici." },
        { icon: <Award size={32} />, title: "2. COMPETI", description: "Metti alla prova le tue creazioni nelle Art Battles e fatti votare dalla community." },
        { icon: <Wallet size={32} />, title: "3. GUADAGNA", description: "Trasforma i tuoi punti e le tue vittorie in premi reali e prelevabili." },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white flex flex-col relative isolate">
            <AuroraBackground />
            
            <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-10">
                <Logo />
                <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSwitcher />
                    <button onClick={onLoginClick} className="font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block">{t.login_button || 'Login'}</button>
                    <button onClick={onLoginClick} className="font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors sm:hidden">Accedi</button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-16 pb-24 md:pt-20 md:pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-5xl md:text-7xl font-extrabold pb-3 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">Crea.</span> Vota. Guadagna.
                    </h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                        La tua creatività non è mai stata così preziosa. Dai vita a opere d'arte con l'IA, competi e ottieni premi reali.
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <button onClick={onLoginClick} className="relative group mt-12">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse"></div>
                        <div className="relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full flex items-center gap-2 text-lg">
                            Inizia Subito, è Gratis <ArrowRight className="inline-block transition-transform group-hover:translate-x-1"/>
                        </div>
                    </button>
                </motion.div>
            </main>
            
            <section className="w-full py-20 md:py-24 z-10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Come Funziona</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {steps.map((step, i) => (
                            <FadeInOnScroll key={i} delay={i * 0.2} className="text-center">
                                <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10 flex flex-col items-center">
                                    <div className="p-4 bg-gray-900 rounded-full mb-4 text-teal-400">{step.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="w-full py-20 md:py-24 z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
                        <FadeInOnScroll className="p-8 bg-gray-900/50 rounded-xl border border-white/10">
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-2">€<AnimatedCounter to={12845} /></h3>
                            <p className="text-gray-400 font-semibold">Totale Guadagnato dalla Community</p>
                        </FadeInOnScroll>
                        <FadeInOnScroll delay={0.2} className="p-8 bg-gray-900/50 rounded-xl border border-white/10">
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2"><AnimatedCounter to={25789} /></h3>
                            <p className="text-gray-400 font-semibold">Utenti Attivi</p>
                        </FadeInOnScroll>
                        <FadeInOnScroll delay={0.4} className="p-8 bg-gray-900/50 rounded-xl border border-white/10">
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2"><AnimatedCounter to={95240} /></h3>
                            <p className="text-gray-400 font-semibold">Opere d'Arte Create</p>
                        </FadeInOnScroll>
                    </div>
                </div>
            </section>

             <section className="w-full py-20 md:py-24 z-10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Un Ecosistema Completo per Guadagnare</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                             <FadeInOnScroll key={i} delay={i * 0.2}>
                                <div className="p-8 bg-gray-800/50 rounded-xl border border-white/10 h-full hover:border-teal-400 transition-colors duration-300">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                             </FadeInOnScroll>
                        ))}
                     </div>
                </div>
            </section>

            <footer className="w-full text-center p-8 text-sm text-gray-500 z-10 mt-12">
                <p>&copy; {new Date().getFullYear()} Zenith Rewards. {t.footer_text || 'Tutti i diritti riservati.'}</p>
            </footer>
        </div>
    );
};


function AppContent() {
    const [user, authLoading, authError] = useAuthState(auth);
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const [appData, setAppData] = useState<{
        pointsBalance: number | null;
        pendingBalance: number | null;
        leaderboard: LeaderboardUser[];
        streakInfo: StreakInfo | null;
        missions: Mission[];
    }>({
        pointsBalance: null, pendingBalance: null, leaderboard: [], streakInfo: null, missions: [],
    });

    const [appStatus, setAppStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const loadInitialData = useCallback(async (currentUser: User) => {
        setAppStatus('loading');
        try {
            // Sincronizza l'utente e ottiene i dati iniziali
            await fetch(`${BACKEND_URL}/sync_user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: currentUser.uid, 
                    email: currentUser.email, 
                    displayName: currentUser.displayName, 
                    avatar_url: currentUser.photoURL, 
                    referrer_id: sessionStorage.getItem('referrerId') 
                }),
            });

            // Carica in parallelo i dati della dashboard
            const [balanceRes, leaderboardRes, streakRes] = await Promise.all([
                fetch(`${BACKEND_URL}/get_user_balance/${currentUser.uid}`), // Endpoint ipotetico
                fetch(`${BACKEND_URL}/leaderboard`), // Endpoint ipotetico
                fetch(`${BACKEND_URL}/streak/status/${currentUser.uid}`), // Endpoint ipotetico
            ]);
            
            const balanceData = balanceRes.ok ? await balanceRes.json() : { points_balance: 0, pending_points_balance: 0 };
            
            setAppData({
                pointsBalance: balanceData.points_balance,
                pendingBalance: balanceData.pending_points_balance,
                leaderboard: leaderboardRes.ok ? await leaderboardRes.json() : [],
                streakInfo: streakRes.ok ? await streakRes.json() : { days: 0, canClaim: false },
                missions: [], // Carica le missioni se hai un endpoint
            });

            setAppStatus('ready');
            if (sessionStorage.getItem('referrerId')) sessionStorage.removeItem('referrerId');

        } catch (e) {
            console.error("Failed to initialize user session:", e);
            setAppStatus('error');
            setNotification({ id: Date.now(), message: 'Errore di connessione con il server.', type: 'error' });
        }
    }, []);
    
    useEffect(() => {
        if (user && !authLoading) {
            loadInitialData(user);
        } else if (!user && !authLoading) {
            setAppStatus('ready');
        }
    }, [user, authLoading, loadInitialData]);
    
    if (authLoading) {
      return <div className="flex items-center justify-center min-h-screen bg-gray-950"><LoaderCircle className="animate-spin h-12 w-12 text-teal-400" /></div>;
    }
    
    if (!user) {
      return (
          <>
              <LandingPage onLoginClick={() => setShowAuthModal(true)} />
              <AnimatePresence>
                {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
              </AnimatePresence>
          </>
      );
    }

    if (appStatus === 'loading') {
        return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4"><LoaderCircle className="animate-spin h-12 w-12 text-teal-400" /><span>Sincronizzazione account...</span></div>;
    }

    if (appStatus === 'error') {
        return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4 p-4 text-center"><AlertTriangle className="w-12 h-12 text-red-500"/><h2 className="text-2xl font-bold">Oops! Errore di Connessione</h2><p className="text-red-400">Impossibile caricare i dati. Controlla la tua connessione e riprova.</p><button onClick={() => loadInitialData(user)} className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500">Riprova</button></div>;
    }
    
    const renderContent = () => {
        // Unisci le props comuni per pulizia
        const commonProps = { user, showNotification: setNotification, isSynced: true };
        const dashboardProps = { ...commonProps, ...appData, onNavigate: setActivePage, refreshData: () => loadInitialData(user) };
        const payoutProps = { ...commonProps, pointsBalance: appData.pointsBalance, refreshBalance: () => loadInitialData(user) };
        
        // Aggiungi un wrapper con animazione per il cambio di pagina
        return (
            <AnimatePresence mode="wait">
                <motion.div key={activePage} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    {(() => {
                        switch (activePage) {
                            case 'dashboard': return <Dashboard {...dashboardProps} />;
                            case 'guadagna': return <Offerwall />;
                            case 'portafoglio': return <Payout {...payoutProps} />;
                            case 'invita': return <Referral {...commonProps} />;
                            case 'profile': return <Profile {...commonProps} />;
                            case 'settings': return <Settings {...commonProps} />;
                            case 'art-battles': return <ArtBattle {...commonProps} />;
                            case 'fucina': return <Fucina {...commonProps} />;
                            case 'ai-studio': return <AIStudioPage {...commonProps} />;
                            default: return <Dashboard {...dashboardProps} />;
                        }
                    })()}
                </motion.div>
            </AnimatePresence>
        );
    };
    
    return (
      <div className="flex min-h-screen bg-gray-950 text-white font-sans">
        <Sidebar 
            onLoginClick={() => setShowAuthModal(true)} // <-- AGGIUNGI QUESTA RIGA
            user={user} 
            activePage={activePage} 
            setActivePage={setActivePage} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
        />
        <main className="flex-1 flex flex-col w-full lg:ml-64">
            <header className="w-full p-4 flex justify-between items-center lg:hidden sticky top-0 bg-gray-900/80 backdrop-blur-sm z-30 border-b border-gray-800">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                    <Menu size={24} />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Logo />
                </div>
                {/* Spazio vuoto per bilanciare */}
                <div className="w-8"></div>
            </header>
            <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8">
                {renderContent()}
            </div>
        </main>
        <AnimatePresence>
            {notification && (
                <NotificationToast
                 key={notification.id} // Usa l'id come "key" speciale per React
                    message={notification.message}
                    type={notification.type}
                    onDismiss={() => setNotification(null)}
                />
            )}
        </AnimatePresence>
      </div>
    );
}

export default function HomePage() {
    return (
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    );
}