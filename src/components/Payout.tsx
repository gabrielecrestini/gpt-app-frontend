"use client";
import { useState } from 'react';
import type { User } from 'firebase/auth';
import { Wallet, Send, LoaderCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationToast from './NotificationToast';

// CORREZIONE: Rimosso la barra finale dall'URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
const POINTS_TO_EUR_RATE = 1000;

// Tipi di dato usati nel componente
type PayoutProps = {
    user: User | null;
    pointsBalance: number | null;
    refreshBalance: () => void;
};
type Notification = {
    message: string;
    type: 'success' | 'error';
};
type Transaction = {
    id: number;
    type: 'deposit' | 'withdrawal';
    status: 'completed' | 'pending';
    amount: number;
    date: string;
};

// Dati statici per lo storico (da sostituire con una chiamata API in futuro)
const fakeTransactions: Transaction[] = [
    { id: 1, type: 'withdrawal', status: 'completed', amount: 5250, date: '2025-06-28' },
    { id: 2, type: 'deposit', status: 'completed', amount: 1000, date: '2025-06-25' },
    { id: 3, type: 'withdrawal', status: 'pending', amount: 2000, date: '2025-07-01' },
];

// Componente principale
export default function Payout({ user, pointsBalance, refreshBalance }: PayoutProps) {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('PayPal');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const isBalanceLoading = pointsBalance === null;

    const handlePayoutRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !amount || !address) {
            setNotification({ message: "Per favore, compila tutti i campi.", type: 'error' });
            return;
        }
        
        const pointsToWithdraw = parseInt(amount, 10);
        if (isNaN(pointsToWithdraw) || pointsToWithdraw < 1000) {
            setNotification({ message: "L'importo minimo per il prelievo è 1,000 ZC.", type: 'error' });
            return;
        }
        if (pointsToWithdraw > (pointsBalance ?? 0)) {
            setNotification({ message: "Non hai abbastanza Zenith Coins prelevabili.", type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setNotification(null);
        try {
            // CORREZIONE: Aggiunta la barra iniziale al percorso
            const res = await fetch(`${BACKEND_URL}/request_payout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.uid,
                    points_amount: pointsToWithdraw,
                    method: method,
                    address: address,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Si è verificato un errore.');

            setNotification({ message: data.message, type: 'success' });
            refreshBalance();
            setAmount('');
            setAddress('');
        } catch (err: any) {
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const valueInEur = amount && !isNaN(parseInt(amount, 10)) ? (parseInt(amount, 10) / POINTS_TO_EUR_RATE).toFixed(2) : '0.00';

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="p-4 sm:p-8 w-full max-w-6xl mx-auto text-white">
            {/* Header Animato */}
            <motion.header 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
                    <Wallet size={40} /> Portafoglio e Prelievi
                </h1>
                <p className="text-gray-400 mt-3 text-lg">Trasforma i tuoi Zenith Coins in premi reali.</p>
            </motion.header>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Colonna Principale (Form + Storico) */}
                <main className="lg:col-span-3 flex flex-col gap-8">
                    {/* Card Form di Prelievo */}
                    <motion.form onSubmit={handlePayoutRequest} className="bg-gray-900/50 p-8 rounded-2xl border border-white/10 space-y-6" variants={cardVariants} initial="hidden" animate="visible">
                        <h3 className="text-2xl font-bold">Nuova Richiesta di Prelievo</h3>
                        <div>
                            <label htmlFor="amount" className="text-sm font-bold text-gray-400">Importo (ZC)</label>
                            <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Minimo 1,000" className="w-full mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"/>
                            <p className="text-right text-sm text-green-400 mt-1">Equivale a: {valueInEur} EUR</p>
                        </div>
                        <div>
                            <label htmlFor="method" className="text-sm font-bold text-gray-400">Metodo di Pagamento</label>
                            <select id="method" value={method} onChange={e => setMethod(e.target.value)} className="w-full mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                                <option>PayPal</option>
                                <option>Bitcoin</option>
                                <option>Ethereum</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="address" className="text-sm font-bold text-gray-400">{method === 'PayPal' ? 'Email PayPal' : 'Indirizzo Wallet'}</label>
                            <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Inserisci il tuo indirizzo" className="w-full mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"/>
                        </div>
                        <button type="submit" disabled={isSubmitting || isBalanceLoading} className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg font-bold flex items-center justify-center gap-2 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                            {isSubmitting ? <LoaderCircle className="animate-spin" /> : <><Send size={18}/> Invia Richiesta</>}
                        </button>
                    </motion.form>

                    {/* NUOVA SEZIONE: Storico Transazioni */}
                    <motion.div className="bg-gray-900/50 p-8 rounded-2xl border border-white/10" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <h3 className="text-2xl font-bold mb-4">Storico Transazioni</h3>
                        <div className="space-y-4">
                            {fakeTransactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {tx.type === 'deposit' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold capitalize">{tx.type === 'withdrawal' ? 'Prelievo' : 'Deposito'}</p>
                                            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-lg ${tx.type === 'deposit' ? 'text-green-400' : 'text-white'}`}>{tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()} ZC</p>
                                        <p className={`text-xs capitalize ${tx.status === 'completed' ? 'text-gray-400' : 'text-yellow-400'}`}>{tx.status === 'completed' ? 'Completato' : 'In attesa'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </main>
                
                {/* Colonna Laterale (Saldo) */}
                <aside className="lg:col-span-2">
                     <motion.div className="sticky top-8" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        {isBalanceLoading ? (
                            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col justify-center items-center animate-pulse h-60">
                                <div className="w-3/4 h-6 bg-white/10 rounded-md mb-6"></div>
                                <div className="w-1/2 h-16 bg-white/10 rounded-md my-4"></div>
                                <div className="w-1/3 h-4 bg-white/10 rounded-md mt-2"></div>
                            </div>
                        ) : (
                            <div className="backdrop-blur-xl bg-gradient-to-br from-green-900/20 to-gray-900/20 p-8 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center">
                                <p className="text-gray-300 text-lg">Il tuo Saldo Prelievabile</p>
                                <p className="text-5xl sm:text-6xl font-bold my-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-green-300">{(pointsBalance ?? 0).toLocaleString()} <span className="text-4xl">ZC</span></p>
                                <p className="text-gray-400">= circa ${ ((pointsBalance ?? 0) / POINTS_TO_EUR_RATE).toFixed(2) } EUR</p>
                            </div>
                        )}
                    </motion.div>
                </aside>
            </div>

           {notification && <NotificationToast {...notification} onDismiss={() => setNotification(null)} />}
        </div>
    );
}