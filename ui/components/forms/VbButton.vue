<template>
  <component
    :is="tag"
    v-bind="linkAttrs"
    class="btn"
    :class="{
      [`btn--${props.type}`]: props.type,
      [`btn--${props.shape}`]: props.shape,
    }"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type {
  vbButtonShapeEnum,
  vbButtonTypeEnum,
} from "~/ui/components/forms/VbButton.type";

const props = defineProps<{
  type: vbButtonTypeEnum;
  href?: string;
  shape?: vbButtonShapeEnum;
}>();

// Liens internes (/) → NuxtLink (navigation SPA) ; externes → <a> ; sinon <button>.
const NuxtLink = resolveComponent("NuxtLink");
const isInternal = computed(() => props.href?.startsWith("/") ?? false);

const tag = computed(() => {
  if (isInternal.value) return NuxtLink;
  return props.href ? "a" : "button";
});

const linkAttrs = computed(() => {
  if (isInternal.value) return { to: props.href };
  return props.href ? { href: props.href } : {};
});
</script>

<style lang="scss" scoped>
.btn {
  @apply inline-flex ps-md pe-md pt-sm pb-sm items-center justify-center;
  @apply rounded;
  @apply text-body-md;
  @apply transition-all duration-200 ease-in-out;
  outline: 0px solid white;

  &:focus-visible {
    outline: 4px solid;
  }

  &:active {
    transform: scale(0.96);
  }

  &--primary {
    @apply bg-secondary text-white;
    box-shadow: 0 12px 24px -10px rgba(35, 165, 247, 0.6);

    &:hover {
      @apply bg-blue-400;
    }
    &:focus-visible {
      @apply bg-blue-400;
      @apply outline-blue-500;
    }
    &:active {
      @apply bg-blue-500;
    }
  }

  &--outline {
    @apply border border-secondary text-secondary;

    &:hover {
      @apply bg-blue-100;
    }
    &:focus-visible {
      @apply outline-blue-500;
    }
    &:active {
      @apply text-blue-600;
      @apply bg-blue-200;
    }
  }

  // Boutons sociaux : carré blanc, fine bordure grise.
  &--soft {
    @apply bg-white text-grey-600 border border-grey-200;

    &:hover {
      @apply border-grey-300 text-black;
    }
    &:focus-visible {
      @apply outline-grey-500;
    }
    &:active {
      @apply bg-grey-100 border-grey-400 text-black;
    }
  }

  &--square {
    padding: 0;
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }
}
</style>
