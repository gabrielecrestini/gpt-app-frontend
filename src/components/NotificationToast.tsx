"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

// 1. Definisci le props che il componente accetta, includendo onDismiss
type NotificationToastProps = {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void; // <-- La prop che mancava
};

export default function NotificationToast({ message, type, onDismiss }: NotificationToastProps) {
  
  // 2. Aggiungi un timer per chiudere automaticamente la notifica
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Chiude dopo 5 secondi

    // Pulisce il timer se il componente viene rimosso prima
    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss]);

  const isSuccess = type === 'success';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`fixed bottom-5 right-5 flex items-center p-4 max-w-sm w-full rounded-lg shadow-lg text-white z-50
        ${isSuccess ? 'bg-green-600/90 backdrop-blur-sm border border-green-400' : 'bg-red-600/90 backdrop-blur-sm border border-red-400'}`}
    >
      <div className="flex-shrink-0">
        {isSuccess ? <CheckCircle size={24} /> : <XCircle size={24} />}
      </div>
      <div className="ml-3 mr-4 text-sm font-medium">
        {message}
      </div>
      {/* 3. Aggiungi un pulsante di chiusura che usa onDismiss */}
      <button
        onClick={onDismiss}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 hover:bg-white/20 focus:ring-2 focus:ring-white transition-colors"
      >
        <X size={20} />
      </button>
    </motion.div>
  );
}