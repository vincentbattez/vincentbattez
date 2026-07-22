// Notif Pushover quand quelqu'un passe par /go/call.
// Isolée en Netlify Function : le site est statique (SSG), les secrets restent côté serveur.
const CALL_URL = "https://meet.google.com/zri-nmgp-tqc";

export default async (): Promise<Response> => {
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

  await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return new Response(null, { status: 204 });
};
