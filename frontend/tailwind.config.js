/** @type {import('tailwindcss').Config} */
module.exports = {
  /* ------------------------------------------------------------ *
   * 1) Light/Dark via classe .dark no <html>                      *
   * ------------------------------------------------------------ */
  darkMode: 'class',

  /* ------------------------------------------------------------ *
   * 2) Fontes de conteúdo (Angular + eventuais libs React/JSX)    *
   * ------------------------------------------------------------ */
  content: [
    './src/**/*.{html,ts}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],

  /* ------------------------------------------------------------ *
   * 3) Tokens                                                     *
   * ------------------------------------------------------------ */
  theme: {
    extend: {
      colors: {
        /* ——— via CSS Vars (Design System) ——— */
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',

        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        /* ——— Paleta fixa extra (uso livre) ——— */
        primaryBrand:   { light: '#FCA5A5', DEFAULT: '#EF4444', dark: '#B91C1C' },
        secondaryBrand: { light: '#FECACA', DEFAULT: '#DC2626', dark: '#991B1B' },

        /* ——— Background estático opcional ——— */
        backgroundStatic: { light: '#FFFFFF', dark: '#000000' },

        /* ——— Escala de cinzas ——— */
        gray: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },

      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        '3xl':'1.5rem',
        '4xl':'2rem',
        '5xl':'2.5rem',
      },

      boxShadow: {
        'card-light': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'card-dark':  '0 10px 15px -3px rgba(255,255,255,0.1), 0 4px 6px -2px rgba(255,255,255,0.05)',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif:['Merriweather', 'ui-serif', 'Georgia'],
      },

      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.71,0.04,0.29,0.99)',
      },
    },
  },

  /* ------------------------------------------------------------ *
   * 4) Plugins Tailwind                                           *
   * ------------------------------------------------------------ */
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
