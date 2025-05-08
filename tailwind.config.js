/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        coral: "#FF6B81",
        rose: "#D86D72",
        mint: "#A8E0D7",
        cream: "#FFF9F0",
        charcoal: "#2B2B2A",
        sunny: "#FFE066",
      },
    },
  },
  plugins: [],
};

// postcss.config.js