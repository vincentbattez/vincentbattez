<template>
  <div class="vb-skill">
    <VbSkillList :skill-list="skillList" />
  </div>
</template>

<script lang="ts" setup>
import { IVbSkill, vbSkillTypeEnum } from "~/components/footer/vbSkill.type";
import VbSkillList from "~/components/footer/VbSkillList.vue";

const skillList: IVbSkill[] = [
  {
    name: "vue 3",
    type: vbSkillTypeEnum.primary,
    love: true,
  },
  {
    name: "javascript",
    type: vbSkillTypeEnum.primary,
    love: false,
  },
  {
    name: "UX",
    type: vbSkillTypeEnum.primary,
    love: true,
  },
  {
    name: "accessibilité",
    type: vbSkillTypeEnum.primary,
    love: false,
  },
  {
    name: "user-centric",
    type: vbSkillTypeEnum.primary,
    love: true,
  },
  {
    name: "analytics",
    type: vbSkillTypeEnum.primary,
    love: false,
  },
  {
    name: "seo",
    type: vbSkillTypeEnum.primary,
    love: false,
  },
  {
    name: "freelance",
    type: vbSkillTypeEnum.secondary,
    love: false,
  },
  {
    name: "node.js",
    type: vbSkillTypeEnum.secondary,
    love: false,
  },
];
</script>

<style lang="scss" scoped>
.vb-skill {
  @apply mb-md;
}
</style>
