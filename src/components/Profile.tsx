// src/components/Profile.tsx
import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User as UserIcon, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

// --- Componenti Avatar SVG (definiti localmente per semplicità) ---
const MaleAvatarSVG = () => ( <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#2c3e50"/><path d="M50 56C61.0457 56 70 64.9543 70 76V100H30V76C30 64.9543 38.9543 56 50 56Z" fill="#34495e"/><circle cx="50" cy="42" r="16" fill="#ecf0f1"/><path d="M42 38C42 35.7909 43.7909 34 46 34H54C56.2091 34 58 35.7909 58 38V40H42V38Z" fill="#7f8c8d"/></svg> );
const FemaleAvatarSVG = () => ( <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#34495e"/><path d="M50 58C63.8071 58 75 69.1929 75 83V100H25V83C25 69.1929 36.1929 58 50 58Z" fill="#2c3e50"/><circle cx="50" cy="42" r="16" fill="#ecf0f1"/><path d="M30 40C30 30 40 22 50 22C60 22 70 30 70 40L65 46L35 46L30 40Z" fill="#e74c3c"/></svg> );
const avatars = [ { id: 'avatar_male_svg', component: MaleAvatarSVG }, { id: 'avatar_female_svg', component: FemaleAvatarSVG } ];

type ProfileProps = {
    user: User;
};

export default function Profile({ user }: ProfileProps) {
    const { t } = useLanguage();
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user.photoURL || avatars[0].id);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            await updateProfile(user, { displayName, photoURL: selectedAvatar });
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
            await fetch(`${BACKEND_URL}/update_profile/${user.uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: displayName, avatar_url: selectedAvatar }),
            });
            setMessage(t.profile_update_success);
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setError(err.message || t.profile_error_generic);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user.email) {
            setError("Impossibile cambiare password per account social.");
            return;
        }
        if (newPassword.length < 6) {
            setError(t.profile_error_pw_length);
            return;
        }

        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            // Questo passo è cruciale per la sicurezza
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            
            setMessage(t.profile_pw_change_success);
            setCurrentPassword('');
            setNewPassword('');
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setError(t.profile_error_reauth);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full max-w-4xl animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-8">{t.profile_title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Colonna Modifica Profilo */}
                <form onSubmit={handleProfileUpdate} className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg space-y-6">
                    <h2 className="text-2xl font-bold">{t.profile_info_title}</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t.profile_avatar_label}</label>
                        <div className="flex gap-3">
                            {avatars.map(avatar => (
                                <button type="button" key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)} className={`w-20 h-20 bg-gray-900/50 rounded-full transition-all duration-300 border-2 overflow-hidden ${selectedAvatar === avatar.id ? 'border-green-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}>
                                    <avatar.component />
                                </button>
                            ))}
                            {user.photoURL && !user.photoURL.includes('_svg') && (
                                <button type="button" onClick={() => setSelectedAvatar(user.photoURL!)} className={`w-20 h-20 rounded-full transition-all duration-300 border-2 overflow-hidden ${selectedAvatar === user.photoURL ? 'border-green-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}>
                                    <Image src={user.photoURL} alt="Google Avatar" width={80} height={80} className="rounded-full" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">{t.profile_username_label}</label>
                        <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" /></div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed">
                        <Save size={18}/> {isSaving ? 'Salvataggio...' : t.profile_save_btn}
                    </button>
                </form>

                {/* Colonna Cambio Password */}
                <form onSubmit={handlePasswordChange} className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg space-y-6">
                     <h2 className="text-2xl font-bold">{t.profile_security_title}</h2>
                     <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">{t.profile_current_pw_label}</label>
                        <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" /></div>
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">{t.profile_new_pw_label}</label>
                        <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Almeno 6 caratteri" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" /></div>
                    </div>
                     <button type="submit" disabled={isSaving || !currentPassword || !newPassword} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600">
                        <Save size={18}/> {isSaving ? 'Salvataggio...' : t.profile_change_pw_btn}
                    </button>
                </form>

                 {/* Messaggi di stato */}
                {(error || message) && (
                    <div className="md:col-span-2 mt-4">
                        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-center gap-2 animate-fade-in"><AlertCircle size={16} />{error}</div>}
                        {message && <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm p-3 rounded-lg flex items-center gap-2 animate-fade-in"><CheckCircle size={16} />{message}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
