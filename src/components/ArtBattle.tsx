// src/components/ArtBattle.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, LoaderCircle, X, Sparkles } from 'lucide-react'; // <--- MODIFICA QUI: Aggiunto Sparkles
import NotificationToast from './NotificationToast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Importa i nuovi componenti
import CreationStudio from './CreationStudio';
import ContestBanner from './ContestBanner';
import ContentFeed from './ContentFeed';

// Importa i tipi da un file centrale
import type { AIContent, Contest, Notification } from '../types';

// --- Costanti e Setup Stripe ---
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// --- Componente Principale ArtBattle ---
export default function ArtBattle({ user }: { user: User | null }) {
    // Stati per i dati
    const [feed, setFeed] = useState<AIContent[]>([]);
    const [contest, setContest] = useState<Contest | null>(null);
    const [isLoadingFeed, setIsLoadingFeed] = useState(true);

    // Stati per il tool di generazione
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationResult, setGenerationResult] = useState<AIContent | null>(null);

    // Stati per il flusso di pagamento
    const [paymentMethod, setPaymentMethod] = useState<'points' | 'stripe' | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    
    // Stato per le notifiche
    const [notification, setNotification] = useState<Notification | null>(null);

    // Stati per i pannelli collapsable
    const [isStudioOpen, setIsStudioOpen] = useState(true);
    const [isContestOpen, setIsContestOpen] = useState(true);

    // Caricamento dati iniziali (feed e contest)
    const fetchData = useCallback(async () => {
        setIsLoadingFeed(true);
        try {
            const [feedRes, contestRes] = await Promise.all([
                fetch(`${BACKEND_URL}/ai/content/feed`),
                fetch(`${BACKEND_URL}/contests/current`)
            ]);
            if (feedRes.ok) setFeed(await feedRes.json());
            if (contestRes.ok) setContest(await contestRes.json());
        } catch (err) { setNotification({ message: "Impossibile caricare i contenuti.", type: 'error' });
        } finally { setIsLoadingFeed(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Gestione della Generazione AI (Passata a CreationStudio)
    const handleGenerate = async (prompt: string, contentType: 'IMAGE' | 'POST' | 'VIDEO', payMethod: 'points' | 'stripe') => {
        if (!user || !prompt) {
            setNotification({ message: "Per favore, inserisci un prompt e assicurati di essere loggato.", type: 'error' });
            return;
        }
        setIsGenerating(true);
        setPaymentMethod(payMethod);

        try {
            const res = await fetch(`${BACKEND_URL}/ai/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid, prompt, content_type: contentType, payment_method: payMethod, contest_id: contest?.id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);

            if (data.payment_required) {
                setClientSecret(data.client_secret);
            } else {
                setGenerationResult(data);
            }
        } catch (err) {
            setNotification({ message: (err as Error).message, type: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };
    
    // Pubblica un contenuto
    const handlePublish = async (contentId: number) => {
        try {
            const res = await fetch(`${BACKEND_URL}/ai/content/${contentId}/publish`, { method: 'POST' });
            if (!res.ok) throw new Error("Pubblicazione fallita.");
            setNotification({ message: "La tua opera è ora pubblica!", type: 'success' });
            setGenerationResult(null); // Chiude il modal del risultato
            fetchData(); // Aggiorna il feed
        } catch (err) {
            setNotification({ message: (err as Error).message, type: 'error' });
        }
    };

    // Vota un contenuto
    const handleVote = async (contentId: number) => {
        if (!user) {
            setNotification({ message: "Devi essere loggato per votare.", type: 'error' });
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/ai/content/${contentId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Impossibile votare il contenuto.");
            }
            setNotification({ message: "Voto registrato con successo!", type: 'success' });
            fetchData(); // Aggiorna il feed per riflettere il nuovo voto
        } catch (err) {
            setNotification({ message: (err as Error).message, type: 'error' });
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white min-h-screen w-full">
            {/* Header */}
            <header className="text-center mb-12 animate-fade-in-down">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-500 flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 md:w-12 md:h-12" /> Art Battles & Creation Studio
                </h1>
                <p className="text-gray-400 mt-3 text-lg">Crea, competi e scala le classifiche con il potere dell'IA.</p>
            </header>

            {/* Tool di Creazione AI */}
            <CreationStudio
                user={user}
                contestId={contest?.id || null}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                paymentMethod={paymentMethod}
                onShowNotification={(msg, type) => setNotification({ message: msg, type: type })}
                isOpen={isStudioOpen}
                onToggle={() => setIsStudioOpen(!isStudioOpen)}
            />

            {/* Banner Contest */}
            {contest && (
                <ContestBanner
                    themePrompt={contest.theme_prompt}
                    isOpen={isContestOpen}
                    onToggle={() => setIsContestOpen(!isContestOpen)}
                />
            )}
            
            {/* Feed Social */}
            <ContentFeed feed={feed} isLoadingFeed={isLoadingFeed} onVote={handleVote} currentUserUid={user?.uid || null} />

            {/* MODAL per Pagamento Stripe */}
            <AnimatePresence>
                {clientSecret && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-800 p-8 rounded-lg w-full max-w-md relative">
                            <button onClick={() => setClientSecret(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X/></button>
                            <h3 className="text-lg font-semibold mb-4 text-center">Completa il pagamento sicuro</h3>
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm />
                            </Elements>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* MODAL per Risultato Generazione e Piano Virale */}
            <AnimatePresence>
                {generationResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl relative border border-purple-500/50">
                            <button onClick={() => setGenerationResult(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X/></button>
                            <h2 className="text-2xl font-bold mb-4">Generazione Completata!</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-2">La tua Creazione:</h3>
                                    {generationResult.content_type === 'IMAGE' && generationResult.generated_url && <img src={generationResult.generated_url} alt={generationResult.prompt} className="rounded-lg w-full h-auto max-h-[300px] object-contain"/>}
                                    {generationResult.content_type === 'POST' && generationResult.generated_text && <p className="p-4 bg-gray-900 rounded-lg whitespace-pre-wrap max-h-[300px] overflow-y-auto">{generationResult.generated_text}</p>}
                                    {generationResult.content_type === 'VIDEO' && generationResult.generated_url && <video controls src={generationResult.generated_url} className="rounded-lg w-full h-auto max-h-[300px] object-contain"></video>}
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-lg flex flex-col">
                                    <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={18} className="text-purple-400"/> Piano per la Viralità</h3>
                                    <p className="text-sm text-gray-300 whitespace-pre-wrap flex-grow overflow-y-auto">{generationResult.ai_strategy_plan}</p>
                                </div>
                            </div>
                            <button onClick={() => handlePublish(generationResult.id)} className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">Pubblica nella Galleria</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {notification && <NotificationToast {...notification} onDismiss={() => setNotification(null)} />}
        </div>
    );
}