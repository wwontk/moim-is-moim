/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
      },
      animation: {
        slideDown: "slideDown 0.3s ease-out forwards",
        slideUp: "slideUp 0.5s ease-out forwards",
      },
      backgroundImage: {
        "symbol-pattern": "url('/src/assets/symbol.jpg')",
      },
      colors: {
        "theme-main-color": "#8ec3b1",
        "theme-color-001": "#def5e5",
        "theme-color-002": "#bcead5",
        "theme-color-003": "#9ed5c5",
        "main-gray": "#f8f8f8",
        "custom-gray-001": "#79747E",
        "custom-gray-002": "#c9c9c9",
        "custom-gray-003": "#4e4e4e",
        "custom-gray-004": "#6e6e6e",
        "badge-red-001": "#ffe8e8",
        "badge-red-002": "#ff5b5b",
        "badge-green-001": "#BCFFEB",
        "badge-green-002": "#25EEB2",
      },
      boxShadow: {
        "five-percent": "0 4px 4px -1px rgba(12, 12, 13, 0.05)",
        "ten-percent": "0 4px 4px -1px rgba(12, 12, 13, 0.1)",
        "drop-300": "0 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
    screens: {
      xs: { max: "767px" },
    },
  },
  plugins: [],
};
