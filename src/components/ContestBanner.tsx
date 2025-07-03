// src/components/ContestBanner.tsx
import { motion } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';

interface ContestProps {
  themePrompt: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ContestBanner({ themePrompt, isOpen, onToggle }: ContestProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-purple-500/20 to-red-500/20 p-6 rounded-2xl border border-white/10 mb-12 overflow-hidden"
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-purple-300" /> GARA DEL GIORNO
        </h2>
        {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <p className="text-3xl font-bold mt-2">"{themePrompt}"</p>
          <p className="text-gray-400 text-sm mt-4">Per partecipare, genera un'opera e seleziona il contest prima di pubblicare.</p>
        </motion.div>
      )}
    </motion.div>
  );
}