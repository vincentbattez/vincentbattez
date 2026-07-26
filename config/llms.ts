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
        "Profil rare combinant une **architecture backend robuste** (DDD, hexagonale, APIs critiques haute volumétrie) et une **maîtrise avancée du développement assisté par IA** (agents LLM, context engineering).",
        "",
        "- 8 ans d'expérience, dont React/Remix, Vue.js/Nuxt, TypeScript et Node.js/Fastify.",
        "- Spécialités : architecture logicielle (DDD, Clean/Hexagonale), qualité (TDD, code review, observabilité) et développement assisté par IA (agents LLM, context engineering).",
        "- Certifié accessibilité web OPQUAST (850/1000).",
        "- Langues : français (natif), anglais professionnel (compréhension B2).",
        "- **Disponible pour des contrats freelance** — 100 % remote ou hybride, missions de longue durée privilégiées.",
      ].join("\n"),
    },
    {
      title: "Expertise",
      description: [
        "- **IA & Agents LLM** : Claude Code (SDD + TDD), gestion de contexte, orchestration multi-agents, conception de skills, prompt engineering.",
        "- **Backend** : Node.js, Fastify (Zod), Express, NestJS, PostgreSQL (Prisma), APIs critiques haute volumétrie.",
        "- **Frontend** : TypeScript, React (Remix), Vue.js (Nuxt, Pinia), Design System, accessibilité (A11Y), UX/UI.",
        "- **Craftsmanship** : DDD, Clean Code, Hexagonale/MVC, tests (Vitest, Playwright, k6), documentation & transmission.",
        "- **Plateforme & Observabilité** : Docker, Azure, CI/CD (GitLab, GitHub Actions), OpenTelemetry (OTEL-LGTM), Datadog (Kubernetes : notions).",
      ].join("\n"),
    },
    {
      title: "Expériences clés",
      description: [
        "- **Norauto** (2022–2026, freelance, Lille, équipe de 11) — API de devis critique *from scratch* (Fastify, ~2M req/an), DDD + hexagonal en prod, observabilité Datadog (astreintes, DryRun), dev assisté par IA (code review, PR), refonte front Vue.js 3/Pinia.",
        "- **Québecor** (2021–2022, Montréal) — Architecte Front-End : refonte architecturale, Design patterns, Storybook, observabilité GTM/GA.",
        "- **Decathlon** (2018–2020, Lille) — Co-conception du Design System (Springboard), bonnes pratiques A11Y.",
      ].join("\n"),
    },
    {
      title: "Projets personnels — IA générative",
      description: [
        "- **Second brain** — Système de contexte pour agents IA : base de connaissances structurée, modèle de données, règles et skills garantissant fiabilité et maintenance automatique.",
        "- **Raredrop Studio** — Studio de collectibles gaming : API Fastify (endpoint batch, OpenRouter, résilience `Promise.allSettled`), frontend React Router 7 (SSR, graceful degradation).",
        "- **Somnia** — Méditations générées par IA : pipeline multi-agents (Storyteller + Writer, Claude Opus/OpenRouter) → TTS → Sonos, ~2-3 min de bout en bout.",
        "- **Homelab** — Infra DevOps R&D, 100 % IaC : structure et contexte conçus pour qu'un LLM administre entièrement le serveur ; GitOps 6 couches (Ansible, Dokploy, SOPS, CI/CD, OTEL-LGTM, backup 3-2-1).",
      ].join("\n"),
    },
    {
      title: "Modalités de collaboration",
      description: [
        "- **Statut** : freelance, disponible pour de nouveaux contrats.",
        "- **Organisation** : 100 % remote ou hybride.",
        "- **Durée** : missions de longue durée privilégiées.",
        "- **Prise de contact** : LinkedIn ou email.",
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
    "Disponible pour des contrats freelance (100 % remote ou hybride, longue durée) — prise de contact via LinkedIn ou par email.",
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
- Statut : freelance, **disponible pour de nouveaux contrats** (100 % remote ou hybride, missions de longue durée privilégiées)
- Langues : français (langue maternelle), anglais professionnel (compréhension B2)

## Ce que je recherche

- **Type** : missions freelance de longue durée.
- **Organisation** : 100 % remote ou hybride.
- **Contexte idéal** : produits à forte exigence technique (APIs critiques, architecture, qualité) et/ou projets tirant parti des agents IA et du context engineering.
- **Qualité** : culture craftsmanship poussée (TDD, tests Vitest/Playwright/k6, code review, observabilité OpenTelemetry/Datadog).
- **Fiabilité** : conçoit des systèmes robustes, testables et durables, avec un vrai sens du produit (user-centric, UX/UI, accessibilité certifiée OPQUAST).
- **Longévité** : missions longues (4 ans chez Norauto), gage d'engagement et de confiance.

## Compétences

### IA & Agents LLM
- Claude Code (Spec-Driven Development + TDD)
- Gestion de contexte LLM : structuration de l'information, specs, boucle de validation, orchestration multi-agents
- Conception de skills, prompt engineering, context engineering
- Appliqué en contexte professionnel (code review, descriptions de PR, dev assisté) comme en R&D personnelle (systèmes multi-agents)

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
- Observabilité : OpenTelemetry (stack OTEL-LGTM), Datadog (monitors, alertes, astreintes)
- Cloud & CI/CD : GitLab CI (autoscaling, pipelines MEP), GitHub Actions
- Docker (production et homelab GitOps)
- Kubernetes : notions (exposition en contexte OPS)

## Expériences professionnelles (8 ans)

### Développeur Full-Stack — Norauto (freelance)
*2022 – 2026 (51 mois) · Lille, France · équipe de 11*

Mission longue durée, du front vers le back, sur des systèmes critiques.

**Quote Engine — API de devis critique (from scratch, Fastify / TypeScript)**
- ~2 millions de requêtes/an, tenue des pics de charge saisonniers, exigence « ne doit jamais tomber » : gestion d'erreur robuste et DTO modulables pour absorber les changements métier.
- Intégration de 15 API internes, communication inter-équipes.
- Observabilité de production : Datadog (monitors, alertes, astreintes), logs traçables, mécanisme de *DryRun* pour tester en conditions réelles.

**Architecture & qualité**
- DDD + architecture hexagonale en production : event storming, ubiquitous language, couche métier isolée et testée.
- Refonte d'un référentiel PostgreSQL à haute volumétrie (> 200 req/s) et d'une base de +10 ans sans régression ; modernisation du socle (CJS → ESM, Node 20 → 24, nettoyage des dépendances, pipelines GitLab CI).
- Refonte du front (mandat initial) en Vue.js 3 / Pinia (GraphQL/Apollo), mise en place des conventions et de l'outillage.

**Transmission**
- Documentation d'équipe centralisée (Docusaurus) et diffusion des standards

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
Studio de production de collectibles gaming (API + frontend).
- API Fastify : OpenRouter comme couche d'abstraction (bascule de modèle sans toucher au code).
- Traçabilité : métadonnées de génération (prompt, modèle, date) embarquées dans chaque image pour reproduire un résultat des mois plus tard.
- Frontend React Router 7 (SSR) : streaming + graceful degradation (jamais de rendu bloqué par un service externe), integration contracts typés, Prisma/PostgreSQL.

### Somnia (2025 – aujourd'hui)
Génération quotidienne de méditations guidées par IA.
- Pipeline multi-agents : Storyteller (récit en 5 scènes) puis Meditation Writer (mise en méditation guidée), Claude Opus via OpenRouter, TTS puis diffusion Sonos — déclenché par un bouton physique (Home Assistant).
- Sélection pondérée des thèmes/ambiances, contexte injecté dynamiquement.

### Homelab — infrastructure & DevOps (R&D personnelle)
Infrastructure serveur reproductible, **100 % Infrastructure as Code**.
- **Contexte et structure pensés pour qu'un LLM comprenne et administre entièrement le serveur** (l'objectif directeur du projet) : documentation, conventions et modèle de données conçus pour un agent IA.
- Chaîne GitOps 6 couches : provisioning Ansible, déploiement Dokploy/Traefik, secrets chiffrés dans Git (SOPS/age), CI/CD GitHub Actions, observabilité (OTEL-LGTM, Uptime Kuma), backup 3-2-1 (Restic/rclone).
- Réseau segmenté (UniFi, WireGuard, VLAN, DNS Cloudflare), héberge un agent IA autonome (Hermes).

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
