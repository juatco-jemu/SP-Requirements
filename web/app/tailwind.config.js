/** @type {import('tailwindcss').Config} */

import colors from "tailwindcss/colors";

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          ["dark-hover"]: colors.neutral[900],
        },
        up_green: {
          DEFAULT: "#00563F",
          hover: "#002a1f",
          border: colors.green[600],
          text: colors.green[700],
          dark: "#000e0a",
          ["dark-hover"]: colors.green[900],
        },
        up_maroon: {
          DEFAULT: "#8D1436",
          hover: "#3e0918",
          border: colors.red[600],
          text: colors.red[700],
          dark: "#0c0205",
          ["dark-hover"]: colors.red[900],
        },
        up_yellow: {
          DEFAULT: "#FFB61C",
          hover: "#d47b00",
          border: colors.yellow[600],
          text: colors.yellow[700],
          dark: "#d47b00",
          ["dark-hover"]: colors.yellow[900],
        },
      },
    },
  },
  plugins: [],
};
