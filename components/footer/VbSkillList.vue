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
import { type IVbSkill } from "~/components/footer/vbSkill.type";
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
    @apply flex flex-wrap justify-center gap-sm sm:gap-md overflow-visible;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    
    @screen sm {
      padding-left: 0;
      padding-right: 0;
    }
  }

  &--item {
    @apply flex items-center whitespace-nowrap;
    @apply text-body-sm sm:text-body-md; // Smaller text on mobile
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
  
  &--text {
    @apply text-body-sm sm:text-body-md;
  }
}
</style>
