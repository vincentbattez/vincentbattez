<template>
  <main class="page flex flex-col">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </main>
</template>

<style lang="scss">
@use "~/ui/styles/main.scss";

body {
  background: linear-gradient(180deg, #ffffff 0%, #f3f2ef 100%);
}

.page {
  @apply min-h-screen;
}
</style>
