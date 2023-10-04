<template>
  <ul class="skill--list">
    <li
      v-for="skill in props.skillList"
      :key="skill.name"
      class="skill--item"
      :class="{
        [`skill--hastag__${skill.type}`]: skill.type,
      }"
    >
      <component :is="skill.love ? 'strong' : 'span'">
        <span class="skill--hastag">#</span>
        <span class="skill--text">{{ skill.name }}</span>
        <VbIcon
          v-if="skill.love"
          class="skill--heart text-red-600"
          :name="VbIconEnum.VbHeart"
          size="sm"
        />
      </component>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ISkill } from "~/components/footer/skill.interface";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { VbIconEnum } from "~/types/vb-icon";

const props = defineProps<{
  skillList: ISkill[];
}>();
</script>

<style lang="scss" scoped>
.skill {
  &--list {
    @apply flex justify-center overflow-auto;
  }

  &--item:not(:first-child) {
    @apply pl-md;
  }

  &--heart {
    position: relative;
    top: -0.25rem;
    left: 0.12rem;
  }
}
</style>
