'use client';

import { useMemo } from 'react';

/**
 * Drifting token stream — monospace skill/tool names cascading
 * down behind a section. Pure CSS animation, edge-masked.
 * Low opacity, purely atmospheric.
 */
const TOKENS = [
  'python', 'agents', 'react', 'next.js', 'three.js', 'automation',
  'openai', 'langchain', 'typescript', 'node', 'docker', 'git',
  'graphql', 'postgres', 'redis', 'tailwind', 'framer', 'vite',
  'playwright', 'figma', 'vercel', 'linux', 'webgl', 'shaders',
  'fastapi', 'selenium', 'cron', 'bash', 'api', 'webhooks',
  'claude', 'gpt', 'mistral', 'chromadb', 'rag', 'embeddings',
  'scraper', 'pipeline', 'workflow', 'scheduler', 'telegram',
];

const TOKEN_COUNT = 42;

export function TokenStream({ className = '' }: { className?: string }) {
  const items = useMemo(() => {
    return Array.from({ length: TOKEN_COUNT }, (_, i) => {
      const token = TOKENS[i % TOKENS.length];
      const x = Math.random() * 100;
      const duration = 14 + Math.random() * 18; // 14–32s
      const delay = Math.random() * -30; // stagger
      const drift = (Math.random() - 0.5) * 60; // horizontal sway in px
      const opacity = 0.08 + Math.random() * 0.1; // 8–18%
      const size = 10 + Math.random() * 2; // 10–12px

      return { token, x, duration, delay, drift, opacity, size };
    });
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        maskImage:
          'linear-gradient(90deg, transparent, black 8% 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, black 8% 92%, transparent)',
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute block font-mono whitespace-nowrap"
          style={{
            left: `${item.x}%`,
            top: 0,
            fontSize: `${item.size}px`,
            color: 'rgba(255,255,255,0.6)',
            '--tok-opacity': item.opacity,
            '--tok-drift': `${item.drift}px`,
            animation: `drift-fall ${item.duration}s linear ${item.delay}s infinite`,
            opacity: item.opacity,
            letterSpacing: '0.04em',
          } as React.CSSProperties}
        >
          {item.token}
        </span>
      ))}
    </div>
  );
}
