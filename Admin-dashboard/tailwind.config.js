/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1F27",
        paper: "#F7F7F5",
        brand: {
          50: "#EEF4FF",
          100: "#D9E6FF",
          300: "#8FB4FF",
          500: "#3D6BF0",
          600: "#2E54D1",
          700: "#233FA0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
