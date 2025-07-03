// src/components/Sidebar.tsx - Versione Raffinata

import React, { useState } from 'react';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Assicurati che il percorso sia corretto
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Importa le icone
import {
    LayoutDashboard, DollarSign, Wallet, Gift, LogOut, LogIn, User as UserIcon,
    Settings, Sparkles, ShoppingCart, X, Bot, MoreHorizontal
} from 'lucide-react';

// Importa avatar CSS (se presenti)
import { CosmicOrbitAvatar, EnergyCrystalAvatar, NebulaAuraAvatar } from './CssAvatars';

// Definiamo le props che il componente accetta
type SidebarProps = {
    user: User | null;
    activePage: string;
    setActivePage: React.Dispatch<React.SetStateAction<string>>;
    onLoginClick: () => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// --- Sotto-Componente: Logo ---
const Logo = () => (
    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
        <div className="w-8 h-8 flex items-center justify-center">
            <div className="relative w-7 h-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-10deg]">
                <div className="absolute w-full h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-sm" style={{ transform: 'skewX(-15deg)', clipPath: 'polygon(0 0, 100% 0, 100% 25%, 0 25%, 0 75%, 100% 75%, 100% 100%, 0 100%)' }}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm" style={{ transform: 'skewX(-15deg) translateX(3px)', clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)' }}></div>
            </div>
        </div>
        <span className="font-bold text-lg text-white">Zenith Rewards</span>
    </div>
);

// --- Sotto-Componente: Elemento di Navigazione Raffinato ---
const NavItem = ({ icon: Icon, name, isActive, onClick }: { icon: React.ElementType, name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`relative flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 text-left w-full font-medium ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}`}>
        {isActive && <motion.div layoutId="active-pill" className="absolute left-0 top-0 h-full w-1 bg-purple-500 rounded-r-full" />}
        <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-purple-400' : ''}`} />
        <span>{name}</span>
    </button>
);

// --- Sotto-Componente: Menu Profilo Utente ---
const UserProfileMenu = ({ user, handleNavigation }: { user: User, handleNavigation: (page: string) => void }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { t } = useLanguage();

    const accountItems = [
        { name: t.sidebar_profile || 'Profilo', icon: UserIcon, page: 'profile' },
        { name: t.sidebar_settings || 'Impostazioni', icon: Settings, page: 'settings' },
    ];

    return (
        <div className="relative">
            <div
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/60 transition-colors cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <UserAvatar user={user} />
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate text-white" title={user.displayName || 'Utente'}>{user.displayName || 'Utente'}</p>
                        <p className="text-xs text-gray-400 truncate" title={user.email || ''}>{user.email}</p>
                    </div>
                </div>
                <MoreHorizontal className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0" />
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                    >
                        <nav>
                            {accountItems.map((item) => (
                                <button key={item.page} onClick={() => { handleNavigation(item.page); setMenuOpen(false); }} className="w-full flex items-center space-x-3 p-3 text-sm text-gray-300 hover:bg-gray-700/80 transition-colors">
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                            <div className="border-t border-gray-700">
                                <button onClick={() => signOut(auth)} className="w-full flex items-center space-x-3 p-3 text-sm text-red-400 hover:bg-red-500/20 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    <span>{t.sidebar_logout || 'Logout'}</span>
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sotto-Componente: Avatar ---
const UserAvatar = ({ user }: { user: User }) => {
    // La logica per gli avatar rimane la stessa del tuo codice originale
    const avatarIdentifier = user.photoURL || '';
    if (avatarIdentifier.startsWith('css_')) {
        switch (avatarIdentifier) {
            case 'css_cosmic_orbit': return <CosmicOrbitAvatar />;
            case 'css_energy_crystal': return <EnergyCrystalAvatar />;
            default: return <NebulaAuraAvatar name={user.displayName} />;
        }
    }
    if (avatarIdentifier.startsWith('http')) {
        return <Image src={avatarIdentifier} alt={user.displayName || 'Avatar'} width={40} height={40} className="rounded-full flex-shrink-0" />;
    }
    return <NebulaAuraAvatar name={user.displayName} />;
};


// --- Componente Principale Sidebar ---
export default function Sidebar({ user, activePage, setActivePage, onLoginClick, isOpen, setIsOpen }: SidebarProps) {
    const { t } = useLanguage();

    const handleNavigation = (page: string) => {
        setActivePage(page);
        setIsOpen(false);
    };

    const navItems = [
        { name: t.sidebar_dashboard || 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
        { name: t.sidebar_earn || 'Guadagna', icon: DollarSign, page: 'guadagna' },
        { name: t.sidebar_art_battles || 'Art Battles', icon: Sparkles, page: 'art-battles' },
        { name: "AI Studio", icon: Bot, page: 'ai-studio' }, // NUOVA VOCE
        { name: "Fucina di Zenith", icon: ShoppingCart, page: 'fucina' },
        { name: t.sidebar_wallet || 'Portafoglio', icon: Wallet, page: 'portafoglio' },
        { name: t.sidebar_referrals || 'Invita Amici', icon: Gift, page: 'invita' },
    ];

    return (
        <>
            {/* Overlay per la visualizzazione mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 p-4 flex flex-col justify-between border-r border-gray-800 z-40
                         transition-transform duration-300 ease-in-out
                         lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div>
                    <div className="flex justify-between items-center mb-10 px-2">
                        <Logo />
                        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-3">{t.sidebar_menu || 'Menu'}</h3>
                    <nav className="flex flex-col space-y-1">
                        {user && navItems.map((item) => (
                            <NavItem
                                key={item.page}
                                icon={item.icon}
                                name={item.name}
                                isActive={activePage === item.page}
                                onClick={() => handleNavigation(item.page)}
                            />
                        ))}
                    </nav>
                </div>

                <div className="border-t border-gray-800/50 pt-4">
                    {user ? (
                        <UserProfileMenu user={user} handleNavigation={handleNavigation} />
                    ) : (
                        <button onClick={onLoginClick} className="w-full flex items-center justify-center space-x-3 text-green-400 hover:text-white hover:bg-green-500/80 p-3 rounded-lg transition-colors font-semibold">
                            <LogIn className="h-5 w-5" />
                            <span>{t.sidebar_login || 'Login'}</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}