<script setup lang="ts">
import { Markdown } from "@comark/vue";
import { useChat } from "@ai-sdk/vue";
import { DefaultChatTransport, type UIMessage } from "ai";
import VbNavbar from "~/components/footer/VbNavbar.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import VbRecommendationPanel from "~/components/recommendation/VbRecommendationPanel.vue";
import VbRecommendationSteps from "~/components/recommendation/VbRecommendationSteps.vue";
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
const WELCOME: UIMessage = {
  id: "ruby-welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: [
        "Salut, moi c'est **Ruby**. Merci de prendre cinq minutes pour Vincent.",
        "",
        "Je te pose **5 questions courtes**, tu réponds avec ce qui te vient — des bouts de phrases suffisent, je me charge d'écrire. À la fin, tu récupères un texte prêt à coller.",
        "",
        "**Question 1/5** — Où et quand avez-vous travaillé ensemble, et toi, tu faisais quoi dans l'équipe ?",
        "",
        "_Par exemple : « Norauto, 2023, j'étais PO sur l'API de devis »._",
      ].join("\n"),
    },
  ],
};

const { track } = useAnalytics();

const { messages, sendMessage, status, error, stop, clearError } = useChat({
  transport: new DefaultChatTransport({ api: "/api/recommendation" }),
});

const started = ref(false);
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
const heading = computed(
  () =>
    RECOMMENDATION_STEPS[step.value - 1] ??
    (hasRecommendation.value
      ? RECOMMENDATION_DELIVERY
      : RECOMMENDATION_STEPS[0]!),
);

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
  const match = textOf(last).match(/Question\s+(\d)\s*\/\s*5/i);
  if (!match) return;
  const current = Number(match[1]);
  questionStep.value = current;
  if (current <= lastStep) return;
  lastStep = current;
  track("recommendation_step", { step: current });
});

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
});

function start(): void {
  started.value = true;
  messages.value = [WELCOME];
  track("recommendation_started", {});
}

function submit(): void {
  const text = input.value.trim();
  if (!text || isBusy.value) return;
  input.value = "";
  clearError();
  sendMessage({ text });
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

      <div class="vb-entretien">
        <VbRecommendationSteps class="vb-entretien--rail" :step="step" />

        <section v-if="!started" class="vb-intro">
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
          <VbButton :type="vbButtonTypeEnum.primary" @click="start">
            Commencer l'entretien
          </VbButton>
        </section>

        <section v-else class="vb-talk">
          <header class="vb-talk--head">
            <h1 class="vb-talk--title">{{ heading.label }}</h1>
            <p class="vb-talk--goal">{{ heading.goal }}</p>
          </header>

          <div class="vb-talk--fil ph-no-capture">
            <div
              v-for="message in messages"
              :key="message.id"
              class="vb-bulle"
              :class="`vb-bulle--${message.role}`"
            >
              <span v-if="message.role === 'assistant'" class="vb-bulle--who">
                Ruby
              </span>
              <Markdown
                :value="textOf(message)"
                :streaming="isStreaming"
                class="vb-bulle--md"
              />
            </div>

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

          <form class="vb-saisie" @submit.prevent="submit">
            <textarea
              v-model="input"
              class="vb-saisie--champ ph-no-capture"
              rows="2"
              placeholder="Réponds en quelques mots…"
              aria-label="Ta réponse"
              @keydown.enter="onEnter"
            />
            <VbButton
              v-if="isBusy"
              :type="vbButtonTypeEnum.soft"
              @click.prevent="stop"
            >
              Arrêter
            </VbButton>
            <VbButton v-else :type="vbButtonTypeEnum.primary" @click="submit">
              Envoyer
            </VbButton>
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
  min-height: min(100vh - var(--vb-gap) * 2, 900px);
  border-radius: 28px;
  box-shadow: 0 40px 80px -30px rgb(225 159 80 / 55%);
  background: linear-gradient(115deg, #ffffff 0%, #fffaf1 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--content {
    @apply flex flex-col grow p-md;
    gap: 1rem;

    @screen md {
      @apply p-xl;
    }
  }
}

.vb-entretien {
  @apply grow flex flex-col gap-lg;

  @screen md {
    display: grid;
    grid-template-columns: 19rem minmax(0, 1fr);
    gap: 2.5rem;
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

  @screen md {
    align-self: center;
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

  &--head {
    @apply pb-sm border-b border-grey-200;
  }

  &--title {
    @apply font-heading text-h3 text-black;
  }

  &--goal {
    @apply text-body-sm text-grey-700;
  }

  &--fil {
    @apply flex flex-col gap-md overflow-y-auto;
    max-height: 48vh;
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
  @apply flex flex-col gap-sm;

  @screen md {
    @apply flex-row items-end;
  }

  &--champ {
    @apply grow p-sm rounded border border-grey-200 bg-white text-body-md text-black;
    resize: none;

    &:focus-visible {
      @apply outline outline-2 outline-blue-500;
    }
  }
}
</style>
