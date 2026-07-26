<script setup lang="ts">
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbNavbar from "~/components/footer/VbNavbar.vue";
import VbSocials from "~/components/footer/VbSocials.vue";
import VbNextSlot from "~/components/VbNextSlot.vue";
import VbTooltip from "~/ui/components/overlay/VbTooltip.vue";
import { seo } from "~/config/seo";

const { outboundHref, trackOutbound } = useOutbound();

// Hero dérivé du positionnement (SSOT config/seo). Le <h1> anime chaque mot du
// rôle (dernier accentué) ; voir index-motion.scss (stagger calibré sur 3 mots).
const heroWords = seo.role.split(" ");
const kicker = `${seo.role} ${seo.employment.label} à ${seo.location.city}`;

useSeoMeta({
  title: seo.title,
  description: seo.descriptionCard,
  ogTitle: seo.title,
  ogDescription: seo.descriptionCard,
  twitterTitle: seo.title,
  twitterDescription: seo.descriptionCard,
});

useHead({
  titleTemplate: null,
  link: [
    // Portrait = élément LCP : préchargé pour un rendu plus rapide.
    {
      rel: "preload",
      as: "image",
      href: seo.portrait,
      fetchpriority: "high",
    },
  ],
});

// Parallaxe 3D du pointeur (très subtil). Piloté par la propriété `transform`
// (l'entrée utilise le longhand `translate` → aucun conflit). Compositor-only,
// throttlé en rAF, suivi instantané. Ignoré si reduced-motion ou pointeur
// grossier (tactile).
const frameEl = ref<HTMLElement | null>(null);

onMounted(() => {
  const fine = matchMedia("(pointer: fine)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduce.matches) return;

  const MAX_SHIFT = 1; // translation max en px
  const MAX_TILT = 1; // inclinaison max en deg
  let tx = 0;
  let ty = 0;
  let rx = 0;
  let ry = 0;
  let raf = 0;

  const apply = () => {
    raf = 0;
    if (frameEl.value) {
      frameEl.value.style.transform =
        `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) ` +
        `translate3d(${tx}px, ${ty}px, 0)`;
    }
  };

  const onMove = (e: MouseEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
    const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1..1
    tx = nx * MAX_SHIFT;
    ty = ny * MAX_SHIFT;
    ry = nx * MAX_TILT; // souris à droite → bord droit s'éloigne
    rx = -ny * MAX_TILT; // souris en bas → bord bas se rapproche
    if (!raf) raf = requestAnimationFrame(apply);
  };

  window.addEventListener("mousemove", onMove, { passive: true });

  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", onMove);
    if (raf) cancelAnimationFrame(raf);
  });
});
</script>

<template>
  <div ref="frameEl" class="vb-frame">
    <div class="vb-frame--decor" aria-hidden="true"></div>
    <div class="vb-frame--dots" aria-hidden="true"></div>

    <div class="vb-frame--content">
      <VbNavbar class="vb-frame--nav" />

      <div class="vb-hero">
        <div class="vb-hero--text">
          <h1 class="vb-hero--kicker">{{ kicker }}</h1>
          <p class="vb-hero--title">
            <!--            <span v-for="(word, i) in heroWords" :key="i" class="vb-word">-->
            <!--              <span-->
            <!--                class="vb-word--i"-->
            <!--                :class="{ 'vb-hero--accent': i === heroWords.length - 1 }"-->
            <!--                >{{ word }}</span-->
            <!--              >-->
            <!--            </span>-->
            <span class="vb-word">
              <span class="vb-word--i">Développeur </span>
            </span>
            <span class="vb-word">
              <span class="vb-word--i">Full-Stack</span>
            </span>
            <span class="vb-word">
              <span class="vb-word--i vb-hero--accent">Sénior</span>
            </span>
          </p>
          <div class="vb-hero--lead">
            <p class="vb-hero--tension">
              J'intègre l'IA au cœur de mon workflow quotidien. Elle démultiplie
              la vitesse mais sans
              <VbTooltip
                align="start"
                term="Architecture"
                :content="[
                  'Produire du code n\'est plus le bottleneck : c\'est la compréhension profonde d\'un système qui l\'est devenue. Les principes d\'architecture d\'il y a +20 ans n\'ont jamais été aussi décisifs.',
                  'Poser des frontières qui tiennent dans la durée, ça ne s\'improvise pas.',
                ]"
                :keywords="[
                  'Couplage fort',
                  'Big ball of mud',
                  'Dépendances circulaires',
                  'Abstractions fuyantes',
                ]"
                >architecture</VbTooltip
              >
              ni
              <VbTooltip
                align="start"
                term="Compréhension solides"
                :content="[
                  'L\'IA ne produit de façon fiable que si on connaît ses angles morts. Et cela ne concerne pas que le dev :',
                  'Du besoin à la rédaction du ticket, jusqu\'à la mise en prod et à la documentation, toute la chaîne est en jeu. Sans ce recul, on empile ce qu\'on ne maîtrise plus.',
                ]"
                :keywords="[
                  'Hallucinations',
                  'Contexte manquant',
                  'Dérive silencieuse',
                  'Sur-confiance',
                ]"
                >compréhension</VbTooltip
              >
              solides, elle accélère aussi
              <VbTooltip
                align="end"
                term="Dette technique"
                :content="[
                  'L\'IA amplifie le meilleur comme le pire : elle s\'appuie sur ton code existant. Une base saine la tire vers le haut ; truffée de mauvaises pratiques, elle les reproduit et les répand à pleine vitesse.',
                  'Sans le contexte ni le recul pour trancher, la dette s\'accumule aussi vite que le reste.',
                ]"
                :keywords="[
                  'God object',
                  'Flaky tests',
                  'Code mort',
                  'Duplication',
                  'Rustines empilées',
                ]"
                >la dette</VbTooltip
              >. <br />
              C'est précisément là que j'interviens&nbsp;: profiter de la
              vitesse sans jamais en payer la dette.
            </p>
          </div>

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
              Consulter mes disponibilités
            </VbButton>

            <VbButton
              :href="outboundHref('cv', 'pf')"
              :type="vbButtonTypeEnum.outline"
              @click="trackOutbound('cv', 'pf')"
            >
              Voir mon CV
            </VbButton>
          </div>

          <VbNextSlot />
        </div>

        <div class="vb-hero--portrait">
          <div class="vb-medallion">
            <img
              :src="seo.portrait"
              width="640"
              height="640"
              fetchpriority="high"
              :alt="seo.portraitAlt"
            />

            <span class="vb-xp">
              <span class="vb-xp--num">+8</span>
              <span class="vb-xp--label">ans<br />d'expériences</span>
            </span>
          </div>

          <VbSocials class="vb-hero--socials" />
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
  background: linear-gradient(115deg, #ffffff 0%, #fffaf1 100%);
  display: flex;
  flex-direction: column;
  // Parallaxe 3D du pointeur piloté par `transform` en JS (suivi instantané).
  // L'entrée utilise le longhand `translate` → aucun conflit.
  transform-style: preserve-3d;
  will-change: transform;

  &--decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    // Chute d'opacité progressive : pas de bord/anneau visible en atteignant transparent.
    &::before {
      content: "";
      position: absolute;
      top: -60px;
      right: -140px;
      width: 620px;
      height: 620px;
      background: radial-gradient(
        circle at 60% 40%,
        rgba(246, 186, 87, 0.32),
        rgba(240, 145, 15, 0.06) 60%,
        transparent 0%
      );
    }

    // Matrice de points : le dégradé blanc→orange n'est révélé qu'à travers la
    // trame de points, puis estompé en diagonale (composite intersect) pour se
    // fondre progressivement vers l'intérieur de la carte.
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 360px;
      height: 320px;
      background: linear-gradient(45deg, #f0910f 0%, #ffffff 100%);
      --vb-dot: radial-gradient(
        circle at center,
        #000 1.3px,
        transparent 1.7px
      );
      --vb-fade: linear-gradient(45deg, #000 0%, transparent 68%);
      -webkit-mask-image: var(--vb-dot), var(--vb-fade);
      mask-image: var(--vb-dot), var(--vb-fade);
      -webkit-mask-size:
        16px 16px,
        cover;
      mask-size:
        16px 16px,
        cover;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }
  }

  // Matrice de points blancs en haut à droite, estompée en diagonale vers
  // l'intérieur de la carte (même trame que la décoration bas-gauche).
  &--dots {
    position: absolute;
    top: 0;
    right: 0;
    width: 360px;
    height: 320px;
    pointer-events: none;
    z-index: 0;
    background: #f6ba57;
    --vb-dot: radial-gradient(circle at center, #000 1.3px, transparent 1.7px);
    --vb-fade: linear-gradient(225deg, #000 0%, transparent 68%);
    -webkit-mask-image: var(--vb-dot), var(--vb-fade);
    mask-image: var(--vb-dot), var(--vb-fade);
    -webkit-mask-size:
      16px 16px,
      cover;
    mask-size:
      16px 16px,
      cover;
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
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
  @apply px-xxl;
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
    display: block;
    overflow: hidden;
    vertical-align: top;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
    // Vue condense le whitespace entre les masques : espacement porté en CSS.
    margin-right: 0.22em;

    @media (max-width: 820px) {
      display: inline-block;
    }

    &:last-child {
      margin-right: 0;
    }

    &--i {
      display: inline-block;
    }
  }

  // Direction B — raffinement typographique pur (même Nunito, même gris).
  // Taille fluide, interligne aéré, rythme entre les deux phrases.
  &--lead {
    @apply font-body text-grey-700;
    font-size: clamp(17px, 0.6vw + 15px, 19px);
    font-weight: 600;
    line-height: 1.65;
    max-width: 35rem;

    p + p {
      margin-top: 1rem;
    }

    // Antithèse dramatisée : « vitesse » ↔ « prix » en accent orange.
    em {
      @apply text-primary;
      font-style: normal;
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

  // Socials sous la photo : uniquement en mobile (voir media query).
  &--socials {
    display: none;
  }
}

.vb-medallion {
  position: relative;
  width: min(310px, 70vw);
  aspect-ratio: 1;
  padding: 10px;
  border-radius: 50%;
  background: linear-gradient(160deg, #facf79, #f0910f);
  box-shadow: 0 24px 48px -18px rgba(240, 145, 15, 0.55);

  @media (max-width: 440px) {
    width: min(200px, 50vw);
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
}

// Sceau « ancienneté » qui chevauche le bas du médaillon (overlap = repère
// visuel fort). Carte blanche + ombre ambrée pour rester dans la charte.
.vb-xp {
  position: absolute;
  left: 50%;
  bottom: 6%;
  transform: translate(-50%, 50%);
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid rgba(240, 145, 15, 0.16);
  box-shadow: 0 16px 32px -14px rgba(240, 145, 15, 0.6);

  &--num {
    @apply font-heading text-primary;
    font-weight: 700;
    font-size: 1.7rem;
    line-height: 1;
  }

  &--label {
    @apply font-body text-grey-600 uppercase;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    line-height: 1.2;
    text-align: left;
  }

  @media (max-width: 440px) {
    padding: 0.4rem 0.8rem;
    gap: 0.45rem;

    &--num {
      font-size: 1.35rem;
    }

    &--label {
      font-size: 0.55rem;
    }
  }
}

// La timeline d'entrée (orchestration CSS) vit dans ./index-motion.scss,
// chargée via le second bloc `<style scoped src>` ci-dessous.

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

    // En mobile, on masque le décor (glow + trame bas-gauche) et on recolore
    // la trame haut-droite en orange, comme celle en bas à gauche.
    &--decor {
      display: none;
    }

    &--dots {
      width: 200px;
      height: 180px;
      background: linear-gradient(45deg, #f0910f 0%, #ffffff 100%);
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
      @apply flex-col items-center gap-lg;
    }

    &--socials {
      @apply flex justify-center;
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

<!-- Logique d'animation isolée (même scope-id que ce composant). -->
<style scoped lang="scss" src="./index-motion.scss"></style>
