// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Crown, DollarSign, ArrowRight, Users, Zap, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type DashboardProps = {
    user: User | null;
    isSynced: boolean;
    onNavigate: (page: string) => void; 
};

// --- Tipi di Dati per le Nuove Funzionalità ---
type LeaderboardUser = { name: string; earnings: number; avatar: string };
type StreakInfo = { days: number; canClaim: boolean };
type Mission = { id: number; title: string; progress: number; target: number; reward: number };

// --- Sotto-componenti per la Nuova UI ---
const UserInitialAvatar = ({ name }: { name: string }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">
            {initial}
        </div>
    );
};

const LeaderboardCard = ({ data, isLoading }: { data: LeaderboardUser[], isLoading: boolean }) => {
    const { t } = useLanguage();
    return (
        <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-4"><Crown className="text-yellow-400" /><h3 className="font-bold text-lg">{t.dashboard_weekly_earnings}</h3></div>
            {isLoading ? (<div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>) : (
                <ul className="space-y-4">
                    {data.map((player, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-400 w-5">{index + 1}.</span>
                                <UserInitialAvatar name={player.name} />
                                <span className="truncate">{player.name}</span>
                            </div>
                            <span className="font-bold text-green-400">${player.earnings.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const StreakCard = ({ data, isLoading }: { data: StreakInfo, isLoading: boolean }) => (
     <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-4"><Zap className="text-purple-400" /><h3 className="font-bold text-lg">Zenith Streak</h3></div>
        {isLoading ? (<div className="h-16 animate-pulse bg-white/10 rounded-lg"></div>) : (
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold">{data.days} <span className="text-lg">Giorni</span></p>
                    <p className="text-xs text-gray-400">di accesso consecutivo</p>
                </div>
                <button disabled={!data.canClaim} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg">
                    {data.canClaim ? 'Riscatta Bonus' : 'Riscattato'}
                </button>
            </div>
        )}
    </div>
);

const MissionsCard = ({ data, isLoading }: { data: Mission[], isLoading: boolean }) => {
    return (
        <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Le Tue Missioni Giornaliere</h3>
            {isLoading ? (<div className="space-y-4"><div className="h-16 animate-pulse bg-white/10 rounded-lg"></div><div className="h-16 animate-pulse bg-white/10 rounded-lg"></div></div>) : (
                <ul className="space-y-4">
                    {data.map((mission) => {
                        const progress = Math.min((mission.progress / mission.target) * 100, 100);
                        const isComplete = progress >= 100;
                        return (
                            <li key={mission.id} className="bg-gray-900/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold">{mission.title}</p>
                                    <div className={`flex items-center gap-1 font-bold ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {isComplete ? <CheckCircle size={16}/> : <DollarSign size={16}/>} {mission.reward}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-right text-xs mt-1 text-gray-400">{mission.progress} / {mission.target}</p>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
};


export default function Dashboard({ user, isSynced, onNavigate }: DashboardProps) {
  const { t } = useLanguage();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({ days: 0, canClaim: false });
  const [missions, setMissions] = useState<Mission[]>([]);
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";

  useEffect(() => {
    if (user && isSynced) {
      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          const [balanceRes, referralRes, leaderboardRes, streakRes, missionsRes] = await Promise.all([
             fetch(`${BACKEND_URL}/get_user_balance/${user.uid}`),
             fetch(`${BACKEND_URL}/referral_stats/${user.uid}`),
             fetch(`${BACKEND_URL}/leaderboard`),
             fetch(`${BACKEND_URL}/streak/status/${user.uid}`),
             fetch(`${BACKEND_URL}/missions/${user.uid}`),
          ]);
          
          if (balanceRes.ok) setPointsBalance((await balanceRes.json()).points_balance);
          if (referralRes.ok) setReferralCount((await referralRes.json()).referral_count);
          if (leaderboardRes.ok) setLeaderboard(await leaderboardRes.json());
          if (streakRes.ok) setStreakInfo(await streakRes.json());
          if (missionsRes.ok) setMissions(await missionsRes.json());

        } catch (error) {
          console.error("Errore nel caricare i dati della dashboard:", error);
        } finally {
            setIsLoading(false);
        }
      };
      loadDashboardData();
    } else if(!user) {
        setIsLoading(false);
    }
  }, [user, isSynced]);
  
  return (
    <div className="w-full h-full p-4 md:p-8 animate-fade-in-up overflow-auto relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">{t.sidebar_dashboard}</h1>
            <p className="text-gray-400">{t.dashboard_welcome}, {user?.displayName?.split(' ')[0] || 'Campione'}!</p>
          </div>
          <button 
            onClick={() => onNavigate('guadagna')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <span>{t.dashboard_cta}</span>
            <ArrowRight size={16} />
          </button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <main className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg"><div className="flex items-center gap-4"><div className="p-3 bg-green-500/20 rounded-lg"><DollarSign className="text-green-400"/></div><div><p className="text-sm text-gray-400">{t.dashboard_balance}</p><p className="text-2xl font-bold">{pointsBalance.toLocaleString()} ZC</p></div></div></div>
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg"><div className="flex items-center gap-4"><div className="p-3 bg-blue-500/20 rounded-lg"><Users className="text-blue-400"/></div><div><p className="text-sm text-gray-400">{t.dashboard_referrals}</p><p className="text-2xl font-bold">{referralCount}</p></div></div></div>
            </div>
            <MissionsCard data={missions} isLoading={isLoading} />
        </main>

        <aside className="lg:col-span-1 flex flex-col gap-6">
            <StreakCard data={streakInfo} isLoading={isLoading} />
            <LeaderboardCard data={leaderboard} isLoading={isLoading} />
        </aside>

      </div>
    </div>
  );
}