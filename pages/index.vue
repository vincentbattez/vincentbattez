<script setup lang="ts">
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbNavbar from "~/components/footer/VbNavbar.vue";

// SEO page d'accueil : positionnement « Développeur Full-Stack Senior Freelance ».
// Le titre est absolu (titleTemplate désactivé) car il contient déjà la marque,
// ce qui évite le doublon avec le template global défini dans nuxt.config.
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
  meta: [
    {
      name: "keywords",
      content:
        "Développeur Full-Stack, Développeur Senior, Freelance Lille, Node.js, React, Vue.js, TypeScript, Architecture logicielle, Développeur web freelance",
    },
  ],
});
</script>

<template>
  <div class="vb-frame">
    <!-- Décor CSS pur : blob ambré (haut-droite) + hachures 45° (bas-gauche) -->
    <div class="vb-frame--decor" aria-hidden="true"></div>

    <div class="vb-frame--content">
      <!-- Topbar -->
      <VbNavbar class="vb-frame--nav" />

      <!-- Hero -->
      <div class="vb-hero">
        <!-- Texte -->
        <div class="vb-hero--text">
          <p class="vb-hero--kicker">
            Développeur Full-Stack Freelance à Lille
          </p>
          <h1 class="vb-hero--title">
            Développeur Full-Stack
            <span class="vb-hero--accent">Senior</span>
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

        <!-- Portrait -->
        <div class="vb-hero--portrait">
          <div class="vb-medallion">
            <img
              src="/images/vincentbattez.webp"
              width="640"
              height="640"
              alt="Portrait de Vincent Battez, développeur Full-Stack Senior freelance"
            />
          </div>
        </div>
      </div>

      <!-- Marquee compétences -->
      <VbFooter class="vb-frame--marquee" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vb-frame {
  position: relative;
  margin: auto;
  width: min(100%, 1180px);
  height: min(100vh, 900px);
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 40px 80px -30px rgba(36, 22, 5, 0.35);
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

    // blob ambré haut-droite : halo rond diffus, chute d'opacité progressive
    // (pas de bord/anneau visible en atteignant transparent).
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

    // hachures 45° en triangle bas-gauche
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
    @apply font-body text-body-sm text-grey-500 uppercase mb-md;
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

// Responsive : un seul breakpoint à 820px (aligné sur le prototype).
@media (max-width: 820px) {
  .vb-frame {
    // Sur mobile le conteneur remplit l'écran : pas de carte flottante,
    // donc pas d'ombre ni de coins arrondis. height:auto laisse le cadre
    // grandir selon le contenu (aucun rognage vertical, CTA toujours
    // atteignables, la page défile si besoin) tout en gardant overflow:hidden
    // pour clipper le décor (sinon le blob déborde → scroll horizontal).
    height: auto;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;

    &--nav {
      @apply px-md;
    }

    // décor repositionné et réduit
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
