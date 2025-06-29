// src/components/Referral.tsx
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Share2, Copy, CheckCircle, LoaderCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type ReferralProps = {
    user: User | null;
};

export default function Referral({ user }: ReferralProps) {
    const { t } = useLanguage();

    // Il link ora punta al tuo sito live, passando l'ID dell'utente come parametro 'ref'
    const referralLink = `https://cashhh-52f38.web.app/?ref=${user?.uid}`;
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({ count: 0, earnings: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch delle statistiche reali dal backend
    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
                try {
                    setLoading(true);
                    const response = await fetch(`${BACKEND_URL}/referral_stats/${user.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setStats({ count: data.referral_count, earnings: data.referral_earnings });
                    }
                } catch (error) {
                    console.error("Errore nel caricare le statistiche referral:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [user]);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl animate-fade-in-up text-center">
            <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-blue-500/10 p-8 rounded-2xl border border-white/10 shadow-lg">
                <Share2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4">{t.referral_title}</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    {t.referral_desc}
                </p>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-300 font-semibold">{t.referral_link_title}</p>
                    <p className="font-mono text-base md:text-lg bg-gray-900/50 border border-dashed border-gray-600 px-6 py-3 rounded-lg break-all">
                        {referralLink}
                    </p>
                    <button
                        onClick={handleCopy}
                        className={`w-48 py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            copied 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                        {copied ? t.referral_copied_btn : t.referral_copy_btn}
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="font-bold text-xl mb-2">{t.referral_earnings_title}</h3>
                    {loading ? (
                        <LoaderCircle className="animate-spin h-8 w-8 text-gray-400" />
                    ) : (
                        <p className="text-3xl font-bold text-green-400">${stats.earnings.toFixed(2)}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">{loading ? t.referral_loading : t.referral_updated_now}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="font-bold text-xl mb-2">{t.referral_count_title}</h3>
                    {loading ? (
                        <LoaderCircle className="animate-spin h-8 w-8 text-gray-400" />
                    ) : (
                        <p className="text-3xl font-bold text-white">{stats.count}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">{loading ? t.referral_loading : t.referral_total}</p>
                </div>
            </div>
        </div>
    );
}
