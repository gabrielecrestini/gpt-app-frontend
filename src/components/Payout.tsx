// src/components/Payout.tsx
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { CreditCard, AlertTriangle, CheckCircle, LoaderCircle, Bitcoin, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const POINTS_TO_EUR_RATE = 1000; // 1000 ZC = 1€
const EthereumIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12l6-6l6 6l-6 6z" /><path d="M6 12l6 6l6-6l-6-6z" /></svg>
);

type PayoutProps = {
    user: User | null;
    isSynced: boolean;
};

const PayoutOptionTab = ({ icon, label, isActive, onClick }: { icon: JSX.Element, label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors ${isActive ? 'bg-white/5 border-b-2 border-green-400 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
        {icon}<span>{label}</span>
    </button>
);

export default function Payout({ user, isSynced }: PayoutProps) {
   const { t } = useLanguage();
   const [pointsBalance, setPointsBalance] = useState(0);
   const [loading, setLoading] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false);
   const [payoutMethod, setPayoutMethod] = useState('paypal');
   const [payoutAddress, setPayoutAddress] = useState('');
   const [pointsToWithdraw, setPointsToWithdraw] = useState(2000);
   const [showModal, setShowModal] = useState(false);
   const [error, setError] = useState('');
   const [successMessage, setSuccessMessage] = useState('');

   const balanceInEur = pointsBalance / POINTS_TO_EUR_RATE;
   const amountInEur = pointsToWithdraw / POINTS_TO_EUR_RATE;

    useEffect(() => {
        if (user && isSynced) {
            const fetchBalance = async () => {
                setLoading(true);
                setError('');
                const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
                try {
                    const response = await fetch(`${BACKEND_URL}/get_user_balance/${user.uid}`);
                    if (!response.ok) throw new Error(t.payout_error_server);
                    const data = await response.json();
                    setPointsBalance(data.points_balance);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchBalance();
        } else if (!user) {
            setLoading(false);
        }
    }, [user, isSynced, t]);

   const handleWithdraw = () => {
       setError('');
       setSuccessMessage('');
       if (payoutMethod === 'paypal' && (!payoutAddress.includes('@') || !payoutAddress.includes('.'))) {
           setError(t.payout_error_email);
           return;
       }
       if (payoutMethod !== 'paypal' && payoutAddress.length < 26) {
            setError("Indirizzo wallet non valido.");
            return;
       }
       if (pointsToWithdraw > pointsBalance) {
           setError(t.payout_error_funds);
           return;
       }
       setShowModal(true);
   }

   const confirmWithdrawal = async () => {
        if (!user) return;
        setIsProcessing(true);
        setError('');
        setSuccessMessage('');
        try {
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gpt-app-backend.onrender.com";
            const response = await fetch(`${BACKEND_URL}/request_payout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.uid, points_amount: pointsToWithdraw, method: payoutMethod, address: payoutAddress }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Errore sconosciuto.");
            }
            setSuccessMessage(t.payout_success_message);
            setPointsBalance(prev => prev - pointsToWithdraw);
            setPayoutAddress('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
            setShowModal(false);
        }
   }

   const getAddressLabel = () => {
        if(payoutMethod === 'paypal') return t.payout_email_label;
        if(payoutMethod === 'bitcoin') return "Indirizzo Wallet Bitcoin (BTC)";
        if(payoutMethod === 'ethereum') return "Indirizzo Wallet Ethereum (ETH)";
        return "Indirizzo";
   }

   return (
       <div className="w-full max-w-4xl animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-8">{t.payout_title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-gray-400 text-sm">{t.payout_balance}</h3>
                            {loading ? (<LoaderCircle className="animate-spin h-10 w-10 text-gray-400 mt-2" />) : (
                                <div>
                                    <p className="text-4xl font-bold text-green-400">{pointsBalance.toLocaleString()} ZC</p>
                                    <p className="text-sm text-gray-400">~ €{balanceInEur.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                        <CreditCard className="h-12 w-12 text-gray-600"/>
                    </div>
                    <div className="border-b border-gray-700 mb-6 flex space-x-1 md:space-x-4">
                        <PayoutOptionTab icon={<DollarSign size={18}/>} label="PayPal" isActive={payoutMethod === 'paypal'} onClick={() => { setPayoutMethod('paypal'); setPayoutAddress('') }} />
                        <PayoutOptionTab icon={<Bitcoin size={18}/>} label="Bitcoin" isActive={payoutMethod === 'bitcoin'} onClick={() => { setPayoutMethod('bitcoin'); setPayoutAddress('') }} />
                        <PayoutOptionTab icon={<EthereumIcon />} label="Ethereum" isActive={payoutMethod === 'ethereum'} onClick={() => { setPayoutMethod('ethereum'); setPayoutAddress('') }} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="payoutAddress" className="block text-sm font-medium text-gray-300 mb-2">{getAddressLabel()}</label>
                        <input type={payoutMethod === 'paypal' ? 'email' : 'text'} id="payoutAddress" value={payoutAddress} onChange={(e) => setPayoutAddress(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder={payoutMethod === 'paypal' ? 'es. nome@email.com' : 'es. 1A1zP1e...'}/>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">{t.payout_amount_label}: <span className="font-bold text-green-400">{pointsToWithdraw.toLocaleString()} ZC</span></label>
                        <input type="range" id="amount" min="2000" max={Math.max(2000, pointsBalance)} step="100" value={pointsToWithdraw} onChange={(e) => setPointsToWithdraw(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2.000 ZC</span><span>{pointsBalance.toLocaleString()} ZC</span></div>
                    </div>
                    {error && <p className="text-sm text-red-400 mb-4 flex items-center gap-2"><AlertTriangle size={16}/>{error}</p>}
                    {successMessage && <p className="text-sm text-green-400 mb-4 flex items-center gap-2"><CheckCircle size={16}/>{successMessage}</p>}
                    <button onClick={handleWithdraw} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={pointsBalance < 2000 || loading}>
                        {t.payout_withdraw_btn} ~€{amountInEur.toFixed(2)}
                    </button>
                </div>
                <div className="md:col-span-1 backdrop-blur-sm bg-gray-900/50 p-6 rounded-2xl border border-white/10">
                     <h3 className="font-bold text-lg mb-4">Informazioni Prelievo</h3>
                     <div className="text-sm text-gray-400 space-y-4">
                        <p>I prelievi vengono processati manualmente entro 24-48 ore.</p>
                        <p><span className="font-bold text-white">Tasso di Conversione:</span> {POINTS_TO_EUR_RATE} ZC = 1.00€.</p>
                        <p><span className="font-bold text-white">Commissioni PayPal:</span> Nessuna.</p>
                        <p><span className="font-bold text-white">Commissioni Cripto:</span> Variabili in base alla rete. L'importo inviato sarà al netto delle commissioni.</p>
                     </div>
                </div>
            </div>
            {showModal && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-8 rounded-lg max-w-sm w-full border border-gray-700 animate-fade-in-up">
                        <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold text-center">{t.payout_modal_title}</h3>
                        <p className="text-center text-gray-300 mt-2">{t.payout_modal_desc} <span className="font-bold text-white">{pointsToWithdraw.toLocaleString()} ZC</span> {t.payout_modal_desc_to} <span className="font-bold text-white break-all">{payoutAddress}</span>.</p>
                        <p className="text-xs text-center text-gray-500 mt-4">{t.payout_modal_irreversible}</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-600 rounded-lg hover:bg-gray-700" disabled={isProcessing}>{t.payout_modal_cancel}</button>
                            <button onClick={confirmWithdrawal} className="flex-1 py-2 bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center" disabled={isProcessing}>
                                {isProcessing ? <LoaderCircle className="animate-spin" /> : t.payout_modal_confirm}
                            </button>
                        </div>
                    </div>
                 </div>
            )}
       </div>
   );
}