import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        card: '#171717',
        secondary: '#262626',
        border: '#282828',
        fg: '#fafafa',
        muted: {
          DEFAULT: '#a1a1aa',
          fg: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#7c5cff',
          light: '#a78bff',
        },
        success: '#22c55e',
        warning: '#f5c518',
        decay: '#f87171',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        kicker: '0.22em',
      },
      fontSize: {
        hero: 'clamp(48px, 10vw, 128px)',
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
        toggle: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
