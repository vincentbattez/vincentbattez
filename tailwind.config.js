import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    colors: {
      primary: "#F0910F", // orange-500
      secondary: "#23a5f7ff", // blue-500
      black: "#241605",
      white: "#FFFFFF",
      orange: {
        100: "#FEF3D2",
        200: "#FDE4A6",
        300: "#FACF79",
        400: "#F6BA57",
        500: "#F0910F",
        600: "#CF7A18",
        700: "#AD5E11",
        800: "#8B450A",
        900: "#733306",
      },
      blue: {
        100: "#d2f7fdff",
        200: "#a7ebfeff",
        300: "#7bd9fdff",
        400: "#5ac5fbff",
        500: "#23a5f7ff",
        600: "#1a80d4ff",
        700: "#1260b2ff",
        800: "#0b458fff",
        900: "#053075ff",
      },
      yellow: {
        100: "#fffcd9ff",
        200: "#fff8b4ff",
        300: "#fff38fff",
        400: "#feee75ff",
        500: "#fee646ff",
        600: "#dbc232ff",
        700: "#b79f23ff",
        800: "#937d17ff",
        900: "#7a650cff",
      },
      grey: {
        100: "#f3f2efff",
        200: "#eae6e1ff",
        300: "#c2bcafff",
        400: "#a9a08fff",
        500: "#91856fff",
        600: "#706856ff",
        700: "#504a3eff",
        800: "#302d25ff",
        900: "#1d1b16ff",
      },
      green: {
        100: "#edfce5ff",
        200: "#d8fcccff",
        300: "#baf6aeff",
        400: "#9fed99ff",
        500: "#76e275ff",
        600: "#56c25fff",
        700: "#3ba34eff",
        800: "#26833dff",
        900: "#176c35ff",
      },
      red: {
        100: "#feebddff",
        200: "#ffd0beff",
        300: "#ffb09fff",
        400: "#fe9286ff",
        500: "#ff5552ff",
        600: "#db434fff",
        700: "#b72f45ff",
        800: "#941d3bff",
        900: "#7a1233ff",
      },
    },
    spacing: {
      xs: ".25rem",
      sm: ".5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      xxl: "3rem",
      xxxl: "4rem",
    },
    fontFamily: {
      heading: ["Nunito", "sans-serif"],
      body: ["Nunito", "sans-serif"],
    },
    fontSize: {
      "display-xl": "6rem",
      "display-lg": "3.75rem",
      h1: "2.5rem",
      h2: "2rem",
      h3: "1.625rem",
      h4: "1.25rem",
      "body-lg": "1.125rem",
      "body-md": "1rem",
      "body-sm": "0.875rem",
    },
    lineHeight: {
      heading: "120%",
      body: "150%",
    },
    fontWeight: {
      semibold: 600,
      extrabold: 800,
    },
    icon: {
      md: "1.5rem",
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      // Icons
      addUtilities({
        ".icon-sm": {
          "font-size": ".75rem",
        },
        ".icon-md": {
          "font-size": "1.5rem",
        },
      });
    }),
  ],
};
