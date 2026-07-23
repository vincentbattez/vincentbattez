<template>
  <div class="vb-skill">
    <VbSkillList :skill-list="skillList" />
  </div>
</template>

<script lang="ts" setup>
import type { IVbSkill } from "~/components/footer/vbSkill.type";
import VbSkillList from "~/components/footer/VbSkillList.vue";

// Reflet du profil (cf. CV). Cœurs sur les compétences signature (colorées).
const skillList: IVbSkill[] = [
  // LLM & Agents
  { name: "Claude Code", love: true },
  { name: "multi-agents", love: false },
  { name: "SDD", love: false },
  { name: "contexte LLM", love: false },
  { name: "conception de skills", love: true },
  // Software Craftsmanship
  { name: "TDD", love: true },
  { name: "Clean Code", love: false },
  { name: "hexagonale", love: false },
  { name: "DDD", love: true },
  { name: "code review", love: false },
  // Frontend
  { name: "TypeScript", love: true },
  { name: "React", love: false },
  { name: "Remix", love: false },
  { name: "Vue.js", love: true },
  { name: "Nuxt", love: false },
  { name: "Pinia", love: false },
  { name: "Design System", love: false },
  { name: "A11Y", love: true },
  { name: "UX / UI", love: true },
  // Backend
  { name: "Node.js", love: false },
  { name: "Fastify", love: false },
  { name: "NestJS", love: false },
  { name: "PostgreSQL", love: false },
  { name: "Prisma", love: false },
  // Tests & Observabilité
  { name: "Vitest", love: false },
  { name: "Playwright", love: false },
  { name: "k6", love: false },
  { name: "OTEL", love: false },
  { name: "Datadog", love: false },
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
</style>
