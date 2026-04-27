/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        mnd: {
          green: "#00A651",
          "green-dark": "#008C45",
          "green-light": "#E8F5E9",
          dark: "#1B1B1B",
          gray: "#6B7280",
          "gray-light": "#F5F5F5",
          red: "#EF4444",
          orange: "#F59E0B",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
