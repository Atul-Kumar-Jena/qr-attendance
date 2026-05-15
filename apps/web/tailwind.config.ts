import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
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
          DEFAULT: '#0B1220',
          soft: '#1A2236',
          mute: '#5A6783',
        },
        cream: {
          50: '#FAFAF7',
          100: '#F4F3EC',
          200: '#EAE7DA',
        },
        sage: {
          400: '#9DB39A',
          500: '#7C967A',
          600: '#5F7B5E',
        },
        accent: {
          DEFAULT: '#FF6B3D',
          warm: '#F2A65A',
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
