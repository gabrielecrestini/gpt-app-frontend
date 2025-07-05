"use client";
import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence, useInView, Easing, Transition } from 'framer-motion';

// Import componenti e icone
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

// Import Icone Lucide (Assicurati che siano tutte installate)
import {
    LoaderCircle, Wallet, Sparkles, Target, ArrowRight, Menu, ChevronDown, Award, Users, Bot, AlertTriangle, Palette, ShoppingCart,
    Image as ImageIcon, FileText, Video, Euro, LayoutDashboard, Brain, TrendingUp, Trophy, CheckCircle, XCircle, Globe
} from 'lucide-react';

// URL del backend, assicurati che NON termini con una barra '/'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

// --- Componenti per la Landing Page (Puliti e Responsive) ---

const LogoLanding = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-3 group ${className}`}>
        <div className="w-10 h-10 flex items-center justify-center">
            <div className="relative w-8 h-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-12deg]">
                <div className="absolute w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-lg" style={{ transform: 'skew(-15deg)' }}></div>
                <div className="absolute w-[90%] h-[90%] top-[5%] left-[5%] bg-gray-900 rounded-md" style={{ transform: 'skew(-15deg)' }}></div>
                <div className="absolute w-1.5 h-full bg-gradient-to-b from-teal-400 to-blue-500 rounded-lg top-0 left-1/2 -translate-x-1/2" style={{ transform: 'skew(-15deg)' }}></div>
            </div>
        </div>
        <span className="font-bold text-2xl text-white tracking-wide">Zenith Rewards</span>
    </div>
);

const LanguageSwitcher = () => {
    const { lang, setLang, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = languages.find(l => l.code === lang);

    return (
        <div className="relative z-20"> {/* Aumenta z-index per dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-white text-sm md:text-base"
            >
                <span>{currentLang?.flag || <Globe size={18}/>}</span>
                <span className="hidden md:inline">{currentLang?.label}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-36 md:w-40 bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden"
                    >
                        {languages.map(l => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code); setIsOpen(false); }}
                                className="w-full text-left px-4 py-2 hover:bg-purple-600/30 transition-colors flex items-center gap-3 text-sm"
                            >
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
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
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

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, gradient, delay }: FeatureCardProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    const cardTransition: Transition = {
        duration: 0.7,
        delay: delay,
        ease: "easeOut" as Easing,
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: cardTransition,
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className={`flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg ${gradient} bg-opacity-10 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 cursor-pointer`}
        >
            <div className={`p-4 rounded-full mb-4 flex items-center justify-center border border-white/20`} style={{ background: gradient }}>
                <Icon size={36} className="text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-300 text-sm md:text-base">{description}</p>
        </motion.div>
    );
};


const LandingPage = ({ onLoginClick }: { onLoginClick: () => void }) => {
    const { t } = useLanguage();

    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: "easeOut" as Easing,
                staggerChildren: 0.2
            }
        }
    };

    const ctaButtonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: 1.2,
                ease: "easeOut" as Easing,
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white flex flex-col relative isolate overflow-x-hidden">
            <AuroraBackground />

            <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-10 border-b border-white/5">
                <LogoLanding />
                <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSwitcher />
                    <button
                        onClick={onLoginClick}
                        className="font-semibold px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm md:text-base"
                    >
                        {t.login_button || 'Accedi'}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-16 pb-24 md:pt-20 md:pb-32">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                    className="max-w-4xl mx-auto"
                >
                    <motion.h1 variants={heroVariants} className="text-5xl md:text-7xl font-extrabold pb-3 tracking-tight leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">Crea.</span> <br className="sm:hidden"/> Vota. Guadagna.
                    </motion.h1>
                    <motion.p variants={heroVariants} className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        La tua creatività non è mai stata così preziosa. Dai vita a opere d'arte con l'IA, competi e ottieni premi reali.
                    </motion.p>
                    <motion.div variants={ctaButtonVariants} className="mt-12">
                        <button onClick={onLoginClick} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            <div className="relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full flex items-center gap-2 text-lg md:text-xl">
                                Inizia Subito, è Gratis <ArrowRight className="inline-block transition-transform group-hover:translate-x-1" />
                            </div>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Sezione Funzionalità */}
                <section className="w-full max-w-7xl mx-auto mt-28 md:mt-36 px-4 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
                        Sblocca il Tuo Vero Potenziale con Zenith Rewards
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        <FeatureCard
                            icon={Brain}
                            title="AI Studio Creativo"
                            description="Trasforma le tue idee in immagini, testi e video mozzafiato con il potere dell'intelligenza artificiale."
                            gradient="linear-gradient(to right, #a855f7, #6d28d9)"
                            delay={0.1}
                        />
                         <FeatureCard
                            icon={Trophy}
                            title="Competi in Art Battles"
                            description="Metti alla prova le tue creazioni, vota le opere degli altri utenti e scala le classifiche per vincere premi esclusivi."
                            gradient="linear-gradient(to right, #ec4899, #d946ef)"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Euro}
                            title="Guadagni Reali & Prelievi Facili"
                            description="Accumula Zenith Coins completando offerte e sondaggi, poi preleva i tuoi guadagni in denaro reale."
                            gradient="linear-gradient(to right, #10b981, #059669)"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="AI Business Assistant"
                            description="Ottieni strategie su misura per il tuo business, consigli per i social media, dropshipping e molto altro."
                            gradient="linear-gradient(to right, #3b82f6, #2563eb)"
                            delay={0.4}
                        />
                    </div>
                </section>
            </main>

            <footer className="w-full text-center p-8 text-sm text-gray-500 z-10 border-t border-white/5">
                <p>&copy; {new Date().getFullYear()} Zenith Rewards. {t.footer_text || 'Tutti i diritti riservati.'}</p>
            </footer>
        </div>
    );
};


// --- Type Definitions ---
type LeaderboardUser = { name: string; earnings: number; avatar: string; };
type StreakInfo = { days: number; canClaim: boolean; };
type Mission = { id: number; title: string; progress: number; target: number; reward: number; };

type Notification = { id: number; message: string; type: 'success' | 'error'; };

type AppData = {
    pointsBalance: number;
    pendingBalance: number;
    leaderboard: LeaderboardUser[];
    streakInfo: StreakInfo;
    userPlan: 'free' | 'premium' | 'assistant';
    dailyGenerationsUsed: number;
    missions: Mission[];
    dailyVotesUsed: number;
};

const initialAppData: AppData = {
    pointsBalance: 0,
    pendingBalance: 0,
    leaderboard: [],
    streakInfo: { days: 0, canClaim: false },
    userPlan: 'free',
    dailyGenerationsUsed: 0,
    missions: [],
    dailyVotesUsed: 0,
};

const LogoApp = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-2 group ${className}`}>
        <div className="w-8 h-8 flex items-center justify-center">
            <div className="relative w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-12deg]">
                <div className="absolute w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-lg" style={{ transform: 'skew(-15deg)' }}></div>
                <div className="absolute w-[90%] h-[90%] top-[5%] left-[5%] bg-gray-900 rounded-md" style={{ transform: 'skew(-15deg)' }}></div>
            </div>
        </div>
        <span className="font-bold text-lg text-white">Zenith</span>
    </div>
);

// Nuovi tipi per la diagnostica
type LoadingStepStatus = 'pending' | 'success' | 'error';
type LoadingStep = {
    id: string;
    label: string;
    status: LoadingStepStatus;
    error?: string;
};

function AppContent() {
    const [user, authLoading] = useAuthState(auth);
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [appData, setAppData] = useState<AppData>(initialAppData);
    const [appStatus, setAppStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [appError, setAppError] = useState<string | null>(null);

    const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([]);

    const addNotification = (message: string, type: Notification['type'] = 'error') => {
        setNotification({ id: Date.now(), message, type });
    };

    const updateLoadingStep = useCallback((id: string, status: LoadingStepStatus, labelSuffix?: string, error?: string) => {
        setLoadingSteps(prevSteps => {
            const baseLabel = id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const finalLabel = labelSuffix ? `${baseLabel}: ${labelSuffix}` : baseLabel;
            const existingStepIndex = prevSteps.findIndex(step => step.id === id);

            if (existingStepIndex > -1) {
                return prevSteps.map((step, index) =>
                    index === existingStepIndex ? { ...step, status, label: finalLabel, error } : step
                );
            } else {
                return [...prevSteps, { id, label: finalLabel, status, error }];
            }
        });
    }, []);

    const loadInitialData = useCallback(async (currentUser: User) => {
        setAppStatus('loading');
        setLoadingSteps([]); // Resetta i passi all'inizio
        setAppError(null);

        // Funzione helper per fetch con diagnostica
        const diagnosticFetch = async (id: string, url: string, method: string = 'GET', body?: any) => {
            updateLoadingStep(id, 'pending', `Connessione a ${url.split('/').slice(-2).join('/')}...`);
            try {
                const options: RequestInit = {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: body ? JSON.stringify(body) : undefined,
                };
                const res = await fetch(url, options);
                
                if (!res.ok) {
                    const errorBody = await res.json().catch(() => ({ detail: `HTTP status: ${res.status}` }));
                    let errorMessage = `Errore ${res.status}`;
                    if (errorBody.detail) errorMessage += ` - ${errorBody.detail}`;
                    if (errorBody.message) errorMessage += ` - ${errorBody.message}`;

                    updateLoadingStep(id, 'error', errorMessage, errorMessage);
                    throw new Error(errorMessage);
                }
                const data = await res.json();
                updateLoadingStep(id, 'success', `Completato.`);
                return { key: id, data: data }; // Modificato per restituire un oggetto con 'key' e 'data'
            } catch (e: any) {
                const fullErrorMsg = `Errore di rete/server: ${e.message}`;
                updateLoadingStep(id, 'error', fullErrorMsg, fullErrorMsg);
                // Non rilanciare l'errore completo qui, ma un oggetto per allSettled
                // altrimenti .then() non viene chiamato per i casi di errore gestiti
                return { key: id, error: e.message }; // Modificato per restituire un oggetto con 'key' e 'error'
            }
        };

        let isCriticalFailure = false;

        // 1. Sync User (prima e fondamentale)
        try {
            await diagnosticFetch(
                'userSync',
                `${BACKEND_URL}/sync_user`,
                'POST',
                { user_id: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, avatar_url: currentUser.photoURL, referrer_id: sessionStorage.getItem('referrerId') }
            );
            updateLoadingStep('userSync', 'success', 'Utente sincronizzato.');
            if (sessionStorage.getItem('referrerId')) {
                sessionStorage.removeItem('referrerId');
            }
        } catch (e: any) {
            isCriticalFailure = true;
            addNotification("Sincronizzazione critica del profilo fallita. Riprova.", 'error');
            setAppError(`Sincronizzazione iniziale fallita: ${e.message}`);
            // Non terminare subito, permettiamo agli altri passi di mostrare lo stato
        }


        // 2. Richieste parallele per i dati della dashboard
        const dataPromises = [
            diagnosticFetch('balance', `${BACKEND_URL}/get_user_balance/${currentUser.uid}`),
            diagnosticFetch('leaderboard', `${BACKEND_URL}/leaderboard`),
            diagnosticFetch('streak', `${BACKEND_URL}/streak/status/${currentUser.uid}`),
            diagnosticFetch('profile', `${BACKEND_URL}/users/${currentUser.uid}/profile`),
            // Il contest ora può restituire 404 senza essere un errore critico
            diagnosticFetch('contest', `${BACKEND_URL}/contests/current/${currentUser.uid}`),
            diagnosticFetch('shopItems', `${BACKEND_URL}/shop/items`),
        ];

        const results = await Promise.allSettled(dataPromises); // Passa l'array di promises direttamente
        
        const newAppData: AppData = { ...initialAppData };
        let hasMajorErrorInParallelFetches = false;

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                const fetchedResult = result.value; // Questo è l'oggetto { key, data } o { key, error }
                
                if ('data' in fetchedResult) { // È un risultato di successo (con dati)
                    const { key, data } = fetchedResult;

                    if (key === 'contest' && data === null) { // Contest non trovato (successo gestito)
                        return; // Non aggiornare appData, ma il passo è già successo
                    }

                    switch (key) {
                        case 'balance':
                            newAppData.pointsBalance = data?.points_balance || 0;
                            newAppData.pendingBalance = data?.pending_points_balance || 0;
                            break;
                        case 'leaderboard':
                            if (Array.isArray(data)) {
                                newAppData.leaderboard = data.map((userFromApi: any) => ({
                                    name: userFromApi.display_name,
                                    earnings: userFromApi.points_balance,
                                    avatar: userFromApi.avatar_url,
                                }));
                            }
                            break;
                        case 'streak':
                            newAppData.streakInfo = {
                                days: data?.login_streak || 0,
                                canClaim: data?.can_claim || false,
                            };
                            break;
                        case 'profile':
                            newAppData.userPlan = data?.subscription_plan || 'free';
                            newAppData.dailyGenerationsUsed = data?.daily_ai_generations_used || 0;
                            newAppData.dailyVotesUsed = data?.daily_votes_used || 0;
                            break;
                        case 'shopItems':
                            // shopItems non va in appData ma è stato recuperato con successo.
                            // La sua presenza qui indica che il fetch è avvenuto.
                            break;
                        default:
                            break;
                    }
                } else { // fetchedResult contiene 'error'
                    hasMajorErrorInParallelFetches = true;
                }
            } else { // result.status === 'rejected' (la Promise è stata veramente rejected)
                hasMajorErrorInParallelFetches = true;
            }
        });
        
        setAppData(newAppData);
        if (isCriticalFailure || hasMajorErrorInParallelFetches) {
            setAppStatus('error');
            if (!appError) setAppError("Si sono verificati errori durante il caricamento dei dati. Controlla i dettagli sopra.");
        } else {
            setAppStatus('ready');
            setAppError(null);
        }

    }, [updateLoadingStep, appError]);

    useEffect(() => {
        if (user && !authLoading) {
            loadInitialData(user);
        } else if (!user && !authLoading) {
            setAppStatus('ready');
        }
    }, [user, authLoading, loadInitialData]);

    if (authLoading || (appStatus === 'loading' && user)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-8 p-4 md:p-8">
                <LoaderCircle className="animate-spin h-16 w-16 text-teal-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-300">Sincronizzazione account in corso...</h2>
                <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
                    <h3 className="text-xl font-semibold mb-6 text-gray-200">Passi di Inizializzazione:</h3>
                    <ul className="space-y-4">
                        {loadingSteps.map(step => (
                            <li key={step.id} className="flex items-start gap-4">
                                <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full
                                    ${step.status === 'pending' ? 'bg-blue-500' : ''}
                                    ${step.status === 'success' ? 'bg-green-500' : ''}
                                    ${step.status === 'error' ? 'bg-red-500' : ''}`
                                }>
                                    {step.status === 'pending' && <LoaderCircle size={18} className="animate-spin text-white" />}
                                    {step.status === 'success' && <CheckCircle size={18} className="text-white" />}
                                    {step.status === 'error' && <XCircle size={18} className="text-white" />}
                                </span>
                                <div className="flex-1">
                                    <p className={`font-medium text-base ${step.status === 'error' ? 'text-red-300' : 'text-gray-200'}`}>
                                        {step.label}
                                    </p>
                                    {step.error && (
                                        <p className="text-xs text-red-400 mt-1 max-w-full overflow-hidden text-ellipsis whitespace-normal break-words">
                                            Errore: {step.error}
                                            {(step.error.includes('HTTP status: 500') || step.error.includes('Database error') || step.error.includes('network')) && (
                                                <span className="block mt-1 font-semibold text-white/80">
                                                    (Controlla i log di Render del backend per il traceback completo!)
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
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

    if (appStatus === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4 p-4 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-3xl font-bold">Oops! Errore di Caricamento Dati</h2>
                <p className="text-red-400 max-w-lg mx-auto mb-6">{appError || "Si è verificato un errore generico durante il caricamento dei dati iniziali."}</p>
                <button
                    onClick={() => user && loadInitialData(user)}
                    className="mt-4 px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 font-semibold transition-colors flex items-center gap-2"
                >
                    <LoaderCircle size={20} className="animate-spin-slow"/> Riprova Caricamento
                </button>
                <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 mt-8 text-left">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Dettagli Ultimi Passi:</h3>
                    <ul className="space-y-3">
                        {loadingSteps.map(step => (
                            <li key={step.id} className="flex items-start gap-4">
                                <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full
                                    ${step.status === 'pending' ? 'bg-blue-500' : ''}
                                    ${step.status === 'success' ? 'bg-green-500' : ''}
                                    ${step.status === 'error' ? 'bg-red-500' : ''}`
                                }>
                                    {step.status === 'pending' && <LoaderCircle size={18} className="animate-spin text-white" />}
                                    {step.status === 'success' && <CheckCircle size={18} className="text-white" />}
                                    {step.status === 'error' && <XCircle size={18} className="text-white" />}
                                </span>
                                <div className="flex-1">
                                    <p className={`font-medium text-base ${step.status === 'error' ? 'text-red-300' : 'text-gray-200'}`}>
                                        {step.label}
                                    </p>
                                    {step.error && (
                                        <p className="text-xs text-red-400 mt-1 max-w-full overflow-hidden text-ellipsis whitespace-normal break-words">
                                            Errore: {step.error}
                                            {(step.error.includes('HTTP status: 500') || step.error.includes('Database error') || step.error.includes('network')) && (
                                                <span className="block mt-1 font-semibold text-white/80">
                                                    (Controlla i log di Render del backend per il traceback completo!)
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        const commonProps = { user, setNotification: addNotification, isSynced: appStatus === 'ready' };
        const dashboardProps = { ...commonProps, ...appData, onNavigate: setActivePage, refreshData: () => user && loadInitialData(user) };
        const payoutProps = { ...commonProps, pointsBalance: appData.pointsBalance, refreshBalance: () => user && loadInitialData(user) };
        const aiStudioProps = { ...commonProps, userPlan: appData.userPlan, dailyGenerationsUsed: appData.dailyGenerationsUsed, refreshData: () => user && loadInitialData(user)};
        const artBattleProps = { ...commonProps, currentUserUid: user.uid, refreshData: () => user && loadInitialData(user)};
        const fucinaProps = { ...commonProps };

        const pageMap: { [key: string]: ReactNode } = {
            'dashboard': <Dashboard {...dashboardProps} />,
            'guadagna': <Offerwall />,
            'portafoglio': <Payout {...payoutProps} />,
            'invita': <Referral user={user} />,
            'profile': <Profile {...commonProps} />,
            'settings': <Settings user={user} />,
            'art-battles': <ArtBattle {...artBattleProps} />,
            'fucina': <Fucina {...fucinaProps} />,
            'ai-studio': <AIStudioPage {...aiStudioProps} />,
        };
        return pageMap[activePage] || <Dashboard {...dashboardProps} />;
    };

    return (
        <div className="flex min-h-screen bg-gray-950 text-white font-sans">
            <Sidebar user={user} activePage={activePage} setActivePage={setActivePage} onLoginClick={() => setShowAuthModal(true)} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 flex flex-col w-full">
                <header className="w-full p-4 flex justify-between items-center lg:hidden sticky top-0 bg-gray-950/80 backdrop-blur-sm z-30 border-b border-white/10">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2"><Menu size={24} /></button>
                    <div className="absolute left-1/2 -translate-x-1/2"><LogoApp /></div>
                    <div className="w-8"></div>
                </header>
                <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            <AnimatePresence>
                {notification && (
                    <NotificationToast
                        key={notification.id}
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