// src/components/Offerwall.tsx
import { useLanguage } from '../context/LanguageContext';
import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Dati fittizi per i provider di offerte.
// Sostituisci i loghi con quelli reali quando li avrai.
const offerProviders = [
    { 
        name: 'CPX Research', 
        logo: 'https://placehold.co/64x64/2d3748/ffffff?text=CPX', 
        description: 'Sondaggi di alta qualità' 
    },
    { 
        name: 'AdGate Media', 
        logo: 'https://placehold.co/64x64/2d3748/ffffff?text=AdG', 
        description: 'Offerte, video e altro' 
    },
    { 
        name: 'Ayet Studios', 
        logo: 'https://placehold.co/64x64/2d3748/ffffff?text=Ayet', 
        description: 'Guadagna provando nuove app' 
    },
    { 
        name: 'Lootably', 
        logo: 'https://placehold.co/64x64/2d3748/ffffff?text=Loot', 
        description: 'Un mondo di offerte diverse' 
    },
];

export default function Offerwall() {
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-6xl animate-fade-in-up">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-bold">{t.earn_title}</h1>
                <p className="text-gray-400 mt-1">{t.earn_subtitle}</p>
            </header>

            {/* Sezione Offerta in Evidenza */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Star className="text-yellow-400" />
                    {t.earn_featured_title}
                </h2>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row items-center gap-6 transition-all hover:border-green-400/50">
                    <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image 
                            src="https://placehold.co/100x100/1a202c/4ade80?text=ZEN" 
                            alt="Logo offerta in evidenza" 
                            width={100} 
                            height={100} 
                            className="rounded-md" 
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-xl">Sondaggi Esclusivi Zenith</h3>
                        <p className="text-gray-400 text-sm mt-1">Rispondi a sondaggi personalizzati e guadagna fino a 5$ per ogni completamento. I tuoi primi 100 punti sono in regalo!</p>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105 mt-4 md:mt-0">
                        <span>Inizia Ora</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Griglia dei Provider */}
            <div>
                 <h2 className="text-2xl font-bold mb-4">{t.earn_providers_title}</h2>
                 <p className="text-gray-400 mb-6">{t.earn_provider_desc}</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offerProviders.map(provider => (
                        <div 
                            key={provider.name} 
                            className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 hover:border-teal-400/50 hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-white rounded-lg p-1 flex-shrink-0">
                                <Image 
                                    src={provider.logo} 
                                    alt={`${provider.name} logo`} 
                                    width={64} 
                                    height={64} 
                                    className="rounded-md" 
                                    unoptimized // Necessario per alcuni placeholder esterni
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{provider.name}</h4>
                                <p className="text-sm text-gray-400">{provider.description}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
}