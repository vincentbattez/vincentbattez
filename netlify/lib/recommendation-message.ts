// Messages de l'Entretien tels que la page et le handler les manipulent. Importé
// au runtime par la page : uniquement des `import type`, effacés au build.

import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import type { recommendationTools } from "./recommendation-tools";

export type RecommendationMessage = UIMessage<
  unknown,
  UIDataTypes,
  InferUITools<typeof recommendationTools>
>;

// Le tool call est le seul canal de la Recommandation. Pendant que Ruby l'écrit,
// le part est en `input-streaming` et son `texte` n'est qu'un fragment : seule
// une Recommandation à l'input complet compte comme livrée. La dernière l'emporte.
export function deliveredRecommendation(
  messages: RecommendationMessage[],
): string {
  let found = "";
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type !== "tool-submit_recommendation") continue;
      if (part.state !== "input-available" && part.state !== "output-available")
        continue;
      if (part.input.texte.length > 0) found = part.input.texte;
    }
  }
  return found;
}
