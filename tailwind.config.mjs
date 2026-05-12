/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Siko palette — derived from the actual product surfaces.
      // The product itself is two-toned: dark overlay UI (for the kid)
      // and a light email report (for the parent). The landing page
      // is parent-facing primarily, so cream is the page ground and
      // dark surfaces are used as inset "product moments."
      colors: {
        // Page ground + ink
        cream: {
          DEFAULT: '#FBF8F1',
          50: '#FDFBF6',
          100: '#FBF8F1',
          200: '#F5EFE0',
          300: '#EFE7D1',
          400: '#E5D9B8',
        },
        ink: {
          DEFAULT: '#16161D',
          900: '#16161D',
          800: '#1F1F28',
          700: '#2A2A33',
          600: '#3D3D48',
          500: '#5C5C66',
          400: '#7A7A84',
          300: '#9A9AA3',
          200: '#BFBFC6',
          100: '#E5E2D8', // border
        },
        // Warm gold — softened from the product's #FFD84D so it reads
        // calmer on cream than it does on dark.
        gold: {
          DEFAULT: '#B8893A',
          50: '#FAF4E2',
          100: '#F2E4B8',
          200: '#E8CD7F',
          300: '#D4AD4A',
          400: '#B8893A',
          500: '#8F6920',
          600: '#5E4612',
        },
        // State accents (muted for cream ground)
        sage: '#94A98B',
        dusty: '#8FA3BE',
        terra: '#C18965',
        // Dark surface — for product-moment insets. Exactly matches
        // overlay.html's bubble background so screenshots-in-CSS are
        // pixel-faithful.
        surface: {
          DEFAULT: '#16181E',
          dark: '#0E0F13',
          card: '#1F222B',
          border: 'rgba(255, 255, 255, 0.14)',
        },
        // Bright product accents — for use *only* inside product moments
        // (these are too saturated for the page itself).
        product: {
          yellow: '#FFD84D',
          yellowSoft: 'rgba(255, 216, 77, 0.18)',
          yellowBorder: 'rgba(255, 216, 77, 0.55)',
          green: '#8CDCA0',
          blue: '#78B4FF',
          cyan: '#78D2DC',
          orange: '#F4A259',
        },
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        'eyebrow': '0.14em',
      },
      fontSize: {
        // Custom display sizes for the hero
        'display-1': ['clamp(2.75rem, 5.6vw, 5.25rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-2': ['clamp(2.25rem, 4.2vw, 3.75rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-3': ['clamp(1.6rem, 2.8vw, 2.4rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        'page': '1180px',
        'prose-wide': '720px',
      },
      animation: {
        'bubble-breath': 'bubbleBreath 4.2s ease-in-out infinite',
        'dot-pulse': 'dotPulse 3.6s ease-in-out infinite',
        'mark-pulse': 'markPulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        bubbleBreath: {
          '0%, 100%': { opacity: '0.96' },
          '50%': { opacity: '1' },
        },
        dotPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        markPulse: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 8px rgba(255, 216, 77, 0.55)) drop-shadow(0 0 28px rgba(255, 216, 77, 0.32))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 12px rgba(255, 216, 77, 0.75)) drop-shadow(0 0 40px rgba(255, 216, 77, 0.45))',
          },
        },
      },
    },
  },
  plugins: [],
};
