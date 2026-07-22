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
    call: "https://meet.google.com/zri-nmgp-tqc",
    envoyer_message: "https://www.linkedin.com/messaging/thread/new/",
    linkedin: "https://www.linkedin.com/in/vincentbattez/",
    github: "https://github.com/vincentbattez/",
    cv: "https://drive.google.com/file/d/0B_qtZh6a-s4cVTFkMU42bU9LTU0/view?resourcekey=0-77krpT-fBdI0BbSikISLBQ",
    mail: "mailto:vincentbattez",
  },
};

const redirectLabel = {
  recommandation: "l'espace recommandation LinkedIn",
  entretien: "la prise de rendez-vous",
  call: "votre appel visio",
  envoyer_message: "votre messagerie LinkedIn",
  linkedin: "mon profil LinkedIn",
  github: "mon GitHub",
  cv: "mon CV",
  mail: "votre messagerie",
} as const;

const defaultRedirectLabel = "votre destination";

export function getRedirectLabel(redirectId: string): string {
  return (
    redirectLabel[redirectId as keyof typeof redirectLabel] ??
    defaultRedirectLabel
  );
}

// Déclenche la notif Pushover côté client (site statique, pas de serveur runtime).
// keepalive : la requête survit au window.location.replace qui suit.
export function notifyCall(redirectId: string): void {
  if (redirectId !== "call" || !import.meta.client) {
    return;
  }

  fetch("/.netlify/functions/notify-call", {
    method: "POST",
    keepalive: true,
  }).catch(() => {});
}

export function injectUtmSourceInUrl(source: string, baseUrl: string): string {
  const utmUrlRedirect = new URL(baseUrl);
  utmUrlRedirect.searchParams.append("utm_source", source);
  return utmUrlRedirect.toString();
}
