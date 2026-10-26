// Contrat des tools de l'Entretien, partagé par le handler (streamText,
// validation de l'historique) et la page (types seulement). Volontairement sans
// dépendance au Dossier ni aux instructions de Ruby : rien de ce module ne doit
// pouvoir les attirer dans le bundle navigateur.
// L'`execute` (la notification) reste injecté côté handler.

import { tool } from "ai";
import { z } from "zod";

export const recommendationTools = {
  submit_recommendation: tool({
    description:
      "Livre la Recommandation finale au Collègue. Seul moyen de la lui transmettre.",
    inputSchema: z.object({
      texte: z.string().meta({
        description:
          "La Recommandation complète, texte simple, ~1000 caractères, à la première personne du Collègue.",
      }),
    }),
    outputSchema: z.object({ livree: z.literal(true) }),
  }),
};
