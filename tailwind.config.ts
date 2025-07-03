// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // --- CODICE PER L'ANIMAZIONE "AURORA" AGGIUNTO QUI ---
      animation: {
        blob: 'blob 8s infinite alternate',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      // -----------------------------------------------------

      // Se in futuro vorrai aggiungere altri stili personalizzati,
      // come colori o font, puoi farlo qui.
      // Esempio:
      // colors: {
      //   'brand-purple': '#6b21a8',
      // }
    },
  },
  plugins: [],
};
export default config;