<script setup lang="ts">
import {
  getRedirectLabel,
  getRedirectMeta,
  isDownloadRedirect,
  lookupTable,
  notifyCall,
} from "~/utils/redirect";
import { seo } from "~/config/seo";
import GoRedirectLoader from "~/components/GoRedirectLoader.vue";

const route = useRoute();
const { track } = useAnalytics();

const redirectId = String(route.params.id);
const redirectURL =
  lookupTable.redirectId[redirectId as keyof typeof lookupTable.redirectId] ||
  "/";
const redirectLabel = getRedirectLabel(redirectId);

useRobotsRule("noindex, nofollow");

const siteConfig = useSiteConfig();
useHead({
  link: [{ rel: "canonical", href: `${siteConfig.url}/` }],
});

const ogImageUrl = `${siteConfig.url}/og/go-${redirectId}.png`;
const meta = getRedirectMeta(redirectId);
const title = meta?.title ?? seo.title;
const description = meta?.description ?? seo.descriptionCard;
useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: ogImageUrl,
  twitterImage: ogImageUrl,
});

const isDownload = isDownloadRedirect(redirectId);
const isExiting = ref(false);
const isDone = ref(false);
onMounted(() => {
  track("outbound_link_opened", {
    destination: redirectId,
    source: typeof route.query.s === "string" ? route.query.s : "direct",
  });
  notifyCall(redirectId);

  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  // Téléchargement : la page reste affichée, pas de fondu de sortie.
  const exitTimer = isDownload
    ? undefined
    : setTimeout(() => (isExiting.value = true), 1500);
  const redirectTimer = setTimeout(() => {
    window.location.replace(redirectURL);
    if (!isDownload) {
      return;
    }
    // Délai : fermer avant la réponse annulerait le téléchargement. close()
    // n'agit que sur un onglet sans historique (lien target=_blank, QR code) ;
    // sinon le message de fin reste affiché.
    closeTimer = setTimeout(() => {
      isDone.value = true;
      window.close();
    }, 1000);
  }, 1500);
  onBeforeUnmount(() => {
    clearTimeout(exitTimer);
    clearTimeout(redirectTimer);
    clearTimeout(closeTimer);
  });
});
</script>

<template>
  <div class="vb-container flex flex-1">
    <GoRedirectLoader
      :label="redirectLabel"
      :url="redirectURL"
      :exiting="isExiting"
      :done="isDone"
    />
  </div>
</template>
