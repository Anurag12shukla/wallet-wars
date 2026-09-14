/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Gold & Obsidian Design Tokens
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#FFD700',
          bright: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
          auric: '#EAB308',
        },
        chrome: {
          light: '#FFFFFF',
          DEFAULT: '#F1F5F9',
          muted: '#94A3B8',
          dark: '#64748B',
          border: '#334155',
        },
        obsidian: {
          deepest: '#040507',
          darker: '#07080B',
          dark: '#0D0F14',
          card: '#12141C',
          'card-hover': '#181B26',
          border: '#242838',
          'border-active': 'rgba(245, 158, 11, 0.5)',
        },
        crimson: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          glow: 'rgba(239, 68, 68, 0.4)',
        },
        // Mapped Brand Tokens (for existing component compatibility)
        robinhood: {
          green: '#F59E0B', // Mapped to primary vibrant gold
          'green-light': '#FBBF24',
          'green-dark': '#D97706',
          red: '#EF4444',
          'red-light': '#F87171',
          gold: '#FFD700',
          dark: '#0D0F14',
          darker: '#07080B',
          card: '#12141C',
          'card-hover': '#181B26',
          border: '#242838',
          'border-active': 'rgba(245, 158, 11, 0.4)',
        },
        brand: {
          gold: '#FFD700',
          amber: '#F59E0B',
          chrome: '#E2E8F0',
          green: '#10B981',
          purple: '#F59E0B', // Mapped to primary gold
          cyan: '#FFD700',   // Mapped to bright gold
          dark: '#0D0F14',
          darker: '#07080B',
          card: '#12141C',
          border: '#242838',
        },
        rarity: {
          common: '#94A3B8',
          uncommon: '#10B981',
          rare: '#38BDF8',
          epic: '#A855F7',
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
        'hero-glow': 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
        'gold-glow': 'radial-gradient(circle at center, rgba(255, 215, 0, 0.25) 0%, transparent 70%)',
        'card-glow': 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
        'gold-metallic': 'linear-gradient(135deg, #FFE066 0%, #F59E0B 50%, #B45309 100%)',
        'chrome-metallic': 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #64748B 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 10s linear infinite',
        'halo': 'halo 4s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.15)' },
          '100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.7), 0 0 40px rgba(245, 158, 11, 0.35), 0 0 60px rgba(255, 215, 0, 0.2)' },
        },
        halo: {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.08)', opacity: '0.75' },
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
