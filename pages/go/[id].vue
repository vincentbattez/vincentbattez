<script setup lang="ts">
import {
  getRedirectLabel,
  lookupTable,
  sendIOSNotification,
} from "~/utils/redirect";
import GoRedirectLoader from "~/components/GoRedirectLoader.vue";

const route = useRoute();

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
useSeoMeta({
  ogImage: ogImageUrl,
  twitterImage: ogImageUrl,
});

if (import.meta.server) {
  sendIOSNotification(redirectId, redirectURL);
}

const isExiting = ref(false);
onMounted(() => {
  const exitTimer = setTimeout(() => (isExiting.value = true), 750);
  const redirectTimer = setTimeout(
    () => window.location.replace(redirectURL),
    800,
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
