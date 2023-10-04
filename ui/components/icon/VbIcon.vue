<template>
  <i
    class="vb-icon"
    :class="{
      [`icon-${props.name}`]: props.name,
      [`vb-icon--${props.size}`]: props.size,
    }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { VbIconEnum } from "~/types/vb-icon";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";

const props = defineProps<{
  name: VbIconEnum;
  size: vbButtonSizeEnum;
}>();
</script>

<style lang="scss">
.vb-icon {
  line-height: 0;
  display: inline-block;

  &--sm {
    @apply icon-sm;
  }
  &--md {
    @apply icon-md;
  }
  &--lg {
    @apply icon-lg;
  }
}
</style>
