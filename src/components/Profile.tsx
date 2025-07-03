// src/components/Profile.tsx

import { useState } from 'react';
import type { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { CosmicOrbitAvatar, EnergyCrystalAvatar, NebulaAuraAvatar } from './CssAvatars';
import NotificationToast from './NotificationToast';
import { LoaderCircle } from 'lucide-react';

const AVATAR_OPTIONS = [
    { id: 'css_cosmic_orbit', component: <CosmicOrbitAvatar /> },
    { id: 'css_energy_crystal', component: <EnergyCrystalAvatar /> },
    { id: 'css_nebula_aura', component: <NebulaAuraAvatar name="G" /> },
];

export default function Profile({ user, isSynced }: { user: User | null; isSynced: boolean }) {
    if (!user) {
        return <div className="text-center p-8">Caricamento del profilo...</div>;
    }

    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user.photoURL || 'css_nebula_aura');
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com/";

    const handleSaveProfile = async () => {
        if (!isSynced) {
            setNotification({ message: "Attendi la fine della sincronizzazione prima di salvare.", type: 'error' });
            return;
        }
        setIsSaving(true);
        setNotification(null);
        try {
            // 1. Aggiorna il database backend
            const res = await fetch(`${BACKEND_URL}update_profile/${user.uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                display_name: displayName, // Modificato in snake_case
              avatar_url: selectedAvatar
               })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Errore del server");

            // 2. Se il backend ha successo, aggiorna il profilo di autenticazione Firebase
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                    photoURL: selectedAvatar,
                });
            }

            setNotification({ message: "Profilo aggiornato! Ricarica la pagina per vedere le modifiche.", type: 'success' });
        } catch (err: any) {
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto text-white animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">Il Tuo Profilo</h1>
            <div className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
                <div>
                    <label className="text-sm font-bold text-gray-400">Nome Visualizzato</label>
                    <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-900 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-400">Scegli il tuo Avatar</label>
                    <div className="mt-4 flex flex-wrap gap-4">
                        {AVATAR_OPTIONS.map(option => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedAvatar(option.id)}
                                className={`p-2 rounded-full transition-all duration-300 ${selectedAvatar === option.id ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-gray-800 hover:bg-gray-700'}`}
                            >
                                {option.component}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                    <button 
                        onClick={handleSaveProfile} 
                        disabled={isSaving || !isSynced}
                        className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <LoaderCircle className="animate-spin" /> : 'Salva Modifiche'}
                    </button>
                    {!isSynced && <p className="text-xs text-yellow-400 mt-2">Sincronizzazione utente in corso... Attendere per salvare.</p>}
                </div>
            </div>
            {notification && <NotificationToast {...notification} onDismiss={() => setNotification(null)} />}
        </div>
    );
}