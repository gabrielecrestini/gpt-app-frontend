// src/components/Sidebar.tsx
import { signOut, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LayoutDashboard, DollarSign, Wallet, Gift, LogOut, LogIn, User as UserIcon, Settings, Sparkles, BarChart2 } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';

type SidebarProps = {
  user: User | null;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  onLoginClick: () => void;
};

// --- NUOVO LOGO PIÙ IMPATTIVO (PURO CSS) ---
const Logo = () => (
    <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => window.location.reload()}>
        <div className="w-10 h-10 flex items-center justify-center">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-10deg]">
                {/* Barra principale della "Z" */}
                <div 
                    className="absolute w-full h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-sm"
                    style={{ 
                        transform: 'skewX(-15deg)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 25%, 0 25%, 0 75%, 100% 75%, 100% 100%, 0 100%)'
                    }}
                ></div>
                {/* Elemento sovrapposto per creare l'effetto spezzato */}
                <div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm"
                    style={{
                         transform: 'skewX(-15deg) translateX(4px)',
                         clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)'
                    }}
                ></div>
            </div>
        </div>
        <span className="font-bold text-xl text-white">Zenith Rewards</span>
    </div>
);

// --- NUOVI AVATAR CSS ---
const UniversalAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gray-700 relative overflow-hidden flex-shrink-0">
        <div className="absolute -bottom-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
    </div>
);
const FemaleAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gray-700 relative overflow-hidden flex-shrink-0">
        <div className="absolute -bottom-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
    </div>
);


// --- Componente Avatar Intelligente ---
const UserAvatar = ({ user }: { user: User }) => {
    // Se l'utente ha scelto un avatar CSS specifico
    if (user.photoURL === 'css_female') {
        return <FemaleAvatar />;
    }
    if (user.photoURL === 'css_universal') {
        return <UniversalAvatar />;
    }
    // Se ha un'immagine reale (es. da Google)
    if (user.photoURL && user.photoURL.startsWith('http')) {
        return (
            <Image 
                src={user.photoURL} 
                alt={user.displayName || 'User Avatar'} 
                width={40} 
                height={40} 
                className="rounded-full flex-shrink-0" 
            />
        );
    }
    // Fallback di default se non ha nessuna immagine
    return <UniversalAvatar />;
};


export default function Sidebar({ user, setActivePage, onLoginClick }: SidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    { name: t.sidebar_dashboard, icon: LayoutDashboard, page: 'dashboard' },
    { name: t.sidebar_earn, icon: DollarSign, page: 'guadagna' },
    { name: t.sidebar_art_battles, icon: Sparkles, page: 'art-battles' },
    { name: t.sidebar_wallet, icon: Wallet, page: 'portafoglio' },
    { name: t.sidebar_referrals, icon: Gift, page: 'invita' },
  ];
  
  const accountItems = [
      { name: t.sidebar_profile, icon: UserIcon, page: 'profile' },
      { name: t.sidebar_settings, icon: Settings, page: 'settings' },
  ]

  return (
    <aside className="w-64 bg-gray-950 p-6 flex flex-col justify-between border-r border-gray-800">
      <div>
        <Logo />
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t.sidebar_menu}</h3>
        <nav className="flex flex-col space-y-2">
          {user && navItems.map((item) => (
            <button key={item.page} onClick={() => setActivePage(item.page)} className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors">
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        
        {user && (
            <div className='mt-6'>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t.sidebar_account}</h3>
                 <nav className="flex flex-col space-y-2">
                  {accountItems.map((item) => (
                    <button key={item.page} onClick={() => setActivePage(item.page)} className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
            </div>
        )}

      </div>
      <div className="border-t border-gray-800 pt-6">
        {user ? (
          <>
            <div className="flex items-center gap-3 mb-4">
                 <UserAvatar user={user} />
                 <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate" title={user.displayName || 'Utente'}>{user.displayName || 'Utente'}</p>
                    <p className="text-xs text-gray-400 truncate" title={user.email || ''}>{user.email}</p>
                 </div>
            </div>
            <button onClick={() => signOut(auth)} className="w-full flex items-center justify-center space-x-3 text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span>{t.sidebar_logout}</span>
            </button>
          </>
        ) : (
             <button onClick={onLoginClick} className="w-full flex items-center justify-center space-x-3 text-green-400 hover:text-white hover:bg-green-500 p-2 rounded-lg transition-colors">
                <LogIn className="h-5 w-5" />
                <span>{t.sidebar_login}</span>
            </button>
        )}
      </div>
    </aside>
  );
}
