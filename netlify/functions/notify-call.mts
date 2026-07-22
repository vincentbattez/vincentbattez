import { trackServerEvent } from "../lib/analytics";

// Notif Pushover quand quelqu'un passe par /go/call.
// Isolée en Netlify Function : le site est statique (SSG), les secrets restent côté serveur.
const CALL_URL = "https://meet.google.com/zri-nmgp-tqc";

export default async (request: Request): Promise<Response> => {
  const token = process.env.PUSHOVER_APP_TOKEN;
  const user = process.env.PUSHOVER_USER_KEY;

  if (!token || !user) {
    return new Response("Pushover config manquante", { status: 500 });
  }

  const body = new URLSearchParams({
    token,
    user,
    title: "Quelqu'un essaye de me joindre",
    message: 'Quelqu\'un est passé par le lien "vincentbattez.dev/go/call"',
    url: CALL_URL,
    url_title: "Rejoindre l'appel",
  });

  const response = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    return new Response("Pushover request failed", { status: 502 });
  }

  // Analytique best-effort : découplée de la notif, ne la bloque jamais.
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
    // ignore : la notif est déjà partie, l'analytique ne doit pas casser la réponse
  }

  return new Response(null, { status: 204 });
};
