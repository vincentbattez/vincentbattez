<script setup lang="ts">
import { lookupTable, sendIOSNotification } from "~/utils/redirect";

const route = useRoute();

// const source = route.query.s;
const redirectId = route.params.id;
const redirectURL = lookupTable.redirectId[redirectId] || "/";

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
