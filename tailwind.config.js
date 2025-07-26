/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3E60F4',
        secondary: '#4C94E7',
        accent: '#14D163',
        dark: "#000000",
        graytext: "#D8D8D8",
        yellow: "#FFFF00",
        grayac: "#ACACAC"
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
