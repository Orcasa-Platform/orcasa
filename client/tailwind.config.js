/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/containers/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/constants/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-roboto-slab)', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        '3.5xl': ['32px', '48px'],
        '3.8xl': ['34px', '50px'],
      },
      colors: {
        main: 'hsl(var(--main))',
        yellow: {
          50: '#FFF7E6',
          // Geospatial data
          500: '#FFD500',
          // Geospatial data highlighted text
          600: '#FFC200',
        },
        blue: {
          50: '#F2F7FB',
          100: '#EAF1F8',
          400: '#4BA1F1',
          // Organizations
          500: '#358FE3',
          800: '#0765BD',
          900: '#2A4374',
        },
        gray: {
          50: '#F7F7F9',
          100: '#F0F0F5',
          200: '#CFD1DB',
          // Disabled for buttons / labels
          300: '#B2B5C5',
          400: '#8B90A4',
          500: '#7C7F8F',
          600: '#565D79',
          700: '#3C4363',
          800: '#2C324B',
          900: '#1D2133',
        },
        peach: {
          50: '#FFF7EF',
          100: '#FFECDB',
          // Projects
          700: '#EF6A4C',
          900: '#CA3412',
        },
        brown: {
          // Practices
          500: '#BA7300',
        },
        green: {
          // Scientific evidence
          700: '#2BB3A7',
        },
        purple: {
          // Datasets
          50: '#F0EBF4',
          700: '#8380BC',
          900: '#584484',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      textColor: {
        default: 'hsl(var(--main))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        DEFAULT: '0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button');
    }),
  ],
};
