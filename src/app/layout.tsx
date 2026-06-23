import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Mundial 2026 · Centro de Análisis',
  description: 'Grupos, tablas y análisis estadístico Poisson del Mundial 2026, con actualización automática.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <footer><div className="wrap">Centro de Análisis Mundial 2026 — modelo Poisson · las probabilidades son estimaciones estadísticas, no certezas · no constituye asesoría de apuestas.</div></footer>
      </body>
    </html>
  );
}
