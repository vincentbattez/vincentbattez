// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/seo", "@nuxt/eslint"],

  // Site configuration for SEO modules
  site: {
    url: "https://vincentbattez.dev",
    name: "Vincent Battez - AI Engineer & Full Stack Developer",
    description:
      "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle à Lille, France.",
    defaultLocale: "fr",
    identity: {
      type: "Person",
    },
    twitter: "@vincentbattez",
    language: "fr-FR",
  },

  // Open Graph configuration (l'image par défaut est définie dans app.vue via defineOgImage)
  // Le rendu utilise Satori (deps satori + @resvg/resvg-js)
  ogImage: {
    enabled: true,
  },

  // Global SEO defaults
  app: {
    head: {
      htmlAttrs: {
        lang: "fr-FR",
      },
      titleTemplate: "%s | Vincent Battez - AI Engineer & Full Stack Developer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle à Lille, France.",
        },
        {
          name: "keywords",
          content:
            "IA Engineer, Développeur Full Stack, Expert RAG, LLM, Context Engineering, Prompt Engineering, Intelligence Artificielle, Lille, France",
        },
        { name: "author", content: "Vincent Battez" },
        { name: "robots", content: "index, follow" },
        { name: "language", content: "French" },
        { name: "geo.region", content: "FR-59" },
        { name: "geo.placename", content: "Lille" },
        { name: "geo.position", content: "50.6292;3.0573" },
        { name: "ICBM", content: "50.6292, 3.0573" },
        // Open Graph meta tags
        {
          property: "og:title",
          content:
            "Vincent Battez - AI Engineer & Full Stack Developer | Expert RAG, LLMs, Node.js",
        },
        {
          property: "og:description",
          content:
            "Développeur Full Stack spécialisé en IA : Expert RAG (Retrieval-Augmented Generation), LLMs, Context Engineering. Technologies : Node.js, React, observabilité. Services IA à Lille, France.",
        },
        { property: "og:type", content: "profile" },
        { property: "og:locale", content: "fr_FR" },
        { property: "og:url", content: "https://vincentbattez.dev" },
        {
          property: "og:site_name",
          content: "Vincent Battez - AI Engineer Portfolio",
        },
      ],
    },
  },

  // SEO module configuration
  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  // Sous-module Schema.org désactivé : nuxt-schema-org 6.x est incompatible avec le moteur
  // head unhead 3.x de Nuxt 4.5 (le hook `entries:resolve` ne s'exécute pas → crash `resolveGraph`).
  // Le JSON-LD structuré (Person + ProfessionalService + WebSite) est injecté manuellement
  // dans app.vue via useHead, ce qui contourne le plugin cassé.
  schemaOrg: false,

  // Additional runtime configuration
  runtimeConfig: {
    public: {
      siteUrl: "https://vincentbattez.dev",
      siteName: "Vincent Battez - AI Engineer & Full Stack Developer",
      siteDescription:
        "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle à Lille, France.",
      language: "fr-FR",
      author: {
        name: "Vincent Battez",
        email: "contact@vincentbattez.dev",
        url: "https://vincentbattez.dev",
      },
      location: {
        city: "Lille",
        country: "France",
      },
    },
  },
});
