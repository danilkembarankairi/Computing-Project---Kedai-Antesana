/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6F4E37",
        secondary: "#C9A66B",
        accent: "#2C1810",
      },
    },
  },
  plugins: [],
};
