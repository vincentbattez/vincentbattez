<template>
  <footer class="vb-footer">
    <a
      v-if="route.path === '/'"
      class="page-llms"
      href="/llms-full.txt"
      title="Version llms.txt — pour les agents IA"
    >
      llms.txt
    </a>
    <div class="vb-skill">
      <VbSkillList :skill-list="skillList" />
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { IVbSkill } from "~/components/footer/vbSkill.type";
import VbSkillList from "~/components/footer/VbSkillList.vue";
const route = useRoute();

// Reflet du profil (cf. CV). Cœurs sur les compétences signature (colorées).
const skillList: IVbSkill[] = [
  // Tests & Observabilité
  { name: "Vitest", love: false },
  { name: "Playwright", love: false },
  { name: "k6", love: false },
  { name: "Observabilité", love: true },
  { name: "Datadog", love: false },
  // LLM & Agents
  { name: "Claude Code", love: true },
  { name: "SDD", love: false },
  { name: "Gestion de contexte LLM", love: false },
  // Software Craftsmanship
  { name: "TDD", love: false },
  { name: "Clean Code", love: true },
  { name: "Hexagonale", love: false },
  { name: "MVC", love: false },
  { name: "DDD", love: true },
  { name: "Code review", love: false },
  { name: "Documentation et transmission", love: true },
  // Frontend
  { name: "TypeScript", love: false },
  { name: "React", love: true },
  { name: "Remix", love: false },
  { name: "Vue.js", love: true },
  { name: "Nuxt", love: false },
  { name: "Pinia", love: false },
  { name: "Vision User-Centric", love: true },
  { name: "Design System", love: false },
  { name: "A11Y", love: false },
  { name: "UX / UI", love: true },
  // Backend
  { name: "Node.js", love: true },
  { name: "Fastify", love: false },
  { name: "NestJS", love: false },
  { name: "PostgreSQL", love: false },
  { name: "Prisma", love: false },
  // Plateforme
  { name: "Docker", love: false },
  { name: "Kubernetes", love: false },
  { name: "CI/CD", love: false },
];
</script>

<style lang="scss" scoped>
.vb-skill {
  @apply py-md;
  border-top: 1px solid rgba(240, 145, 15, 0.18);
  background: white;
}

// Lien discret /llms.txt : centré sous la carte. Faible contraste volontaire
// (décoratif/technique), renforcé au survol/focus.
.page-llms {
  @apply mb-sm block w-fit mx-auto font-heading font-semibold text-orange-700/35 no-underline text-body-sm;
  letter-spacing: 0.12em;
  transition:
    color 150ms ease,
    opacity 150ms ease;
}

.page-llms:hover,
.page-llms:focus-visible {
  @apply text-orange-700/95 underline;
  text-underline-offset: 3px;
}
</style>
