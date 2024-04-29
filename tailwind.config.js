/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#F8D4C9",
        columnBackgroundColor: "#e6f7f9",
      },
    },
  },
  plugins: [],
};
