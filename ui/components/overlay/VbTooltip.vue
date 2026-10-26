<template>
  <span
    ref="rootEl"
    class="vb-tt"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <button
      ref="triggerEl"
      type="button"
      class="vb-tt--trigger"
      :aria-describedby="id"
      @click="pinned = !pinned"
    >
      <slot />
    </button>

    <!-- Téléportée pour échapper au clipping de `.vb-frame` (overflow:hidden +
         transform). Inline avant le mount → pas de mismatch d'hydratation. -->
    <Teleport to="body" :disabled="!mounted">
      <span
        :id="id"
        ref="bubbleEl"
        role="tooltip"
        class="vb-tt--bubble"
        :class="[`vb-tt--bubble--${align}`, { 'vb-tt--bubble--open': open }]"
        :style="bubbleStyle"
        :tabindex="isSheet ? -1 : undefined"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
        @focusin="onFocusin"
        @focusout="onFocusout"
      >
        <button
          type="button"
          class="vb-tt--close"
          aria-label="Fermer"
          @click="dismiss"
        >
          <span aria-hidden="true">×</span>
        </button>
        <!-- Seul le corps défile en bottom sheet : le bouton fermer reste visible. -->
        <span class="vb-tt--body">
          <span v-if="term" class="vb-tt--term">{{ term }}</span>
          <span v-for="(para, i) in paragraphs" :key="i" class="vb-tt--def">{{
            para
          }}</span>
          <span v-if="keywords?.length" class="vb-tt--tags">
            <span v-for="kw in keywords" :key="kw" class="vb-tt--tag">{{
              kw
            }}</span>
          </span>
        </span>
      </span>
    </Teleport>
  </span>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    content: string | string[];
    term?: string;
    keywords?: string[];
    align?: "start" | "center" | "end";
  }>(),
  { align: "center", term: undefined, keywords: undefined },
);

const paragraphs = computed(() =>
  Array.isArray(props.content) ? props.content : [props.content],
);

// États séparés : sinon le mouseleave refermerait une fiche ouverte au clic.
const hovered = ref(false);
const focused = ref(false);
const pinned = ref(false);
const open = computed(() => hovered.value || focused.value || pinned.value);

const rootEl = ref<HTMLElement | null>(null);
const bubbleEl = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLButtonElement | null>(null);
const mounted = ref(false);
// Tactile ou écran étroit : bulle ancrée en bas de l'écran (bottom sheet),
// positionnée en CSS. Même requête que le bloc `@media` du style. Le
// `tabindex=-1` qui va avec garde le focus quand on tape dans la fiche pour la
// faire défiler : sans lui, le focusout du mot la refermerait.
const isSheet = ref(false);

// En sheet, le survol est ignoré : le tap émule un mouseenter qui collerait, et
// à la souris (fenêtre étroite) la fiche se fermerait en rejoignant le bas.
function onHover(value: boolean) {
  if (!isSheet.value) hovered.value = value;
}

const bubbleStyle = ref<Record<string, string>>({});
function reposition() {
  const t = triggerEl.value;
  if (!t || isSheet.value) {
    bubbleStyle.value = {};
    return;
  }
  const r = t.getBoundingClientRect();
  const style: Record<string, string> = { top: `${r.top - 12}px` };
  if (props.align === "start") style.left = `${r.left}px`;
  else if (props.align === "end") style.left = `${r.right}px`;
  else style.left = `${r.left + r.width / 2}px`;
  bubbleStyle.value = style;
}

// `flush: 'pre'` : recalcul avant la classe `--open`, pas de flash de position.
watch(open, (v) => {
  if (v) reposition();
});

function close() {
  hovered.value = false;
  focused.value = false;
  pinned.value = false;
}

// Sur `pointerdown` pour réagir avant tout changement de focus.
function onDocPointerDown(e: PointerEvent) {
  if (!open.value) return;
  const target = e.target as Node | null;
  if (rootEl.value?.contains(target) || bubbleEl.value?.contains(target))
    return;
  close();
}

// Au niveau document : iOS ne focalise pas un bouton tapé, et une fiche ouverte
// au survol doit pouvoir se fermer sans y déplacer le focus.
function onDocKeydown(e: KeyboardEvent) {
  if (e.key !== "Escape" || !open.value) return;
  const active = document.activeElement;
  if (rootEl.value?.contains(active) || bubbleEl.value?.contains(active))
    dismiss();
  else close();
}

onMounted(() => {
  mounted.value = true;
  const mq = matchMedia("(pointer: coarse), (max-width: 820px)");
  isSheet.value = mq.matches;
  const onReflow = () => open.value && reposition();
  const onMq = () => {
    isSheet.value = mq.matches;
    hovered.value = false;
    onReflow();
  };
  mq.addEventListener("change", onMq);
  window.addEventListener("resize", onReflow, { passive: true });
  window.addEventListener("scroll", onReflow, { passive: true, capture: true });
  document.addEventListener("pointerdown", onDocPointerDown, true);
  document.addEventListener("keydown", onDocKeydown);
  onBeforeUnmount(() => {
    mq.removeEventListener("change", onMq);
    window.removeEventListener("resize", onReflow);
    window.removeEventListener("scroll", onReflow, { capture: true });
    document.removeEventListener("pointerdown", onDocPointerDown, true);
    document.removeEventListener("keydown", onDocKeydown);
  });
});

// Le refocus de `dismiss` redéclenche un focusin : ignoré une fois pour ne pas
// rouvrir la fiche qu'on vient de fermer.
let suppressFocusin = false;
function onFocusin() {
  if (suppressFocusin) {
    suppressFocusin = false;
    return;
  }
  focused.value = true;
}

// Mot et bulle sont séparés dans le DOM : ouverte tant que le focus est dans l'un.
function onFocusout(e: FocusEvent) {
  const to = e.relatedTarget as Node | null;
  if (rootEl.value?.contains(to) || bubbleEl.value?.contains(to)) return;
  focused.value = false;
  pinned.value = false;
}

function dismiss() {
  close();
  // Déjà focalisé → aucun focusin : le drapeau resterait armé et avalerait le
  // prochain focus clavier.
  suppressFocusin = document.activeElement !== triggerEl.value;
  triggerEl.value?.focus();
}

const id = useId();
</script>

<style lang="scss" scoped>
.vb-tt {
  position: relative;
  display: inline-block;

  &--trigger {
    font: inherit;
    font-weight: 800;
    color: inherit;
    cursor: help;
    padding: 0 0.12em;
    border-radius: 5px;
    border-bottom: 2px dashed theme("colors.primary");
    transition: all 200ms ease;

    &::after {
      content: "+";
      font-size: 0.62em;
      font-weight: 800;
      vertical-align: super;
      margin-left: 0.06em;
      color: theme("colors.primary");
      display: inline-block;
      transition: transform 200ms ease;
    }

    &:hover,
    &:focus-visible {
      color: theme("colors.black");
      background: theme("colors.orange.100");
      border-bottom-style: solid;
      outline: 0;
    }

    &:hover::after,
    &:focus-visible::after {
      transform: rotate(90deg);
    }
  }

  // Masquée en opacity/visibility (jamais display:none) : aria-describedby
  // reste fiable pour les lecteurs d'écran.
  &--bubble {
    position: fixed;
    z-index: 1000;
    width: max-content;
    max-width: min(22rem, 78vw);
    padding: 0.75rem 0.9rem;
    border-radius: 14px;
    background:
      radial-gradient(
        72% 34px at 50% 0%,
        rgba(240, 145, 15, 0.42) 0%,
        rgba(240, 145, 15, 0.11) 46%,
        transparent 72%
      ),
      linear-gradient(152deg, #2c1c08 0%, #241605 100%);
    box-shadow:
      0 22px 44px -20px rgba(36, 22, 5, 0.75),
      0 0 0 1px rgba(240, 145, 15, 0.18),
      inset 0 1px 0 0 rgba(240, 145, 15, 0.28);
    text-align: left;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 190ms ease,
      transform 190ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 190ms;

    &::before {
      content: "";
      position: absolute;
      top: -7px;
      left: 50%;
      width: 62%;
      height: 24px;
      transform: translateX(-50%);
      background: radial-gradient(
        58% 100% at 50% 0%,
        rgba(240, 145, 15, 0.6) 0%,
        rgba(240, 145, 15, 0) 74%
      );
      filter: blur(7px);
      pointer-events: none;
      animation: vb-tt-glow 3.6s ease-in-out infinite;
    }

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      width: 12px;
      height: 12px;
      margin-top: -6px;
      background: #241605;
      transform: rotate(45deg);
    }

    &--center {
      transform: translate(-50%, calc(-100% + 6px));
      &::after {
        left: 50%;
        margin-left: -6px;
      }
    }
    &--start {
      transform: translate(0, calc(-100% + 6px));
      &::after {
        left: 1.25rem;
      }
    }
    &--end {
      transform: translate(-100%, calc(-100% + 6px));
      &::after {
        right: 1.25rem;
      }
    }

    &--open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
    &--center.vb-tt--bubble--open {
      transform: translate(-50%, -100%);
    }
    &--start.vb-tt--bubble--open {
      transform: translate(0, -100%);
    }
    &--end.vb-tt--bubble--open {
      transform: translate(-100%, -100%);
    }
  }

  &--body {
    display: block;
  }

  &--close {
    position: absolute;
    top: 6px;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: rgba(240, 145, 15, 0.12);
    color: theme("colors.orange.300");
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    transition:
      background 160ms ease,
      color 160ms ease;

    &:hover,
    &:focus-visible {
      background: rgba(240, 145, 15, 0.22);
      color: theme("colors.orange.400");
      outline: 0;
    }
  }

  &--term {
    display: block;
    margin-bottom: 0.15rem;
    padding-right: 1.25rem;
    font-family: theme("fontFamily.heading");
    font-size: theme("fontSize.body-md");
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: theme("colors.orange.400");

    &::before {
      content: "";
      display: inline-block;
      width: 0.42em;
      height: 0.42em;
      margin-right: 0.55em;
      vertical-align: 0.06em;
      background: theme("colors.primary");
      transform: rotate(45deg);
    }
  }

  &--def {
    display: block;
    font-family: theme("fontFamily.body");
    font-size: theme("fontSize.body-md");
    line-height: 150%;
    color: theme("colors.page");

    & + & {
      margin-top: 0.5rem;
    }
  }

  &--tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.7rem;
    padding-top: 0.6rem;
    border-top: 1px solid rgba(240, 145, 15, 0.18);
  }

  &--tag {
    font-family: theme("fontFamily.body");
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    line-height: 1.2;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    color: theme("colors.orange.300");
    background: rgba(240, 145, 15, 0.1);
    border: 1px solid rgba(240, 145, 15, 0.22);
    white-space: nowrap;
  }
}

@keyframes vb-tt-glow {
  0%,
  100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vb-tt--bubble {
    transition-property: opacity, visibility;
  }
  .vb-tt--bubble::before {
    animation: none;
  }
  .vb-tt--bubble--center {
    transform: translate(-50%, -100%);
  }
  .vb-tt--bubble--start {
    transform: translate(0, -100%);
  }
  .vb-tt--bubble--end {
    transform: translate(-100%, -100%);
  }
}

// Mobile : un souligné pointillé suffit à signaler le terme. Bordure 2px, gras
// et « + » sur chaque terme faisaient trop de bruit en colonne étroite.
@media (max-width: 820px) {
  .vb-tt {
    display: inline;
  }

  .vb-tt--trigger {
    font-weight: 700;
    padding: 0;
    border-bottom: 0;
    text-decoration: underline dotted theme("colors.primary");
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;

    &::after {
      content: none;
    }

    &:hover,
    &:focus-visible {
      text-decoration-style: solid;
    }
  }
}

// Bottom sheet : ancrée en bas, pleine largeur moins la gouttière. Une bulle
// au-dessus du mot débordait du haut de l'écran sur les fiches longues.
@media (pointer: coarse), (max-width: 820px) {
  .vb-tt--bubble {
    inset: auto 0.5rem calc(0.5rem + env(safe-area-inset-bottom)) 0.5rem;
    width: auto;
    max-width: none;
    max-height: 70dvh;
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 20px;
    outline: 0;

    // Le caret ne pointe plus aucun mot.
    &::after {
      display: none;
    }
  }
  .vb-tt--bubble--center,
  .vb-tt--bubble--start,
  .vb-tt--bubble--end {
    transform: translateY(16px);
  }
  .vb-tt--bubble--center.vb-tt--bubble--open,
  .vb-tt--bubble--start.vb-tt--bubble--open,
  .vb-tt--bubble--end.vb-tt--bubble--open {
    transform: none;
  }

  .vb-tt--body {
    min-height: 0;
    overflow-y: auto;
    // Le défilement de la fiche n'entraîne pas la page derrière.
    overscroll-behavior: contain;
    padding: 1.1rem 1.1rem 1.25rem;
  }

  // Cible tactile de 40px (le × de 22px se rate au doigt).
  .vb-tt--close {
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1;
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }

  .vb-tt--term {
    padding-right: 2.5rem;
    line-height: 40px;
    margin-top: -0.6rem;
  }
}

@media (pointer: coarse) and (prefers-reduced-motion: reduce),
  (max-width: 820px) and (prefers-reduced-motion: reduce) {
  .vb-tt--bubble--center,
  .vb-tt--bubble--start,
  .vb-tt--bubble--end {
    transform: none;
  }
}
</style>
