import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Nigeria green — brand load-bearing. /quieter dropped `primary.glow`.
        primary: {
          dark: '#003d1e',
          DEFAULT: '#006633',
          light: '#008744',
        },
        // Calm neutral surfaces — replace rgba glassmorphism backgrounds.
        background: {
          DEFAULT: '#fbfcfb',
          secondary: '#f4f7f4',
        },
        // OKLCH-inspired neutrals tinted toward primary green hue 155, chroma <= 0.010.
        // Design brief §5: hex approximations for each token. Use these for surfaces,
        // hairline rules, and text levels.
        neutral: {
          0: '#fbfcfb',
          50: '#f4f7f4',
          100: '#e9eee9',
          200: '#dde2dd',
          300: '#c7cfc7',
          600: '#697269',
          900: '#1c211d',
        },
        text: {
          DEFAULT: '#1c211d',
          secondary: '#697269',
          muted: '#9aa19a',
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
          50: '#fbe9e7',
        },
        blue: {
          DEFAULT: '#1565c0',
        },
        // Semantic coverage tiers — preserved per design brief §5.
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
        // Nigeria zone palette — preserved per design brief §5.
        zone: {
          nw: '#8b0000',
          ne: '#cc4400',
          nc: '#cc8400',
          se: '#006633',
          ss: '#1565c0',
          sw: '#4a148c',
        },
        // Typology data colours — kept; matching `-bg` tints retired per design brief §5.
        typology: {
          access: '#1565c0',
          reference: '#2e7d32',
        },
      },
      fontFamily: {
        // Editorial pair (design brief §4 — Pair B, Source Serif 4 + Source Sans 3).
        // Display = Source Serif 4 (heroes, headings, operational headline numbers).
        // Body    = Source Sans 3 (paragraphs, eyebrows, tabular figures).
        sans: [
          '"Source Sans 3"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: [
          '"Source Serif 4"',
          'ui-serif',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
        display: [
          '"Source Serif 4"',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        body: [
          '"Source Sans 3"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        // Modular scale at 1.25 (major third) anchored at 16 px body — design brief §4.
        // Token : [size-px, { lineHeight, letterSpacing? }]
        'display-1': ['64px', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'display-2': ['48px', { lineHeight: '1.10', letterSpacing: '-0.012em' }],
        'display-3': ['36px', { lineHeight: '1.15', letterSpacing: '-0.008em' }],
        'h1': ['28px', { lineHeight: '1.20', letterSpacing: '-0.005em' }],
        'h2': ['22px', { lineHeight: '1.30' }],
        'h3': ['18px', { lineHeight: '1.40' }],
        'body': ['16px', { lineHeight: '1.60' }],
        'small': ['14px', { lineHeight: '1.55' }],
        'eyebrow': ['12px', { lineHeight: '1.40', letterSpacing: '0.08em' }],
        'mono': ['14px', { lineHeight: '1.50' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      // Editorial radii — keep sm/md/lg only. Pills (>= 9999px) and 2xl (28px) deleted
      // per design brief §10. CoverageTierTag and toggles use rounded-sm (6px).
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      // shadow-sm only — used as a 1 px hairline alternative for table headers.
      // shadow-md/lg/hover removed; nothing in the editorial system lifts.
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
      // No keyframes / animation extensions — ambient motion (heroGradient, pulse,
      // slideUp, fadeIn) deleted per design brief §10. Per-route motion is handled
      // by /animate via framer-motion.
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
