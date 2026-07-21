<script setup lang="ts">
import {
  getRedirectLabel,
  lookupTable,
  sendIOSNotification,
} from "~/utils/redirect";
import GoRedirectLoader from "~/components/GoRedirectLoader.vue";

const route = useRoute();

// const source = route.query.s;
const redirectId = String(route.params.id);
const redirectURL =
  lookupTable.redirectId[redirectId as keyof typeof lookupTable.redirectId] ||
  "/";
const redirectLabel = getRedirectLabel(redirectId);

// SEO pages de redirection.
// La redirection est côté CLIENT (cf. onMounted plus bas) : le SSR renvoie un
// 200 avec l'écran « Redirection en cours… » pour que les crawlers sociaux
// lisent les balises (og:image, etc.) avant de suivre le lien externe.
// - noindex : on ne veut pas indexer ces endpoints (useRobotsRule pose le meta
//   ET l'en-tête X-Robots-Tag).
// - canonical : pointe vers le portfolio principal pour éviter le duplicate content.
useRobotsRule("noindex, nofollow");

const siteConfig = useSiteConfig();
useHead({
  link: [{ rel: "canonical", href: `${siteConfig.url}/` }],
});

// OG image statique dédiée à chaque redirection : public/og/go-<id>.png
// (fournie manuellement). Override le défaut global posé dans app.vue.
const ogImageUrl = `${siteConfig.url}/og/go-${redirectId}.png`;
useSeoMeta({
  ogImage: ogImageUrl,
  twitterImage: ogImageUrl,
});

// 📲 Notification iOS : côté serveur uniquement. Le token Pushover est une
// variable d'env serveur (indisponible côté client), et le SSR s'exécute déjà
// à chaque requête réelle. import.meta.server évite un double appel à
// l'hydratation.
if (import.meta.server) {
  sendIOSNotification(redirectId, redirectURL);
}

// ➡️ Redirect to UTM url
// if (source) {
//   console.log("✅ route()", route);
//   injectUtmSourceInUrl(source);
// }

// ✅ Redirection vers l'URL externe, côté client (après hydratation) pour
// préserver le rendu 200 lisible par les crawlers.
// `replace()` (et non `href = …`) remplace l'entrée /go dans l'historique au
// lieu d'en créer une nouvelle : le retour arrière ramène ainsi à la page
// précédant /go plutôt que de re-déclencher la redirection.
//
// Délai fixe de 2 s pour laisser exister l'écran de transition premium. Le
// fade-out de sortie (rebond, 280 ms) est armé vers 1720 ms et doit se terminer
// AVANT le replace() à 2000 ms : on anime puis on redirige, jamais l'inverse.
const isExiting = ref(false);
onMounted(() => {
  const exitTimer = setTimeout(() => (isExiting.value = true), 1720);
  const redirectTimer = setTimeout(
    () => window.location.replace(redirectURL),
    2000,
  );
  onBeforeUnmount(() => {
    clearTimeout(exitTimer);
    clearTimeout(redirectTimer);
  });
});
</script>

<template>
  <div class="vb-container flex flex-1">
    <GoRedirectLoader
      :label="redirectLabel"
      :url="redirectURL"
      :exiting="isExiting"
    />
  </div>
</template>
