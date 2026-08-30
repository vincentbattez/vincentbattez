<template>
  <aside class="vb-steps" aria-label="Étapes de l'entretien">
    <p class="vb-steps--kicker">Entretien de recommandation</p>
    <p class="vb-steps--time">5 questions · ~5 minutes</p>

    <ol class="vb-steps--list">
      <li
        v-for="(item, index) in steps"
        :key="item.label"
        class="vb-step"
        :class="[`vb-step--${state(index)}`]"
        :aria-current="state(index) === 'current' ? 'step' : undefined"
      >
        <span class="vb-step--dot">
          {{ state(index) === "done" ? "✓" : index + 1 }}
        </span>
        <span class="vb-step--body">
          <span class="vb-step--label">{{ item.label }}</span>
          <span class="vb-step--goal">{{ item.goal }}</span>
        </span>
      </li>
    </ol>

    <p class="vb-steps--privacy">
      Rien n'est conservé&nbsp;: tout reste dans ton navigateur.
    </p>
  </aside>
</template>

<script setup lang="ts">
import { RECOMMENDATION_STEPS } from "~/components/recommendation/steps";

const props = defineProps<{
  /** 1 à 5 pendant l'Entretien, 6 une fois la Recommandation livrée. */
  step: number;
}>();

const steps = RECOMMENDATION_STEPS;

function state(index: number): "done" | "current" | "todo" {
  if (props.step > index + 1) return "done";
  if (props.step === index + 1) return "current";
  return "todo";
}
</script>

<style lang="scss" scoped>
.vb-steps {
  @apply flex flex-col gap-sm;

  &--kicker {
    @apply font-heading text-h4 text-black;
  }

  &--time {
    @apply text-body-sm text-grey-600;
  }

  &--list {
    @apply flex flex-col mt-sm;
  }

  &--privacy {
    @apply text-body-sm text-grey-600 mt-md;
  }
}

.vb-step {
  @apply flex gap-sm pb-md;
  position: relative;

  // Filet vertical entre les pastilles : le progrès se lit d'un coup d'œil.
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 0.85rem;
    top: 1.9rem;
    bottom: 0.15rem;
    width: 2px;
    @apply bg-grey-200;
  }

  &--dot {
    @apply flex items-center justify-center shrink-0 border border-grey-200 bg-white text-grey-600 text-body-sm;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 999px;
    font-weight: 800;
    z-index: 1;
  }

  &--body {
    @apply flex flex-col;
  }

  &--label {
    @apply text-body-md text-grey-600;
    font-weight: 800;
  }

  // L'objectif n'apparaît que là où il sert : sur l'étape en cours.
  &--goal {
    @apply text-body-sm text-grey-700;
    display: none;
  }

  &--done .vb-step--dot {
    @apply bg-green-800 text-white;
    border-color: transparent;
  }

  &--current .vb-step--dot {
    @apply bg-secondary text-white;
    border-color: transparent;
    box-shadow: 0 0 0 5px rgb(35 165 247 / 18%);
  }

  &--current .vb-step--label {
    @apply text-black;
  }

  &--current .vb-step--goal {
    display: block;
  }
}
</style>
