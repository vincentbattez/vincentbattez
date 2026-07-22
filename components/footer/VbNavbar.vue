<template>
  <nav class="vb-navbar">
    <NuxtLink class="vb-navbar--badge" to="/go/envoyer_message?s=pf">
      <span class="vb-navbar--indicator"></span>
      <span class="vb-navbar--badge-text"
        >Disponible pour mission freelance</span
      >
    </NuxtLink>

    <div class="vb-navbar--socials">
      <VbButton
        href="/go/linkedin?s=pf"
        aria-label="Profil LinkedIn de Vincent Battez"
        :shape="vbButtonShapeEnum.square"
        :type="vbButtonTypeEnum.soft"
      >
        <VbIcon :size="vbButtonSizeEnum.lg" :name="VbIconEnum.VbLinkedin" />
      </VbButton>

      <VbButton
        href="/go/github?s=pf"
        aria-label="Profil GitHub de Vincent Battez"
        :shape="vbButtonShapeEnum.square"
        :type="vbButtonTypeEnum.soft"
      >
        <VbIcon :size="vbButtonSizeEnum.lg" :name="VbIconEnum.VbGithub" />
      </VbButton>
    </div>
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
  @apply flex items-center justify-between gap-md;

  &--badge {
    @apply inline-flex items-center gap-sm;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;

    &:focus {
      outline: 2px solid #3b82f6;
    }
  }

  &--badge-text {
    @apply text-body-sm sm:text-body-md text-orange-800;
    font-weight: 700;
  }

  &--indicator {
    @apply flex-shrink-0;
    width: 11px;
    height: 11px;
    border-radius: 11px;
    background: #56c25f; // green-600
    box-shadow: 0 0 4px 0 #56c25f;
    animation: live-pulse 2s ease-in-out infinite;
  }

  &--socials {
    @apply flex items-center gap-sm;
  }
}

@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 4px 0 #56c25f;
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
    box-shadow: 0 0 8px 2px #56c25f;
  }
}

@media (max-width: 820px) {
  .vb-navbar--badge-text {
    @apply text-body-sm;
  }
}
</style>
