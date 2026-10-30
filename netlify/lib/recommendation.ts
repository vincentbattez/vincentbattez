// Handler de l'Entretien de recommandation. Le modèle et la notification sont
// injectés : c'est le seul seam de test du projet (voir recommendation.test.ts).
// Rien n'est persisté ici — ni l'Entretien, ni la Recommandation (ADR 0003).

import {
  APICallError,
  convertToModelMessages,
  createUIMessageStreamResponse,
  RetryError,
  streamText,
  tool,
  toUIMessageStream,
  validateUIMessages,
  type LanguageModel,
} from "ai";
import { dossier } from "../../config/dossier";
import { rubyInstructions } from "../../config/ruby";
import type { RecommendationMessage } from "./recommendation-message";
import { recommendationTools } from "./recommendation-tools";

// Un Entretien tient en 5 questions ; au-delà de 25 tours, le Collègue tourne
// en rond ou quelqu'un s'amuse.
export const MAX_TURNS = 25;
export const LANDING_TURN = 20;

export const LANDING_INSTRUCTION = `ATTENTION : cet Entretien s'éternise. Tu as maintenant assez de matière. Conclus au prochain message et appelle \`submit_recommendation\` avec ce que tu as, même si c'est incomplet. Ne pose plus de question.`;

// Le Collègue a cliqué « Terminer et rédiger ma recommandation » : il s'arrête là, quelle que soit
// l'étape. Même mécanique que l'atterrissage, déclenchée par lui.
export const CONCLUDE_INSTRUCTION = `ATTENTION : le Collègue a demandé à terminer l'Entretien maintenant. Ne pose plus aucune question. Rédige la Recommandation avec ce qu'il t'a déjà donné, même si c'est incomplet, et appelle \`submit_recommendation\` dans ce message. N'invente aucun fait pour combler ce qui manque.`;

// Sans contenu, par construction : la notification ne transporte aucun propos
// du Collègue (ADR 0003).
export const NOTIFICATION_TITLE = "Nouvelle recommandation";
export const NOTIFICATION_MESSAGE =
  "Quelqu'un vient de terminer un entretien de recommandation.";

export const TURN_LIMIT_MESSAGE =
  "Cet entretien a atteint sa limite. Recharge la page pour en démarrer un nouveau.";
export const UPSTREAM_ERROR_MESSAGE =
  "Ruby est indisponible pour le moment. Réessaie dans un instant.";
export const BAD_REQUEST_MESSAGE = "Requête invalide.";

export const UPSTREAM_FAILURE_LOG = "[recommendation] panne du fournisseur";

export type RecommendationDeps = {
  model: LanguageModel;
  notify: (title: string, message: string) => Promise<unknown>;
};

export function buildSystemPrompt(turns: number, conclude = false): string {
  const parts = [rubyInstructions, dossier];
  if (conclude) parts.push(CONCLUDE_INSTRUCTION);
  else if (turns >= LANDING_TURN) parts.push(LANDING_INSTRUCTION);
  return parts.join("\n\n---\n\n");
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function countTurns(messages: RecommendationMessage[]): number {
  return messages.filter((message) => message.role === "user").length;
}

// Trace minimale d'une panne : de quoi diagnostiquer (type, statut, modèle),
// jamais le message ni le corps de l'erreur, qui peuvent porter le prompt ou la
// réponse amont — donc les propos du Collègue (ADR 0003).
function logUpstreamFailure(error: unknown, model: LanguageModel): void {
  const cause = RetryError.isInstance(error) ? error.lastError : error;
  console.error(UPSTREAM_FAILURE_LOG, {
    error: cause instanceof Error ? cause.name : typeof cause,
    status: APICallError.isInstance(cause) ? cause.statusCode : undefined,
    model: typeof model === "string" ? model : model.modelId,
  });
}

export function createRecommendationHandler({
  model,
  notify,
}: RecommendationDeps) {
  const tools = {
    submit_recommendation: tool({
      ...recommendationTools.submit_recommendation,
      execute: async () => {
        await notify(NOTIFICATION_TITLE, NOTIFICATION_MESSAGE);
        return { livree: true as const };
      },
    }),
  };

  return async (request: Request): Promise<Response> => {
    // L'historique vient du navigateur : il doit respecter le contrat des
    // messages et des tools avant d'atteindre le modèle.
    let messages: RecommendationMessage[];
    let conclude: boolean;
    try {
      const body = (await request.json()) as {
        messages?: unknown;
        conclude?: unknown;
      };
      messages = await validateUIMessages<RecommendationMessage>({
        messages: body.messages,
        tools: recommendationTools,
      });
      conclude = body.conclude === true;
    } catch {
      return errorResponse(400, BAD_REQUEST_MESSAGE);
    }

    const turns = countTurns(messages);
    if (turns > MAX_TURNS) {
      return errorResponse(429, TURN_LIMIT_MESSAGE);
    }

    try {
      const result = streamText({
        model,
        system: buildSystemPrompt(turns, conclude),
        messages: await convertToModelMessages(messages),
        tools,
        // Le Collègue qui arrête Ruby coupe la requête : la génération suit.
        abortSignal: request.signal,
        // `streamText` ne lève pas : la panne passe dans le flux.
        onError: ({ error }) => logUpstreamFailure(error, model),
        // Le reasoning natif aide la sélection des Valeurs ; il ne sort jamais
        // vers le Collègue (`sendReasoning: false`).
        providerOptions: {
          openrouter: { reasoning: { effort: "medium" } },
        },
      });

      return createUIMessageStreamResponse({
        stream: toUIMessageStream<typeof tools, RecommendationMessage>({
          stream: result.stream,
          tools,
          sendReasoning: false,
          onError: () => UPSTREAM_ERROR_MESSAGE,
        }),
      });
    } catch {
      return errorResponse(502, UPSTREAM_ERROR_MESSAGE);
    }
  };
}
