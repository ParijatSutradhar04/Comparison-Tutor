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
      },
      animation: {
        'pulse-green': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
