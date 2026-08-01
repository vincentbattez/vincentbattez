<template>
  <nav class="vb-navbar">
    <div class="vb-navbar--status">
      <NuxtLink
        v-if="isAvailableForFreelance"
        class="vb-navbar--badge"
        to="/go/entretien?s=pf"
      >
        <span class="vb-navbar--indicator"></span>
        <span class="vb-navbar--badge-text"
          >Disponible pour {{ seo.employment.seeking }}</span
        >
      </NuxtLink>
      <span v-else class="vb-navbar--badge is-unavailable">
        <span class="vb-navbar--indicator"></span>
        <span class="vb-navbar--badge-text">Indisponible pour le moment</span>
      </span>
      <span class="vb-navbar--status-date"
        >Statut mise à jour : {{ formattedStatusUpdatedAt }}</span
      >
    </div>

    <VbSocials class="vb-navbar--socials" />
  </nav>
</template>

<script lang="ts" setup>
import VbSocials from "~/components/footer/VbSocials.vue";
import { isAvailableForFreelance, statusUpdatedAt } from "~/config/status";
import { seo } from "~/config/seo";

const formattedStatusUpdatedAt = computed(() => {
  const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
  const diffMs = new Date(statusUpdatedAt).getTime() - Date.now();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (Math.abs(diffDays) >= 30) {
    const diffMonths = Math.round(diffDays / 30);
    return rtf.format(diffMonths, "month");
  }
  if (Math.abs(diffDays) >= 7) {
    return rtf.format(Math.round(diffDays / 7), "week");
  }
  return rtf.format(diffDays, "day");
});
</script>

<style lang="scss" scoped>
.vb-navbar {
  @apply flex items-center justify-between gap-md;

  &--status {
    @apply flex flex-wrap items-baseline gap-x-sm flex-col;
    align-items: flex-end;
  }

  &--status-date {
    @apply text-grey-500 relative;
    top: -4px;
    font-size: 0.7rem;
    font-style: italic;
  }

  &--badge {
    @apply inline-flex items-center gap-sm;
    border-radius: 999px;

    &:focus-visible {
      outline: 2px solid #3b82f6;
    }

    &.is-unavailable {
      cursor: default;
      opacity: 0.55;

      .vb-navbar--badge-text {
        @apply text-grey-600;
      }

      .vb-navbar--indicator {
        @apply bg-grey-400;
        box-shadow: none;
        animation: none;
      }
    }
  }

  &--badge-text {
    @apply text-body-sm sm:text-body-md text-blue-500;
    font-weight: 800;
  }

  &--indicator {
    @apply flex-shrink-0 bg-blue-500;
    width: 11px;
    height: 11px;
    border-radius: 11px;
    box-shadow: 0 0 4px 0 #3b82f6;
    animation: live-pulse 2s ease-in-out infinite;
  }
}

@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 4px 0 #3b82f6;
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
    box-shadow: 0 0 8px 2px #3b82f6;
  }
}

@media (max-width: 820px) {
  .vb-navbar {
    justify-content: center;
  }

  .vb-navbar--status {
    align-items: center;
  }

  .vb-navbar--badge-text {
    @apply text-body-sm;
  }

  // En mobile, les socials passent sous la photo (rendus dans le hero).
  .vb-navbar--socials {
    display: none;
  }
}
</style>
