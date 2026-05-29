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
          DEFAULT: '#16161A', // Ember near-black (cooler than Apple grey)
          soft:    '#3A3A40',
          mute:    '#6E6E76',
        },
        cream: {
          // "cream" names stay so no component files need touching.
          50:  '#FFFFFF',
          100: '#F5F5F7',
          200: '#E8E8ED',
        },
        accent: {
          DEFAULT: '#FF6B3D', // ember
          warm:    '#F2A65A',
          rose:    '#FF4D6D',
          violet:  '#7C5CFF',
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
