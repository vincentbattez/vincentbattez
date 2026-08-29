import { describe, expect, it, vi } from "vitest";
import { MockLanguageModelV4, simulateReadableStream } from "ai/test";
import type { LanguageModelV4StreamPart } from "@ai-sdk/provider";
import {
  BAD_REQUEST_MESSAGE,
  createRecommendationHandler,
  LANDING_INSTRUCTION,
  LANDING_TURN,
  MAX_TURNS,
  NOTIFICATION_MESSAGE,
  UPSTREAM_ERROR_MESSAGE,
} from "./recommendation";
import { dossier } from "../../config/dossier";
import { rubyInstructions } from "../../config/ruby";

const PROPOS_DU_COLLEGUE = "Vincent a repris l'API de devis en trois semaines";
const RECOMMANDATION = "J'ai bossé avec Vincent pendant deux ans.";

function finish(unified: "stop" | "tool-calls"): LanguageModelV4StreamPart {
  return {
    type: "finish",
    finishReason: { unified, raw: unified },
    usage: {
      inputTokens: {
        total: 10,
        noCache: 10,
        cacheRead: undefined,
        cacheWrite: undefined,
      },
      outputTokens: { total: 10, text: 10, reasoning: undefined },
    },
  };
}

function streamingModel(
  chunks: LanguageModelV4StreamPart[],
  reason: "stop" | "tool-calls" = "stop",
) {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "stream-start", warnings: [] },
          ...chunks,
          finish(reason),
        ],
      }),
    }),
  });
}

function textModel(text = "Salut, on commence ?") {
  return streamingModel([
    { type: "text-start", id: "t0" },
    { type: "text-delta", id: "t0", delta: text },
    { type: "text-end", id: "t0" },
  ]);
}

function toolCallModel(texte = RECOMMANDATION) {
  return streamingModel(
    [
      {
        type: "tool-call",
        toolCallId: "call-1",
        toolName: "submit_recommendation",
        input: JSON.stringify({ texte }),
      },
    ],
    "tool-calls",
  );
}

function chatRequest(userMessages: string[]) {
  return new Request("http://localhost/api/recommendation", {
    method: "POST",
    body: JSON.stringify({
      messages: userMessages.map((text, index) => ({
        id: `m${index}`,
        role: "user",
        parts: [{ type: "text", text }],
      })),
    }),
  });
}

function handlerWith(model: MockLanguageModelV4, notify = vi.fn()) {
  return { handler: createRecommendationHandler({ model, notify }), notify };
}

async function run(
  model: MockLanguageModelV4,
  messages = [PROPOS_DU_COLLEGUE],
) {
  const { handler, notify } = handlerWith(model);
  const response = await handler(chatRequest(messages));
  const body = await response.text();
  return { response, body, notify };
}

function systemPromptOf(model: MockLanguageModelV4): string {
  const prompt = model.doStreamCalls[0]?.prompt ?? [];
  return prompt
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");
}

describe("handler de l'Entretien de recommandation", () => {
  it("envoie les instructions de Ruby et le Dossier au modèle", async () => {
    const model = textModel();
    await run(model);

    const system = systemPromptOf(model);
    expect(system).toContain(rubyInstructions);
    expect(system).toContain(dossier);
  });

  it("ne renvoie ni les instructions ni le Dossier au Collègue", async () => {
    const { body } = await run(textModel());

    expect(body).not.toContain("Dossier — Vincent Battez");
    expect(body).not.toContain("Tu es Ruby");
  });

  it("refuse proprement au-delà du plafond de tours", async () => {
    const model = textModel();
    const { handler } = handlerWith(model);

    const response = await handler(
      chatRequest(Array.from({ length: MAX_TURNS + 1 }, () => "encore")),
    );

    expect(response.status).toBe(429);
    expect(model.doStreamCalls).toHaveLength(0);
  });

  it("injecte l'atterrissage forcé à partir du tour d'atterrissage", async () => {
    const model = textModel();
    await run(
      model,
      Array.from({ length: LANDING_TURN }, () => "je continue"),
    );

    expect(systemPromptOf(model)).toContain(LANDING_INSTRUCTION);
  });

  it("n'injecte pas l'atterrissage forcé avant", async () => {
    const model = textModel();
    await run(model);

    expect(systemPromptOf(model)).not.toContain(LANDING_INSTRUCTION);
  });

  it("relaie le tool call submit_recommendation jusqu'au client", async () => {
    const { body } = await run(toolCallModel());

    expect(body).toContain("submit_recommendation");
    expect(body).toContain(RECOMMANDATION);
  });

  it("notifie sans transporter les propos du Collègue", async () => {
    const { notify } = await run(toolCallModel());

    expect(notify).toHaveBeenCalledOnce();
    const [title, message] = notify.mock.calls[0] as [string, string];
    expect(message).toBe(NOTIFICATION_MESSAGE);
    for (const envoye of [title, message]) {
      expect(envoye).not.toContain(PROPOS_DU_COLLEGUE);
      expect(envoye).not.toContain(RECOMMANDATION);
    }
  });

  it("ne notifie pas tant qu'aucune Recommandation n'est livrée", async () => {
    const { notify } = await run(textModel());

    expect(notify).not.toHaveBeenCalled();
  });

  it("transforme une erreur du fournisseur en message exploitable", async () => {
    const model = new MockLanguageModelV4({
      doStream: async () => {
        throw new Error(
          "openrouter 500: quota dépassé sur la clé sk-or-v1-xxx",
        );
      },
    });

    const { body } = await run(model);

    expect(body).toContain(UPSTREAM_ERROR_MESSAGE);
    expect(body).not.toContain("sk-or-v1-xxx");
  });

  it("rejette un corps de requête invalide", async () => {
    const { handler } = handlerWith(textModel());

    const response = await handler(
      new Request("http://localhost/api/recommendation", {
        method: "POST",
        body: "pas du json",
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toContain(BAD_REQUEST_MESSAGE);
  });
});
