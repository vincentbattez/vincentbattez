// Anti-corruption layer : le code métier n'appelle que `track()`, PostHog reste
// remplaçable sans toucher aux appelants.

type AnalyticsEvents = {
  outbound_link_opened: { destination: string; source: string };
  // Entretien de recommandation : anonymes, sans aucun propos du Collègue.
  recommendation_started: Record<string, never>;
  recommendation_step: { step: number };
  recommendation_concluded: { step: number };
  recommendation_completed: Record<string, never>;
  recommendation_refined: Record<string, never>;
  recommendation_copied: Record<string, never>;
  recommendation_reset: { step: number };
};

export function useAnalytics() {
  const posthog = usePostHog();

  function track<K extends keyof AnalyticsEvents>(
    name: K,
    properties: AnalyticsEvents[K],
  ): void {
    posthog?.capture(name, properties);
  }

  return { track };
}
