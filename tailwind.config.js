/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: "#2EB67D",
        backgroundGray: "#4B5563",
      },
      keyframes: {
        slideInFromRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutToRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        slideInFromRight: "slideInFromRight 0.5s ease-out forwards",
        slideOutToRight: "slideOutToRight 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
