/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "Juice-white": "#F0EFEF",
        "Juice-blue": "#3b82f6",
        "Juice-blue-light": "#60a5fa",
        "Juice-blue-dark": "#1d4ed8",
        "juice-cream": "#fef9e8",
        "juice-green": "#55d43f",
        "juice-green-dark": "#01a044",
        "juice-green-light": "#7de068",
        "juice-bg-dark": "#1a1f16",
        "juice-bg-card": "#232a1e",
      },
      fontFamily: {
        urbanist: ["urbanist"],
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-black-outline": {
          "-webkit-text-stroke-width": "1px",
          "-webkit-text-stroke-color": "#000",
        },
        ".text-Juice-white-outline": {
          "-webkit-text-stroke-width": "1px",
          "-webkit-text-stroke-color": "#fff",
        },
        ".text-juice-green-outline": {
          "-webkit-text-stroke-width": "1px",
          "-webkit-text-stroke-color": "#55d43f",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
