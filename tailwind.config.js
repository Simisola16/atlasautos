/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C9A84C',
          50: '#fcf7ec',
          100: '#fbecd6',
          200: '#f5d9b0',
          300: '#efc58a',
          400: '#e9b264',
          500: '#c9a84c',
          600: '#a68f3f',
          700: '#837330',
          800: '#5f5a22',
          900: '#3c4015',
        },
        car: {
          bg: '#080808',
          surface: '#111111',
          gold: '#C9A84C',
          'gold-muted': 'rgba(201, 168, 76, 0.2)',
          silver: '#E8E8E8',
          muted: '#888888',
          border: 'rgba(201, 168, 76, 0.2)',
        },
        danger: {
          DEFAULT: '#C0392B',
        },
        dark: {
          DEFAULT: '#080808',
          50: '#111111',
          100: '#222222',
          200: '#333333',
          300: '#444444',
          400: '#555555',
          500: '#666666',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
