<script setup lang="ts">
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbNavbar from "~/components/footer/VbNavbar.vue";

useSeoMeta({
  title: "Vincent Battez - Développeur Full-Stack Senior Freelance à Lille",
  description:
    "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture des applications web robustes : Node.js, React, Vue.js, TypeScript.",
  ogTitle: "Vincent Battez - Développeur Full-Stack Senior Freelance à Lille",
  ogDescription:
    "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture des applications web robustes : Node.js, React, Vue.js, TypeScript.",
  twitterTitle:
    "Vincent Battez - Développeur Full-Stack Senior Freelance à Lille",
  twitterDescription:
    "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture des applications web robustes : Node.js, React, Vue.js, TypeScript.",
});

useHead({
  titleTemplate: null,
  link: [
    // Portrait = élément LCP : préchargé pour un rendu plus rapide.
    {
      rel: "preload",
      as: "image",
      href: "/images/vincentbattez.webp",
      fetchpriority: "high",
    },
  ],
});
</script>

<template>
  <div class="vb-frame">
    <div class="vb-frame--decor" aria-hidden="true"></div>

    <div class="vb-frame--content">
      <VbNavbar class="vb-frame--nav" />

      <div class="vb-hero">
        <div class="vb-hero--text">
          <p class="vb-hero--kicker">
            Développeur Full-Stack Freelance à Lille
          </p>
          <h1 class="vb-hero--title">
            <span class="vb-word"
              ><span class="vb-word--i">Développeur</span></span
            >
            <span class="vb-word"
              ><span class="vb-word--i">Full-Stack</span></span
            >
            <span class="vb-word"
              ><span class="vb-word--i vb-hero--accent">Senior</span></span
            >
          </h1>
          <p class="vb-hero--lead">
            Disponible dès maintenant pour <strong>créer</strong> ou
            <strong>architecturer</strong> des applications web robustes.
          </p>

          <div class="vb-hero--actions">
            <VbButton
              href="/go/entretien?s=pf"
              :type="vbButtonTypeEnum.primary"
            >
              <VbIcon
                class="mr-sm"
                :size="vbButtonSizeEnum.lg"
                :name="VbIconEnum.VbCalendar"
              />
              Prendre rendez-vous
            </VbButton>

            <VbButton href="/go/cv?s=pf" :type="vbButtonTypeEnum.outline">
              Voir mon CV
            </VbButton>
          </div>
        </div>

        <div class="vb-hero--portrait">
          <div class="vb-medallion">
            <img
              src="/images/vincentbattez.webp"
              width="640"
              height="640"
              fetchpriority="high"
              alt="Portrait de Vincent Battez, développeur Full-Stack Senior freelance"
            />
          </div>
        </div>
      </div>

      <VbFooter class="vb-frame--marquee" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vb-frame {
  // Gouttière garantie autour de la carte : le fond de page reste visible sur
  // tous les côtés, même quand le viewport est plus petit que la frame — la
  // carte flotte toujours (coins arrondis + ombre jamais collés au bord).
  --vb-gap: clamp(1rem, 2.5vw, 2rem);
  position: relative;
  margin: auto;
  width: min(100% - var(--vb-gap) * 2, 1180px);
  height: min(100vh - var(--vb-gap) * 2, 900px);
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 40px 80px -30px rgb(225 159 80 / 55%);
  // Dégradé lissé (2 stops) : évite le palier plat #fff→#fff qui créait une
  // bande verticale perçue (Mach band) au milieu de la carte.
  background: linear-gradient(115deg, #ffffff 0%, #fdf3e2 100%);
  display: flex;
  flex-direction: column;

  &--decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    // Chute d'opacité progressive : pas de bord/anneau visible en atteignant transparent.
    &::before {
      content: "";
      position: absolute;
      top: -160px;
      right: -140px;
      width: 620px;
      height: 620px;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(246, 186, 87, 0.34) 0%,
        rgba(246, 186, 87, 0.16) 34%,
        rgba(240, 145, 15, 0.05) 56%,
        transparent 78%
      );
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 360px;
      height: 320px;
      background: repeating-linear-gradient(
        45deg,
        rgba(240, 145, 15, 0.16) 0 5px,
        transparent 5px 12px
      );
      clip-path: polygon(0 100%, 0 0, 100% 100%);
    }
  }

  &--content {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  &--nav {
    @apply px-xl pt-lg;
  }

  &--marquee {
    margin-top: auto;
  }
}

.vb-hero {
  @apply px-xl;
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  gap: var(--vb-hero-gap, 3rem);

  &--kicker {
    @apply font-body text-body-sm text-grey-600 uppercase mb-md;
    letter-spacing: 0.18em;
    font-weight: 700;
  }

  &--title {
    @apply font-heading text-black mb-md;
    font-weight: 700;
    font-size: clamp(38px, 5vw, 62px);
    line-height: 1.05;
  }

  &--accent {
    @apply text-primary;
    position: relative;
  }

  // Typo cinétique : chaque mot glisse depuis un masque (overflow caché).
  // padding/margin compensés pour ne pas rogner les jambages (« pp »).
  .vb-word {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
    // Vue condense le whitespace entre les masques : espacement porté en CSS.
    margin-right: 0.22em;

    &:last-child {
      margin-right: 0;
    }

    &--i {
      display: inline-block;
    }
  }

  &--lead {
    @apply font-body text-grey-700;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.5;
    max-width: 29rem;

    strong {
      @apply text-black;
      font-weight: 800;
    }
  }

  &--actions {
    @apply flex gap-md mt-lg;
  }

  &--portrait {
    display: flex;
    justify-content: center;
  }
}

.vb-medallion {
  width: min(310px, 70vw);
  aspect-ratio: 1;
  padding: 10px;
  border-radius: 50%;
  background: linear-gradient(160deg, #fde4a6, #f6ba57);
  box-shadow: 0 24px 48px -18px rgba(240, 145, 15, 0.55);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
}

// ─── Timeline d'entrée (colocée avec le markup qu'elle anime) ────────────
// Keyframes + tokens de rythme (--vb-*) définis dans ui/styles/base/_motion.scss.
// NE PAS déplacer cette timeline en global : Vue réécrit les noms de keyframes
// des blocs scoped, la réf resterait alors désalignée du nom global.
//
// Orchestration CSS-only (pas de flash d'hydratation, SSG-safe). Tout l'état
// caché est gated derrière `no-preference` : la règle reduced-motion globale ne
// neutralise PAS `animation-delay`, donc masquer par défaut laisserait le contenu
// invisible pendant le stagger. Ici, au repos = état final visible.
@media (prefers-reduced-motion: no-preference) {
  .vb-frame {
    opacity: 0;
    animation: vb-frame-in var(--vb-dur-frame) var(--vb-ease-fade) forwards
      var(--vb-at-frame);
  }

  .vb-frame--nav {
    opacity: 0;
    animation: vb-fade-drop var(--vb-dur-fade) var(--vb-ease-fade) forwards
      var(--vb-at-nav);
  }

  .vb-hero--kicker {
    opacity: 0;
    animation: vb-fade-rise var(--vb-dur-fade) var(--vb-ease-fade) forwards
      var(--vb-at-kicker);
  }

  .vb-hero .vb-word--i {
    transform: translateY(115%);
    animation: vb-word-rise var(--vb-dur-word) var(--vb-ease-reveal) forwards;
  }
  .vb-word:nth-child(1) .vb-word--i {
    animation-delay: var(--vb-at-word-1);
  }
  .vb-word:nth-child(2) .vb-word--i {
    animation-delay: var(--vb-at-word-2);
  }
  .vb-word:nth-child(3) .vb-word--i {
    animation-delay: var(--vb-at-word-3);
  }

  // L'accent cumule la révélation ET le tracé du soulignement (2 animations).
  // Sélecteur renforcé (0,3,0) pour battre la règle générale `.vb-word--i`.
  .vb-hero .vb-word--i.vb-hero--accent {
    background-image: linear-gradient(currentColor, currentColor);
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 0% 3px;
    padding-bottom: 2px;
    animation:
      vb-word-rise var(--vb-dur-word) var(--vb-ease-reveal) forwards
        var(--vb-at-word-3),
      vb-accent-underline var(--vb-dur-underline) var(--vb-ease-fade) forwards
        var(--vb-at-underline);
  }

  .vb-hero--lead {
    opacity: 0;
    animation: vb-fade-rise var(--vb-dur-fade) var(--vb-ease-fade) forwards
      var(--vb-at-lead);
  }

  .vb-hero--actions {
    opacity: 0;
    animation: vb-fade-rise var(--vb-dur-fade) var(--vb-ease-fade) forwards
      var(--vb-at-actions);
  }

  .vb-medallion {
    transform: scale(0.9);
    animation: vb-medallion-in var(--vb-dur-medallion) var(--vb-ease-reveal)
      forwards var(--vb-at-medallion);
  }

  // Flottement porté par le wrapper (pas le médaillon) → aucun conflit de
  // transform avec la révélation, et aucun opacity sur un ancêtre du portrait.
  .vb-hero--portrait {
    animation: vb-portrait-float var(--vb-dur-float) var(--vb-ease-float)
      var(--vb-at-float) infinite;
  }

  .vb-frame--marquee {
    opacity: 0;
    animation: vb-fade-rise var(--vb-dur-fade) var(--vb-ease-fade) forwards
      var(--vb-at-marquee);
  }
}

// Responsive : un seul breakpoint à 820px (aligné sur le prototype).
@media (max-width: 820px) {
  .vb-frame {
    // La carte reste flottante (coins arrondis + ombre conservés) avec sa
    // gouttière tout autour. height:auto laisse le cadre grandir selon le
    // contenu (aucun rognage vertical, CTA toujours atteignables, la page
    // défile si besoin) ; margin fixe = gouttière constante en haut/bas.
    height: auto;
    min-height: calc(100vh - var(--vb-gap) * 2);
    margin: var(--vb-gap) auto;

    &--nav {
      @apply px-md;
    }

    &--decor::before {
      top: -80px;
      right: -100px;
      width: 380px;
      height: 380px;
    }
    &--decor::after {
      width: 200px;
      height: 180px;
    }
  }

  .vb-hero {
    @apply px-md py-xl;
    // Colonne unique : les items s'étirent à la largeur de la colonne (pas de
    // justify-items:center qui les dimensionnerait à leur max-content et ferait
    // déborder le lead max-width:29rem). Le centrage se fait via text-align.
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
    gap: var(--vb-hero-gap, 2rem);

    &--portrait {
      order: -1;
    }

    &--lead {
      margin-inline: auto;
    }

    &--actions {
      @apply flex-col w-full;
    }
  }
}
</style>
