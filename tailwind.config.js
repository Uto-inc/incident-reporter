/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uto-blue': '#3B82F6',
        'uto-red': '#EF4444',
        'uto-green': '#10B981',
        'uto-yellow': '#F59E0B',
      }
    },
  },
  plugins: [],
}