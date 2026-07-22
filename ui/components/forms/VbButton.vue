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

  &--primary {
    @apply bg-secondary text-white;
    box-shadow: 0 12px 24px -10px rgba(35, 165, 247, 0.6);

    &:hover {
      @apply bg-blue-400;
    }
    &:focus {
      @apply bg-blue-400;
      outline: 4px solid #d2f7fdff;
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
    &:focus {
      outline: 4px solid #d2f7fdff;
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
    &:focus {
      outline: 4px solid #d2f7fdff;
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
