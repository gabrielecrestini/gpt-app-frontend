// src/components/CreationStudio.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LoaderCircle, CreditCard, Star, Image as ImageIcon, FileText, Video, ChevronDown, ChevronUp } from 'lucide-react';
import type { User } from 'firebase/auth';

type ContentType = 'IMAGE' | 'POST' | 'VIDEO';

interface CreationStudioProps {
  user: User | null;
  contestId: number | null;
  onGenerate: (prompt: string, contentType: ContentType, payMethod: 'points' | 'stripe') => Promise<void>;
  isGenerating: boolean;
  paymentMethod: 'points' | 'stripe' | null;
  onShowNotification: (message: string, type: 'success' | 'error') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CreationStudio({
  user,
  contestId,
  onGenerate,
  isGenerating,
  paymentMethod,
  onShowNotification,
  isOpen,
  onToggle,
}: CreationStudioProps) {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<ContentType>('IMAGE');

  const handleLocalGenerate = async (payMethod: 'points' | 'stripe') => {
    if (!user || !prompt) {
      onShowNotification("Per favore, inserisci un prompt e assicurati di essere loggato.", 'error');
      return;
    }
    await onGenerate(prompt, contentType, payMethod);
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/50 p-6 rounded-2xl border border-white/10 mb-12 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={onToggle}>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-400" /> Creation Studio
        </h2>
        {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </div>

      {isOpen && (
        <>
          <div className="flex gap-2 mb-4">
            {(['IMAGE', 'POST', 'VIDEO'] as const).map(type => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  contentType === type ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {type === 'IMAGE' ? <ImageIcon className="h-4 w-4" /> : type === 'POST' ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descrivi la tua idea..."
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 min-h-[80px]"
          ></textarea>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => handleLocalGenerate('points')}
              disabled={isGenerating}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating && paymentMethod === 'points' ? <LoaderCircle className="animate-spin" /> : <><Star size={18} /> Genera con Punti</>}
            </button>
            <button
              onClick={() => handleLocalGenerate('stripe')}
              disabled={isGenerating}
              className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating && paymentMethod === 'stripe' ? <LoaderCircle className="animate-spin" /> : <><CreditCard size={18} /> Genera con Carta</>}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Le prime 3 generazioni costano 50 ZC. Successivamente 1000 ZC o 1,00 €.</p>
        </>
      )}
    </motion.div>
  );
}