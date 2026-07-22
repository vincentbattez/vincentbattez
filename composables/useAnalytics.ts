// Couche d'anti-corruption analytique (client).
// Le code métier n'appelle QUE `track()` : PostHog reste caché ici et peut être
// remplacé (ex. proxy serveur) sans toucher aux appelants.

type AnalyticsEvents = {
  outbound_link_opened: { destination: string; source: string };
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
