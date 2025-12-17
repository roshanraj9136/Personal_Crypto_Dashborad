/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crypto-dark': '#0b0e11',
        'crypto-card': '#181a20',
        'trade-up': '#0ecb81',   // Green
        'trade-down': '#f6465d', // Red
      }
    },
  },
  plugins: [],
}
