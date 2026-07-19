export const lookupTable = {
  source: {
    sem: "signature_email",
    lk: "linkedin",
    cd: "calendrier_description",
    mp: "message_prive",
    pf: "portfolio",
    qr: "qr_code",
    cv: "cv",
    gh: "github",
  },
  redirectId: {
    recommandation:
      "https://www.linkedin.com/in/vincentbattez/details/recommendations/edit/write/?profileUrn=urn%3Ali%3Afsd_profile%3AACoAABx8RLABL3SOZC3R86qDOhYgJZwNmmSBKWY",
    entretien: "https://hub.flexibits.com/openings/vincentbattez/entretien/",
    call: process.env.GOOGLE_MEET_LINK,
    envoyer_message: "https://www.linkedin.com/messaging/thread/new/",
    linkedin: "https://www.linkedin.com/in/vincentbattez/",
    github: "https://github.com/vincentbattez/",
    cv: process.env.CV_LINK,
    mail: "mailto:vincentbattez",
  },
};

export async function sendIOSNotification(
  redirectId: string,
  url: string,
): Promise<void> {
  if (redirectId !== "call") {
    return;
  }

  const title = "Quelqu'un essaye de me joindre";
  const message =
    'Quelqu\'un est passé par le lien "vincentbattez.dev/go/call"';
  const urlTitle = "Rejoindre l'appel";

  await fetch(
    `https://api.pushover.net/1/messages.json
        ?token=${process.env.PUSHOVER_APP_TOKEN}
        &user=${process.env.PUSHOVER_USER_KEY}
        &title=${title}
        &message=${message}
        &url=${url}
        &url_title=${urlTitle}`,
    { method: "POST" },
  );
}

export function injectUtmSourceInUrl(source: string, baseUrl: string): string {
  const utmUrlRedirect = new URL(baseUrl);
  utmUrlRedirect.searchParams.append("utm_source", source);
  return utmUrlRedirect.toString();
}
