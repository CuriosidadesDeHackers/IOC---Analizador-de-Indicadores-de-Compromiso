/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'cyber-blue': '#1e3a8a',
        'cyber-dark': '#0f172a',
        'cyber-gray': '#64748b',
        'cyber-green': '#10b981',
        'cyber-red': '#ef4444',
        'cyber-orange': '#f59e0b',
      },
      boxShadow: {
        'cyber': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}