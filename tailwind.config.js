/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1e40af',
        'light-blue': '#3b82f6'
      },
      boxShadow: {
        'dropdown': '0 4px 10px rgba(0, 0, 0, 0.15)'
      }
    }
  },
  plugins: []
}
