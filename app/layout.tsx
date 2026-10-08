import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXUS // Compa AI - Asistente Inteligente',
  description: 'Asistente de inteligencia artificial NEXUS con núcleo 3D interactivo bioluminiscente, síntesis de voz y estilo casual y directo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#060E0A] text-slate-100 antialiased selection:bg-[#00F5A0]/30 selection:text-[#00F5A0]">
        {children}
      </body>
    </html>
  );
}
