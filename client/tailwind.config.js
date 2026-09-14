/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wallet Wars design system
        brand: {
          purple: '#9945FF',
          cyan: '#14F195',
          dark: '#0a0a0f',
          darker: '#060609',
          card: '#12121a',
          border: '#1e1e2e',
        },
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          blue: '#4A90D9',
        },
        rarity: {
          common: '#8b8b8b',
          uncommon: '#14F195',
          rare: '#4A90D9',
          epic: '#9945FF',
          legendary: '#FFD700',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at center, rgba(153, 69, 255, 0.15) 0%, transparent 70%)',
        'card-glow': 'linear-gradient(135deg, rgba(153,69,255,0.08) 0%, rgba(20,241,149,0.05) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(153,69,255,0.3), 0 0 10px rgba(153,69,255,0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(153,69,255,0.6), 0 0 20px rgba(153,69,255,0.4), 0 0 40px rgba(153,69,255,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
