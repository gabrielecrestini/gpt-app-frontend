"use client";
import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { User, updateProfile } from 'firebase/auth';
import { LanguageProvider, useLanguage, Language } from '../context/LanguageContext';
import { motion, useInView, useAnimate, AnimatePresence } from 'framer-motion';

// Import all necessary components
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

// CORRECTED: Added 'Palette' to the import list
import { LoaderCircle, Wallet, Sparkles, Target, ArrowRight, Menu, ChevronDown, Award, Users, Bot, Palette, ShoppingCart, AlertTriangle } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

// --- Type Definitions ---
type LeaderboardUser = { name: string; earnings: number; avatar: string; };
type StreakInfo = { days: number; canClaim: boolean; };
type Mission = { id: number; title: string; progress: number; target: number; reward: number; };
type Notification = { id: number; message: string; type: 'success' | 'error'; };

// --- Sub-components for UI & Animations ---

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
            animate(0, to, { duration: 2, ease: "easeOut", onUpdate: (latest) => { if (scope.current) scope.current.textContent = Math.round(latest).toLocaleString('it-IT'); } });
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

const LandingPage = ({ onLoginClick }: { onLoginClick: () => void }) => {
    const { t } = useLanguage();
    const features = [
        { icon: <Palette size={28} className="text-teal-400" />, title: "Art Battles", description: "Partecipa a sfide creative, vota le opere migliori e scala le classifiche per vincere premi." },
        { icon: <Sparkles size={28} className="text-purple-400" />, title: "AI Studio", description: "Usa la nostra IA avanzata per generare opere d'arte uniche e strategie di marketing." },
        { icon: <Wallet size={28} className="text-green-400" />, title: "Offerwall & Guadagni", description: "Completa semplici task e sondaggi per accumulare punti e aumentare i tuoi guadagni." },
    ];
    
    return (
        <div className="w-full min-h-screen bg-gray-950 text-white flex flex-col relative isolate">
            <AuroraBackground />
            <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-10">
                <Logo />
                <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSwitcher />
                    <button onClick={onLoginClick} className="font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">{t.login_button || 'Accedi'}</button>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-16 pb-24 md:pt-20 md:pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-5xl md:text-7xl font-extrabold pb-3 tracking-tighter"><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">Crea.</span> Vota. Guadagna.</h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">La tua creatività non è mai stata così preziosa. Dai vita a opere d'arte con l'IA, competi e ottieni premi reali.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <button onClick={onLoginClick} className="relative group mt-12"><div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div><div className="relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full flex items-center gap-2 text-lg">Inizia Subito, è Gratis <ArrowRight className="inline-block transition-transform group-hover:translate-x-1"/></div></button>
                </motion.div>
            </main>
        </div>
    );
};

// --- Main Application Logic Component ---
function AppContent() {
    const [user, authLoading, authError] = useAuthState(auth);
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const [appData, setAppData] = useState({
        pointsBalance: null as number | null,
        pendingBalance: null as number | null,
        leaderboard: [] as LeaderboardUser[],
        streakInfo: null as StreakInfo | null,
        missions: [] as Mission[],
        userPlan: 'free' as 'free' | 'premium' | 'assistant',
        dailyGenerationsUsed: 0,
    });
    const [appStatus, setAppStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [appError, setAppError] = useState<string | null>(null);

    const loadInitialData = useCallback(async (currentUser: User) => {
        setAppStatus('loading');
        try {
            await fetch(`${BACKEND_URL}/sync_user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, avatar_url: currentUser.photoURL, referrer_id: sessionStorage.getItem('referrerId') }),
            });
            
            const [balanceRes, leaderboardRes, streakRes, userProfileRes] = await Promise.all([
               fetch(`${BACKEND_URL}/get_user_balance/${currentUser.uid}`),
               fetch(`${BACKEND_URL}/leaderboard`),
               fetch(`${BACKEND_URL}/streak/status/${currentUser.uid}`),
               fetch(`${BACKEND_URL}/users/${currentUser.uid}/profile`),
            ]);
            
            if (!balanceRes.ok || !leaderboardRes.ok || !streakRes.ok || !userProfileRes.ok) throw new Error("Failed to load core data from the server.");

            const balanceData = await balanceRes.json();
            const leaderboardData = await leaderboardRes.json();
            const streakData = await streakRes.json();
            const userProfileData = await userProfileRes.json();
            
            setAppData({
                pointsBalance: balanceData.points_balance,
                pendingBalance: balanceData.pending_points_balance,
                leaderboard: leaderboardData,
                streakInfo: streakData,
                missions: [],
                userPlan: userProfileData.subscription_plan || 'free',
                dailyGenerationsUsed: userProfileData.daily_ai_generations_used || 0,
            });

            if (sessionStorage.getItem('referrerId')) sessionStorage.removeItem('referrerId');
            setAppStatus('ready');
        } catch (e: any) {
            console.error("Failed to initialize user session:", e);
            setAppError(e.message || "Could not connect to the server.");
            setAppStatus('error');
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
    if (authError) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-500"><p>Authentication Error: {authError.message}</p></div>;
    }
    
    if (!user) {
        return (
            <>
                <LandingPage onLoginClick={() => setShowAuthModal(true)} />
                <AnimatePresence>{showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}</AnimatePresence>
            </>
        );
    }

    if (appStatus === 'loading') {
        return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4"><LoaderCircle className="animate-spin h-12 w-12 text-teal-400" /><span>Syncing account...</span></div>;
    }

    if (appStatus === 'error') {
        return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4 p-4 text-center"><AlertTriangle className="w-12 h-12 text-red-500"/><h2 className="text-2xl font-bold">Oops! Connection Error</h2><p className="text-red-400">{appError}</p><button onClick={() => loadInitialData(user)} className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500">Retry</button></div>;
    }
    
    const renderContent = () => {
        const commonProps = { user, isSynced: true, setNotification };
        const dashboardProps = { ...commonProps, ...appData, onNavigate: setActivePage, refreshData: () => loadInitialData(user) };
        const payoutProps = { ...commonProps, pointsBalance: appData.pointsBalance, refreshBalance: () => loadInitialData(user) };
        const aiStudioProps = { ...commonProps, userPlan: appData.userPlan, dailyGenerationsUsed: appData.dailyGenerationsUsed, fetchUserData: () => loadInitialData(user)};

        return (
            <AnimatePresence mode="wait">
                <motion.div key={activePage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    {(() => {
                        switch (activePage) {
                            case 'dashboard': return <Dashboard {...dashboardProps} />;
                            case 'guadagna': return <Offerwall />;
                            case 'portafoglio': return <Payout {...payoutProps} />;
                            case 'invita': return <Referral user={user} />;
                            case 'profile': return <Profile {...commonProps} />;
                            case 'settings': return <Settings user={user} />;
                            case 'art-battles': return <ArtBattle {...commonProps} />;
                            case 'fucina': return <Fucina {...commonProps} />;
                            case 'ai-studio': return <AIStudioPage {...aiStudioProps} />;
                            default: return <Dashboard {...dashboardProps} />;
                        }
                    })()}
                </motion.div>
            </AnimatePresence>
        );
    };
    
    return (
        <div className="flex min-h-screen bg-gray-950 text-white font-sans">
            <Sidebar user={user} activePage={activePage} setActivePage={setActivePage} onLoginClick={() => setShowAuthModal(true)} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 flex flex-col w-full lg:ml-64">
                <header className="w-full p-4 flex justify-between items-center lg:hidden sticky top-0 bg-gray-900/80 backdrop-blur-sm z-30 border-b border-gray-800"><button onClick={() => setIsSidebarOpen(true)} className="text-white p-2"><Menu size={24} /></button><div className="absolute left-1/2 -translate-x-1/2"><Logo /></div><div className="w-8"></div></header>
                <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8">{renderContent()}</div>
            </main>
            <AnimatePresence>{notification && (<NotificationToast key={notification.id} message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />)}</AnimatePresence>
        </div>
    );
}

export default function HomePage() {
    return ( <LanguageProvider> <AppContent /> </LanguageProvider> );
}