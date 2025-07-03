// src/components/ConfirmationModal.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';

type ConfirmationModalProps = {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
};

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onClose }: ConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose} // Chiude il modale se si clicca sullo sfondo
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8"
                        onClick={(e) => e.stopPropagation()} // Evita che il click sul modale chiuda se stesso
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500 mb-4">
                                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                            <p className="text-gray-400 mb-8">{message}</p>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={20} /> Annulla
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={20} /> Conferma
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;