<template>
  <span
    class="vb-tt"
    :class="[`vb-tt--${align}`, { 'vb-tt--open': open }]"
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

    <span :id="id" role="tooltip" class="vb-tt--bubble">
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
        <span v-for="kw in keywords" :key="kw" class="vb-tt--tag">{{ kw }}</span>
      </span>
    </span>
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
    // Ancrage horizontal : évite le clipping aux bords de la carte.
    align?: "start" | "center" | "end";
  }>(),
  { align: "center", term: undefined, keywords: undefined },
);

// Normalise en paragraphes (un <span> block par entrée).
const paragraphs = computed(() =>
  Array.isArray(props.content) ? props.content : [props.content],
);

// Ouverture pilotée en JS : `open = survol/focus OU épinglé`. Le clic sur le mot
// épingle la fiche (affichage permanent, indépendant du hover) ; la croix, Échap
// ou la perte de focus la referment. Deux états séparés car sinon le mouseleave
// refermerait aussitôt une fiche ouverte au clic.
const hovered = ref(false);
const pinned = ref(false);
const open = computed(() => hovered.value || pinned.value);

const triggerEl = ref<HTMLButtonElement | null>(null);

// Le refocus de `dismiss` redéclenche un focusin : ce drapeau l'ignore une fois
// pour ne pas rouvrir la fiche qu'on vient de fermer.
let suppressFocusin = false;
function onFocusin() {
  if (suppressFocusin) {
    suppressFocusin = false;
    return;
  }
  hovered.value = true;
}

function dismiss() {
  hovered.value = false;
  pinned.value = false;
  suppressFocusin = true;
  triggerEl.value?.focus();
}
function onFocusout(e: FocusEvent) {
  const root = e.currentTarget as HTMLElement;
  if (!root.contains(e.relatedTarget as Node | null)) {
    hovered.value = false;
    pinned.value = false;
  }
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

  // Fiche de définition. Masquée en opacity/visibility (jamais display:none) →
  // aria-describedby reste fiable pour les lecteurs d'écran.
  &--bubble {
    position: absolute;
    bottom: calc(100% + 12px);
    z-index: 40;
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

  // Révélation pilotée par l'état `open` (hover/focus l'activent en JS).
  &--open .vb-tt--bubble {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  // --- Ancrage : center (défaut), start (bord gauche), end (bord droit) ---
  &--center {
    .vb-tt--bubble {
      left: 50%;
      transform: translateX(-50%) translateY(6px);
      &::after {
        left: 50%;
        margin-left: -6px;
      }
    }
    &.vb-tt--open .vb-tt--bubble {
      transform: translateX(-50%) translateY(0);
    }
  }

  &--start {
    .vb-tt--bubble {
      left: 0;
      transform: translateY(6px);
      &::after {
        left: 1.25rem;
      }
    }
    &.vb-tt--open .vb-tt--bubble {
      transform: translateY(0);
    }
  }

  &--end {
    .vb-tt--bubble {
      right: 0;
      transform: translateY(6px);
      &::after {
        right: 1.25rem;
      }
    }
    &.vb-tt--open .vb-tt--bubble {
      transform: translateY(0);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .vb-tt--bubble {
    transition-property: opacity, visibility;
  }
  .vb-tt--center .vb-tt--bubble {
    transform: translateX(-50%);
  }
  .vb-tt--start .vb-tt--bubble,
  .vb-tt--end .vb-tt--bubble {
    transform: none;
  }
  .vb-tt--trigger::after {
    transition: none;
  }
}

// Mobile : la bulle ne tient plus ancrée au mot (débordait hors de la frame
// rognée). On la détache (trigger `static` → l'ancêtre positionné devient
// `.vb-frame--content`) et on la centre dans la carte, largeur bornée au
// viewport. Le caret perd son sens, on le masque.
@media (max-width: 820px) {
  .vb-tt {
    position: static;
  }
  .vb-tt--center,
  .vb-tt--start,
  .vb-tt--end {
    .vb-tt--bubble {
      position: absolute;
      left: 50%;
      right: auto;
      top: 50%;
      bottom: auto;
      width: min(20rem, calc(100vw - 3rem));
      max-width: none;
      transform: translate(-50%, -50%);

      &::after {
        display: none;
      }
    }
    &.vb-tt--open .vb-tt--bubble {
      transform: translate(-50%, -50%);
    }
  }
}
</style>
