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

  // Polices auto-hébergées. Déclaration explicite des graisses pour éviter tout
  // FOUT : Nunito (corps, jusqu'à extrabold 800), Zilla Slab (titres, 700).
  fonts: {
    families: [
      { name: "Nunito", weights: [400, 600, 700, 800] },
      { name: "Zilla Slab", weights: [500, 600, 700] },
    ],
  },

  // Site configuration for SEO modules
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
    // Force l'indexabilité en production. Sans ça, nuxt-robots désactive l'indexation
    // (robots.txt "Disallow: /") tant que l'environnement n'est pas détecté comme prod.
    // Portfolio mono-domaine → un booléen explicite est déterministe (cf. getSiteIndexable).
    indexable: true,
  },

  // Génération dynamique d'images OG désactivée : on utilise des images
  // statiques fournies dans public/og/ (plus simple et mieux contrôlé vu le
  // faible nombre de pages). og:image / twitter:image sont posés à la main via
  // useSeoMeta (défaut dans app.vue, spécifiques dans pages/go/[id].vue).
  ogImage: {
    enabled: false,
  },

  // Global SEO defaults
  app: {
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
        // NB : le meta `robots` est géré par le module @nuxtjs/robots (metaTag: true),
        // piloté par site.indexable et la config `robots` ci-dessous. On ne le pose donc
        // pas à la main ici pour éviter deux sources concurrentes sur `name="robots"`.
        { name: "language", content: "French" },
        { name: "geo.region", content: "FR-59" },
        { name: "geo.placename", content: "Lille" },
        { name: "geo.position", content: "50.6292;3.0573" },
        { name: "ICBM", content: "50.6292, 3.0573" },
        // Open Graph meta tags
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
        // Twitter Card meta tags
        // twitter:image et og:image sont posés via useSeoMeta (défaut dans app.vue,
        // spécifiques par redirection dans pages/go/[id].vue) car la génération
        // dynamique og-image est désactivée (images statiques). twitter:site/creator
        // proviennent de site.twitter ("@vincentbattez").
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

  // SEO module configuration
  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  // robots.txt : autorise le crawl. On NE bloque PAS /go/* (contrairement à un
  // premier réflexe) : ces pages renvoient désormais un 200 avec meta noindex
  // (redirection côté client). Un `Disallow: /go/` serait contre-productif —
  // (1) il empêcherait les crawlers sociaux (LinkedIn, Twitter) de lire l'og:image
  //     de la page → aperçus de partage cassés ;
  // (2) robots.txt et noindex ne s'additionnent pas : une URL bloquée n'est jamais
  //     fetchée, donc Google n'y verrait jamais le noindex (risque d'indexation
  //     "URL seule"). Le noindex servi sur le 200 suffit à les tenir hors de l'index.
  // Le sitemap (@nuxtjs/sitemap, tâche 6.2) exclut déjà /go/**.
  robots: {
    allow: ["/"],
  },

  // Sitemap : découverte par les moteurs de recherche. Le portfolio est
  // essentiellement mono-page → la home est prioritaire (1.0), les futures pages
  // héritent d'un défaut raisonnable (0.8, mensuel). autoLastmod ajoute la date de
  // build comme signal de fraîcheur. Les redirections /go/* sont exclues (cf. robots).
  sitemap: {
    autoLastmod: true,
    defaults: {
      changefreq: "monthly",
      priority: 0.8,
    },
    urls: [{ loc: "/", changefreq: "yearly", priority: 1.0 }],
    exclude: ["/go/**"],
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
