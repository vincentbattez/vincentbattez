<template>
  <Transition name="vb-next-slot" appear>
    <p v-if="label" class="vb-next-slot">
      <span class="vb-next-slot--dot" aria-hidden="true"></span>
      Prochain créneau : <strong>{{ label }}</strong>
    </p>
  </Transition>
</template>

<script lang="ts" setup>
import { useNextSlot } from "~/composables/useNextSlot";

const { start } = useNextSlot();

// Garde l'affichage relatif ("dans 4 h") honnête si l'onglet reste ouvert.
const now = ref(Date.now());
let ticker: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  ticker = setInterval(() => (now.value = Date.now()), 60_000);
});
onBeforeUnmount(() => clearInterval(ticker));

const NBSP = " ";

const label = computed(() => {
  if (!start.value) return null;
  const startMs = new Date(start.value).getTime();
  if (startMs <= now.value) return null;
  const day = parisDay(startMs);
  const today = parisDay(now.value);
  if (day === today) return relative(startMs - now.value);
  if (day === nextDay(today)) return absolute(start.value, "demain");
  return absolute(start.value);
});

function parisDay(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(ms));
}

// Via UTC pour éviter les sauts d'heure d'été.
function nextDay(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function relative(diffMs: number): string {
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 60) return `dans ${minutes}${NBSP}min`;
  // floor : "dans 5 h" tant que l'heure pleine n'est pas atteinte.
  return `dans ${Math.floor(diffMs / 3_600_000)}${NBSP}h`;
}

function absolute(iso: string, dayLabel?: string): string {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Paris",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${dayLabel ?? get("weekday")} ${get("hour")}h${get("minute")}`;
}
</script>

<style lang="scss" scoped>
.vb-next-slot {
  @apply inline-flex items-center gap-sm text-grey-500 mt-sm;
  font-size: 0.8rem;

  strong {
    @apply text-blue-500;
    font-weight: 700;
  }

  &--dot {
    @apply flex-shrink-0 bg-blue-500;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    box-shadow: 0 0 4px 0 #3b82f6;
    animation: vb-next-slot-pulse 2s ease-in-out infinite;
  }
}

@keyframes vb-next-slot-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}

// `both` obligatoire : sans fill backwards, l'élément resterait opaque pendant
// le délai puis sauterait à 0 (flash).
.vb-next-slot-enter-active {
  animation: vb-fade-rise var(--vb-dur-fade) var(--vb-ease-fade) both
    var(--vb-at-next-slot);
}

@media (prefers-reduced-motion: reduce) {
  .vb-next-slot--dot {
    animation: none;
  }
  .vb-next-slot-enter-active {
    animation: none;
  }
}
</style>
