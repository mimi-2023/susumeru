/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roundedMplus: ['"M PLUS Rounded 1c"', "sans-serif"],
      },
    colors: {
      myPaleBlue: "#BAE2F8",
      myMediumBlue: "#35A1DC",
      myDeepBlue: "#006DD2",
      myOrange: "#FFB800",
      myRed: "#FF2F2F",
      myGreen: "#4ECB71",
      myPaleGray: "#D9D9D9",
      textBlack: "#404040",
      textGray: "#5C5C5C",
      hoverOrange: "#EEAB00",
      hoverBlue: "#318EC1"

      },
    },
  },
  plugins: [],
}

