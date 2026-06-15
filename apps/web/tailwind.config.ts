import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1280px' } },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#13231A',
          soft: '#23362A',
          mute: '#5E6B56',
        },
        cream: {
          50: '#F4EFDF',
          100: '#EAE3CE',
          200: '#DCD3B8',
        },
        sage: {
          400: '#6FD3A0',
          500: '#2E8A5C',
          600: '#1F7A52',
        },
        accent: {
          DEFAULT: '#2E8A5C',
          warm: '#D7B65A',
          gold: '#D7B65A',
          ivory: '#EAD79B',
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
