<template>
  <aside class="vb-steps" aria-label="Étapes de l'entretien">
    <p class="vb-steps--kicker vb-monte" :style="rank(0)">
      Entretien de recommandation
    </p>
    <p class="vb-steps--time vb-monte" :style="rank(1)">
      5 questions · ~5 minutes
    </p>

    <p class="vb-steps--resume" aria-hidden="true">{{ resume }}</p>

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

// En mobile, le rail se résume à une ligne : où on en est, et sur quoi.
const resume = computed(() =>
  props.step > steps.length
    ? "Recommandation prête"
    : `Étape ${props.step}/${steps.length} · ${steps[props.step - 1]?.label ?? ""}`,
);

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
// Mobile : une barre d'une ligne (résumé + pastilles). Desktop : le rail vertical.
.vb-steps {
  @apply flex flex-row flex-wrap items-center gap-xs;

  @screen md {
    @apply flex-col flex-nowrap items-stretch gap-sm;
  }

  &--kicker {
    @apply hidden font-heading text-h4 text-black;

    @screen md {
      @apply block;
    }
  }

  &--time {
    @apply hidden text-body-sm text-grey-600;

    @screen md {
      @apply block;
    }
  }

  &--resume {
    @apply text-body-sm text-black;
    font-weight: 800;
    order: -2;

    @screen md {
      @apply hidden;
    }
  }

  &--list {
    @apply flex flex-row items-center w-full;

    @screen md {
      @apply flex-col items-stretch mt-sm w-auto;
    }
  }

  &--privacy {
    @apply hidden text-body-sm text-grey-600;

    @screen md {
      @apply block mt-md;
    }
  }

  &--reset {
    @apply flex flex-col gap-xs text-body-sm;
    order: -1;
    margin-left: auto;

    @screen md {
      @apply mt-sm;
      order: 0;
      margin-left: 0;
    }
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
  @apply flex items-center grow;
  position: relative;

  &:last-child {
    @apply grow-0;
  }

  // Filet entre les pastilles : le progrès se lit d'un coup d'œil.
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 1.35rem;
    right: 0.2rem;
    top: 50%;
    height: 2px;
    @apply bg-grey-200;
  }

  &--dot {
    @apply flex items-center justify-center shrink-0 border border-grey-200 bg-white text-grey-600;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
    border-radius: 999px;
    font-weight: 800;
    z-index: 1;
  }

  // Les libellés restent lus par les lecteurs d'écran, invisibles en mobile.
  &--body {
    @apply sr-only;
  }

  &--label {
    @apply text-body-md text-grey-600;
    font-weight: 800;
  }

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
    box-shadow: 0 0 0 4px theme("colors.secondary / 18%");
  }

  &--current .vb-step--label {
    @apply text-black;
  }

  @screen md {
    @apply items-start gap-sm pb-md grow-0;

    &:not(:last-child)::before {
      left: 0.85rem;
      right: auto;
      top: 1.9rem;
      bottom: 0.15rem;
      width: 2px;
      height: auto;
    }

    &--dot {
      @apply text-body-sm;
      width: 1.75rem;
      height: 1.75rem;
      font-size: inherit;
    }

    &--body {
      @apply not-sr-only flex flex-col;
    }

    // L'objectif n'apparaît que là où il sert : sur l'étape en cours.
    &--current .vb-step--goal {
      display: block;
    }

    &--current .vb-step--dot {
      box-shadow: 0 0 0 5px theme("colors.secondary / 18%");
    }
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
