import withNuxt from "./.nuxt/eslint.config.mjs";
import prettier from "eslint-plugin-prettier/recommended";

export default withNuxt(
  // Intègre Prettier comme règle ESLint (remplace plugin:prettier/recommended)
  prettier,
);
