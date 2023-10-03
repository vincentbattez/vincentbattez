<template>
  <button
    class="btn"
    :class="{
      [`btn--${props.type}`]: props.type,
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: "primary",
  },
});
</script>

<style lang="scss" scoped>
.btn {
  @apply flex ps-md pe-md pt-sm pb-sm items-center justify-center;
  @apply rounded;
  @apply text-body-md;

  &--primary {
    @apply bg-secondary text-white;
  }

  &--secondary {
    @apply border border-secondary text-secondary;
  }
}
</style>
