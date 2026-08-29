import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  createRecommendationHandler,
  UPSTREAM_ERROR_MESSAGE,
} from "../lib/recommendation";
import { sendPushover } from "../lib/pushover";

// Modèle surchargeable sans redéploiement de code (variable d'environnement).
const DEFAULT_MODEL = "anthropic/claude-sonnet-4.5";

export default async (request: Request): Promise<Response> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: UPSTREAM_ERROR_MESSAGE }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const openrouter = createOpenRouter({ apiKey });
  const handler = createRecommendationHandler({
    model: openrouter(process.env.RECOMMENDATION_MODEL ?? DEFAULT_MODEL),
    notify: (title, message) => sendPushover({ title, message }),
  });

  return handler(request);
};
