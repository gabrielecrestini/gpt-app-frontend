// src/app/template.tsx

'use client'; // Dichiariamo questo come un Componente Client per usare le animazioni

import { motion } from 'framer-motion';

// Definiamo le varianti dell'animazione per un effetto di dissolvenza e scorrimento
const variants = {
    hidden: { opacity: 0, x: 0, y: 20 }, // Stato iniziale: invisibile e leggermente spostato in basso
    enter: { opacity: 1, x: 0, y: 0 },   // Stato finale: completamente visibile e nella sua posizione finale
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
        variants={variants}
        initial="hidden"
        animate="enter"
        transition={{ ease: 'easeInOut', duration: 0.75 }}
    >
      {children}
    </motion.main>
  );
}