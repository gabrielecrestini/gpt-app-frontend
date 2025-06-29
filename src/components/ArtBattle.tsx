// src/components/ArtBattle.tsx
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Sparkles, BrainCircuit, Image as ImageIcon, Send, LoaderCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';

type Contest = {
    id: number;
    theme_prompt: string;
    end_date: string;
};

// --- Sotto-componente: Animazione di generazione AI ---
const GeneratingAnimation = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-teal-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-teal-400 rounded-full animate-spin"></div>
                <div className="absolute inset-2 flex items-center justify-center">
                    <BrainCircuit className="w-10 h-10 text-teal-400" />
                </div>
            </div>
            <p className="mt-4 text-gray-300 font-semibold">{t.art_battle_generating}</p>
        </div>
    );
}

export default function ArtBattle({ user, isSynced }: { user: User | null; isSynced: boolean; }) {
    const { t } = useLanguage();
    const [contest, setContest] = useState<Contest | null>(null);
    const [prompt, setPrompt] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

    useEffect(() => {
        if (isSynced) {
            const fetchContest = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`${BACKEND_URL}/contests/current`);
                    if (!res.ok) throw new Error(t.art_battle_error_no_contest);
                    const data = await res.json();
                    setContest(data);
                    setPrompt(data.theme_prompt); 
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchContest();
        }
    }, [isSynced, t]);

    const handleGenerateImage = async () => {
        if (!prompt || !user || !contest) return;
        setIsGenerating(true);
        setError('');
        setSuccessMessage('');
        setGeneratedImageUrl(null);

        try {
            const res = await fetch(`${BACKEND_URL}/contests/generate_image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid, prompt: prompt, contest_id: contest.id })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || t.art_battle_error_generation_failed);
            }
            const data = await res.json();
            setGeneratedImageUrl(data.image_url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmitToContest = async () => {
        if (!generatedImageUrl || !user || !contest) return;
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
             const res = await fetch(`${BACKEND_URL}/contests/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contest_id: contest.id,
                    user_id: user.uid,
                    image_url: generatedImageUrl,
                    prompt: prompt
                })
            });
             if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || t.art_battle_error_submit_failed);
            }
            setSuccessMessage(t.art_battle_submit_success);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><LoaderCircle className="animate-spin h-12 w-12" /></div>;
    }

    return (
        <div className="w-full max-w-7xl animate-fade-in-up p-4">
            <header className="text-center mb-10">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center gap-3">
                    <Sparkles/>{t.art_battle_title}
                </h1>
                <p className="text-gray-400 mt-2">{t.art_battle_subtitle}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Colonna di Creazione */}
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg space-y-6">
                    <h2 className="text-2xl font-bold">{t.art_battle_studio_title}</h2>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">{t.art_battle_theme_of_day}</p>
                        <p className="font-semibold text-lg text-white">{contest?.theme_prompt || t.art_battle_no_contest}</p>
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">{t.art_battle_prompt_label}</label>
                        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} maxLength={300} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 transition"></textarea>
                        <p className="text-xs text-gray-500 text-right mt-1">{prompt.length} / 300</p>
                    </div>
                    <button onClick={handleGenerateImage} disabled={isGenerating || !contest} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:scale-105 transition-transform">
                        {isGenerating ? <LoaderCircle className="animate-spin" /> : <><BrainCircuit size={20}/>{t.art_battle_generate_btn}</>}
                    </button>
                </div>

                {/* Colonna Risultato e Galleria */}
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
                    {isGenerating && <GeneratingAnimation />}
                    {!isGenerating && generatedImageUrl && (
                        <div className="w-full text-center animate-fade-in">
                            <Image src={generatedImageUrl} alt="Opera generata dall'AI" width={400} height={400} className="rounded-lg mb-4 mx-auto shadow-2xl" />
                            {successMessage ? (
                                <div className="text-green-400 font-bold flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-lg">
                                    <CheckCircle/> {successMessage}
                                </div>
                            ) : (
                                <div className="flex gap-4 justify-center">
                                    <button onClick={handleSubmitToContest} disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-500">
                                        {isSubmitting ? <LoaderCircle className="animate-spin"/> : <Send size={18}/>} {t.art_battle_submit_btn}
                                    </button>
                                    <button onClick={() => setGeneratedImageUrl(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">
                                        {t.art_battle_retry_btn}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {!isGenerating && !generatedImageUrl && (
                        <div className="text-center text-gray-500">
                            <ImageIcon size={64} className="mx-auto mb-4"/>
                            <h3 className="font-bold text-lg">{t.art_battle_placeholder_title}</h3>
                            <p className="text-sm">{t.art_battle_placeholder_desc}</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <div className="mt-4 bg-red-500/10 text-red-300 text-center p-3 rounded-lg"><AlertTriangle className="inline mr-2"/>{error}</div>}
        </div>
    );
}
