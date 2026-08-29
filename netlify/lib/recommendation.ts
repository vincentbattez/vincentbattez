// Handler de l'Entretien de recommandation. Le modèle et la notification sont
// injectés : c'est le seul seam de test du projet (voir recommendation.test.ts).
// Rien n'est persisté ici — ni l'Entretien, ni la Recommandation (ADR 0003).

import {
  convertToModelMessages,
  streamText,
  tool,
  type LanguageModel,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { dossier } from "../../config/dossier";
import { rubyInstructions } from "../../config/ruby";

// Un Entretien tient en 5 questions ; au-delà de 25 tours, le Collègue tourne
// en rond ou quelqu'un s'amuse.
export const MAX_TURNS = 25;
export const LANDING_TURN = 20;

export const LANDING_INSTRUCTION = `ATTENTION : cet Entretien s'éternise. Tu as maintenant assez de matière. Conclus au prochain message et appelle \`submit_recommendation\` avec ce que tu as, même si c'est incomplet. Ne pose plus de question.`;

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

export type RecommendationDeps = {
  model: LanguageModel;
  notify: (title: string, message: string) => Promise<unknown>;
};

export function buildSystemPrompt(turns: number): string {
  const parts = [rubyInstructions, dossier];
  if (turns >= LANDING_TURN) parts.push(LANDING_INSTRUCTION);
  return parts.join("\n\n---\n\n");
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function countTurns(messages: UIMessage[]): number {
  return messages.filter((message) => message.role === "user").length;
}

export function createRecommendationHandler({
  model,
  notify,
}: RecommendationDeps) {
  return async (request: Request): Promise<Response> => {
    let messages: UIMessage[];
    try {
      const body = (await request.json()) as { messages?: unknown };
      if (!Array.isArray(body.messages)) throw new Error("messages manquants");
      messages = body.messages as UIMessage[];
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
        system: buildSystemPrompt(turns),
        messages: await convertToModelMessages(messages),
        tools: {
          submit_recommendation: tool({
            description:
              "Livre la Recommandation finale au Collègue. Seul moyen de la lui transmettre.",
            inputSchema: z.object({
              texte: z
                .string()
                .describe(
                  "La Recommandation complète, texte simple, ~1000 caractères, à la première personne du Collègue.",
                ),
            }),
            execute: async () => {
              await notify(NOTIFICATION_TITLE, NOTIFICATION_MESSAGE);
              return { livree: true };
            },
          }),
        },
        // Le reasoning natif aide la sélection des Valeurs ; il ne sort jamais
        // vers le Collègue (`sendReasoning: false`).
        providerOptions: {
          openrouter: { reasoning: { effort: "medium" } },
        },
      });

      return result.toUIMessageStreamResponse({
        sendReasoning: false,
        onError: () => UPSTREAM_ERROR_MESSAGE,
      });
    } catch {
      return errorResponse(502, UPSTREAM_ERROR_MESSAGE);
    }
  };
}
