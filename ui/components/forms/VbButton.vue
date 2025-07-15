<template>
  <component
    :is="props.href ? 'a' : 'button'"
    :href="props.href"
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
import {
  vbButtonShapeEnum,
  vbButtonTypeEnum,
} from "~/ui/components/forms/VbButton.type";

const props = defineProps<{
  type: vbButtonTypeEnum;
  href?: String;
  shape?: vbButtonShapeEnum;
}>();
</script>

<style lang="scss" scoped>
.btn {
  @apply inline-flex ps-md pe-md pt-sm pb-sm items-center justify-center;
  @apply rounded;
  @apply text-body-md;
  @apply transition-all duration-200 ease-in-out;

  // type
  &--primary {
    @apply bg-secondary text-white;

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

  // shape
  &--square {
    @apply ps-sm pe-sm pt-sm pb-sm;
  }
}
</style>
