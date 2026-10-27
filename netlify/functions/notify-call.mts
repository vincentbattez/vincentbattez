import { trackServerEvent } from "../lib/analytics";
import { sendPushover } from "../lib/pushover";

// Isolée en Netlify Function : le site est statique, les secrets restent serveur.
const CALL_URL = "https://meet.google.com/zri-nmgp-tqc";

export default async (request: Request): Promise<Response> => {
  const result = await sendPushover({
    title: "Quelqu'un essaye de me joindre",
    message: 'Quelqu\'un est passé par le lien "vincentbattez.dev/go/call"',
    url: CALL_URL,
    urlTitle: "Rejoindre l'appel",
    // Emergency pour passer le Ne pas déranger : répète toutes les 30 s, 5 min max.
    emergency: { retry: 30, expire: 300 },
  });

  if (result === "not-configured") {
    return new Response("Pushover config manquante", { status: 500 });
  }
  if (result === "failed") {
    return new Response("Pushover request failed", { status: 502 });
  }

  try {
    await trackServerEvent(
      "call_notification_sent",
      request.headers.get("x-posthog-distinct-id") ?? "anonymous",
      {
        source: "netlify_function",
        $session_id: request.headers.get("x-posthog-session-id"),
      },
    );
  } catch {
    // La notif est déjà partie : l'analytique ne doit pas casser la réponse.
  }

  return new Response(null, { status: 204 });
};
