import { lookupTable } from "./utils/redirect";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-07-19",

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/seo",
    "@nuxt/eslint",
    "@nuxt/fonts",
  ],

  fonts: {
    families: [
      { name: "Nunito", weights: [400, 600, 700, 800] },
      { name: "Zilla Slab", weights: [600, 700] },
    ],
    // Site 100% français, aucun italique utilisé : évite de générer les
    // subsets cyrillique/grec/vietnamien et les variantes italic (~15 fichiers).
    defaults: {
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
    },
  },

  features: {
    // Sans ça, tout entry.css est inliné dans le HTML EN PLUS du <link> : payé 2×.
    inlineStyles: false,
  },

  experimental: {
    // Évite une requête _payload.json (69 octets) préchargée sur chaque page.
    payloadExtraction: false,
  },

  nitro: {
    prerender: {
      // Le crawler ignore les liens avec query (?s=pf) : sans cette liste, les
      // pages /go n'ont pas de HTML statique et l'accès direct renvoie 404.
      routes: Object.keys(lookupTable.redirectId).map((id) => `/go/${id}`),
    },
  },

  site: {
    url: "https://vincentbattez.dev",
    name: "Vincent Battez - Développeur Full-Stack Senior Freelance",
    description:
      "Développeur Full-Stack Senior freelance à Lille. J'accompagne entreprises et CTOs pour créer et architecturer des applications web robustes (Node.js, React, Vue.js, TypeScript).",
    defaultLocale: "fr",
    identity: {
      type: "Person",
    },
    twitter: "@vincentbattez",
    language: "fr-FR",
    indexable: true,
  },

  ogImage: {
    enabled: false,
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "fr-FR",
      },
      titleTemplate:
        "%s | Vincent Battez - Développeur Full-Stack Senior Freelance",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Développeur Full-Stack Senior freelance à Lille. J'accompagne entreprises et CTOs pour créer et architecturer des applications web robustes (Node.js, React, Vue.js, TypeScript).",
        },
        {
          name: "keywords",
          content:
            "Développeur Full-Stack, Développeur Senior, Freelance Lille, Node.js, React, Vue.js, TypeScript, Architecture logicielle, Développeur web freelance",
        },
        { name: "author", content: "Vincent Battez" },
        { name: "language", content: "French" },
        { name: "geo.region", content: "FR-59" },
        { name: "geo.placename", content: "Lille" },
        { name: "geo.position", content: "50.6292;3.0573" },
        { name: "ICBM", content: "50.6292, 3.0573" },
        {
          property: "og:title",
          content:
            "Vincent Battez - Développeur Full-Stack Senior Freelance à Lille",
        },
        {
          property: "og:description",
          content:
            "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture des applications web robustes : Node.js, React, Vue.js, TypeScript.",
        },
        { property: "og:type", content: "profile" },
        { property: "og:locale", content: "fr_FR" },
        { property: "og:url", content: "https://vincentbattez.dev" },
        {
          property: "og:site_name",
          content: "Vincent Battez - Développeur Full-Stack Senior Freelance",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content:
            "Vincent Battez - Développeur Full-Stack Senior Freelance à Lille",
        },
        {
          name: "twitter:description",
          content:
            "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture des applications web robustes : Node.js, React, Vue.js, TypeScript.",
        },
      ],
    },
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  robots: {
    allow: ["/"],
  },

  sitemap: {
    autoLastmod: true,
    defaults: {
      changefreq: "monthly",
      priority: 0.8,
    },
    urls: [{ loc: "/", changefreq: "yearly", priority: 1.0 }],
    exclude: ["/go/**"],
  },

  // Schema.org désactivé (nuxt-schema-org 6 incompatible unhead 3) : JSON-LD injecté à la main dans app.vue.
  schemaOrg: false,

  runtimeConfig: {
    public: {
      siteUrl: "https://vincentbattez.dev",
      siteName: "Vincent Battez - Développeur Full-Stack Senior Freelance",
      siteDescription:
        "Développeur Full-Stack Senior freelance à Lille. J'accompagne entreprises et CTOs pour créer et architecturer des applications web robustes (Node.js, React, Vue.js, TypeScript).",
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
