// Mobile : lien direct vers l'URL externe, car seul un geste utilisateur ouvre
// l'app native. Bascule après onMounted pour éviter un mismatch d'hydratation.
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

  function trackOutbound(redirectId: RedirectId, source: string): void {
    if (isMobile.value) {
      track("outbound_link_opened", { destination: redirectId, source });
    }
  }

  return { outboundHref, trackOutbound };
}
