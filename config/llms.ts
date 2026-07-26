/**
 * Source de vérité pour `/llms.txt` et `/llms-full.txt` (module nuxt-llms).
 *
 * - `llmsOptions` : consommé par `nuxt.config.ts` (clé `llms`). Génère le
 *   `llms.txt` concis (titre + blockquote + sections), conforme à llmstxt.org.
 * - `llmsFullContent` : markdown détaillé injecté dans `/llms-full.txt` via le
 *   hook `llms:generate:full` (server/plugins/llms.ts). La route full ne rend
 *   QUE ce que le hook pousse — d'où le document markdown complet ci-dessous.
 *
 * Contenu dérivé du CV (source unique). Coordonnées volontairement limitées à
 * l'email pro + réseaux : pas de téléphone/email perso dans un fichier public.
 */

import { seo } from "./seo";

export const llmsOptions = {
  domain: seo.siteUrl,
  title: "Vincent Battez — Développeur Full-Stack Senior Freelance",
  description: `Développeur Full-Stack Senior freelance basé à ${seo.location.city} (${seo.location.region}, ${seo.location.country}), 8 ans d'expérience. Node.js/Fastify, React, Vue.js, TypeScript, architecture logicielle (DDD, hexagonale) et développement assisté par IA (agents LLM, context engineering). Disponible pour des contrats freelance.`,

  sections: [
    {
      title: "Profil",
      description: [
        "**Vincent Battez** — Développeur Full-Stack Senior, freelance à Lille (Hauts-de-France, France).",
        "",
        "- 8 ans d'expérience, dont React/Remix, Vue.js/Nuxt, TypeScript et Node.js/Fastify.",
        "- Spécialités : architecture logicielle (DDD, Clean/Hexagonale), qualité (TDD, code review, observabilité) et développement assisté par IA (agents LLM, context engineering).",
        "- Certifié accessibilité web OPQUAST (850/1000).",
        "- Langues : français (natif), anglais (compréhension B2).",
        "- **Disponible pour des contrats freelance.**",
      ].join("\n"),
    },
    {
      title: "Expertise",
      description: [
        "- **IA & Agents LLM** : Claude Code (SDD + TDD), gestion de contexte, orchestration multi-agents, conception de skills, prompt engineering.",
        "- **Backend** : Node.js, Fastify (Zod), Express, NestJS, PostgreSQL (Prisma), APIs critiques haute volumétrie.",
        "- **Frontend** : TypeScript, React (Remix), Vue.js (Nuxt, Pinia), Design System, accessibilité (A11Y), UX/UI.",
        "- **Craftsmanship** : DDD, Clean Code, Hexagonale/MVC, tests (Vitest, Playwright, k6), documentation & transmission.",
        "- **Plateforme & Observabilité** : Docker, Kubernetes, CI/CD (GitLab, GitHub), OpenTelemetry, Datadog.",
      ].join("\n"),
    },
    {
      title: "Expériences clés",
      description: [
        "- **Norauto** (2022–2026, freelance, Lille) — API Fastify critique *from scratch*, refonte d'un référentiel PostgreSQL haute volumétrie (>200 req/s), refonte front Vue.js 3/Pinia, standards d'équipe et observabilité.",
        "- **Québecor** (2021–2022, Montréal) — Architecte Front-End : refonte architecturale, Design patterns, Storybook, observabilité GTM/GA.",
        "- **Decathlon** (2018–2020, Lille) — Co-conception du Design System (Springboard), bonnes pratiques A11Y.",
      ].join("\n"),
    },
    {
      title: "Projets personnels — IA générative",
      description: [
        "- **Second brain** — Système de contexte pour agents IA : base de connaissances structurée, modèle de données, règles et skills garantissant fiabilité et maintenance automatique.",
        "- **Raredrop Studio** — Générateur de goodies gaming : API Fastify multi-modèles (OpenRouter), batch parallèle, workflow modulaire (Remix) et prompt engineering composable.",
        "- **Somnia** — Générateur de méditations personnalisées : architecture multi-agents, contexte injecté dynamiquement, pipeline IoT → haut-parleur.",
      ].join("\n"),
    },
    {
      title: "Liens",
      links: [
        {
          title: "Site",
          description: "Portfolio de Vincent Battez.",
          href: seo.siteUrlWithSlash,
        },
        {
          title: "LinkedIn",
          description: "Parcours professionnel et contact.",
          href: seo.social.linkedin,
        },
        {
          title: "GitHub",
          description: "Code et projets open source.",
          href: seo.social.github,
        },
      ],
    },
  ],

  notes: [
    "Disponible pour des contrats freelance — prise de contact via LinkedIn ou par email.",
    `Contact : ${seo.author.email}`,
  ],

  // Active la route /llms-full.txt (le contenu est injecté par le hook serveur).
  full: {
    title: "Vincent Battez — CV détaillé",
    description:
      "CV complet dérivé du portfolio : profil, expériences, compétences, projets IA, distinctions et formation.",
  },
};

export const llmsFullContent = `# Vincent Battez — Développeur Full-Stack Senior Freelance

> Développeur Full-Stack Senior freelance basé à ${seo.location.city} (${seo.location.region}, ${seo.location.country}), 8 ans d'expérience. Node.js/Fastify, React, Vue.js, TypeScript.
> Architecture logicielle (DDD, hexagonale) et développement assisté par IA (agents LLM, context engineering).
> Disponible pour des contrats freelance.

## Contact

- Site : ${seo.siteUrlWithSlash}
- Email : ${seo.author.email}
- LinkedIn : ${seo.social.linkedin}
- GitHub : ${seo.social.github}
- Localisation : ${seo.location.city}, ${seo.location.region}, ${seo.location.country}
- Statut : freelance, **disponible pour de nouveaux contrats**
- Langues : français (langue maternelle), anglais (compréhension B2, expression A2/B1)

## Compétences

### IA & Agents LLM
- Claude Code (Spec-Driven Development + TDD)
- Gestion de contexte LLM : structuration de l'information, specs, boucle de validation, orchestration multi-agents
- Conception de skills, prompt engineering, context engineering

### Software Craftsmanship

L'architecture logicielle est au cœur de ma pratique : je la considère comme un investissement déterminant pour la robustesse et l'évolutivité d'un produit, et c'est l'une des premières choses que je m'attache à mettre en place chez mes clients. Je m'appuie sur le Domain-Driven Design (DDD), l'architecture hexagonale et les Anti-Corruption Layers (ACL), le Clean Code et le MVC pour concevoir des systèmes clairs, testables et durables.

Cette exigence s'accompagne d'une démarche qualité forte — Spec-Driven Development, TDD, code review et tests automatisés (Vitest, Playwright, k6). Mais je crois surtout que ces pratiques n'ont de valeur que si elles sont partagées : je tiens à les documenter, à les transmettre et à faire monter les équipes en compétence, dans une vision résolument user-centric.

### Frontend (8 ans de TypeScript)
- TypeScript, React (Remix), Vue.js (Nuxt, Pinia)
- Design System, accessibilité (A11Y, certifié OPQUAST)
- Forte sensibilité UX/UI

### Backend
- Node.js (4 ans), Fastify (Zod), Express, NestJS
- PostgreSQL (Prisma)

### Plateforme & Observabilité
- Observabilité : OpenTelemetry, Datadog
- Docker, Kubernetes
- CI/CD : GitLab, GitHub

## Expériences professionnelles (8 ans)

### Développeur Full-Stack — Norauto (freelance)
*2022 – 2026 (51 mois) · Lille, France*
- Développement *from scratch* d'une API Fastify critique avec contraintes de charge.
- Refonte d'un référentiel (API + base PostgreSQL) à haute volumétrie (> 200 req/s).
- Gestion d'incidents et fiabilisation de la production.
- Rédaction de documentation et partage de veille continue.
- Évaluation de l'intégration du développement assisté par IA dans l'équipe.
- Amélioration de l'observabilité technique et fonctionnelle.
- Refonte de l'architecture front avec Vue.js 3 et Pinia.
- Amélioration des rituels et process de l'équipe.
- Mise en place des standards d'équipe et de la qualité (conventions, DX, architecture).

### Architecte Front-End — Québecor (mission Atecna)
*2021 – 2022 (10 mois) · Montréal, Canada*
- Refonte architecturale du front : réduction de la dette technique, Design patterns, DX, Storybook.
- Mise en place de l'observabilité GTM et GA avec documentation et bonnes pratiques.

### Développeur Front-End — Bell (mission Atecna)
*2020 – 2021 (6 mois) · Montréal, Canada*
- Développement front en Vue.js 2 d'une plateforme analytique.

### Fondateur — Bankora
*2020 – 2021 (12 mois) · Lille, France*
- Conception et lancement d'un SaaS FinTech : business plan, stratégie de communication, UX/UI, site en Nuxt 2.

### Développeur Front-End — Decathlon (mission Atecna)
*2018 – 2020 (24 mois) · Lille, France*
- Co-conception du Design System de Decathlon (Springboard), bonnes pratiques A11Y.

## Projets personnels — IA générative

### Second brain (2026 – aujourd'hui)
Système de contexte pour agents IA.
- Base de connaissances structurée (personnelle et professionnelle) exploitée par des agents IA.
- Conception du modèle de données, des règles d'écriture et des skills garantissant fiabilité et maintenance automatique.

### Raredrop Studio (2026 – aujourd'hui)
Générateur de goodies et collectibles gaming.
- API Fastify de génération d'images et de texte multi-modèles (OpenRouter), traitement par batch parallèle.
- Workflow modulaire en Remix avec un système composable de prompt engineering (styles/effets/skins) garantissant une signature visuelle unique et cohérente.

### Somnia (2025 – aujourd'hui)
Générateur de méditations à thème personnalisé.
- Architecture multi-agents spécialisés, gestion du contexte injecté dynamiquement.
- Pipeline de bout en bout : trigger IoT → diffusion sur haut-parleur.

## Prix et distinctions

- Juré WorldSkills 2020 (Saint-Quentin, France).
- Certification OPQUAST — 850/1000 (2019, accessibilité web).
- Médaille d'argent WorldSkills 2018 (Roubaix, France).
- Médaille de bronze Cultura'Care 2018 (Centre Hospitalier de Lens, France).
- Médaille d'or Culturathon 2017 (Louvre-Lens, France).
- Projet international GGULIVRR@Lodz 2017 (Łódź, Pologne).

## Formation

- **Licence pro Créaweb** — IUT de Lens (2017 – 2018).
- **DUT MMI** (Métiers du Multimédia et de l'Internet) — IUT de Lens (2015 – 2017).

## Influences

- Eric Evans — Domain-Driven Design
- John Ousterhout — Philosophy of Software Design
- Matt Pocock — LLM
- Andrej Karpathy — LLM

## Centres d'intérêt

- Informatique (autodidacte depuis l'enfance : soudure, code, homelab, DIY) - 21 ans
- Électronique (ESP32, Arduino) - 7 ans
- Réseau (datacenter DIY domestique : NAS, Ubiquiti, VLAN, DNS local) - 7 ans
- Domotique (Home Assistant, IoT Zigbee) - 7 ans
- IA générative (veille active & R&D appliquée) - 3 ans 
- Cartomagie - 12 ans
- Design - 11 ans 
- Photographie - 5 ans
`;
