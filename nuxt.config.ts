import { lookupTable } from "./utils/redirect";
import { seo } from "./config/seo";
import { llmsOptions } from "./config/llms";

// PostHog uniquement en prod : le dev polluait le projet analytics de prod.
// Fail-closed (défaut = désactivé) ; forçable via NUXT_PUBLIC_POSTHOG_ENABLED=true.
const posthogEnabled =
  process.env.NUXT_PUBLIC_POSTHOG_ENABLED === "true" ||
  process.env.NODE_ENV === "production";

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
    "@posthog/nuxt",
    "@vite-pwa/nuxt",
    "nuxt-llms",
  ],

  llms: llmsOptions,

  // "autoUpdate" : le nouveau SW prend le contrôle à la visite suivante, évite
  // de servir un HTML précaché périmé après un déploiement.
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: seo.pwa.name,
      short_name: seo.pwa.shortName,
      description: seo.descriptionCard,
      lang: seo.language,
      start_url: "/",
      display: "standalone",
      background_color: seo.backgroundColor,
      theme_color: seo.themeColor,
      icons: [
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
      // Sans ça, le SW sert la home précachée pour toute navigation, y compris
      // /llms-full.txt & co (ce sont des requêtes de navigation).
      navigateFallbackDenylist: [/\.(?:txt|xml|json|webmanifest|png|ico|svg)(?:\?|$)/],
    },
    client: {
      installPrompt: false,
    },
  },

  fonts: {
    families: [
      { name: "Nunito", weights: [400, 600, 700, 800] },
      { name: "Zilla Slab", weights: [600, 700] },
    ],
    // Site 100% français, aucun italique : évite ~15 fichiers de police inutiles.
    defaults: {
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
    },
  },

  features: {
    // Sinon entry.css est inliné dans le HTML EN PLUS du <link> : payé 2×.
    inlineStyles: false,
  },

  experimental: {
    // Évite une requête _payload.json (69 octets) préchargée sur chaque page.
    payloadExtraction: false,
  },

  nitro: {
    prerender: {
      // Le crawler ignore les liens avec query (?s=pf) : sans cette liste, /go
      // n'a pas de HTML statique et l'accès direct renvoie 404.
      routes: Object.keys(lookupTable.redirectId).map((id) => `/go/${id}`),
    },
  },

  site: {
    url: seo.siteUrl,
    name: seo.name,
    description: seo.descriptionMeta,
    defaultLocale: seo.defaultLocale,
    identity: {
      type: "Person",
    },
    twitter: seo.twitter,
    language: seo.language,
    indexable: true,
  },

  ogImage: {
    enabled: false,
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: seo.defaultLocale,
      },
      titleTemplate: seo.titleTemplate,
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: seo.themeColor },
        { name: "description", content: seo.descriptionMeta },
        { name: "keywords", content: seo.keywords },
        { name: "author", content: seo.author.name },
        { name: "language", content: "French" },
        { name: "geo.region", content: seo.location.regionCode },
        { name: "geo.placename", content: seo.location.city },
        {
          name: "geo.position",
          content: `${seo.location.latitude};${seo.location.longitude}`,
        },
        {
          name: "ICBM",
          content: `${seo.location.latitude}, ${seo.location.longitude}`,
        },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.descriptionCard },
        { property: "og:type", content: "profile" },
        { property: "og:locale", content: seo.locale },
        { property: "og:url", content: seo.siteUrlWithSlash },
        { property: "og:site_name", content: seo.name },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo.title },
        { name: "twitter:description", content: seo.descriptionCard },
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

  // nuxt-schema-org 6 incompatible unhead 3 : JSON-LD écrit à la main (app.vue).
  schemaOrg: false,

  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST,
    clientConfig: {
      capture_exceptions: posthogEnabled,
      autocapture: posthogEnabled,
      capture_pageview: posthogEnabled,
      // Coupe tout envoi (capture manuelle incluse) hors prod.
      opt_out_capturing_by_default: !posthogEnabled,
      __add_tracing_headers: ["localhost", "vincentbattez.dev"],
      // Évite le chargement du recorder (~30-50 KB) au runtime.
      disable_session_recording: true,
    },
    serverConfig: {
      enableExceptionAutocapture: posthogEnabled,
      disabled: !posthogEnabled,
    },
  },

  runtimeConfig: {
    public: {
      posthog: {
        publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
        host: process.env.NUXT_PUBLIC_POSTHOG_HOST,
      },
      siteUrl: seo.siteUrl,
      siteName: seo.name,
      siteDescription: seo.descriptionMeta,
      language: seo.language,
      author: {
        name: seo.author.name,
        email: seo.author.email,
        url: seo.author.url,
      },
      location: {
        city: seo.location.city,
        country: seo.location.country,
      },
    },
  },
});
