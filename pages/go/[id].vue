<script setup lang="ts">
import { resolveRedirectURL, sendIOSNotification } from "~/utils/redirect";

const route = useRoute();
const config = useRuntimeConfig();

// const source = route.query.s;
const redirectId = String(route.params.id);
const redirectURL = resolveRedirectURL(redirectId, {
  cvLink: config.public.cvLink,
  callLink: config.public.callLink,
});

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
onMounted(() => {
  window.location.replace(redirectURL);
});
</script>

<template>
  <div class="vb-container flex items-center justify-center flex-1">
    <div class="text-center">
      <p class="mb-sm">⏳ Redirection en cours...</p>
      <a
        class="text-body-sm text-grey-100"
        :href="redirectURL"
        rel="noopener noreferrer"
      >
        {{ redirectURL }}
      </a>
    </div>
  </div>
</template>
