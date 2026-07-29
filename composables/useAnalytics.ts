// Anti-corruption layer : le code métier n'appelle que `track()`, PostHog reste
// remplaçable sans toucher aux appelants.

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
