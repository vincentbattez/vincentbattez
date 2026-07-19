<script setup lang="ts">
import { lookupTable, sendIOSNotification } from "~/utils/redirect";

const route = useRoute();

// const source = route.query.s;
const redirectId = String(route.params.id);
const redirectURL =
  lookupTable.redirectId[redirectId as keyof typeof lookupTable.redirectId] ||
  "/";

// SEO pages de redirection : à placer AVANT navigateTo, qui émet le 302 et
// interrompt le setup en SSR (tout ce qui suit serait ignoré).
// - noindex : useRobotsRule pose le meta ET l'en-tête X-Robots-Tag, seul signal
//   robots visible par un crawler sur une redirection 302.
// - canonical : pointe vers le portfolio principal pour éviter le duplicate content.
useRobotsRule("noindex, nofollow");

const siteConfig = useSiteConfig();
useHead({
  link: [{ rel: "canonical", href: `${siteConfig.url}/` }],
});

// 📲 Send iOS notification
sendIOSNotification(redirectId, redirectURL);

// ➡️ Redirect to UTM url
// if (source) {
//   console.log("✅ route()", route);
//   injectUtmSourceInUrl(source);
// }

// ✅ Redirect to external URL
await navigateTo(redirectURL, {
  external: true,
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
