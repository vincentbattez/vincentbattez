<template>
  <aside class="vb-steps" aria-label="Étapes de l'entretien">
    <p class="vb-steps--kicker vb-monte" :style="rank(0)">
      Entretien de recommandation
    </p>
    <p class="vb-steps--time vb-monte" :style="rank(1)">
      5 questions · ~5 minutes
    </p>

    <ol class="vb-steps--list">
      <li
        v-for="(item, index) in steps"
        :key="item.label"
        class="vb-step vb-monte"
        :class="[`vb-step--${state(index)}`]"
        :style="rank(index + 2)"
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

    <p class="vb-steps--privacy vb-monte" :style="rank(steps.length + 2)">
      Rien n'est conservé&nbsp;: tout reste dans ton navigateur.
    </p>

    <div
      v-if="resettable"
      class="vb-steps--reset vb-monte"
      :style="rank(steps.length + 3)"
    >
      <button
        v-if="!confirming"
        type="button"
        class="vb-steps--reset-link"
        @click="confirming = true"
      >
        Recommencer l'entretien
      </button>
      <template v-else>
        <span class="vb-steps--reset-ask"> Tes réponses seront effacées. </span>
        <span class="vb-steps--reset-choices">
          <button
            type="button"
            class="vb-steps--reset-link vb-steps--reset-link-danger"
            @click="reset()"
          >
            Tout effacer
          </button>
          <button
            type="button"
            class="vb-steps--reset-link"
            @click="confirming = false"
          >
            Annuler
          </button>
        </span>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RECOMMENDATION_STEPS } from "~/components/recommendation/steps";

const props = defineProps<{
  /** 1 à 5 pendant l'Entretien, 6 une fois la Recommandation livrée. */
  step: number;
  /** Faux tant que l'Entretien n'a pas commencé : rien à effacer. */
  resettable?: boolean;
}>();

const emit = defineEmits<{ reset: [] }>();

const steps = RECOMMENDATION_STEPS;
const confirming = ref(false);

// Le rail se compose de haut en bas : titre, durée, puis chaque étape.
function rank(index: number): Record<string, number> {
  return { "--vb-rank": index };
}

function reset(): void {
  confirming.value = false;
  emit("reset");
}

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

  &--reset {
    @apply flex flex-col gap-xs mt-sm text-body-sm;
  }

  &--reset-ask {
    @apply text-grey-600;
  }

  &--reset-choices {
    @apply flex gap-md;
  }

  &--reset-link {
    @apply text-grey-600 underline text-left;

    &:hover {
      @apply text-black;
    }

    &:focus-visible {
      @apply outline outline-2 outline-blue-500;
    }
  }

  &--reset-link-danger {
    @apply text-red-700;
    font-weight: 800;

    &:hover {
      @apply text-red-800;
    }
  }
}

// Chaque ligne du rail entre à son tour, de haut en bas.
.vb-monte {
  animation: vb-monte-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--vb-rank) * 140ms);
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

@keyframes vb-monte-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vb-monte {
    animation: none;
  }
}
</style>
