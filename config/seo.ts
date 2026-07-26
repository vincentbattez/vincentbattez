/**
 * Source de vérité unique pour tout le SEO du site.
 *
 * Importé à la fois par `nuxt.config.ts` (build-time, chemin relatif
 * `./config/seo`) et par les composants (`~/config/seo`). Toute modification
 * de titre, description, mots-clés, URL, géoloc, etc. se fait ICI.
 *
 * ── Positionnement (SSOT) ──────────────────────────────────────────────────
 * Le rôle et le statut sont exprimés en BRIQUES ATOMIQUES (`roleShort`,
 * `seniority`, `employment`) d'où dérivent titres, descriptions, mots-clés,
 * JSON-LD, hero, badges. Changer une seule brique se répercute sur tout le site :
 *   - rôle    : `roleShort` / `seniority` (ex. "IA Engineer")
 *   - statut  : `employment.{label,adjective,seeking}` (ex. "Freelance" → "CDI")
 * Note : le hero anime exactement 3 mots (voir `pages/index-motion.scss`) ; un
 * rôle à un autre nombre de mots dégrade le stagger sans casser la mise en page.
 *
 * NB : deux descriptions distinctes coexistent volontairement —
 * `descriptionMeta` (longue, meta/site globaux) et `descriptionCard` (courte,
 * cartes sociales + page). Elles diffèrent dans le contenu actuel du site.
 */

const siteUrl = "https://vincentbattez.dev";

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

// ── Briques atomiques du positionnement (SSOT) ──
// `roleShort` : intitulé sans séniorité (hero kicker, mots-clés).
const roleShort = "Développeur Full-Stack";
const seniority = "Senior";
// `role` : intitulé complet (jobTitle, titres, descriptions, hero <h1>).
const role = `${roleShort} ${seniority}`;
// Variante minuscule pour apposition en milieu de phrase ("Photo de …, développeur").
const roleLower = role.charAt(0).toLowerCase() + role.slice(1);

const employment = {
  // Nom du statut : titres, og, JSON-LD worksFor — ex. "Freelance" / "CDI".
  label: "Freelance",
  // Forme en apposition après le rôle — ex. "freelance" / "en CDI".
  adjective: "freelance",
  // Ce que je cherche (badge dispo) — ex. "mission freelance" / "un CDI".
  seeking: "mission freelance",
} as const;

// Accroche réutilisée dans descriptions/alt — "… freelance à Lille".
const tagline = `${role} ${employment.adjective} à ${location.city}`;

// Nom / marque de base, réutilisé pour le titre et le template de titre.
const name = `${author.name} - ${role} ${employment.label}`;

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
  descriptionMeta: `${tagline}. J'accompagne entreprises et CTOs pour créer et architecturer vos applications web robustes (Node.js, React, Vue.js, TypeScript).`,
  // Description courte : cartes sociales (og/twitter/PWA) + page index.
  descriptionCard: `${tagline}. Je crée et j'architecture vos applications web robustes : Node.js, React, Vue.js, TypeScript.`,

  keywords: `${roleShort}, Développeur ${seniority}, ${employment.label} ${location.city}, Node.js, React, Vue.js, TypeScript, Architecture logicielle, Développeur web ${employment.adjective}`,

  jobTitle: role,

  // Briques de positionnement exposées aux composants (hero, badges, JSON-LD).
  roleShort,
  seniority,
  role,
  tagline,
  employment,

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
    alt: `${author.name}, ${tagline}`,
    width: 1200,
    height: 630,
    type: "image/png",
  },

  // Portrait (LCP + schema.org Person.image).
  portrait: "/images/vincentbattez.webp",
  // Alt du portrait dans le hero (apposition minuscule en milieu de phrase).
  portraitAlt: `Photo de ${author.name}, ${roleLower} ${employment.adjective}`,

  // PWA.
  pwa: {
    name,
    shortName: author.name,
  },

  // Descriptions spécifiques aux entités JSON-LD (app.vue) — libellés distincts
  // des descriptions meta, conservés tels quels.
  schema: {
    personDescription: `${tagline}. Je crée et j'architecture vos applications web robustes (Node.js, React, Vue.js, TypeScript).`,
    serviceDescription: `${role} ${employment.adjective} : création et architecture d'applications web robustes (Node.js, React, Vue.js, TypeScript).`,
    // "Développement Full-Stack" (nom de service) volontairement littéral : le
    // statut suit `employment.label`, l'intitulé de service reste stable.
    serviceName: `${author.name} - Développement Full-Stack ${employment.label}`,
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
