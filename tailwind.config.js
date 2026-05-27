/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"ZCOOL XiaoWei"', 'serif'],
        'body': ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        wine: {
          950: '#0d0408',
          900: '#1a0810',
          800: '#2d1020',
          700: '#4a1a30',
        },
        rose: {
          blush: '#c4687a',
          petal: '#e8a0b0',
          light: '#f5d0d8',
        },
        gold: {
          warm: '#c9a96e',
          soft: '#e8d5a3',
        }
      },
      animation: {
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1.0) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.12) translate(-2%, -2%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
