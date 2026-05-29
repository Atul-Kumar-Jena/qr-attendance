import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1280px' } },
    extend: {
      fontFamily: {
        // Both display + body use Nunito Sans — Apple-style single-family.
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          // Theme-aware foreground. Driven by CSS vars (RGB channels so /alpha
          // modifiers work) → text-ink, text-ink/70, bg-ink, border-ink/10 etc.
          // all invert automatically between light and dark, so letters never
          // disappear on theme toggle.
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          soft:    'rgb(var(--ink-soft-rgb) / <alpha-value>)',
          mute:    'rgb(var(--ink-mute-rgb) / <alpha-value>)',
        },
        cream: {
          // "cream" names stay so no component files need touching.
          50:  '#FFFFFF',
          100: '#F5F5F7',
          200: '#E8E8ED',
        },
        accent: {
          // Monochrome, theme-aware. Driven by CSS vars so every accent class
          // flips automatically across light / dark / .section-dark contexts.
          // RGB channels keep Tailwind's /alpha modifiers (bg-accent/20) working.
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          warm:    'rgb(var(--accent-2-rgb) / <alpha-value>)',
          rose:    'rgb(var(--accent-2-rgb) / <alpha-value>)',
          violet:  'rgb(var(--accent-3-rgb) / <alpha-value>)',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
        tightish: '-0.02em',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
