<template>
  <section
    class="vb-reco ph-no-capture"
    :class="{ 'vb-reco--open': open }"
    aria-label="Recommandation"
  >
    <header class="vb-reco--head">
      <h2 class="vb-reco--title">Ta recommandation</h2>
      <button
        type="button"
        class="vb-reco--close"
        aria-label="Revenir à la conversation"
        @click="emit('close')"
      >
        ✕
      </button>
    </header>

    <p v-if="pending" class="vb-reco--warn">
      Ruby a réécrit la recommandation, mais tu as modifié la tienne.
      <button type="button" class="vb-reco--link" @click="emit('replace')">
        Remplacer
      </button>
      <button type="button" class="vb-reco--link" @click="emit('keep')">
        Garder la mienne
      </button>
    </p>

    <textarea
      :value="text"
      class="vb-reco--text ph-no-capture"
      aria-label="Texte de la recommandation, modifiable"
      spellcheck="true"
      @input="emit('edit', ($event.target as HTMLTextAreaElement).value)"
    />

    <footer class="vb-reco--actions">
      <div class="vb-reco--main">
        <VbButton :type="vbButtonTypeEnum.primary" @click="emit('copy')">
          {{ copied ? "Copié !" : "Copier la recommandation" }}
        </VbButton>
        <VbButton
          class="vb-reco--linkedin"
          :type="vbButtonTypeEnum.outline"
          :href="outboundHref('recommandation', 'pf')"
          target="_blank"
          rel="noopener"
          @click="trackOutbound('recommandation', 'pf')"
        >
          <VbIcon :size="vbButtonSizeEnum.md" :name="VbIconEnum.VbLinkedin" />
          Coller sur LinkedIn
        </VbButton>
      </div>
      <button type="button" class="vb-reco--secondary" @click="emit('copy-md')">
        {{
          copiedMarkdown ? "Entretien copié !" : "Copier l'entretien (Markdown)"
        }}
      </button>
    </footer>

    <p v-if="copied" class="vb-reco--thanks">
      Merci beaucoup. Le bouton LinkedIn ouvre le formulaire de recommandation
      du profil de Vincent&nbsp;: il ne reste plus qu'à coller.
    </p>
  </section>
</template>

<script setup lang="ts">
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";

defineProps<{
  text: string;
  open: boolean;
  pending: boolean;
  copied: boolean;
  copiedMarkdown: boolean;
}>();

const emit = defineEmits<{
  edit: [value: string];
  copy: [];
  "copy-md": [];
  replace: [];
  keep: [];
  close: [];
}>();

const { outboundHref, trackOutbound } = useOutbound();
</script>

<style lang="scss" scoped>
.vb-reco {
  @apply flex flex-col gap-sm p-md bg-white border border-orange-200 rounded;
  box-shadow: 0 18px 40px -24px theme("colors.orange.750 / 60%");

  &--head {
    @apply flex items-center justify-between;
  }

  &--title {
    @apply font-heading text-h4 text-black;
  }

  // Le retour à la conversation n'a de sens qu'en plein écran mobile.
  &--close {
    @apply text-grey-600 hidden;
  }

  &--warn {
    @apply text-body-sm text-orange-800 bg-orange-100 p-sm rounded;
  }

  &--link {
    @apply underline font-extrabold ms-sm;
  }

  &--text {
    @apply w-full p-sm rounded border border-grey-200 text-body-sm text-black;
    min-height: 14rem;
    resize: vertical;
    line-height: 150%;

    &:focus-visible {
      @apply outline outline-2 outline-blue-500;
    }
  }

  &--actions {
    @apply flex flex-col gap-sm;
  }

  &--main {
    @apply flex flex-wrap gap-sm;
  }

  &--linkedin {
    @apply gap-sm;
  }

  &--secondary {
    @apply text-body-sm text-grey-600 underline text-left;

    &:hover {
      @apply text-black;
    }
  }

  &--thanks {
    @apply text-body-sm text-grey-700;
  }
}

@media (max-width: 767px) {
  .vb-reco {
    position: fixed;
    inset: 0;
    z-index: 20;
    border-radius: 0;
    overflow-y: auto;
    display: none;

    &--open {
      display: flex;
    }

    &--close {
      @apply block;
    }

    &--text {
      flex: 1;
    }
  }
}
</style>
