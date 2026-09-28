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
        // Reference design palette
        primaryYellow: '#FFD84D',
        periwinkle: '#A9BFF5',
        coralRed: '#F26B6B',
        textNavy: '#2B3350',
        mutedBlue: '#9AA3BD',
        canvasBg: '#F1F5FF',
        screenBg: '#F6F8FF',
        navy: {
          DEFAULT: '#20294F',
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
          DEFAULT: '#AFC7F7',
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
          DEFAULT: '#FFDC61',
          50: '#FFFCF2',
          100: '#FFF8DD',
          200: '#FFF0B8',
          300: '#FFE68C',
          400: '#FFDC61',
          500: '#E6C33D',
        },
        pageBg: {
          DEFAULT: '#F3F8FC',
          dark: '#12172B',
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
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        display: ['Poppins', 'Nunito', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'phone': '0 20px 50px rgba(120, 140, 200, 0.25)',
        'phone-center': '0 28px 65px rgba(100, 125, 195, 0.35)',
        'soft': '0 8px 30px rgba(32, 41, 79, 0.06)',
        'soft-md': '0 12px 35px rgba(32, 41, 79, 0.08)',
        'soft-lg': '0 20px 45px rgba(32, 41, 79, 0.1)',
        'coral-soft': '0 12px 30px rgba(245, 141, 135, 0.28)',
        'blue-soft': '0 12px 30px rgba(175, 199, 247, 0.35)',
        'yellow-soft': '0 12px 30px rgba(255, 220, 97, 0.35)',
        'navy-soft': '0 12px 30px rgba(32, 41, 79, 0.25)',
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
