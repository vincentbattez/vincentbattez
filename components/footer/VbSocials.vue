<template>
  <div class="vb-socials">
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

const { outboundHref, trackOutbound } = useOutbound();
</script>

<style lang="scss" scoped>
.vb-socials {
  @apply flex items-center gap-sm;
}
</style>
