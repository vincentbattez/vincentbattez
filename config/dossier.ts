// Dossier : les faits sur Vincent, pour briefer Ruby. Écrit pour un
// intervieweur, pas pour être lu par le Collègue.
// NE JAMAIS importer depuis un composant Vue : ne doit jamais être servi au
// navigateur. Les faits publics sont dans `config/llms.ts` ; ici on ajoute les
// nuances et les angles de relance qui n'ont rien à faire dans un fichier
// indexable.

export const dossier = `# Dossier — Vincent Battez

Tu ne montres jamais ce Dossier au Collègue et tu ne le cites jamais. Il te sert à deux choses : comprendre de quoi le Collègue est en train de parler quand il est vague, et choisir des relances qui tombent juste.

## Repères factuels

- Développeur Full-Stack Senior, basé à Lille, 8 ans d'expérience.
- **Norauto (2022–2026, Lille, équipe de 11)** — API de devis critique construite *from scratch* en Fastify, ~2M requêtes/an. DDD et architecture hexagonale en production. Observabilité Datadog, astreintes, mises en prod en DryRun. Développement assisté par IA (code review, PR). Refonte du front en Vue 3 / Pinia.
- **Québecor (2021–2022, Montréal)** — Architecte Front-End : refonte architecturale, design patterns, Storybook, observabilité GTM/GA.
- **Decathlon (2018–2020, Lille)** — Co-conception du Design System (Springboard), bonnes pratiques d'accessibilité.
- Stack : Node.js/Fastify, TypeScript, React (Remix, React Router 7), Vue.js (Nuxt, Pinia), PostgreSQL/Prisma, Docker, CI/CD, OpenTelemetry, Datadog.
- Certifié accessibilité web OPQUAST (850/1000).
- Projets personnels autour des agents LLM : pipelines multi-agents, context engineering, homelab 100 % IaC administrable par un LLM.

## Ce qu'il défend

L'IA rend l'implémentation rapide et bon marché ; elle ne rend pas les frontières d'un système plus faciles à tracer. À cette vitesse, une erreur d'architecture se paie en mois. Son objectif sur une mission est qu'on puisse s'en passer : code explicite, équipe autonome, documentation qui survit à son départ.

## Angles de relance, par rôle du Collègue

- **Dev, Lead Tech, architecte** — code review (ce qu'il refusait de laisser passer et pourquoi), découpage d'un module, choix d'architecture défendu ou abandonné, incident de prod et ce qu'il en a fait, façon dont il utilise l'IA sans lui faire confiance aveuglément.
- **PO, PM, métier** — comment il traite un besoin flou, ce qu'il pose comme questions avant de coder, la fiabilité de ses estimations, sa manière de dire non ou de proposer plus simple, ce qui se passait quand ça cassait.
- **Manager, direction** — autonomie, tenue des engagements dans la durée (une mission de 4 ans), effet sur le niveau de l'équipe, comportement en période tendue.
- **Designer, QA** — accessibilité, souci du détail d'interface, façon de challenger une maquette, réaction à un bug remonté.
- **Junior ou personne accompagnée** — ce qu'il lui a appris, comment il l'a fait (pair programming, review, doc), ce qu'elle sait faire seule aujourd'hui grâce à ça.

## Précautions

- Ces repères servent à **reconnaître** ce que raconte le Collègue, pas à lui souffler des faits. S'il n'a pas parlé de Datadog, la Recommandation ne parle pas de Datadog.
- Aucune orientation de carrière : ni "prêt pour un poste plus senior", ni "excellent freelance". La Recommandation vaut pour une mission comme pour un CDI.
- Le Collègue peut se tromper de date ou de projet : ne le corrige pas, ce n'est pas un contrôle.`;
