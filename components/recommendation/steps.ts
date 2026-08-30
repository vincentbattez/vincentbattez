// Les cinq étapes annoncées au Collègue. Les Valeurs restent invisibles pour
// lui (voir config/ruby.ts) : les étapes 2 à 4 sont donc formulées de façon
// générique, elles décrivent l'angle, pas la Valeur visée.
export type RecommendationStep = {
  label: string;
  /** Pourquoi cette question lui est posée, dit dans ses mots. */
  goal: string;
};

export const RECOMMENDATION_STEPS: RecommendationStep[] = [
  {
    label: "Le contexte",
    goal: "Où et quand vous avez travaillé ensemble, et ton rôle à toi.",
  },
  {
    label: "Ce que tu l'as vu faire",
    goal: "Un projet, une décision, un moment précis — pas un adjectif.",
  },
  {
    label: "Sa façon de travailler",
    goal: "Ce qui te revient de sa manière de bosser au quotidien.",
  },
  {
    label: "L'effet sur l'équipe",
    goal: "Ce que sa présence a changé autour de lui.",
  },
  {
    label: "Le mot de la fin",
    goal: "Ce que tu dirais à quelqu'un qui hésite à bosser avec lui.",
  },
];

export const RECOMMENDATION_DELIVERY: RecommendationStep = {
  label: "Ta recommandation",
  goal: "Relis, retouche si besoin, copie. C'est fini.",
};
