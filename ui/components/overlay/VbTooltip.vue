<template>
  <span
    ref="rootEl"
    class="vb-tt"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="onFocusin"
    @focusout="onFocusout"
    @keydown.escape="dismiss"
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

    <!-- Bulle sortie du flux (Teleport → body) pour échapper au clipping de
         `.vb-frame` (overflow:hidden + transform). Rendue inline tant que le
         composant n'est pas monté → pas de mismatch d'hydratation SSR. -->
    <Teleport to="body" :disabled="!mounted">
      <span
        :id="id"
        ref="bubbleEl"
        role="tooltip"
        class="vb-tt--bubble"
        :class="[`vb-tt--bubble--${align}`, { 'vb-tt--bubble--open': open }]"
        :style="bubbleStyle"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
        @focusin="onFocusin"
        @focusout="onFocusout"
        @keydown.escape="dismiss"
      >
        <button
          type="button"
          class="vb-tt--close"
          aria-label="Fermer"
          @click="dismiss"
        >
          <span aria-hidden="true">×</span>
        </button>
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
    </Teleport>
  </span>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    // Définition affichée dans la fiche : string, ou tableau = un paragraphe par entrée.
    content: string | string[];
    // Terme technique mis en avant (capitales), ex. "ARCHITECTURE".
    term?: string;
    // Preuves d'autorité en pied de fiche (chips), ex. failure-modes maîtrisés.
    keywords?: string[];
    // Ancrage horizontal de la bulle par rapport au mot (évite le débordement viewport).
    align?: "start" | "center" | "end";
  }>(),
  { align: "center", term: undefined, keywords: undefined },
);

// Normalise en paragraphes (un <span> block par entrée).
const paragraphs = computed(() =>
  Array.isArray(props.content) ? props.content : [props.content],
);

// Ouverture pilotée en JS : `open = survol OU focus OU épinglé`. Le clic sur le
// mot épingle la fiche (affichage permanent) ; la croix, Échap ou la perte de
// focus la referment. États séparés car sinon le mouseleave refermerait aussitôt
// une fiche ouverte au clic.
const hovered = ref(false);
const focused = ref(false);
const pinned = ref(false);
const open = computed(() => hovered.value || focused.value || pinned.value);

const rootEl = ref<HTMLElement | null>(null);
const bubbleEl = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLButtonElement | null>(null);
const mounted = ref(false);
const isMobile = ref(false);

// La bulle vit sous <body> : elle n'est plus descendante de `.vb-frame`. On
// calcule top/left depuis le rect du mot ; la lévitation verticale (-100%) et
// l'ancrage horizontal (translateX selon `align`) sont en CSS pour garder la
// transition d'entrée.
// - Desktop : `fixed` (la page ne scrolle pas), coords viewport directes.
// - Mobile : `absolute` (suit le scroll, jamais `fixed`), coords + scroll.
const bubbleStyle = ref<Record<string, string>>({});
function reposition() {
  const t = triggerEl.value;
  if (!t) return;
  const r = t.getBoundingClientRect();
  const mobile = isMobile.value;
  const sx = mobile ? window.scrollX : 0;
  const sy = mobile ? window.scrollY : 0;
  const style: Record<string, string> = {
    position: mobile ? "absolute" : "fixed",
    top: `${r.top + sy - 12}px`,
  };
  if (mobile) {
    // Ancrée au-dessus du mot (top) mais centrée dans le viewport → jamais de
    // débordement horizontal. Le caret est masqué en CSS.
    style.left = `${sx + window.innerWidth / 2}px`;
  } else if (props.align === "start") style.left = `${r.left}px`;
  else if (props.align === "end") style.left = `${r.right}px`;
  else style.left = `${r.left + r.width / 2}px`;
  bubbleStyle.value = style;
}

// `flush: 'pre'` (défaut) → recalcul avant l'application de la classe `--open`,
// donc pas de flash à l'ancienne position.
watch(open, (v) => {
  if (v) reposition();
});

// Clic (ou tap) hors du mot ET de la bulle → fermeture. Sur `pointerdown` pour
// réagir avant tout changement de focus.
function onDocPointerDown(e: PointerEvent) {
  if (!open.value) return;
  const target = e.target as Node | null;
  if (rootEl.value?.contains(target) || bubbleEl.value?.contains(target))
    return;
  hovered.value = false;
  focused.value = false;
  pinned.value = false;
}

onMounted(() => {
  mounted.value = true;
  const mq = matchMedia("(max-width: 820px)");
  isMobile.value = mq.matches;
  const onReflow = () => open.value && reposition();
  const onMq = () => {
    isMobile.value = mq.matches;
    onReflow();
  };
  mq.addEventListener("change", onMq);
  window.addEventListener("resize", onReflow, { passive: true });
  window.addEventListener("scroll", onReflow, { passive: true, capture: true });
  document.addEventListener("pointerdown", onDocPointerDown, true);
  onBeforeUnmount(() => {
    mq.removeEventListener("change", onMq);
    window.removeEventListener("resize", onReflow);
    window.removeEventListener("scroll", onReflow, { capture: true });
    document.removeEventListener("pointerdown", onDocPointerDown, true);
  });
});

// Le refocus de `dismiss` redéclenche un focusin : ce drapeau l'ignore une fois
// pour ne pas rouvrir la fiche qu'on vient de fermer.
let suppressFocusin = false;
function onFocusin() {
  if (suppressFocusin) {
    suppressFocusin = false;
    return;
  }
  focused.value = true;
}

// Le mot (`rootEl`) et la bulle (`bubbleEl`) sont désormais séparés dans le DOM :
// on garde la fiche ouverte tant que le focus reste dans l'un OU l'autre.
function onFocusout(e: FocusEvent) {
  const to = e.relatedTarget as Node | null;
  if (rootEl.value?.contains(to) || bubbleEl.value?.contains(to)) return;
  focused.value = false;
  pinned.value = false;
}

function dismiss() {
  hovered.value = false;
  focused.value = false;
  pinned.value = false;
  suppressFocusin = true;
  triggerEl.value?.focus();
}

// Lie le déclencheur à la fiche pour les lecteurs d'écran (aria-describedby).
const id = useId();
</script>

<style lang="scss" scoped>
.vb-tt {
  position: relative;
  display: inline-block;

  &--trigger {
    // Mot annoté : souligné pointillé orange + marqueur exposant.
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

  // Fiche de définition, téléportée sous <body> → `position: fixed`, top/left
  // calculés en JS. Masquée en opacity/visibility (jamais display:none) →
  // aria-describedby reste fiable pour les lecteurs d'écran.
  &--bubble {
    position: fixed;
    z-index: 1000;
    width: max-content;
    max-width: min(22rem, 78vw);
    padding: 0.75rem 0.9rem;
    border-radius: 14px;
    background: linear-gradient(152deg, #2c1c08 0%, #241605 100%);
    box-shadow:
      0 22px 44px -20px rgba(36, 22, 5, 0.75),
      0 0 0 1px rgba(240, 145, 15, 0.18);
    text-align: left;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 190ms ease,
      transform 190ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 190ms;

    // Caret : petit losange qui prolonge la fiche vers le mot.
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

    // --- Ancrage horizontal + lévitation au-dessus du mot ---
    // La bulle est ancrée par son bord bas 12px au-dessus du mot (top JS) puis
    // remontée de -100%. L'entrée part 6px plus bas et glisse vers 0.
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

    // Révélation (hover/focus/épinglage l'activent en JS).
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

  // Croix de fermeture (coin haut-droit). Surtout utile au tap mobile.
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
    font-size: theme("fontSize.body-sm");
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: theme("colors.orange.400");
  }

  &--def {
    display: block;
    font-family: theme("fontFamily.body");
    font-size: theme("fontSize.body-sm");
    line-height: 150%;
    color: theme("colors.page");

    & + & {
      margin-top: 0.5rem;
    }
  }

  // Footer « preuves d'autorité » : failure-modes maîtrisés en pastilles.
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

@media (prefers-reduced-motion: reduce) {
  .vb-tt--bubble {
    transition-property: opacity, visibility;
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

// Mobile : bulle ancrée juste au-dessus du mot (top `absolute` posé en JS,
// jamais `fixed`) pour laisser voir la phrase, mais centrée dans le viewport
// (left JS = centre écran + translateX -50%) → aucun débordement horizontal.
// Le caret ne pointe plus le mot → masqué.
@media (max-width: 820px) {
  .vb-tt--bubble {
    max-width: calc(100vw - 1.5rem);

    &::after {
      display: none;
    }
  }
  .vb-tt--bubble--center,
  .vb-tt--bubble--start,
  .vb-tt--bubble--end {
    transform: translate(-50%, calc(-100% + 6px));
  }
  .vb-tt--bubble--center.vb-tt--bubble--open,
  .vb-tt--bubble--start.vb-tt--bubble--open,
  .vb-tt--bubble--end.vb-tt--bubble--open {
    transform: translate(-50%, -100%);
  }
}
</style>
