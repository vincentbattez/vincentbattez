// Source de vérité unique du SEO : titres, descriptions et JSON-LD dérivent des
// briques atomiques ci-dessous (`roleShort`, `seniority`, `employment`).

const siteUrl = "https://vincentbattez.dev";

const location = {
  city: "Lille",
  region: "Hauts-de-France",
  regionCode: "FR-59",
  country: "France",
  countryCode: "FR",
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

const roleShort = "Développeur Full-Stack";
const seniority = "Senior";
const role = `${roleShort} ${seniority}`;
const roleLower = role.charAt(0).toLowerCase() + role.slice(1);

const employment = {
  label: "Freelance",
  adjective: "freelance",
  seeking: "mission freelance",
} as const;

const tagline = `${role} ${employment.adjective} à ${location.city}`;

const name = `${author.name} - ${role} ${employment.label}`;

export const seo = {
  siteUrl,
  // Slash final à préserver (comportement d'origine).
  siteUrlWithSlash: `${siteUrl}/`,

  name,
  // 64 caractères, troncature SERP assumée : ne pas raccourcir en sacrifiant
  // `seniority` ni `employment.label` (mots-clés de recherche).
  title: `${name} à ${location.city}`,
  titleTemplate: `%s | ${name}`,

  // Longue (meta globaux) et courte (cartes sociales) : distinctes à dessein.
  descriptionMeta: `${tagline}. J'accompagne entreprises et CTOs pour créer et architecturer vos applications web robustes (Node.js, React, Vue.js, TypeScript).`,
  descriptionCard: `${tagline}. Je crée et j'architecture vos applications web robustes : Node.js, React, Vue.js, TypeScript.`,

  keywords: `${roleShort}, Développeur ${seniority}, ${employment.label} ${location.city}, Node.js, React, Vue.js, TypeScript, Architecture logicielle, Développement assisté par IA, Développeur web ${employment.adjective}`,

  jobTitle: role,

  roleShort,
  seniority,
  role,
  tagline,
  employment,

  knowsLanguage: ["fr", "en"],

  // `defaultLocale` est la seule source du `<html lang>` : @nuxtjs/seo l'impose
  // et écrase tout `htmlLang`.
  language: "fr-FR",
  locale: "fr_FR",
  defaultLocale: "fr",

  // Couleurs de marque intentionnelles, pas à retoucher.
  themeColor: "#F0910F",
  backgroundColor: "#feecd1",

  twitter: "@vincentbattez",

  author,
  location,

  social: {
    linkedin: "https://www.linkedin.com/in/vincentbattez",
    github: "https://github.com/vincentbattez",
  },

  ogImage: {
    path: "/og/default.png",
    alt: `${author.name}, ${tagline}`,
    width: 1200,
    height: 630,
    type: "image/png",
  },

  portrait: "/images/vincentbattez.webp",
  portraitAlt: `Photo de ${author.name}, ${roleLower} ${employment.adjective}`,

  pwa: {
    name,
    shortName: author.name,
  },

  schema: {
    personDescription: `${tagline}. Je code avec l'IA au quotidien et j'architecture les systèmes pour qu'ils tiennent à cette vitesse (Node.js, React, Vue.js, TypeScript).`,
    serviceDescription: `${role} ${employment.adjective} : architecture et développement d'applications web à l'ère du code généré par IA (Node.js, React, Vue.js, TypeScript).`,
    serviceName: `${author.name} - Développement Full-Stack ${employment.label}`,
    // Ordre significatif : les moteurs pondèrent les premières entrées, donc le
    // métier passe avant l'IA (cf. docs/product.md).
    personKnowsAbout: [
      "Software Architecture",
      "Full Stack Development",
      "AI-Assisted Development",
      "Technical Debt",
      "Context Engineering",
      "Prompt Engineering",
      "Large Language Models",
      "Node.js",
      "React",
      "Vue.js",
      "TypeScript",
    ],
    occupationSkills: [
      "Software Architecture",
      "Full Stack Development",
      "AI-Assisted Development",
      "Node.js",
      "React",
      "Vue.js",
      "TypeScript",
    ],
    serviceKnowsAbout: [
      "Architecture Logicielle",
      "Développement Full Stack",
      "Développement assisté par IA",
      "Dette technique",
      "Développement Web",
      "Développement Node.js",
      "Développement Front-end",
    ],
  },
} as const;
