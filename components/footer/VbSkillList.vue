<template>
  <ul class="vb-skill--list">
    <li
      v-for="skill in props.skillList"
      :key="skill.name"
      class="vb-skill--item"
      :class="{
        [`vb-skill--hastag__${skill.type}`]: skill.type,
      }"
    >
      <VbIcon
        class="vb-skill--hashtag"
        :class="{
          [`vb-skill--hashtag__${skill.type}`]: skill.type,
        }"
        :name="VbIconEnum.VbHashtag"
        :size="vbButtonSizeEnum.md"
      />
      <span class="vb-skill--text">{{ skill.name }}</span>
      <VbIcon
        v-if="skill.love"
        class="vb-skill--heart text-red-600"
        :name="VbIconEnum.VbHeart"
        :size="vbButtonSizeEnum.sm"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { IVbSkill } from "~/components/footer/vbSkill.type";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { VbIconEnum } from "~/types/vb-icon";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";

const props = defineProps<{
  skillList: IVbSkill[];
}>();
</script>

<style lang="scss" scoped>
.vb-skill {
  &--list {
    @apply flex justify-center overflow-auto;
  }

  &--item {
    @apply flex items-center;

    &:not(:first-child) {
      @apply pl-md;
    }
  }

  &--heart {
    position: relative;
    top: -0.25rem;
    left: 0.12rem;
  }
  &--hashtag {
    @apply mr-xs;

    &__primary {
      @apply text-primary;
    }
    &__secondary {
      @apply text-secondary;
    }
  }
}
</style>
