/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        success: '#22c55e',
        error: '#ef4444',
        kids: {
          pink: '#fda4af',
          purple: '#a78bfa', 
          sky: '#7dd3fc',
          lime: '#a3e635',
          amber: '#fbbf24'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        'display': ['Baloo 2', 'cursive'],
        'body': ['Poppins', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-green': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 0.5s ease-in-out',
        'floaty': 'floaty 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
