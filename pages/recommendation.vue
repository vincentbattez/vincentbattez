<script setup lang="ts">
import { Markdown } from "@comark/vue";
import { useChat } from "@ai-sdk/vue";
import { DefaultChatTransport, type UIMessage } from "ai";
import VbNavbar from "~/components/footer/VbNavbar.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";
import VbRecommendationPanel from "~/components/recommendation/VbRecommendationPanel.vue";
import VbRecommendationSteps from "~/components/recommendation/VbRecommendationSteps.vue";
import VbRecommendationChapter from "~/components/recommendation/VbRecommendationChapter.vue";
import {
  RECOMMENDATION_DELIVERY,
  RECOMMENDATION_STEPS,
} from "~/components/recommendation/steps";
import { seo } from "~/config/seo";

// Page non listée : accessible par lien direct uniquement.
useSeoMeta({
  title: "Recommandation",
  robots: "noindex, nofollow",
});

const STORAGE_KEY = "vb-entretien-recommandation";
const TOOL_PART_TYPE = "tool-submit_recommendation";

// Texte invariant : injecté en dur, aucun appel au modèle pour l'accueil.
const WELCOME_ID = "ruby-welcome";
const WELCOME_TEXT = [
  "Salut, moi c'est **Ruby**. Merci de prendre cinq minutes pour Vincent.",
  "",
  "Je te pose **5 questions courtes**, tu réponds avec ce qui te vient — des bouts de phrases suffisent, je me charge d'écrire. À la fin, tu récupères un texte prêt à coller.",
  "",
  "**Question 1/5** — Où et quand avez-vous travaillé ensemble, et toi, tu faisais quoi dans l'équipe ?",
  "",
  "_Par exemple : « Norauto, 2023, j'étais PO sur l'API de devis »._",
].join("\n");

// Découpé en paragraphes : l'accueil se pose bloc par bloc, pas lettre à lettre.
const WELCOME_PARTS = WELCOME_TEXT.split("\n\n");

const WELCOME: UIMessage = {
  id: WELCOME_ID,
  role: "assistant",
  parts: [{ type: "text", text: WELCOME_TEXT }],
};

const { track } = useAnalytics();

const { messages, sendMessage, status, error, stop, clearError } = useChat({
  transport: new DefaultChatTransport({ api: "/api/recommendation" }),
});

const started = ref(false);
// Sortie de l'intro puis entrée de l'entretien : 2s de bout en bout.
const leaving = ref(false);
const INTRO_EXIT_MS = 600;
const WRITE_DELAY_MS = 2900;
const input = ref("");
const restored = ref(false);

const recommendation = ref("");
const recommendationSource = ref("");
const pendingRecommendation = ref("");
const edited = ref(false);
const panelOpen = ref(false);
const copied = ref(false);
const copiedMarkdown = ref(false);

const isThinking = computed(() => status.value === "submitted");
const isStreaming = computed(() => status.value === "streaming");
const isBusy = computed(() => isThinking.value || isStreaming.value);
const hasRecommendation = computed(() => recommendation.value.length > 0);

// Étape courante du tracker : Ruby l'annonce en fin de message (`Question X/5`),
// la livraison de la Recommandation vaut sixième étape.
const questionStep = ref(1);
const step = computed(() =>
  hasRecommendation.value
    ? RECOMMENDATION_STEPS.length + 1
    : questionStep.value,
);
function calm(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const fil = ref<HTMLElement | null>(null);
const entretien = ref<HTMLElement | null>(null);
// Suivre le flux tant que le Collègue est en bas ; s'il remonte lire, on le laisse.
const stuckToBottom = ref(true);

// Ce qui défile change avec le format : le fil en desktop, toute la colonne en mobile.
function scroller(): HTMLElement | null {
  return window.matchMedia("(min-width: 768px)").matches
    ? fil.value
    : entretien.value;
}

function onFilScroll(): void {
  const el = scroller();
  if (!el) return;
  stuckToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
}

function scrollToBottom(force = false): void {
  const el = scroller();
  if (!el || (!stuckToBottom.value && !force)) return;
  el.scrollTo({
    top: el.scrollHeight,
    behavior: calm() ? "auto" : "smooth",
  });
}

function follow(force = false): void {
  nextTick(() => scrollToBottom(force));
}

// Ouverture : l'accueil se dévoile un paragraphe par seconde. Le texte reste
// complet dans `messages` (persistance, regex), seul l'affichage est retenu.
const REVEAL_INTERVAL_MS = 1000;
const staged = ref(false);
const revealed = ref(0);
let reveal: ReturnType<typeof setInterval> | undefined;

const visibleWelcome = computed(() => WELCOME_PARTS.slice(0, revealed.value));

function stopReveal(): void {
  if (reveal) clearInterval(reveal);
  reveal = undefined;
}

function revealWelcome(): void {
  // L'Entretien a pu être relancé pendant l'attente.
  if (!staged.value) return;
  revealed.value = 1;
  follow();
  reveal = setInterval(() => {
    revealed.value += 1;
    follow();
    if (revealed.value >= WELCOME_PARTS.length) stopReveal();
  }, REVEAL_INTERVAL_MS);
}

// La saisie n'arrive qu'une fois Ruby allée au bout de son accueil.
const composerReady = computed(
  () => !staged.value || revealed.value >= WELCOME_PARTS.length,
);

const champ = ref<HTMLTextAreaElement | null>(null);
const CHAMP_MAX_PX = 160;

function autoGrow(): void {
  const el = champ.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, CHAMP_MAX_PX)}px`;
}

onBeforeUnmount(stopReveal);

function textOf(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .join("\n");
}

// Le tool call est le seul canal de la Recommandation : on lit la dernière
// occurrence dans le fil.
function latestRecommendation(list: UIMessage[]): string {
  let found = "";
  for (const message of list) {
    for (const part of message.parts) {
      if (part.type !== TOOL_PART_TYPE) continue;
      const texte = (part as { input?: { texte?: string } }).input?.texte;
      if (typeof texte === "string" && texte.length > 0) found = texte;
    }
  }
  return found;
}

type ThreadItem = {
  message: UIMessage;
  chapter?: { index: number; label: string; delivery?: boolean };
};

function questionIn(message: UIMessage): number | undefined {
  const match = textOf(message).match(/Question\s+(\d)\s*\/\s*5/i);
  return match ? Number(match[1]) : undefined;
}

// Chaque question ouvre un chapitre dans le fil : la coupure d'étape se voit
// sans relire le message. La livraison en ouvre un dernier.
const thread = computed<ThreadItem[]>(() => {
  let opened = 0;
  return messages.value.map((message) => {
    if (message.role !== "assistant") return { message };

    const delivered = message.parts.some(
      (part) => part.type === TOOL_PART_TYPE,
    );
    if (delivered && opened <= RECOMMENDATION_STEPS.length) {
      opened = RECOMMENDATION_STEPS.length + 1;
      return {
        message,
        chapter: {
          index: opened,
          label: RECOMMENDATION_DELIVERY.label,
          delivery: true,
        },
      };
    }

    const question = questionIn(message);
    const step = RECOMMENDATION_STEPS[(question ?? 0) - 1];
    if (!question || !step || question <= opened) return { message };

    opened = question;
    return { message, chapter: { index: question, label: step.label } };
  });
});

function applyRecommendation(text: string): void {
  recommendation.value = text;
  recommendationSource.value = text;
  edited.value = false;
  pendingRecommendation.value = "";
  panelOpen.value = true;
}

let deliveries = 0;
watch(
  messages,
  (list) => {
    if (restored.value) persist(list);

    const incoming = latestRecommendation(list);
    if (!incoming || incoming === recommendationSource.value) return;

    deliveries += 1;
    if (deliveries === 1) track("recommendation_completed", {});
    else track("recommendation_refined", {});

    // Écraser un texte retouché sans demander, c'est perdre le travail du Collègue.
    if (edited.value) {
      pendingRecommendation.value = incoming;
      recommendationSource.value = incoming;
      return;
    }
    applyRecommendation(incoming);
  },
  { deep: true },
);

// Courbe d'abandon : seule donnée exploitable, rien n'étant persisté côté serveur.
let lastStep = 0;
watch(messages, (list) => {
  const last = list[list.length - 1];
  if (!last || last.role !== "assistant") return;
  const current = questionIn(last);
  if (!current) return;
  questionStep.value = current;
  if (current <= lastStep) return;
  lastStep = current;
  track("recommendation_step", { step: current });
});

watch(messages, () => follow(), { deep: true });
watch(isThinking, () => follow());

function persist(list: UIMessage[]): void {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages: list, recommendation: recommendation.value }),
    );
  } catch {
    // Quota ou navigation privée : l'Entretien continue sans reprise possible.
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as {
        messages?: UIMessage[];
        recommendation?: string;
      };
      if (parsed.messages?.length) {
        messages.value = parsed.messages;
        started.value = true;
        if (parsed.recommendation) {
          recommendation.value = parsed.recommendation;
          recommendationSource.value = latestRecommendation(parsed.messages);
        }
      }
    }
  } catch {
    // Sauvegarde illisible : on repart d'un Entretien vierge.
  }
  restored.value = true;
  follow(true);
});

function start(): void {
  started.value = true;
  messages.value = [WELCOME];
  track("recommendation_started", {});
  if (calm()) return;
  staged.value = true;
  revealed.value = 0;
  // Le rail et le chapitre s'installent d'abord, Ruby parle ensuite.
  setTimeout(revealWelcome, WRITE_DELAY_MS);
}

function begin(): void {
  if (leaving.value) return;
  if (calm()) {
    start();
    return;
  }
  leaving.value = true;
  setTimeout(() => {
    leaving.value = false;
    start();
  }, INTRO_EXIT_MS);
}

function reset(): void {
  stop();
  stopReveal();
  staged.value = false;
  revealed.value = 0;
  clearError();
  track("recommendation_reset", { step: step.value });
  messages.value = [];
  started.value = false;
  input.value = "";
  recommendation.value = "";
  recommendationSource.value = "";
  pendingRecommendation.value = "";
  edited.value = false;
  panelOpen.value = false;
  copied.value = false;
  copiedMarkdown.value = false;
  questionStep.value = 1;
  lastStep = 0;
  deliveries = 0;
  stuckToBottom.value = true;
  nextTick(autoGrow);
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Rien à nettoyer si le stockage est indisponible.
  }
}

function submit(): void {
  const text = input.value.trim();
  if (!text || isBusy.value) return;
  input.value = "";
  clearError();
  stuckToBottom.value = true;
  sendMessage({ text });
  nextTick(autoGrow);
  follow(true);
}

function onEnter(event: KeyboardEvent): void {
  if (event.shiftKey) return;
  event.preventDefault();
  submit();
}

function onEdit(value: string): void {
  recommendation.value = value;
  edited.value = true;
}

async function copyRecommendation(): Promise<void> {
  await navigator.clipboard.writeText(recommendation.value);
  copied.value = true;
  track("recommendation_copied", {});
  setTimeout(() => (copied.value = false), 4000);
}

// Filet de secours : le Collègue repart avec la matière s'il préfère rédiger.
function interviewAsMarkdown(): string {
  return messages.value
    .map((message) => {
      const author = message.role === "assistant" ? "**Ruby**" : "**Toi**";
      return `${author}\n\n${textOf(message)}`;
    })
    .filter((block) => block.trim().length > 0)
    .join("\n\n");
}

async function copyInterview(): Promise<void> {
  await navigator.clipboard.writeText(interviewAsMarkdown());
  copiedMarkdown.value = true;
  setTimeout(() => (copiedMarkdown.value = false), 4000);
}

const mailto = `mailto:${seo.author.email}?subject=Recommandation%20pour%20Vincent`;
</script>

<template>
  <div class="vb-frame">
    <div class="vb-frame--content">
      <VbNavbar class="vb-frame--nav" />

      <div
        ref="entretien"
        class="vb-entretien"
        :class="{ 'vb-entretien--seul': !started }"
        @scroll.passive="onFilScroll"
      >
        <VbRecommendationSteps
          v-if="started"
          class="vb-entretien--rail"
          :step="step"
          :resettable="started"
          @reset="reset"
        />

        <section
          v-if="!started"
          class="vb-intro"
          :class="{ 'vb-intro--sort': leaving }"
        >
          <h1 class="vb-intro--title">
            Vincent aimerait deux mots de ta part.
          </h1>
          <p class="vb-intro--lead">
            Tu n'écris rien. <strong>Ruby</strong> te pose les cinq questions
            ci-contre, tu réponds avec ce qui te vient — même en trois mots — et
            elle rédige la recommandation à ta place.
          </p>
          <p class="vb-intro--lead">
            À la fin, tu repars avec un texte prêt à coller sur LinkedIn. Tu
            peux le retoucher avant.
          </p>
          <VbButton :type="vbButtonTypeEnum.primary" @click="begin">
            Commencer l'entretien
          </VbButton>
        </section>

        <section v-else class="vb-talk">
          <div
            ref="fil"
            class="vb-talk--fil ph-no-capture"
            @scroll="onFilScroll"
          >
            <template v-for="item in thread" :key="item.message.id">
              <VbRecommendationChapter
                v-if="item.chapter"
                :index="item.chapter.index"
                :label="item.chapter.label"
                :delivery="item.chapter.delivery"
              />
              <div class="vb-bulle" :class="`vb-bulle--${item.message.role}`">
                <span
                  v-if="item.message.role === 'assistant'"
                  class="vb-bulle--who"
                >
                  Ruby
                </span>
                <template v-if="staged && item.message.id === WELCOME_ID">
                  <Markdown
                    v-for="(para, i) in visibleWelcome"
                    :key="i"
                    :value="para"
                    class="vb-bulle--md vb-para"
                  />
                </template>
                <Markdown
                  v-else
                  :value="textOf(item.message)"
                  :streaming="isStreaming"
                  class="vb-bulle--md"
                />
              </div>
            </template>

            <p
              v-if="isThinking"
              class="vb-bulle vb-bulle--assistant vb-thinking"
            >
              Ruby réfléchit…
            </p>

            <p v-if="error" class="vb-erreur">
              Ruby ne répond plus. Le plus simple&nbsp;:
              <a :href="mailto">écris directement à Vincent</a>, deux lignes
              suffisent.
            </p>
          </div>

          <form v-if="composerReady" class="vb-saisie" @submit.prevent="submit">
            <div class="vb-saisie--cadre">
              <textarea
                ref="champ"
                v-model="input"
                class="vb-saisie--champ ph-no-capture"
                rows="1"
                placeholder="Réponds en quelques mots…"
                aria-label="Ta réponse"
                @input="autoGrow"
                @keydown.enter="onEnter"
              />
              <button
                v-if="isBusy"
                type="button"
                class="vb-saisie--action vb-saisie--action-stop"
                aria-label="Arrêter Ruby"
                @click="stop"
              >
                <span class="vb-saisie--carre" />
              </button>
              <button
                v-else
                type="submit"
                class="vb-saisie--action"
                aria-label="Envoyer ma réponse"
                :disabled="input.trim().length === 0"
              >
                <VbIcon
                  :size="vbButtonSizeEnum.md"
                  :name="VbIconEnum.VbArrowUp"
                />
              </button>
            </div>
          </form>

          <VbRecommendationPanel
            v-if="hasRecommendation"
            class="vb-talk--reco"
            :text="recommendation"
            :open="panelOpen"
            :pending="pendingRecommendation.length > 0"
            :copied="copied"
            :copied-markdown="copiedMarkdown"
            @edit="onEdit"
            @copy="copyRecommendation"
            @copy-md="copyInterview"
            @replace="applyRecommendation(pendingRecommendation)"
            @keep="pendingRecommendation = ''"
            @close="panelOpen = false"
          />

          <VbButton
            v-if="hasRecommendation && !panelOpen"
            class="vb-talk--rouvrir"
            :type="vbButtonTypeEnum.outline"
            @click="panelOpen = true"
          >
            Voir la recommandation
          </VbButton>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vb-frame {
  --vb-gap: clamp(1rem, 2.5vw, 2rem);
  // Fond opaque des zones collantes, calé sur le dégradé du cadre.
  --vb-voile: #fffdf8;
  position: relative;
  margin: auto;
  width: min(100% - var(--vb-gap) * 2, 1180px);
  // Le cadre tient dans le viewport : c'est lui qui scrolle, pas la page.
  height: min(100dvh - var(--vb-gap) * 2, 900px);
  border-radius: 28px;
  box-shadow: 0 40px 80px -30px rgb(225 159 80 / 55%);
  background: linear-gradient(115deg, #ffffff 0%, #fffaf1 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--content {
    @apply flex flex-col grow p-md;
    gap: 1rem;
    min-height: 0;

    @screen md {
      @apply p-xl;
    }
  }
}

.vb-entretien {
  @apply grow flex flex-col gap-lg;
  min-height: 0;

  @screen md {
    display: grid;
    grid-template-columns: 19rem minmax(0, 1fr);
    gap: 2.5rem;
  }

  // Sans rail, l'intro se pose au centre du cadre.
  &--seul {
    @apply items-center justify-center;

    @screen md {
      display: flex;
    }
  }

  &--rail {
    @screen md {
      position: sticky;
      top: 1rem;
      align-self: start;
    }
  }
}

.vb-intro {
  @apply flex flex-col items-start gap-md;
  max-width: 34rem;
  transition:
    opacity 400ms ease-in,
    transform 400ms cubic-bezier(0.4, 0, 0.6, 1);

  // L'intro s'efface vers le bas, l'entretien remonte ensuite du même côté.
  &--sort {
    opacity: 0;
    transform: translateY(14px);
    pointer-events: none;
  }

  &--title {
    @apply font-heading text-h2 text-black;
  }

  &--lead {
    @apply text-body-lg text-grey-700;
  }
}

.vb-talk {
  @apply flex flex-col gap-md;
  min-width: 0;
  min-height: 0;
  // 3. le rail terminé (~1,9s), le fil monte à son tour.
  animation: vb-talk-in 800ms cubic-bezier(0.22, 1, 0.36, 1) 1900ms both;

  // Le fil occupe toute la hauteur libre ; c'est lui qui scrolle, pas la page.
  &--fil {
    @apply flex flex-col gap-md grow overflow-y-auto;
    min-height: 0;
    scroll-padding-block-end: 1rem;
  }

  &--reco {
    max-width: 42rem;
  }

  &--rouvrir {
    @screen md {
      display: none;
    }
  }
}

.vb-bulle {
  @apply text-body-md;
  max-width: 42rem;
  animation: vb-bulle-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both;

  &--assistant {
    @apply text-black;
  }

  &--user {
    @apply bg-blue-100 rounded p-sm text-black self-end;
  }

  &--who {
    @apply block text-body-sm text-orange-700;
    font-weight: 800;
  }

  &--md :deep(p + p) {
    @apply mt-sm;
  }

  &--md :deep(ul) {
    @apply list-disc ps-lg;
  }

  &--md :deep(strong) {
    font-weight: 800;
  }

  &--md :deep(em) {
    @apply text-grey-700;
    font-style: italic;
  }
}

@keyframes vb-talk-in {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
}

// Chaque paragraphe de l'accueil monte à son tour.
.vb-para {
  animation: vb-para-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both;

  & + & {
    @apply mt-sm;
  }
}

@keyframes vb-para-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@keyframes vb-bulle-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vb-bulle,
  .vb-para,
  .vb-saisie,
  .vb-talk {
    animation: none;
  }

  .vb-intro {
    transition: none;
  }
}

.vb-thinking {
  @apply text-grey-600;
}

.vb-erreur {
  @apply text-body-sm text-red-700 bg-red-100 p-sm rounded;

  a {
    @apply underline font-extrabold;
  }
}

.vb-saisie {
  @apply flex flex-col;
  animation: vb-para-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both;

  // Le cadre porte le focus pour toute la saisie, bouton compris.
  &--cadre {
    @apply relative flex items-end bg-white border border-grey-200;
    border-radius: 16px;
    padding-inline-end: 3.5rem;
    // Le cadre ne descend jamais sous la taille du bouton qu'il abrite.
    min-height: 3.25rem;
    transition:
      box-shadow 200ms ease,
      border-color 200ms ease;

    &:focus-within {
      @apply border-blue-300;
      box-shadow:
        0 0 0 4px rgb(35 165 247 / 16%),
        0 14px 28px -20px rgb(35 165 247 / 90%);
    }
  }

  &--champ {
    @apply grow text-body-md text-black;
    // La palette du thème ne définit pas `transparent`.
    background: transparent;
    padding: 0.8rem 0 0.8rem 0.9rem;
    resize: none;
    max-height: 10rem;
    overflow-y: auto;
    // L'anneau du cadre remplace l'outline natif du champ.
    outline: none;
  }

  &--action {
    @apply absolute flex items-center justify-center bg-secondary text-white;
    right: 0.45rem;
    bottom: 0.45rem;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    box-shadow: 0 10px 20px -12px rgb(35 165 247 / 90%);
    transition:
      background-color 200ms ease,
      opacity 200ms ease,
      transform 200ms ease;

    &:hover:not(:disabled) {
      @apply bg-blue-400;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: scale(0.94);
    }

    &:focus-visible {
      @apply outline outline-2 outline-blue-500;
      outline-offset: 2px;
    }

    &:disabled {
      @apply bg-grey-300;
      box-shadow: none;
      cursor: not-allowed;
    }
  }

  &--action-stop {
    @apply bg-grey-600;

    &:hover {
      @apply bg-grey-700;
    }
  }

  &--carre {
    @apply block bg-white;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 3px;
  }
}

@media (max-width: 767px) {
  // Le scroll se joue ici : le rail et le champ s'y accrochent, le fil défile entre eux.
  .vb-entretien {
    @apply overflow-y-auto gap-sm;
    // Le champ collé en bas ne doit pas masquer la dernière bulle.
    scroll-padding-block: 3.5rem 4rem;
  }

  .vb-entretien--rail {
    position: sticky;
    top: 0;
    z-index: 15;
    @apply pt-xs pb-sm;
    background: var(--vb-voile);
  }

  .vb-talk {
    @apply grow;
  }

  .vb-talk--fil {
    @apply overflow-visible grow-0;
    min-height: auto;
  }

  .vb-saisie {
    position: sticky;
    bottom: 0;
    z-index: 15;
    margin-top: auto;
    @apply pt-sm;
    background: var(--vb-voile);
  }
}
</style>
