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
    envoyer_message: "https://www.linkedin.com/messaging/thread/new/",
    linkedin: "https://www.linkedin.com/in/vincentbattez/",
    github: "https://github.com/vincentbattez/",
    mail: "mailto:vincentbattez",
  },
};

// Résout l'URL cible d'une redirection /go/<id>.
// `call` et `cv` proviennent de l'env (runtimeConfig.public) et non de la table
// statique : elles doivent être disponibles côté client, où `process.env` est
// indisponible. On les passe donc explicitement depuis useRuntimeConfig().
export function resolveRedirectURL(
  redirectId: string,
  config: { cvLink?: string; callLink?: string },
): string {
  const dynamic: Record<string, string | undefined> = {
    call: config.callLink,
    cv: config.cvLink,
  };

  return (
    dynamic[redirectId] ??
    lookupTable.redirectId[redirectId as keyof typeof lookupTable.redirectId] ??
    "/"
  );
}

export async function sendIOSNotification(
  redirectId: string,
  url: string,
): Promise<void> {
  if (redirectId !== "call") {
    return;
  }

  // Corps encodé via URLSearchParams : chaque valeur est proprement échappée et
  // aucun espace/retour-ligne parasite ne se glisse dans la requête (l'ancienne
  // URL en template literal multi-lignes produisait une requête malformée).
  const body = new URLSearchParams({
    token: process.env.PUSHOVER_APP_TOKEN ?? "",
    user: process.env.PUSHOVER_USER_KEY ?? "",
    title: "Quelqu'un essaye de me joindre",
    message: 'Quelqu\'un est passé par le lien "vincentbattez.dev/go/call"',
    url,
    url_title: "Rejoindre l'appel",
  });

  await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

export function injectUtmSourceInUrl(source: string, baseUrl: string): string {
  const utmUrlRedirect = new URL(baseUrl);
  utmUrlRedirect.searchParams.append("utm_source", source);
  return utmUrlRedirect.toString();
}
