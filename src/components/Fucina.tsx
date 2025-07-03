// src/components/Fucina.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, Gem, LoaderCircle, X, CreditCard, Star } from 'lucide-react';
import NotificationToast from './NotificationToast';

// Import di Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// --- Tipi di Dato ---
type ShopItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    price_eur: number;
    item_type: 'BOOST' | 'COSMETIC';
};
type Notification = { message: string; type: 'success' | 'error' };

// --- Costanti e Setup Stripe ---
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// --- Sotto-Componente Card Oggetto ---
const ShopItemCard = ({ item, onPurchase }: { item: ShopItem, onPurchase: (item: ShopItem) => void }) => (
    <motion.div 
        className="group" style={{ perspective: '1000px' }}
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
    >
        <div
            className="relative backdrop-blur-xl bg-gray-900/40 p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col text-center items-center gap-4 transition-all duration-300 ease-out h-full group-hover:[transform:rotateX(5deg)]"
            style={{ transformStyle: 'preserve-3d' }}
        >
             <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(400px at 50% 50%, rgba(255, 255, 255, 0.1), transparent 80%)' }}></div>
            <div className="relative transition-transform duration-300 group-hover:-translate-y-2" style={{ transform: 'translateZ(40px)' }}>
                <div className="p-5 bg-gray-800 rounded-full border-2 border-gray-700 shadow-lg">
                    {item.item_type === 'BOOST' ? <Zap className="w-10 h-10 text-yellow-400"/> : <Gem className="w-10 h-10 text-pink-400"/>}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white relative" style={{ transform: 'translateZ(20px)' }}>{item.name}</h3>
            <p className="text-sm text-gray-400 flex-grow min-h-[40px] relative">{item.description}</p>
            <button 
                onClick={() => onPurchase(item)}
                className="w-full mt-auto py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/30 relative"
                style={{ transform: 'translateZ(30px)' }}
            >
                Acquista
            </button>
        </div>
    </motion.div>
);

// --- Componente Principale Fucina ---
export default function Fucina({ user }: { user: User | null }) {
    const [items, setItems] = useState<ShopItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Carica gli articoli dal negozio
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/shop/items`);
                if (!res.ok) throw new Error("Impossibile caricare gli oggetti del negozio.");
                setItems(await res.json());
            } catch (err) {
                setNotification({ message: (err as Error).message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

    // Gestisce il pagamento con PUNTI
    const handlePayWithPoints = async () => {
        if (!user || !selectedItem) return;
        setIsProcessing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/shop/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid, item_id: selectedItem.id, payment_method: 'points' })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);
            setNotification({ message: data.message || "Acquisto completato!", type: 'success' });
            setSelectedItem(null);
        } catch (err) {
            setNotification({ message: (err as Error).message, type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    // Gestisce il pagamento con SOLDI VERI (Stripe)
    const handlePayWithStripe = async () => {
        if (!user || !selectedItem) return;
        setIsProcessing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/shop/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid, item_id: selectedItem.id, payment_method: 'stripe' })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);
            setClientSecret(data.client_secret);
        } catch (err) {
            setNotification({ message: (err as Error).message, type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    // Chiude il modal e resetta lo stato
    const closeModal = () => {
        setSelectedItem(null);
        setClientSecret(null);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white min-h-screen w-full">
            <header className="text-center mb-12 animate-fade-in-down">
                 <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 flex items-center justify-center gap-3">
                    <ShoppingCart className="w-8 h-8 md:w-12 md:h-12" /> La Fucina di Zenith
                 </h1>
                 <p className="text-gray-400 mt-3 text-lg">Potenzia la tua esperienza. Spendi le tue Zenith Coins con saggezza.</p>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin h-12 w-12 text-yellow-400"/></div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    initial="hidden" animate="visible" transition={{ staggerChildren: 0.07 }}
                >
                    {items.map(item => <ShopItemCard key={item.id} item={item} onPurchase={setSelectedItem} />)}
                </motion.div>
            )}

            {/* MODAL DI PAGAMENTO */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-800 p-8 rounded-2xl w-full max-w-md relative border border-purple-500/50 shadow-lg"
                        >
                            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X/></button>
                            <h2 className="text-2xl font-bold mb-6 text-center">Acquista: {selectedItem.name}</h2>
                            
                            {!clientSecret ? (
                                <div className="space-y-4">
                                    <p className="text-center text-gray-300 mb-6">Scegli come vuoi pagare.</p>
                                    <button onClick={handlePayWithPoints} disabled={isProcessing} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:bg-gray-600">
                                        {isProcessing ? <LoaderCircle className="animate-spin"/> : <><Star size={18}/> {selectedItem.price.toLocaleString()} ZC</>}
                                    </button>
                                    <button onClick={handlePayWithStripe} disabled={isProcessing} className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:bg-gray-600">
                                        {isProcessing ? <LoaderCircle className="animate-spin"/> : <><CreditCard size={18}/> {(selectedItem.price_eur || 0).toFixed(2)} €</>}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-center">Completa il pagamento sicuro</h3>
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <CheckoutForm />
                                    </Elements>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

           {notification && <NotificationToast {...notification} onDismiss={() => setNotification(null)} />}
        </div>
    );
}