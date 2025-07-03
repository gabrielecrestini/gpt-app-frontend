// src/components/CssAvatars.tsx

// Avatar 1: Un'orbita di energia cosmica
export const CosmicOrbitAvatar = () => (
    <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full bg-gray-900 border-2 border-purple-500/50"></div>
        {/* Pianeta centrale */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500"></div>
        {/* Luna in orbita */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-teal-300 shadow-lg shadow-teal-300/50"></div>
        </div>
    </div>
);

// Avatar 2: Un cristallo energetico
export const EnergyCrystalAvatar = () => (
    <div className="relative w-10 h-10 flex items-center justify-center">
        <div 
            className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-300 transition-all duration-300 group-hover:rotate-45"
            style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
        ></div>
    </div>
);

// Avatar 3: Aura Nebulosa con Iniziale
export const NebulaAuraAvatar = ({ name }: { name?: string | null }) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'Z';
    return (
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gray-900 overflow-hidden">
            {/* Strati della nebulosa */}
            <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/50 to-transparent filter blur-md"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-purple-600/50 to-transparent filter blur-md"></div>
            {/* Iniziale */}
            <span className="relative z-10 text-lg">{initial}</span>
        </div>
    );
};