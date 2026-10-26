<template>
  <div class="vb-socials" :class="{ 'vb-socials--compact': compact }">
    <VbButton
      :href="outboundHref('linkedin', 'pf')"
      aria-label="Profil LinkedIn de Vincent Battez"
      :shape="vbButtonShapeEnum.square"
      :type="vbButtonTypeEnum.soft"
      @click="trackOutbound('linkedin', 'pf')"
    >
      <VbIcon :size="vbButtonSizeEnum.lg" :name="VbIconEnum.VbLinkedin" />
    </VbButton>

    <VbButton
      :href="outboundHref('github', 'pf')"
      aria-label="Profil GitHub de Vincent Battez"
      :shape="vbButtonShapeEnum.square"
      :type="vbButtonTypeEnum.soft"
      @click="trackOutbound('github', 'pf')"
    >
      <VbIcon :size="vbButtonSizeEnum.lg" :name="VbIconEnum.VbGithub" />
    </VbButton>
  </div>
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

defineProps<{ compact?: boolean }>();

const { outboundHref, trackOutbound } = useOutbound();
</script>

<style lang="scss" scoped>
.vb-socials {
  @apply flex items-center gap-sm;

  // Rangée identité mobile : la place va au nom, pas aux boutons.
  &--compact {
    gap: 0.375rem;

    :deep(.btn--square) {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    :deep(.vb-icon) {
      font-size: 1.125rem;
    }
  }
}
</style>
