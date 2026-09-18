/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          primary: '#6366f1',
          cyan: '#38bdf8',
          mint: '#10b981',
          pulse: '#f59e0b',
        },
        dark: {
          bg: '#090a0f',
          surface: '#11131a',
          elevated: '#171a24',
          border: 'rgba(255, 255, 255, 0.08)',
          card: '#11131a',
        },
        light: {
          bg: '#fafafa',
          surface: '#ffffff',
          elevated: '#f4f4f6',
          border: 'rgba(0, 0, 0, 0.07)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        brand: ['Space Grotesk', 'Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
        'elevated': '0 10px 30px -10px rgba(0,0,0,0.08)',
        'indigo-glow': '0 0 25px -4px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
