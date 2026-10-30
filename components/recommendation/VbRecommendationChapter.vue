<template>
  <div class="vb-chapitre" role="separator" :aria-label="ariaLabel">
    <span class="vb-chapitre--num">{{ display }}</span>
    <span class="vb-chapitre--label">{{ label }}</span>
    <span class="vb-chapitre--trait" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 1 à 5 pour une question, 6 pour la livraison. */
  index: number;
  label: string;
  /** La livraison clôt l'entretien : elle se marque autrement qu'une question. */
  delivery?: boolean;
}>();

const display = computed(() =>
  props.delivery ? "★" : String(props.index).padStart(2, "0"),
);
const ariaLabel = computed(() =>
  props.delivery ? props.label : `Étape ${props.index} : ${props.label}`,
);
</script>

<style lang="scss" scoped>
.vb-chapitre {
  @apply flex items-center gap-sm pt-sm;
  animation: vb-chapitre-in 420ms cubic-bezier(0.22, 1, 0.36, 1) 300ms both;

  &--num {
    @apply flex items-center justify-center shrink-0 text-white text-body-sm font-heading;
    min-width: 1.75rem;
    height: 1.75rem;
    padding-inline: 0.35rem;
    border-radius: 999px;
    font-weight: 800;
    letter-spacing: 0.02em;
    background: linear-gradient(
      140deg,
      theme("colors.primary") 0%,
      theme("colors.orange.700") 100%
    );
    box-shadow: 0 6px 14px -6px theme("colors.orange.700 / 70%");
  }

  &--label {
    @apply font-heading text-h4 text-orange-800 shrink-0;
    font-weight: 800;
  }

  // Le filet prolonge le titre jusqu'au bord : la coupure se lit sur toute la largeur.
  &--trait {
    @apply grow;
    height: 1px;
    transform-origin: left;
    animation: vb-trait-in 520ms cubic-bezier(0.22, 1, 0.36, 1) 520ms both;
    background: linear-gradient(
      to right,
      theme("colors.orange.300 / 90%"),
      theme("colors.orange.300 / 0%")
    );
  }
}

@keyframes vb-chapitre-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}

@keyframes vb-trait-in {
  from {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vb-chapitre,
  .vb-chapitre--trait {
    animation: none;
  }
}
</style>
