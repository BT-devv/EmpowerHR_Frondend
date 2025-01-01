/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: "#2EB67D",
        backgroundGray: "#4B5563",
      },
    },
  },
  plugins: [],
};
