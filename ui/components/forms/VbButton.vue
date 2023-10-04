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

  // type
  &--primary {
    @apply bg-secondary text-white;
  }

  &--secondary {
    @apply border border-secondary text-secondary;
  }

  // shape
  &--square {
    @apply ps-sm pe-sm pt-sm pb-sm;
  }
}
</style>
