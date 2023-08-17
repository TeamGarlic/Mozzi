/** @type {import('tailwindcss').Config} */

export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    backgroundImage: {
      backimg: "url('/src/assets/img/background2.png')",
    },
    boxShadow: {
      innerblack: 'inset 0 0 0 2px #000000',
      innerpink: 'inset 0 0 0 2px #fa8ee5'
    }
  },
};
export const plugins = [require("tailwind-scrollbar-hide")];
