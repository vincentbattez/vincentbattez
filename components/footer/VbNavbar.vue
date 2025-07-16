<template>
  <nav class="vb-navbar">
    <!-- Freelance -->
    <a
      class="vb-navbar--item vb-navbar--freelance"
      href="/go/envoyer_message?s=pf"
    >
      <div class="vb-navbar--freelance-indicator"></div>
      <span class="vb-navbar--freelance-text"
        >Disponible pour mission freelance</span
      >
    </a>

    <!-- Linkedin -->
    <VbButton
      class="vb-navbar--item"
      href="/go/linkedin?s=pf"
      :shape="vbButtonShapeEnum.square"
      :type="vbButtonTypeEnum.primary"
    >
      <VbIcon :size="vbButtonSizeEnum.lg" :name="VbIconEnum.VbLinkedin" />
    </VbButton>

    <!-- Github -->
    <VbButton
      class="vb-navbar--item"
      href="/go/github?s=pf"
      :shape="vbButtonShapeEnum.square"
      :type="vbButtonTypeEnum.primary"
    >
      <VbIcon :size="vbButtonSizeEnum.lg" :name="VbIconEnum.VbGithub" />
    </VbButton>
  </nav>
</template>

<script lang="ts" setup>
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { VbIconEnum } from "~/types/vb-icon";
import {
  vbButtonTypeEnum,
  vbButtonShapeEnum,
} from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
</script>

<style lang="scss" scoped>
.vb-navbar {
  @apply mt-md flex sm:flex-row justify-center sm:justify-end items-center gap-md sm:gap-lg;

  &--item {
    @apply text-center;

    // On mobile, make the freelance text smaller and wrap better
    &:first-child {
      @apply text-body-sm sm:text-body-md;
    }
  }

  &--freelance {
    @apply flex items-center;

    &:focus {
      outline: 2px solid #3b82f6;
    }
  }

  &--freelance:hover &--freelance-text::before,
  &--freelance:focus &--freelance-text::before {
    width: 100%;
  }

  &--freelance-text {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #3b82f6; // Tailwind blue-500
      border-radius: 2px;
    }

    &::before {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #56c25f; // Green color matching the indicator
      border-radius: 2px;
      transition: width 0.3s ease-in-out;
      z-index: 1;
    }
  }

  &--freelance-indicator {
    @apply mr-md flex-shrink-0;
    width: 11px;
    height: 11px;
    border-radius: 11px;
    background: var(--Green-600, #56c25f);
    box-shadow: 0px 0px 4px 0px #56c25f;
    animation: live-pulse 2s ease-in-out infinite;
  }
}

@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0px 0px 4px 0px #56c25f;
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
    box-shadow: 0px 0px 8px 2px #56c25f;
  }
}
</style>
