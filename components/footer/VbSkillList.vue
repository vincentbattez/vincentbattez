<template>
  <div ref="containerRef" class="vb-skill--container" v-on="events">
    <ul ref="listRef" class="vb-skill--list">
      <li
        v-for="skill in duplicatedSkills"
        :key="`${skill.name}-${skill.index}`"
        class="vb-skill--item"
        :class="{
          'vb-skill--item__love': skill.love,
          'vb-skill--item__loop': skill.isLoopMarker,
        }"
        :aria-hidden="skill.ariaHidden || skill.isLoopMarker || undefined"
      >
        <span v-if="skill.isLoopMarker" class="vb-skill--infinity">|</span>
        <template v-else>
          <VbIcon
            class="vb-skill--hashtag"
            :name="VbIconEnum.VbHashtag"
            :size="vbButtonSizeEnum.md"
          />
          <span class="vb-skill--text">{{ skill.name }}</span>
          <VbIcon
            v-if="skill.love"
            class="vb-skill--heart"
            :name="VbIconEnum.VbHeart"
            :size="vbButtonSizeEnum.sm"
          />
        </template>
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
import { useInfiniteMarquee } from "~/composables/useInfiniteMarquee.ts";

const props = defineProps<{
  skillList: IVbSkill[];
}>();

const COPIES = 3;

// COPIES copies pour une boucle sans couture. Seul le 1er jeu est annoncé :
// les copies (i > 0) sont aria-hidden pour ne pas lire 3× la liste. Un marqueur
// ∞ ferme chaque cycle pour signaler le défilement infini.
type SkillEntry = Partial<IVbSkill> & {
  index: string;
  ariaHidden: boolean;
  isLoopMarker?: boolean;
};
const duplicatedSkills = computed(() => {
  const duplicated: SkillEntry[] = [];
  for (let i = 0; i < COPIES; i++) {
    props.skillList.forEach((skill, index) => {
      duplicated.push({
        ...skill,
        index: `${i}-${index}`,
        ariaHidden: i > 0,
      });
    });
    duplicated.push({
      index: `${i}-loop`,
      ariaHidden: true,
      isLoopMarker: true,
    });
  }
  return duplicated;
});

// +1 : le marqueur ∞ fait partie de la période à répéter.
const { containerRef, listRef, events } = useInfiniteMarquee({
  itemsPerPeriod: () => props.skillList.length + 1,
});
</script>

<style lang="scss" scoped>
.vb-skill {
  &--container {
    @apply w-full overflow-hidden;
    touch-action: pan-y; // gestes horizontaux gérés par nous, vertical → page
    cursor: grab;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );

    &:active {
      cursor: grabbing;
    }
  }

  &--list {
    @apply flex gap-sm sm:gap-md select-none;
    width: max-content;
    will-change: transform;
  }

  &--item {
    @apply flex items-center whitespace-nowrap flex-shrink-0;
    @apply text-body-sm sm:text-body-md text-black;
    font-weight: 700;

    // Seuls les skills likés sont colorés (bleu 500), le reste en noir.
    &__love {
      @apply text-blue-500;
    }
  }

  &--item__loop {
    @apply opacity-60;
  }

  &--infinity {
    @apply text-body-md sm:text-body-lg;
    font-weight: 700;
    line-height: 1;
  }

  &--heart {
    @apply text-blue-500;
    position: relative;
    top: -0.25rem;
    left: 0.12rem;
  }

  &--hashtag {
    @apply mr-xs;
  }

  &--text {
    @apply text-body-sm sm:text-body-md;
  }
}
</style>
