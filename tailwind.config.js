import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#003d1e',
          DEFAULT: '#006633',
          light: '#008744',
          glow: 'rgba(0, 102, 51, 0.25)',
        },
        background: {
          DEFAULT: '#f0f4f0',
          secondary: '#e8f0e8',
          card: 'rgba(255, 255, 255, 0.80)',
          'card-hover': 'rgba(255, 255, 255, 0.92)',
        },
        text: {
          DEFAULT: '#0d1b2a',
          secondary: '#546e7a',
          muted: '#78909c',
          inverse: '#ffffff',
        },
        gold: {
          DEFAULT: '#e6a817',
          dark: '#cc8400',
        },
        red: {
          DEFAULT: '#d32f2f',
          dark: '#b33000',
          deep: '#6b1a1a',
        },
        blue: {
          DEFAULT: '#1565c0',
        },
        coverage: {
          ontrack: '#006633',
          'ontrack-bg': '#e8f5e9',
          atrisk: '#cc8400',
          'atrisk-bg': '#fff8e1',
          critical: '#b33000',
          'critical-bg': '#fbe9e7',
          crisis: '#6b1a1a',
          'crisis-bg': '#fce4ec',
        },
        zone: {
          nw: '#8b0000',
          ne: '#cc4400',
          nc: '#cc8400',
          se: '#006633',
          ss: '#1565c0',
          sw: '#4a148c',
        },
        typology: {
          access: '#1565c0',
          'access-bg': '#e3f2fd',
          reference: '#2e7d32',
          'reference-bg': '#e8f5e9',
        },
      },
      fontFamily: {
        inter: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '16px',
        '2xl': '28px',
        pill: '50px',
      },
      backdropBlur: {
        card: '16px',
        hero: '12px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        hover: '0 8px 28px rgba(0, 102, 51, 0.15)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        heroGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.02)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.45s ease-out',
        heroGradient: 'heroGradient 8s ease infinite',
        pulse: 'pulse 2.5s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [typography],
};
