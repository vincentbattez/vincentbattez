import { defineConfig } from "vitest/config";

// Seams testés : le handler HTTP de l'Entretien (voir issue #17) et la
// notif Pushover de /go/call.
export default defineConfig({
  test: {
    include: ["netlify/**/*.test.ts"],
    environment: "node",
  },
});
