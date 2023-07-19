/** @type {import('tailwindcss').Config} */

export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    backgroundImage: {
      backimg: "url('./src/assets/img/background2.png')",
    },
  },
};
export const plugins = [require("tailwind-scrollbar-hide")];
