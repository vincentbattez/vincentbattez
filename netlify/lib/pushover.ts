// Envoi Pushover partagé par les functions. Ne jette pas : l'appelant décide du
// code HTTP selon le résultat.

export type PushoverResult = "sent" | "not-configured" | "failed";

type PushoverMessage = {
  title: string;
  message: string;
  url?: string;
  urlTitle?: string;
};

export async function sendPushover({
  title,
  message,
  url,
  urlTitle,
}: PushoverMessage): Promise<PushoverResult> {
  const token = process.env.PUSHOVER_APP_TOKEN;
  const user = process.env.PUSHOVER_USER_KEY;
  if (!token || !user) return "not-configured";

  const body = new URLSearchParams({ token, user, title, message });
  if (url) body.set("url", url);
  if (urlTitle) body.set("url_title", urlTitle);

  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
