/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // 蓝色主题
        accent: "#3b82f6",  // hover 时变淡的蓝色
      },
      boxShadow: {
        dropdown: "0 4px 12px rgba(0,0,0,0.15)",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [],
};
