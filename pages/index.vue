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

// `seo.headline` en 3 blocs .vb-word : le stagger de index-motion.scss cible
// nth-child(1..3), donc `seo.roleShort` doit rester en 2 mots.
const heroWords = [...seo.roleShort.split(" "), seo.specialty];
const kicker = `${seo.role} ${seo.employment.label} à ${seo.location.city}`;
const identityMeta = `${seo.employment.label} · ${seo.location.city}`;

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
            <span
              v-for="(word, index) in heroWords"
              :key="word"
              class="vb-word"
            >
              <span
                class="vb-word--i"
                :class="{ 'vb-hero--accent': index === heroWords.length - 1 }"
                >{{ index === heroWords.length - 1 ? word : `${word} ` }}</span
              >
            </span>
          </h2>
          <div class="vb-hero--lead">
            <p class="vb-hero--hook">
              L'IA accélère le code. Sans architecture, elle accélère surtout la
              dette.
            </p>
            <ul class="vb-hero--risks">
              <li>
                Une
                <VbTooltip
                  align="start"
                  term="Architecture"
                  :content="[
                    'À l\'ère de la génération de code, la valeur du développeur réside plus que jamais dans la conception.',
                    'Si l\'implémentation est devenue fluide et rapide, la maîtrise des bonnes pratiques d\'architecture est indispensable. À cette vitesse, une erreur à ce niveau se paie en mois, voire en années.',
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
                qui cède à la première évolution
              </li>
              <li>
                Du code livré sans
                <VbTooltip
                  align="start"
                  term="Compréhension profonde"
                  :content="[
                    'Un modèle de langage n\'est fiable que si on connaît ses angles morts. Et cela ne concerne pas que le dev :',
                    'Du besoin à la rédaction du ticket, jusqu\'à la mise en prod et à la documentation, toute la chaîne est en jeu. Sans ce recul, on empile et on empoisonne chaque nouvelle livraison.',
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
              </li>
              <li>
                Une
                <VbTooltip
                  align="start"
                  term="Dette technique"
                  :content="[
                    'Tout comme un dev inexpérimenté, une IA ne dit jamais non. Elle exécute les bonnes idées comme les mauvaises.',
                    'Pire encore, là où un humain peut râler et s\'agacer devant du code bâclé, l\'IA n\'aura aucune réticence à la relire et à en reproduire',
                    'Elle se nourrit du code existant : sur une base saine, la dérive est contenue, sur une base truffée de raccourcis, elle les reproduit et les répand partout.',
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
                  >dette</VbTooltip
                >
                qui grossit aussi vite que le code
              </li>
            </ul>
            <p class="vb-hero--promise">
              Profiter de la vitesse sans le coût de la
              <VbTooltip
                align="start"
                term="Refonte"
                :content="[
                  'Une refonte est le prix d\'une décision prise 6 mois plus tôt. Plus le code se génère vite, plus cette décision arrive tôt.',
                  'Mon objectif est l\'inverse : encadrer l\'équipe pour livrer un code structuré et explicite, que le prochain développeur (ou le prochain LLM) fera évoluer sans moi.',
                  'Une mission réussie, c\'est une équipe qui n\'a plus besoin de moi.',
                ]"
                :keywords="[
                  'Aucune dépendance humaine',
                  'Évolutivité',
                  'Lisible par l\'équipe',
                  'Onboarding rapide',
                ]"
                >refonte</VbTooltip
              >
              dans 6&nbsp;mois.
            </p>
          </div>

          <div class="vb-hero--actions">
            <VbButton
              href="/go/entretien/?s=pf"
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
              <!-- Espace avant <br> : le badge mobile masque le saut de ligne. -->
              <span class="vb-xp--label">ans <br />d'expérience</span>
            </span>
          </div>

          <!-- Rangée identité mobile uniquement : en desktop, le médaillon et
               le kicker portent déjà ces infos. -->
          <p class="vb-hero--name">{{ seo.author.name }}</p>
          <p class="vb-hero--meta">{{ identityMeta }}</p>

          <VbSocials class="vb-hero--socials" compact />
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

  // Soulignement à l'état final ici : index-motion.scss ne fait que l'animer
  // depuis 0%, donc le mode reduced-motion garde le rendu statique complet.
  &--accent {
    @apply text-primary;
    position: relative;
    background-image: linear-gradient(currentColor, currentColor);
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 100% 3px;
    padding-bottom: 2px;
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
    line-height: 1.55;
    // 40rem : l'accroche tient sur une ligne en desktop, sinon le lead ne
    // rentre plus dans le cadre fixe à 1280x720.
    max-width: 40rem;

    > * + * {
      margin-top: 0.6rem;
    }

    p,
    li {
      text-wrap: pretty;
    }
  }

  // L'accroche porte l'argument : plus contrastée que le reste du lead.
  &--hook {
    @apply text-black;
    font-weight: 700;
  }

  &--risks {
    li {
      position: relative;
      padding-left: 1.2em;
    }

    // Losange repris des fiches tooltip : même marqueur pour les mêmes termes.
    li::before {
      content: "";
      position: absolute;
      left: 0.15em;
      top: 0.8em;
      width: 0.36em;
      height: 0.36em;
      background: theme("colors.primary");
      transform: translateY(-50%) rotate(45deg);
    }
  }

  &--promise {
    @apply text-black;
    font-weight: 700;
  }

  &--actions {
    @apply flex gap-md mt-lg;
  }

  &--portrait {
    display: flex;
    justify-content: center;
  }

  &--socials,
  &--name,
  &--meta {
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
}

@media (max-width: 820px) {
  .vb-frame {
    // Quasi bord à bord : chaque pixel de gouttière est pris à la colonne.
    --vb-gap: 0.5rem;
    // height:auto : le cadre grandit avec le contenu, aucun rognage vertical.
    height: auto;
    min-height: calc(100vh - var(--vb-gap) * 2);
    margin: var(--vb-gap) auto;
    border-radius: 22px;

    // Aligné sur le hero, qui passe à gauche.
    &--nav {
      @apply px-md pt-md;
      justify-content: flex-start;

      :deep(.vb-navbar--status) {
        align-items: flex-start;
      }
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

  // Aligné à gauche : un lead centré sur 8 lignes avait des bords irréguliers.
  .vb-hero {
    @apply px-md pt-md pb-xl;
    grid-template-columns: minmax(0, 1fr);
    // Sur tablette, les rangées étirées écartaient l'identité du titre.
    align-content: center;
    gap: var(--vb-hero-gap, 1.25rem);

    // sr-only, jamais display:none : le h1 reste dans l'arbre a11y. La rangée
    // identité affiche déjà statut et ville.
    &--kicker {
      @apply sr-only;
    }

    // Tailles resserrées : à 393x659, titre, accroche et CTA principal doivent
    // tenir au-dessus du pli.
    &--title {
      font-size: clamp(32px, 8.6vw, 40px);
      text-wrap: balance;
    }

    &--lead {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.55;
    }

    &--actions {
      @apply flex-col w-full;
    }

    // Rangée identité : le médaillon de 200px poussait pitch et CTA sous le
    // pli. Même DOM qu'en desktop, recomposé en grille.
    &--portrait {
      order: -1;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas:
        "avatar name socials"
        "avatar meta socials"
        "avatar xp socials";
      align-items: center;
      column-gap: 0.875rem;
      row-gap: 0.125rem;
    }

    &--name {
      grid-area: name;
      display: block;
      @apply font-heading text-black;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.1;
    }

    &--meta {
      grid-area: meta;
      display: block;
      @apply font-body text-grey-600;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.3;
    }

    &--socials {
      grid-area: socials;
      display: flex;
    }
  }

  // `contents` : l'image et le badge deviennent des cellules de la grille, sans
  // dupliquer le badge dans le markup.
  .vb-medallion {
    display: contents;

    img {
      grid-area: avatar;
      width: 72px;
      height: 72px;
      padding: 3px;
      background: linear-gradient(160deg, #facf79, #f0910f);
      box-shadow: 0 10px 20px -10px rgba(240, 145, 15, 0.55);
    }
  }

  .vb-xp {
    grid-area: xp;
    justify-self: start;
    position: static;
    transform: none;
    gap: 0.3rem;
    padding: 0.1rem 0.5rem;
    box-shadow: none;

    &--num {
      font-size: 0.95rem;
    }

    &--label {
      font-size: 0.58rem;
      letter-spacing: 0.1em;
      white-space: nowrap;

      br {
        display: none;
      }
    }
  }
}
</style>

<style scoped lang="scss" src="./index-motion.scss"></style>
