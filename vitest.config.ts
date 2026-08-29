import { defineConfig } from "vitest/config";

// Un seul seam testé : le handler HTTP de l'Entretien (voir issue #17).
export default defineConfig({
  test: {
    include: ["netlify/**/*.test.ts"],
    environment: "node",
  },
});
