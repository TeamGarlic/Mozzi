/** @type {import('tailwindcss').Config} */

export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    backgroundImage: {
      backimg: "url('/src/assets/img/background2.png')",
    },
    boxShadow: {
      inner: 'inset 0 0 0 2px #000000'
    }
  },
};
export const plugins = [require("tailwind-scrollbar-hide")];
