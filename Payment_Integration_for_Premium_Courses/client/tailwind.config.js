/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14213D',
          light: '#4A5468',
          faint: '#8A93A3',
        },
        paper: {
          DEFAULT: '#F5F5F0',
          raised: '#FFFFFF',
        },
        gold: {
          DEFAULT: '#B8892B',
          light: '#E8C874',
          dark: '#8C6720',
        },
        forest: {
          DEFAULT: '#2F6F52',
          light: '#DCEBE2',
        },
        line: '#E3E0D6',
        danger: {
          DEFAULT: '#B23A34',
          light: '#F6DEDC',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 33, 61, 0.06), 0 8px 24px -12px rgba(20, 33, 61, 0.18)',
        raised: '0 4px 14px -4px rgba(20, 33, 61, 0.25)',
      },
      borderRadius: {
        card: '14px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        fadeUp: 'fadeUp 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
