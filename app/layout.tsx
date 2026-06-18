import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Raigardas — Creative Developer · AI Automation',
  description:
    'Raigardas — IT student crafting AI-driven tools that make automation effortless. Portfolio.',
  keywords: ['Raigardas', 'portfolio', 'AI automation', 'creative developer', 'IT student', 'Vilnius'],
  authors: [{ name: 'Raigardas' }],
  openGraph: {
    title: 'Raigardas — Creative Developer · AI Automation',
    description: 'IT student crafting AI-driven tools that make automation effortless.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Lexend:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
