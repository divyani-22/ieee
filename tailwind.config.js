/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // "Soft pastel learning app" Design Tokens
        pastelBg: '#F3F1F8',
        pastelLavenderBg: '#E9E1F5',
        mint: {
          DEFAULT: '#D6EAE1',
          accent: '#A8D5C2',
          dark: '#589A80',
        },
        lavender: {
          DEFAULT: '#D9CDEE',
          accent: '#B9A6E3',
          dark: '#7D64B5',
        },
        butterYellow: {
          DEFAULT: '#FCE6A6',
          accent: '#E5CB82',
          dark: '#B89431',
        },
        periwinkle: {
          DEFAULT: '#CFD3F0',
          accent: '#B2B9E4',
          dark: '#5660A6',
        },
        skyBlue: {
          DEFAULT: '#6FA8E8',
          light: '#A9CBF5',
        },
        pastelText: {
          primary: '#16161D',
          secondary: '#6B6B7B',
          muted: '#A3A3B5',
        },
        darkPill: '#22222B',
        navy: {
          DEFAULT: '#16161D',
          50: '#F4F6FB',
          100: '#E5E9F5',
          200: '#C7D1EA',
          300: '#9FB0DA',
          600: '#20294F',
          700: '#1A2140',
          800: '#141A32',
          900: '#0E1224',
        },
        lightBlue: {
          DEFAULT: '#D6EAE1',
          50: '#F5F8FE',
          100: '#E8F1FD',
          200: '#AFC7F7',
          300: '#8EB2F4',
          400: '#6C9CF0',
          500: '#4A87EC',
        },
        coral: {
          DEFAULT: '#F58D87',
          50: '#FEF6F5',
          100: '#FDECEB',
          200: '#FBBDB9',
          300: '#F9A5A0',
          400: '#F58D87',
          500: '#E8706A',
          600: '#D5554F',
        },
        yellowPastel: {
          DEFAULT: '#FCE6A6',
          50: '#FFFCF2',
          100: '#FFF8DD',
          200: '#FFF0B8',
          300: '#FFE68C',
          400: '#FFDC61',
          500: '#E6C33D',
        },
        pageBg: {
          DEFAULT: '#F3F1F8',
          dark: '#16161D',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#20294F',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#AFC7F7',
          foreground: '#20294F',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#FFDC61',
          foreground: '#20294F',
        },
        border: 'hsl(var(--border))',
        ring: '#AFC7F7',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',    // 32px
        '5xl': '2.25rem', // 36px
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'pillowy': '0 12px 40px rgba(120, 100, 170, 0.12)',
        'pillowy-hover': '0 18px 50px rgba(120, 100, 170, 0.18)',
        'soft': '0 8px 30px rgba(32, 41, 79, 0.06)',
        'soft-md': '0 12px 35px rgba(32, 41, 79, 0.08)',
        'soft-lg': '0 20px 45px rgba(32, 41, 79, 0.1)',
        'lavender-soft': '0 14px 35px rgba(185, 166, 227, 0.35)',
        'mint-soft': '0 14px 35px rgba(168, 213, 194, 0.35)',
        'yellow-soft': '0 14px 35px rgba(252, 230, 166, 0.4)',
        'coral-soft': '0 12px 30px rgba(245, 141, 135, 0.28)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'float-slow': 'floatSlow 4s infinite ease-in-out',
        'float-reverse': 'floatReverse 5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
      }
    },
  },
  plugins: [],
}
