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

// Le <h2> est codé en dur dans le template (indépendant de `seo.role`) ;
// le stagger de index-motion.scss reste calibré sur 3 mots (.vb-word).
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
    // Portrait = élément LCP.
    {
      rel: "preload",
      as: "image",
      href: seo.portrait,
      fetchpriority: "high",
    },
  ],
});

// Parallaxe pointeur pilotée par `transform` : l'entrée utilise le longhand
// `translate`, donc aucun conflit entre les deux.
const frameEl = ref<HTMLElement | null>(null);

onMounted(() => {
  const fine = matchMedia("(pointer: fine)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduce.matches) return;

  const MAX_SHIFT = 1;
  const MAX_TILT = 1;
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
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    tx = nx * MAX_SHIFT;
    ty = ny * MAX_SHIFT;
    ry = nx * MAX_TILT;
    rx = -ny * MAX_TILT;
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
          <h2 class="vb-hero--title">
            <span class="vb-word">
              <span class="vb-word--i">Développeur </span>
            </span>
            <span class="vb-word">
              <span class="vb-word--i">Full-Stack </span>
            </span>
            <span class="vb-word">
              <span class="vb-word--i vb-hero--accent">Architecture & IA</span>
            </span>
          </h2>
          <div class="vb-hero--lead">
            <p class="vb-hero--tension">
              J'intègre l'IA au cœur de mon workflow quotidien. Elle démultiplie
              la vitesse, mais, sans
              <VbTooltip
                align="start"
                term="Architecture"
                :content="[
                  'À l\'ère de la génération de code, la valeur du développeur s\'est davantage déplacée vers la conception. Si l\'implémentation est devenue fluide et rapide, le découpage d\'un système n\'est que plus critique. À cette vitesse, une erreur à ce niveau se paie en mois, voire en années.',
                  'C\'est pourquoi les principes d\'architecture établis il y a plus de 40 ans n\'ont jamais été aussi actuels.',
                  'Tracer une frontière qu\'on peut déplacer sans casser le reste, ça ne s\'improvise pas.',
                ]"
                :keywords="[
                  'Bounded contexts',
                  'Couplage / cohésion',
                  'Shotgun Surgery',
                  'Big ball of mud',
                ]"
                >architecture</VbTooltip
              >
              ni
              <VbTooltip
                align="start"
                term="Compréhension profonde"
                :content="[
                  'Un modèle de langage n\'est fiable que si on connaît ses angles morts. Et cela ne concerne pas que le dev :',
                  'Du besoin à la rédaction du ticket, jusqu\'à la mise en prod et à la documentation, toute la chaîne est en jeu. Sans ce recul, on empile et empoisonne chaque nouvelle livraison.',
                ]"
                :keywords="[
                  'Hallucinations',
                  'Manque de contexte',
                  'Dérive silencieuse',
                  'Sur-confiance',
                  'Garbage in, garbage out',
                ]"
                >compréhension profonde</VbTooltip
              >
              , elle accélère surtout
              <VbTooltip
                align="start"
                term="Dette technique"
                :content="[
                  'Tout comme un dev inexpérimenté, une IA ne dit jamais non. Elle exécute les bonnes idées comme les mauvaises.',
                  'Elle se nourrit du code existant, sur une base saine, la dérive est contenue, sur une base truffée de raccourcis, elle les reproduit et les répand partout.',
                  'Dire non au bon moment, arbitrer entre livrer et refactorer, ça ne se génère pas, ça s\'apprend. Sans ce recul, la dette s\'accumule désormais aussi vite que le code.',
                ]"
                :keywords="[
                  'God object',
                  'Flaky tests',
                  'Code mort',
                  'Code smell',
                  'Duplication',
                  'Rustines empilées',
                ]"
                >la dette</VbTooltip
              >. <br />
              C'est précisément là que j'interviens&nbsp;: profiter de la
              vitesse sans le coût de la
              <VbTooltip
                align="start"
                term="Refonte"
                :content="[
                  'Une refonte est le prix d\'une décision prise 6 mois plus tôt. Plus le code se génère vite, plus cette décision arrive tôt.',
                  'Mon objectif est l\'inverse : encadrer l\'équipe pour livrer un code structuré et explicite, que le prochain développeur (ou le prochain LLM) fera évoluer sans moi.',
                  'Une mission réussie, c\'est une équipe qui n\'a plus besoin de m\'appeler.',
                ]"
                :keywords="[
                  'Aucune dépendance humaine',
                  'Évolutivité',
                  'Lisible par l\'équipe',
                  'Onboarding rapide',
                ]"
                >refonte</VbTooltip
              >
              dans 6 mois.
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
              <span class="vb-xp--label">ans<br />d'expérience</span>
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
  --vb-gap: clamp(1rem, 2.5vw, 2rem);
  position: relative;
  margin: auto;
  width: min(100% - var(--vb-gap) * 2, 1180px);
  height: min(100vh - var(--vb-gap) * 2, 900px);
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 40px 80px -30px rgb(225 159 80 / 55%);
  // 2 stops : le palier plat #fff→#fff créait une bande verticale (Mach band).
  background: linear-gradient(115deg, #ffffff 0%, #fffaf1 100%);
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
  will-change: transform;

  &--decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;

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

  // padding/margin compensés : sans ça le masque rogne les jambages (« pp »).
  .vb-word {
    display: block;
    overflow: hidden;
    vertical-align: top;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
    // Vue condense le whitespace entre les masques.
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

  &--lead {
    @apply font-body text-grey-700;
    font-size: clamp(17px, 0.6vw + 15px, 19px);
    font-weight: 600;
    line-height: 1.65;
    max-width: 37rem;

    p + p {
      margin-top: 1rem;
    }

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

@media (max-width: 820px) {
  .vb-frame {
    // height:auto : le cadre grandit avec le contenu, aucun rognage vertical.
    height: auto;
    min-height: calc(100vh - var(--vb-gap) * 2);
    margin: var(--vb-gap) auto;

    &--nav {
      @apply px-md;
    }

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
    // Pas de justify-items:center : dimensionnerait les items à max-content
    // et ferait déborder le lead.
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

<style scoped lang="scss" src="./index-motion.scss"></style>
