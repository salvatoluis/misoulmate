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
        coral: "#1A365D",
        rose: "#2B6CB0",
        mint: "#4A5568",
        cream: "#FFF9F0",
        charcoal: "#2B2B2A",
        sunny: "#7C9D96",
      },
    },
  },
  plugins: [],
};
