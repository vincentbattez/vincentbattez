/**
 * Source de vérité unique pour tout le SEO du site.
 *
 * Importé à la fois par `nuxt.config.ts` (build-time, chemin relatif
 * `./config/seo`) et par les composants (`~/config/seo`). Toute modification
 * de titre, description, mots-clés, URL, géoloc, etc. se fait ICI.
 *
 * NB : deux descriptions distinctes coexistent volontairement —
 * `descriptionMeta` (longue, meta/site globaux) et `descriptionCard` (courte,
 * cartes sociales + page). Elles diffèrent dans le contenu actuel du site.
 */

const siteUrl = "https://vincentbattez.dev";

// Nom / marque de base, réutilisé pour le titre et le template de titre.
const name = "Vincent Battez - Développeur Full-Stack Senior Freelance";

const location = {
  city: "Lille",
  region: "Hauts-de-France",
  regionCode: "FR-59",
  country: "France",
  countryCode: "FR",
  // Coordonnées géo (meta geo.position / ICBM).
  latitude: "50.6292",
  longitude: "3.0573",
} as const;

const author = {
  name: "Vincent Battez",
  givenName: "Vincent",
  familyName: "Battez",
  email: "vincent.battez.pro@gmail.com",
  url: siteUrl,
} as const;

export const seo = {
  siteUrl,
  // og:url conserve son slash final (comportement d'origine, à préserver).
  siteUrlWithSlash: `${siteUrl}/`,

  name,
  // Titre complet (avec localisation) — page, og:title, twitter:title.
  title: `${name} à ${location.city}`,
  // Template appliqué aux titres de sous-pages.
  titleTemplate: `%s | ${name}`,

  // Description longue : meta/site globaux (nuxt.config head + site + runtime).
  descriptionMeta:
    "Développeur Full-Stack Senior freelance à Lille. J'accompagne entreprises et CTOs pour créer et architecturer vos applications web robustes (Node.js, React, Vue.js, TypeScript).",
  // Description courte : cartes sociales (og/twitter/PWA) + page index.
  descriptionCard:
    "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture vos applications web robustes : Node.js, React, Vue.js, TypeScript.",

  keywords:
    "Développeur Full-Stack, Développeur Senior, Freelance Lille, Node.js, React, Vue.js, TypeScript, Architecture logicielle, Développeur web freelance",

  jobTitle: "Développeur Full-Stack Senior",

  // Langues maîtrisées (schema.org Person.knowsLanguage).
  knowsLanguage: ["fr", "en"],

  // Locales / langue.
  language: "fr-FR",
  locale: "fr_FR",
  defaultLocale: "fr",
  htmlLang: "fr-FR",

  // Couleurs de marque (theme-color meta + manifest PWA). Valeurs de marque
  // intentionnelles : centralisées, pas à retoucher.
  themeColor: "#F0910F",
  backgroundColor: "#feecd1",

  twitter: "@vincentbattez",

  author,
  location,

  // Réseaux (schema.org sameAs).
  social: {
    linkedin: "https://www.linkedin.com/in/vincentbattez",
    github: "https://github.com/vincentbattez",
  },

  // Image Open Graph statique (URL absolue construite dans app.vue).
  ogImage: {
    path: "/og/default.png",
    alt: "Vincent Battez, Développeur Full-Stack Senior freelance à Lille",
    width: 1200,
    height: 630,
    type: "image/png",
  },

  // Portrait (LCP + schema.org Person.image).
  portrait: "/images/vincentbattez.webp",

  // PWA.
  pwa: {
    name: "Vincent Battez - Développeur Full-Stack Senior Freelance",
    shortName: "Vincent Battez",
  },

  // Descriptions spécifiques aux entités JSON-LD (app.vue) — libellés distincts
  // des descriptions meta, conservés tels quels.
  schema: {
    personDescription:
      "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture vos applications web robustes (Node.js, React, Vue.js, TypeScript).",
    serviceDescription:
      "Développeur Full-Stack Senior freelance : création et architecture d'applications web robustes (Node.js, React, Vue.js, TypeScript).",
    serviceName: "Vincent Battez - Développement Full-Stack Freelance",
    personKnowsAbout: [
      "Artificial Intelligence",
      "RAG (Retrieval-Augmented Generation)",
      "Large Language Models",
      "Context Engineering",
      "Prompt Engineering",
      "Full Stack Development",
      "Node.js",
      "React",
      "Vue.js",
      "TypeScript",
    ],
    occupationSkills: [
      "Full Stack Development",
      "Software Architecture",
      "Node.js",
      "React",
      "Vue.js",
      "TypeScript",
    ],
    serviceKnowsAbout: [
      "Développement Full Stack",
      "Développement Web",
      "Architecture Logicielle",
      "Développement Node.js",
      "Développement Front-end",
    ],
  },
} as const;
