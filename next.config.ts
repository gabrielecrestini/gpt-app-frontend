// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aggiungi questa opzione per abilitare l'esportazione statica
  output: 'export',

  // Buona pratica: Aggiungi qui il dominio delle immagini di Google
  // per permettere al componente <Image> di caricarle.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;
