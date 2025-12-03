/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C5CE7",
        secondary: "#A29BFE",
        accent: "#FD79A8",
        surface: "#FFFFFF",
        background: "#F8F9FA",
        success: "#00B894",
        warning: "#FDCB6E",
        error: "#D63031",
        info: "#74B9FF"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px'
      },
      borderRadius: {
        'DEFAULT': '8px',
        'md': '12px'
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'hover': '0 8px 24px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}