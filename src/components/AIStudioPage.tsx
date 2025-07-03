"use client";
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Sparkles, LoaderCircle, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import NotificationToast from './NotificationToast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com/";

type AIStudioProps = {
    user: User | null;
};
type UserProfile = {
    subscription_plan: 'free' | 'premium' | 'assistant';
    daily_ai_generations_used: number;
};
type Notification = { message: string; type: 'success' | 'error'; };

export default function AIStudioPage({ user }: AIStudioProps) {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (user) {
            fetch(`${BACKEND_URL}/users/${user.uid}/profile`)
                .then(res => res.json())
                .then(data => setUserProfile(data));
        }
    }, [user]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || !user) return;

        setIsLoading(true);
        setResponse('');
        setNotification(null);
        try {
            const res = await fetch(`${BACKEND_URL}/ai/generate-advice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid, prompt: prompt }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);
            setResponse(data.advice);
            // Refresh user profile to get updated generation count
            fetch(`${BACKEND_URL}/users/${user.uid}/profile`).then(res => res.json()).then(data => setUserProfile(data));
        } catch (err: any) {
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const getPlanLimits = () => {
        if (userProfile?.subscription_plan === 'premium') return '150';
        if (userProfile?.subscription_plan === 'assistant') return 'Unlimited';
        return '12';
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 text-white animate-fade-in">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    AI Business Assistant
                </h1>
                <p className="text-gray-400 mt-3 text-lg">Your personal manager for growth. Ask anything.</p>
            </header>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center text-sm">
                    <p>Your Plan: <span className="font-bold text-purple-300 capitalize">{userProfile?.subscription_plan}</span></p>
                    <p>Daily Generations: <span className="font-bold text-purple-300">{userProfile?.daily_ai_generations_used} / {getPlanLimits()}</span></p>
                </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 mb-12">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., How can I make my video about a dancing cat go viral? Or how do I start a niche business for handmade candles?"
                    className="w-full h-32 p-4 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoaderCircle className="animate-spin" /> : <><Wand2 size={18}/> Generate Strategy</>}
                </button>
            </form>

            {isLoading && (
                <div className="text-center">
                    <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-purple-400"/>
                    <p className="mt-2 text-gray-400">Your assistant is thinking...</p>
                </div>
            )}
            
            {response && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-invert prose-lg max-w-none bg-white/5 p-8 rounded-xl border border-white/10"
                >
                    <ReactMarkdown>{response}</ReactMarkdown>
                </motion.div>
            )}

            {notification && <NotificationToast {...notification} onDismiss={() => setNotification(null)} />}
        </div>
    );
}