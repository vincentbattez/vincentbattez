import { PostHog } from "posthog-node";

// Anti-corruption layer (serveur), best-effort : ne bloque jamais l'appelant et
// n'échoue pas si PostHog n'est pas configuré.

type ServerAnalyticsEvents = {
  call_notification_sent: { source: string; $session_id?: string | null };
};

export async function trackServerEvent<K extends keyof ServerAnalyticsEvents>(
  name: K,
  distinctId: string,
  properties: ServerAnalyticsEvents[K],
): Promise<void> {
  // Pas d'envoi depuis le local (`netlify dev`) : ça polluait le projet de prod.
  const isLocal =
    !!process.env.NETLIFY_DEV || process.env.NODE_ENV === "development";
  if (isLocal && process.env.NUXT_PUBLIC_POSTHOG_ENABLED !== "true") return;

  const token = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST;
  if (!token || !host) return;

  // Fonction éphémère : flush immédiat, sinon l'event batché est perdu.
  const posthog = new PostHog(token, { host, flushAt: 1, flushInterval: 0 });
  try {
    posthog.capture({ distinctId, event: name, properties });
    await posthog.shutdown();
  } catch {
    // Analytique non critique : on avale toute erreur.
  }
}
