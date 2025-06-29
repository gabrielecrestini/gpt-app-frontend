// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith Rewards - Guadagna Online",
  description: "La tua piattaforma per guadagnare completando offerte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-gray-900`}>{children}</body>
    </html>
  );
}
