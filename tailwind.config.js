/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "symbol-pattern": "url('/src/assets/symbol.jpg')",
      },
      colors: {
        "theme-main-color": "#8ec3b1",
        "theme-color-001": "#def5e5",
        "theme-color-002": "#bcead5",
        "theme-color-003": "#9ed5c5",
      },
      boxShadow: {
        "five-percent": "0 4px 4px -1px rgba(12, 12, 13, 0.05)",
        "ten-percent": "0 4px 4px -1px rgba(12, 12, 13, 0.1)",
      },
    },
  },
  plugins: [],
};
