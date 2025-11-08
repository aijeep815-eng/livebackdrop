/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./layouts/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx,mdx}",
    "./public/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // 主蓝色
        accent: "#3b82f6",  // hover 浅蓝
      },
      boxShadow: {
        dropdown: "0 4px 12px rgba(0,0,0,0.15)",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  safelist: [
    // 强制保留所有 group-hover 样式
    {
      pattern: /group-hover:.*/,
    },
    {
      pattern: /(hover|focus|active):.*/,
    },
  ],
  plugins: [],
};
