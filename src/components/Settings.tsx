// src/components/Settings.tsx
import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { Bell, Palette, Trash2, Globe } from 'lucide-react';
import { useLanguage, languages, Language } from '../context/LanguageContext'; // Importa dal contesto

type SettingsProps = {
    user: User;
};

// Sotto-componente per gli interruttori (Toggle)
const ToggleSwitch = ({ label, enabled, onToggle }: { label: string, enabled: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                enabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
        >
            <span
                aria-hidden="true"
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    </div>
);


export default function Settings({ user }: SettingsProps) {
    // Usa l'hook per accedere e modificare lo stato globale della lingua
    const { lang, setLang, t } = useLanguage(); 

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    const handleDeleteAccount = () => {
        // In un'app reale, questo aprirebbe una modale di conferma molto seria.
        alert('Funzionalità di eliminazione account non ancora implementata.');
    };

    return (
        <div className="w-full max-w-4xl animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-8">{t.settings_title}</h1>
            
            <div className="space-y-8">
                
                {/* Sezione Lingua */}
                <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="text-teal-400" />
                        <h2 className="text-2xl font-bold">{t.settings_lang_region}</h2>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{t.settings_lang_desc}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {languages.map(l => (
                            <button 
                                key={l.code}
                                onClick={() => setLang(l.code)}
                                className={`p-4 rounded-lg border-2 transition-all ${lang === l.code ? 'border-green-400 bg-green-500/20' : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'}`}
                            >
                                <span className="text-2xl">{l.flag}</span>
                                <p className="font-semibold mt-2">{l.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sezione Notifiche */}
                <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-3 mb-6"><Bell className="text-blue-400" /><h2 className="text-2xl font-bold">{t.settings_notifications}</h2></div>
                    <div className="space-y-4">
                        <ToggleSwitch 
                            label={t.settings_email_notifs} 
                            enabled={emailNotifications}
                            onToggle={() => setEmailNotifications(!emailNotifications)} 
                        />
                        <ToggleSwitch 
                            label={t.settings_push_notifs} 
                            enabled={pushNotifications} 
                            onToggle={() => { /* Funzionalità futura */ }} 
                        />
                    </div>
                </div>

                {/* Sezione Aspetto */}
                 <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <Palette className="text-purple-400" />
                        <h2 className="text-2xl font-bold">{t.settings_appearance}</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">{t.settings_theme}</span>
                            <div className="bg-gray-900/50 p-1 rounded-lg">
                                <button className="px-3 py-1 text-white bg-gray-700 rounded">{t.settings_dark}</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sezione Account (Zona Pericolosa) */}
                <div className="backdrop-blur-sm bg-red-900/20 p-8 rounded-2xl border border-red-500/30 shadow-lg">
                     <div className="flex items-center gap-3 mb-6"><Trash2 className="text-red-400" /><h2 className="text-2xl font-bold">{t.settings_account_mgnt}</h2></div>
                     <div className="flex items-center justify-between">
                        <div><h3 className="font-semibold text-white">{t.settings_delete_account}</h3><p className="text-sm text-gray-400">{t.settings_delete_desc}</p></div>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {t.settings_delete_btn}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}