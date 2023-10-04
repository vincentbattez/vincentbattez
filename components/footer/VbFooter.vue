<template>
  <div class="skill">
    <VbSkillList :skill-list="skillList" />
  </div>
</template>

<script lang="ts" setup>
import { ISkill, skillTypeEnum } from "~/components/footer/skill.interface";
import VbSkillList from "~/components/footer/VbSkillList.vue";

const skillList: ISkill[] = [
  {
    name: "vue 3",
    type: skillTypeEnum.primary,
    love: true,
  },
  {
    name: "javascript",
    type: skillTypeEnum.primary,
    love: false,
  },
  {
    name: "UX",
    type: skillTypeEnum.primary,
    love: true,
  },
  {
    name: "accessibilité",
    type: skillTypeEnum.primary,
    love: false,
  },
  {
    name: "user-centric",
    type: skillTypeEnum.primary,
    love: true,
  },
  {
    name: "analytics",
    type: skillTypeEnum.primary,
    love: false,
  },
  {
    name: "seo",
    type: skillTypeEnum.primary,
    love: false,
  },
  {
    name: "freelance",
    type: skillTypeEnum.secondary,
    love: false,
  },
  {
    name: "node.js",
    type: skillTypeEnum.secondary,
    love: false,
  },
];
</script>

<style lang="scss" scoped></style>
