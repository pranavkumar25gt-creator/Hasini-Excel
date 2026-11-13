/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: 'rgb(var(--bg-card) / <alpha-value>)',
          100: 'rgb(var(--bg-card) / <alpha-value>)',
          200: 'rgb(var(--bg-base) / <alpha-value>)',
          300: 'rgb(var(--primary-soft) / <alpha-value>)',
          400: 'rgb(var(--border-color) / <alpha-value>)',
        },
        rose: {
          soft: 'rgb(var(--primary-soft) / <alpha-value>)',
          blush: 'rgb(var(--border-color) / <alpha-value>)',
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          deep: 'rgb(var(--primary-hover) / <alpha-value>)',
          accent: 'rgb(var(--primary) / <alpha-value>)',
        },
        plum: {
          light: 'rgb(var(--text-muted) / <alpha-value>)',
          DEFAULT: 'rgb(var(--text-main) / <alpha-value>)',
          deep: 'rgb(var(--text-main) / <alpha-value>)',
          night: 'rgb(var(--bg-base) / <alpha-value>)',
          darkCard: 'rgb(var(--bg-card) / <alpha-value>)',
        },
        gold: {
          light: 'rgb(var(--accent-soft) / <alpha-value>)',
          champagne: 'rgb(var(--accent) / <alpha-value>)',
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'rose-glow': '0 8px 30px rgba(var(--primary), 0.16)',
        'rose-glow-lg': '0 12px 40px rgba(var(--primary), 0.24)',
        'gold-glow': '0 8px 30px rgba(var(--accent), 0.22)',
        'editorial': '0 20px 45px -15px rgba(var(--text-main), 0.14)',
      },
      letterSpacing: {
        'editorial': '0.22em',
        'tracked': '0.15em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
