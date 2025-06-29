// src/context/LanguageContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- FIX DEFINITIVO: Definiamo prima la "forma" esatta di una traduzione ---
type TranslationKeys = {
    // Landing Page & Header
    title1: string; title2: string; title3: string;
    subtitle: string; cta_button: string; login_button: string;
    how_it_works: string;
    step1_title: string; step1_desc: string;
    step2_title: string; step2_desc: string;
    step3_title: string; step3_desc: string;
    footer_text: string;
    // AuthModal
    auth_modal_title_login: string; auth_modal_title_register: string;
    auth_modal_username_label: string; auth_modal_password_label: string;
    auth_modal_submit_login: string; auth_modal_submit_register: string;
    auth_modal_or: string; auth_modal_google_btn: string;
    auth_modal_no_account: string; auth_modal_register_link: string;
    auth_modal_has_account: string; auth_modal_login_link: string;
    auth_modal_forgot_pw_link: string;
    auth_modal_terms: string;
    auth_modal_error_username: string;
    // Sidebar
    sidebar_menu: string; sidebar_dashboard: string; sidebar_earn: string;
    sidebar_wallet: string; sidebar_referrals: string; 
    sidebar_art_battles: string;
    sidebar_account: string; sidebar_profile: string; sidebar_settings: string;
    sidebar_logout: string; sidebar_login: string;
    // Dashboard
    dashboard_welcome: string; dashboard_cta: string;
    dashboard_balance: string; dashboard_total_earnings: string;
    dashboard_referrals: string; dashboard_weekly_earnings: string;
    // Pagina Guadagna (Offerwall)
    earn_title: string; earn_subtitle: string;
    earn_featured_title: string; earn_providers_title: string;
    earn_provider_desc: string;
    // Pagina Art Battles
    art_battle_title: string; art_battle_subtitle: string;
    art_battle_studio_title: string; art_battle_theme_of_day: string;
    art_battle_no_contest: string; art_battle_prompt_label: string;
    art_battle_generate_btn: string; art_battle_generating: string;
    art_battle_submit_btn: string; art_battle_retry_btn: string;
    art_battle_submitting: string; art_battle_submit_success: string;
    art_battle_placeholder_title: string; art_battle_placeholder_desc: string;
    art_battle_error_no_contest: string; art_battle_error_generation_failed: string;
    art_battle_error_submit_failed: string;
    // Pagina Portafoglio (Payout)
    payout_title: string; payout_balance: string;
    payout_withdraw_with: string; payout_email_label: string;
    payout_amount_label: string; payout_withdraw_btn: string;
    payout_modal_title: string; payout_modal_desc: string;
    payout_modal_desc_to: string; payout_modal_irreversible: string;
    payout_modal_cancel: string; payout_modal_confirm: string;
    payout_error_email: string; payout_error_funds: string;
    payout_success_message: string;
    payout_error_server: string;
    payout_error_connection: string;
    // Pagina Invita Amici (Referral)
    referral_title: string; referral_desc: string;
    referral_link_title: string; referral_copy_btn: string;
    referral_copied_btn: string; referral_earnings_title: string;
    referral_count_title: string; referral_loading: string;
    referral_updated_now: string; referral_total: string;
    // Pagina Profilo
    profile_title: string; profile_info_title: string;
    profile_avatar_label: string; profile_username_label: string;
    profile_save_btn: string; profile_security_title: string;
    profile_current_pw_label: string; profile_new_pw_label: string;
    profile_change_pw_btn: string;
    profile_update_success: string;
    profile_pw_change_success: string;
    profile_error_generic: string;
    profile_error_reauth: string;
    profile_error_pw_length: string;
    // Pagina Impostazioni
    settings_title: string;
    settings_lang_region: string;
    settings_lang_desc: string;
    settings_notifications: string;
    settings_email_notifs: string;
    settings_push_notifs: string;
    settings_appearance: string;
    settings_theme: string;
    settings_dark: string;
    settings_account_mgnt: string;
    settings_delete_account: string;
    settings_delete_desc: string;
    settings_delete_btn: string;
};

// --- Ora creiamo gli oggetti di traduzione usando il tipo che abbiamo definito ---

const itTranslations: TranslationKeys = {
    title1: "Raggiungi lo", title2: "Zenith", title3: "dei Guadagni",
    subtitle: "Entra in Zenith Rewards, la piattaforma per trasformare il tuo tempo in premi reali. Inizia oggi.",
    cta_button: "Inizia Subito - È Gratis", login_button: "Accedi",
    how_it_works: "Come Funziona",
    step1_title: "1. Registrati Gratis", step1_desc: "Crea il tuo account in meno di 30 secondi e accedi subito.",
    step2_title: "2. Completa le Offerte", step2_desc: "Scegli tra centinaia di sondaggi, giochi e task.",
    step3_title: "3. Incassa i Premi", step3_desc: "Converti i punti in denaro su PayPal, buoni regalo o cripto.",
    footer_text: "Tutti i diritti riservati.",
    auth_modal_title_login: "Accedi al tuo Account", auth_modal_title_register: "Crea un Nuovo Account",
    auth_modal_username_label: "Username", auth_modal_password_label: "Password (min. 6 caratteri)",
    auth_modal_submit_login: "Accedi", auth_modal_submit_register: "Crea il mio Account",
    auth_modal_or: "oppure", auth_modal_google_btn: "Continua con Google",
    auth_modal_no_account: "Non hai un account?", auth_modal_register_link: "Registrati",
    auth_modal_has_account: "Hai già un account?", auth_modal_login_link: "Accedi",
    auth_modal_forgot_pw_link: "Password dimenticata?",
    auth_modal_terms: "Registrandoti, accetti i nostri Termini e Privacy Policy.",
    auth_modal_error_username: "L'username deve essere di almeno 3 caratteri.",
    sidebar_menu: "Menu", sidebar_dashboard: "Dashboard", sidebar_earn: "Guadagna",
    sidebar_wallet: "Portafoglio", sidebar_referrals: "Invita Amici", 
    sidebar_art_battles: "Art Battles",
    sidebar_account: "Account", sidebar_profile: "Profilo", sidebar_settings: "Impostazioni",
    sidebar_logout: "Logout", sidebar_login: "Accedi / Registrati",
    dashboard_welcome: "Bentornato", dashboard_cta: "Guadagna Ora",
    dashboard_balance: "Saldo", dashboard_total_earnings: "Guadagni Tot.",
    dashboard_referrals: "Amici Invitati", dashboard_weekly_earnings: "Guadagni Settimanali",
    earn_title: "Guadagna Ricompense", earn_subtitle: "Scegli tra i nostri partner principali per trovare le migliori offerte.",
    earn_featured_title: "Offerta in Evidenza", earn_providers_title: "Tutti i Provider di Offerte",
    earn_provider_desc: "Scegli un provider per iniziare.",
    art_battle_title: "Zenith Art Battles", art_battle_subtitle: "Usa la tua creatività (e i tuoi Zenith Coins) per creare opere d'arte uniche e vincere!",
    art_battle_studio_title: "Studio di Creazione", art_battle_theme_of_day: "Tema del Giorno:",
    art_battle_no_contest: "Nessun contest attivo", art_battle_prompt_label: "Descrivi la tua visione",
    art_battle_generate_btn: "Genera Immagine (50 ZC)", art_battle_generating: "L'IA sta creando il tuo capolavoro...",
    art_battle_submit_btn: "Invia al Contest", art_battle_retry_btn: "Riprova",
    art_battle_submitting: "Inviando...", art_battle_submit_success: "La tua opera è stata inviata! In bocca al lupo!",
    art_battle_placeholder_title: "La tua opera d'arte apparirà qui", art_battle_placeholder_desc: "Scrivi un prompt e clicca \"Genera\" per iniziare.",
    art_battle_error_no_contest: "Nessun contest attivo oggi.", art_battle_error_generation_failed: "Generazione fallita.",
    art_battle_error_submit_failed: "Invio fallito.",
    payout_title: "Portafoglio e Prelievi", payout_balance: "Saldo Disponibile",
    payout_withdraw_with: "Prelievo con PayPal", payout_email_label: "Il tuo indirizzo email PayPal",
    payout_amount_label: "Seleziona l'importo da prelevare", payout_withdraw_btn: "Preleva",
    payout_modal_title: "Conferma Prelievo", payout_modal_desc: "Stai per prelevare",
    payout_modal_desc_to: "e inviarli a", payout_modal_irreversible: "L'operazione è irreversibile.",
    payout_modal_cancel: "Annulla", payout_modal_confirm: "Conferma",
    payout_error_email: "Per favore, inserisci un indirizzo email PayPal valido.",
    payout_error_funds: "Non hai abbastanza fondi per prelevare questo importo.",
    payout_success_message: "La tua richiesta di prelievo è stata inviata!",
    payout_error_server: "Errore del server, riprova più tardi.",
    payout_error_connection: "Errore di connessione, riprova più tardi.",
    referral_title: "Invita Amici, Guadagnate Insieme!", referral_desc: "Condividi il tuo link personale. Per ogni amico che si iscrive, riceverai una commissione del 10% sui loro guadagni, per sempre!",
    referral_link_title: "Il Tuo Link di Invito Unico", referral_copy_btn: "Copia Link",
    referral_copied_btn: "Copiato!", referral_earnings_title: "I Tuoi Guadagni da Referral",
    referral_count_title: "Amici Invitati", referral_loading: "Caricamento...",
    referral_updated_now: "Aggiornato ora", referral_total: "In totale",
    profile_title: "Il Tuo Profilo", profile_info_title: "Informazioni Account",
    profile_avatar_label: "Il tuo avatar", profile_username_label: "Username",
    profile_save_btn: "Salva Modifiche", profile_security_title: "Sicurezza",
    profile_current_pw_label: "Password Attuale", profile_new_pw_label: "Nuova Password",
    profile_change_pw_btn: "Cambia Password", profile_update_success: "Profilo aggiornato con successo!",
    profile_pw_change_success: "Password cambiata con successo!", profile_error_generic: "Errore durante l'aggiornamento.",
    profile_error_reauth: "Password attuale errata o altro errore.",
    profile_error_pw_length: "La nuova password deve essere di almeno 6 caratteri.",
    settings_title: "Impostazioni", settings_lang_region: "Lingua e Regione",
    settings_lang_desc: "Scegli la lingua in cui visualizzare l'applicazione.",
    settings_notifications: "Notifiche", settings_email_notifs: "Notifiche via Email su nuove offerte",
    settings_push_notifs: "Notifiche Push (Prossimamente)", settings_appearance: "Aspetto",
    settings_theme: "Tema", settings_dark: "Scuro", settings_account_mgnt: "Gestione Account",
    settings_delete_account: "Elimina Account", settings_delete_desc: "Questa azione è permanente e non può essere annullata.",
    settings_delete_btn: "Elimina",
    // Rimosse le chiavi di trading
};

const enTranslations: TranslationKeys = {
    // ... (tutte le traduzioni inglesi, ma senza le chiavi di trading)
    title1: "Reach the", title2: "Zenith", title3: "of Earnings",
    subtitle: "Join Zenith Rewards, the platform to turn your time into real rewards. Start today.",
    cta_button: "Start Now - It's Free", login_button: "Login",
    how_it_works: "How It Works",
    step1_title: "1. Sign Up for Free", step1_desc: "Create your account in less than 30 seconds and get instant access.",
    step2_title: "2. Complete Offers", step2_desc: "Choose from hundreds of surveys, games, and tasks.",
    step3_title: "3. Cash Out Rewards", step3_desc: "Convert your points into PayPal cash, gift cards, or crypto.",
    footer_text: "All rights reserved.",
    auth_modal_title_login: "Login to Your Account", auth_modal_title_register: "Create a New Account",
    auth_modal_username_label: "Username", auth_modal_password_label: "Password (min. 6 characters)",
    auth_modal_submit_login: "Login", auth_modal_submit_register: "Create my Account",
    auth_modal_or: "or", auth_modal_google_btn: "Continue with Google",
    auth_modal_no_account: "Don't have an account?", auth_modal_register_link: "Sign Up",
    auth_modal_has_account: "Already have an account?", auth_modal_login_link: "Login",
    auth_modal_forgot_pw_link: "Forgot password?", auth_modal_terms: "By signing up, you agree to our Terms and Privacy Policy.",
    auth_modal_error_username: "Username must be at least 3 characters.",
    sidebar_menu: "Menu", sidebar_dashboard: "Dashboard", sidebar_earn: "Earn",
    sidebar_wallet: "Wallet", sidebar_referrals: "Refer Friends", sidebar_art_battles: "Art Battles",
    sidebar_account: "Account", sidebar_profile: "Profile", sidebar_settings: "Settings",
    sidebar_logout: "Logout", sidebar_login: "Login / Sign Up",
    dashboard_welcome: "Welcome back", dashboard_cta: "Earn Now",
    dashboard_balance: "Balance", dashboard_total_earnings: "Total Earnings",
    dashboard_referrals: "Referred Friends", dashboard_weekly_earnings: "Weekly Earnings",
    earn_title: "Earn Rewards", earn_subtitle: "Choose from our top partners to find the best offers.",
    earn_featured_title: "Featured Offer", earn_providers_title: "All Offer Providers",
    earn_provider_desc: "Choose a provider to get started.",
    art_battle_title: "Zenith Art Battles", art_battle_subtitle: "Use your creativity (and your Zenith Coins) to create unique artworks and win!",
    art_battle_studio_title: "Creation Studio", art_battle_theme_of_day: "Theme of the Day:",
    art_battle_no_contest: "No active contest", art_battle_prompt_label: "Describe your vision",
    art_battle_generate_btn: "Generate Image (50 ZC)", art_battle_generating: "The AI is creating your masterpiece...",
    art_battle_submit_btn: "Submit to Contest", art_battle_retry_btn: "Retry",
    art_battle_submitting: "Submitting...", art_battle_submit_success: "Your artwork has been submitted! Good luck!",
    art_battle_placeholder_title: "Your artwork will appear here", art_battle_placeholder_desc: "Write a prompt and click \"Generate\" to start.",
    art_battle_error_no_contest: "No active contest today.", art_battle_error_generation_failed: "Generation failed.",
    art_battle_error_submit_failed: "Submission failed.",
    payout_title: "Wallet & Payouts", payout_balance: "Available Balance",
    payout_withdraw_with: "Withdraw with PayPal", payout_email_label: "Your PayPal email address",
    payout_amount_label: "Select amount to withdraw", payout_withdraw_btn: "Withdraw",
    payout_modal_title: "Confirm Withdrawal", payout_modal_desc: "You are about to withdraw",
    payout_modal_desc_to: "and send them to", payout_modal_irreversible: "This action is irreversible.",
    payout_modal_cancel: "Cancel", payout_modal_confirm: "Confirm",
    payout_error_email: "Please enter a valid PayPal email address.",
    payout_error_funds: "You do not have enough funds to withdraw this amount.",
    payout_success_message: "Your withdrawal request has been submitted!",
    payout_error_server: "Server error, please try again later.",
    payout_error_connection: "Connection error, please try again.",
    referral_title: "Refer Friends, Earn Together!", referral_desc: "Share your personal link. For every friend who signs up, you'll earn a 10% commission on their earnings, forever!",
    referral_link_title: "Your Unique Referral Link", referral_copy_btn: "Copy Link",
    referral_copied_btn: "Copied!", referral_earnings_title: "Your Referral Earnings",
    referral_count_title: "Referred Friends", referral_loading: "Loading...",
    referral_updated_now: "Updated now", referral_total: "In total",
    profile_title: "Your Profile", profile_info_title: "Account Information",
    profile_avatar_label: "Your avatar", profile_username_label: "Username",
    profile_save_btn: "Save Changes", profile_security_title: "Security",
    profile_current_pw_label: "Current Password", profile_new_pw_label: "New Password",
    profile_change_pw_btn: "Change Password",
    profile_update_success: "Profile updated successfully!",
    profile_pw_change_success: "Password changed successfully!",
    profile_error_generic: "Error during update.",
    profile_error_reauth: "Wrong current password or other error.",
    profile_error_pw_length: "New password must be at least 6 characters.",
    settings_title: "Settings",
    settings_lang_region: "Language & Region",
    settings_lang_desc: "Choose the language to display the application in.",
    settings_notifications: "Notifications",
    settings_email_notifs: "Email notifications for new offers",
    settings_push_notifs: "Push Notifications (Coming Soon)",
    settings_appearance: "Appearance",
    settings_theme: "Theme",
    settings_dark: "Dark",
    settings_account_mgnt: "Account Management",
    settings_delete_account: "Delete Account",
    settings_delete_desc: "This action is permanent and cannot be undone.",
    settings_delete_btn: "Delete",
};


const translations = {
    it: itTranslations,
    en: enTranslations,
};

export type Language = 'it' | 'en';
export const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: TranslationKeys;
    languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<Language>('it');

    useEffect(() => {
        const savedLang = localStorage.getItem('zenith-lang') as Language;
        if (savedLang && translations[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('zenith-lang', lang);
    }, [lang]);

    const value = {
        lang,
        setLang,
        t: translations[lang] || translations.it,
        languages,
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

