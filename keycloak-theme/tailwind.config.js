/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ef5360",
          hover: "#ec3746",
          active: "#d71424",
          light: "#FFEFF0",
          dark: "#212529",
          black: "#2B212B",
          gray: "#8E8E8E",
          bg: "#F6F6F6",
        },
      },
      fontFamily: {
        sans: ["Prompt", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 12px rgba(239, 83, 96, 0.25)',
        'button-hover': '0 6px 16px rgba(239, 83, 96, 0.32)',
      },
    },
  },
  plugins: [],
};
