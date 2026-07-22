import { PostHog } from "posthog-node";

// Couche d'anti-corruption analytique (serveur).
// Best-effort : ne bloque jamais l'appelant et n'échoue pas si PostHog n'est
// pas configuré. PostHog reste caché ici.

type ServerAnalyticsEvents = {
  call_notification_sent: { source: string; $session_id?: string | null };
};

export async function trackServerEvent<K extends keyof ServerAnalyticsEvents>(
  name: K,
  distinctId: string,
  properties: ServerAnalyticsEvents[K],
): Promise<void> {
  const token = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST;
  if (!token || !host) return;

  // Client par requête (fonction éphémère) : flush immédiat puis shutdown,
  // sinon l'event batché est perdu à la fin de l'invocation.
  const posthog = new PostHog(token, { host, flushAt: 1, flushInterval: 0 });
  try {
    posthog.capture({ distinctId, event: name, properties });
    await posthog.shutdown();
  } catch {
    // Analytique non critique : on avale toute erreur.
  }
}
