import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif:  ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans:   ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:   ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#edfdf6',
          100: '#d3f9e8',
          200: '#aaf1d2',
          300: '#72e4b8',
          400: '#38ce97',
          500: '#15b37e',
          600: '#0a9167',
          700: '#087354',
          800: '#095b44',
          900: '#094b39',
          950: '#042a20',
        },
        sand: {
          50:  '#faf8f5',
          100: '#f2ede4',
          200: '#e5dac8',
          300: '#d4c1a3',
          400: '#c0a47c',
          500: '#b08e60',
          600: '#9a7752',
          700: '#7f6145',
          800: '#68503c',
          900: '#564335',
          950: '#2e221a',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up':   'fade-up 0.6s ease forwards',
        'fade-in':   'fade-in 0.5s ease forwards',
        'marquee':   'marquee 30s linear infinite',
        'float':     'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
