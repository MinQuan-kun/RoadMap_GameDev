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
        brand: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
        dark: {
          bg: '#000000',
          card: '#000000',
          border: '#000000'
        }
      }
    },
  },
  plugins: [],
}
