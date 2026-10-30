import plugin from "tailwindcss/plugin";
import { token, tokens } from "./ui/styles/tokens.mjs";

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  // Toutes les valeurs viennent de ui/styles/tokens.css (DESIGN.md).
  theme: {
    colors: {
      primary: token("palette-primary"),
      secondary: token("palette-secondary"),
      black: token("palette-black"),
      white: token("palette-white"),
      page: token("palette-page"),
      orange: tokens("palette-orange"),
      blue: tokens("palette-blue"),
      yellow: tokens("palette-yellow"),
      grey: tokens("palette-grey"),
      green: tokens("palette-green"),
      red: tokens("palette-red"),
    },
    spacing: {
      xs: token("space-xs"),
      sm: token("space-sm"),
      md: token("space-md"),
      lg: token("space-lg"),
      xl: token("space-xl"),
      xxl: token("space-2xl"),
      xxxl: token("space-3xl"),
    },
    fontFamily: {
      heading: token("font-display"),
      body: token("font-body"),
    },
    fontSize: {
      "display-xl": token("text-6xl"),
      "display-lg": token("text-5xl"),
      h1: token("text-4xl"),
      h2: token("text-3xl"),
      h3: token("text-2xl"),
      h4: token("text-xl"),
      "body-lg": token("text-lg"),
      "body-md": token("text-md"),
      "body-sm": token("text-sm"),
    },
    lineHeight: {
      heading: token("leading-heading"),
      body: token("leading-body"),
    },
    fontWeight: {
      semibold: 600,
      extrabold: 800,
    },
    icon: {
      md: "1.5rem",
    },
    // Rôles, pour le code écrit par Hallmark (bg-paper, text-ink, bg-accent…).
    extend: {
      colors: {
        field: token("color-field"),
        paper: {
          DEFAULT: token("color-paper"),
          2: token("color-paper-2"),
          3: token("color-paper-3"),
          veil: token("color-paper-veil"),
        },
        ink: {
          DEFAULT: token("color-ink"),
          2: token("color-ink-2"),
          raised: token("color-ink-raised"),
        },
        muted: token("color-muted"),
        rule: {
          DEFAULT: token("color-rule"),
          2: token("color-rule-2"),
        },
        accent: {
          DEFAULT: token("color-accent"),
          ink: token("color-accent-ink"),
          glow: token("color-accent-glow"),
          2: token("color-accent-2"),
          "2-ink": token("color-accent-2-ink"),
        },
        focus: token("color-focus"),
      },
      fontFamily: {
        display: token("font-display"),
      },
      borderRadius: tokens("radius"),
      boxShadow: {
        card: token("shadow-card"),
      },
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".icon-sm": {
          "font-size": ".75rem",
        },
        ".icon-md": {
          "font-size": "1rem",
        },
        ".icon-lg": {
          "font-size": "1.5rem",
        },
      });
    }),
  ],
};
