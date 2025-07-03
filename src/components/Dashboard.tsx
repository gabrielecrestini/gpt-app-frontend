"use client";
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Crown, DollarSign, ArrowRight, Users, Zap, LoaderCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NotificationToast from './NotificationToast';

// --- Type Definitions ---
type LeaderboardUser = { name: string; earnings: number; avatar: string; };
type StreakInfo = { days: number; canClaim: boolean; };
type Mission = { id: number; title: string; progress: number; target: number; reward: number; };

type DashboardProps = {
    user: User | null;
    pointsBalance: number | null;
    pendingBalance: number | null;
    leaderboard: LeaderboardUser[];
    streakInfo: StreakInfo | null;
    missions: Mission[];
    onNavigate: (page: string) => void;
    refreshData: () => void;
};

type Notification = {
    message: string;
    type: 'success' | 'error';
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

// --- Sotto-componenti per la UI ---

const SkeletonLoader = ({ className }: { className?: string }) => (
    <div className={`bg-white/10 rounded-lg animate-pulse ${className}`} />
);

const UserInitialAvatar = ({ name }: { name: string }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">
            {initial}
        </div>
    );
};

const StreakCard = ({ data, onClaim, isClaiming }: { data: StreakInfo, onClaim: () => void, isClaiming: boolean }) => (
    <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-4"><Zap className="text-purple-400" /><h3 className="font-bold text-lg">Zenith Streak</h3></div>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-3xl font-bold">{data.days} <span className="text-lg">Giorni</span></p>
                <p className="text-xs text-gray-400">di accesso consecutivo</p>
            </div>
            <button 
                onClick={onClaim} 
                disabled={!data.canClaim || isClaiming} 
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center min-w-[120px] transition-colors"
            >
                {isClaiming ? <LoaderCircle className="animate-spin"/> : (data.canClaim ? 'Riscatta Bonus' : 'Riscattato')}
            </button>
        </div>
    </div>
);

const LeaderboardCard = ({ data }: { data: LeaderboardUser[] }) => {
    const { t } = useLanguage();
    return (
        <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-4"><Crown className="text-yellow-400" /><h3 className="font-bold text-lg">{t.dashboard_weekly_earnings || 'Classifica Settimanale'}</h3></div>
            <ul className="space-y-4">
                {data.length > 0 ? data.map((player, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 truncate">
                            <span className="font-bold text-gray-400 w-5">{index + 1}.</span>
                            <UserInitialAvatar name={player.name} />
                            <span className="truncate">{player.name}</span>
                        </div>
                        <span className="font-bold text-green-400 flex-shrink-0">${player.earnings.toFixed(2)}</span>
                    </li>
                )) : <p className="text-sm text-gray-400">La classifica è ancora vuota.</p>}
            </ul>
        </div>
    );
};

const MissionsCard = ({ data }: { data: Mission[] }) => (
    <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Le Tue Missioni Giornaliere</h3>
        {data.length > 0 ? (
            <p className="text-sm text-gray-400">Le missioni non sono ancora state implementate.</p>
        ) : (
            <p className="text-sm text-gray-400">Nessuna missione disponibile al momento.</p>
        )}
    </div>
);

// --- Componente Principale Dashboard ---
export default function Dashboard({ user, pointsBalance, pendingBalance, leaderboard, streakInfo, missions, onNavigate, refreshData }: DashboardProps) {
    const { t } = useLanguage();
    
    const [isClaiming, setIsClaiming] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const isLoading = pointsBalance === null || streakInfo === null;

    const handleClaimStreak = async () => {
        if (!user || !streakInfo?.canClaim) return;
        setIsClaiming(true);
        try {
            const res = await fetch(`${BACKEND_URL}/streak/claim/${user.uid}`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Riscossione fallita.");
            setNotification({ message: data.message, type: 'success' });
            await refreshData(); 
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="w-full h-full p-4 md:p-8 animate-fade-in-up overflow-y-auto">
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold">{t.sidebar_dashboard || 'Dashboard'}</h1>
                    <p className="text-gray-400">{t.dashboard_welcome || 'Bentornato'}, {user?.displayName?.split(' ')[0] || 'Campione'}!</p>
                </div>
                <button onClick={() => onNavigate('guadagna')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                    <span>{t.dashboard_cta || 'Guadagna Ora'}</span>
                    <ArrowRight size={16} />
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <>
                                <SkeletonLoader className="h-24" />
                                <SkeletonLoader className="h-24" />
                            </>
                        ) : (
                            <>
                                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-500/20 rounded-lg"><DollarSign className="text-green-400"/></div>
                                        <div>
                                            <p className="text-sm text-gray-400">Saldo Prelievabile</p>
                                            <p className="text-2xl font-bold">{pointsBalance?.toLocaleString() ?? 0} ZC</p>
                                            {(pendingBalance ?? 0) > 0 && <p className="text-xs text-yellow-400 mt-1">In Attesa: {pendingBalance?.toLocaleString()} ZC</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/20 rounded-lg"><Users className="text-blue-400"/></div>
                                        <div>
                                            <p className="text-sm text-gray-400">{t.dashboard_referrals || 'Amici Invitati'}</p>
                                            <p className="text-2xl font-bold">0</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <MissionsCard data={missions || []} />
                </main>

                <aside className="lg:col-span-1 flex flex-col gap-6">
                    {isLoading ? <SkeletonLoader className="h-28" /> : <StreakCard data={streakInfo!} onClaim={handleClaimStreak} isClaiming={isClaiming} />}
                    {isLoading ? <SkeletonLoader className="h-60" /> : <LeaderboardCard data={leaderboard || []} />}
                </aside>
            </div>
          {notification && <NotificationToast {...notification} onDismiss={() => setNotification(null)} />}
        </div>
    );
}