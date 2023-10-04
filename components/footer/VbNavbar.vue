<template>
  <nav class="vb-navbar">
    <!-- Freelance -->
    <a class="vb-navbar--item" href="#">Disponible pour mission freelance</a>

    <!-- Linkedin -->
    <VbButton class="vb-navbar--item" href="#" shape="square" type="primary">
      <VbIcon size="lg" :name="VbIconEnum.VbLinkedin" />
    </VbButton>

    <!-- Github -->
    <VbButton class="vb-navbar--item" href="#" shape="square" type="primary">
      <VbIcon size="lg" :name="VbIconEnum.VbGithub" />
    </VbButton>
  </nav>
</template>

<script lang="ts" setup>
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { VbIconEnum } from "~/types/vb-icon";
</script>

<style lang="scss" scoped>
.vb-navbar {
  @apply mt-md flex justify-end items-center;

  &--item {
    &:not(:last-child) {
      @apply mr-lg;
    }
  }
}
</style>
