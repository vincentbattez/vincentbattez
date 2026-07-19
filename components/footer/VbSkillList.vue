<template>
  <div class="vb-skill--container">
    <ul class="vb-skill--list">
      <li
        v-for="skill in duplicatedSkills"
        :key="`${skill.name}-${skill.index}`"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IVbSkill } from "~/components/footer/vbSkill.type";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { VbIconEnum } from "~/types/vb-icon";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";

const props = defineProps<{
  skillList: IVbSkill[];
}>();

// Dupliquer les skills pour créer un effet de boucle infinie
const duplicatedSkills = computed(() => {
  const duplicated: (IVbSkill & { index: string })[] = [];
  // Créer 3 copies pour assurer une boucle fluide
  for (let i = 0; i < 3; i++) {
    props.skillList.forEach((skill, index) => {
      duplicated.push({
        ...skill,
        index: `${i}-${index}`,
      });
    });
  }
  return duplicated;
});
</script>

<style lang="scss" scoped>
.vb-skill {
  &--container {
    @apply w-full overflow-hidden;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
  }

  &--list {
    @apply flex gap-sm sm:gap-md;
    animation: scroll-right 30s linear infinite;
    width: max-content;
  }

  &--item {
    @apply flex items-center whitespace-nowrap flex-shrink-0;
    @apply text-body-sm sm:text-body-md;
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

@keyframes scroll-right {
  0% {
    transform: translateX(-33.333%); // Commence par la gauche
  }
  100% {
    transform: translateX(0); // Se déplace vers la droite
  }
}

// Pause l'animation au survol
.vb-skill--container:hover .vb-skill--list {
  animation-play-state: paused;
}
</style>
