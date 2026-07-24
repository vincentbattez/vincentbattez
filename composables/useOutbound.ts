// Liens sortants on-site.
// Desktop : on passe par /go (loader animé + redirection auto).
// Mobile : lien DIRECT vers l'URL externe → un seul tap, et le geste utilisateur
// ouvre l'app native (LinkedIn, GitHub, Drive) — ce qu'un redirect JS ne permet
// jamais.
//
// SSG : le serveur rend toujours le lien /go (isMobile=false, comme à
// l'hydratation) ; on ne bascule vers l'URL externe qu'après onMounted, côté
// client, pour éviter tout mismatch d'hydratation.
import { lookupTable } from "~/utils/redirect";

type RedirectId = keyof typeof lookupTable.redirectId;

export function useOutbound() {
  const { track } = useAnalytics();
  const isMobile = ref(false);

  onMounted(() => {
    const ua = navigator.userAgent;
    isMobile.value =
      /android|iphone|ipod/i.test(ua) ||
      // iPadOS se présente comme un Mac : détecté via le tactile.
      (/ipad|macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  });

  function outboundHref(redirectId: RedirectId, source: string): string {
    return isMobile.value
      ? lookupTable.redirectId[redirectId]
      : `/go/${redirectId}?s=${source}`;
  }

  // Desktop : la page /go envoie l'event au mount → ne rien faire ici.
  // Mobile : lien direct, on track au clic (fire-and-forget, non bloquant).
  function trackOutbound(redirectId: RedirectId, source: string): void {
    if (isMobile.value) {
      track("outbound_link_opened", { destination: redirectId, source });
    }
  }

  return { outboundHref, trackOutbound };
}
