<script setup lang="ts">
// OG image par défaut (statique) : URL absolue requise par les crawlers sociaux.
const { url: siteUrlBase } = useSiteConfig();
useSeoMeta({
  ogImage: `${siteUrlBase}/og/default.png`,
  twitterImage: `${siteUrlBase}/og/default.png`,
});

// JSON-LD injecté à la main : sous-module schema-org désactivé (incompatible unhead 3).
const siteUrl = "https://vincentbattez.dev";
const schemaOrgGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Vincent Battez",
      url: siteUrl,
      image: `${siteUrl}/images/vincentbattez.webp`,
      description:
        "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture des applications web robustes (Node.js, React, Vue.js, TypeScript).",
      jobTitle: "Développeur Full-Stack Senior",
      email: "contact@vincentbattez.dev",
      sameAs: [
        "https://www.linkedin.com/in/vincentbattez",
        "https://github.com/vincentbattez",
      ],
      worksFor: { "@type": "Organization", name: "Freelance" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lille",
        addressRegion: "Hauts-de-France",
        addressCountry: "FR",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "RAG (Retrieval-Augmented Generation)",
        "Large Language Models",
        "Context Engineering",
        "Prompt Engineering",
        "Full Stack Development",
        "Node.js",
        "React",
        "Vue.js",
        "TypeScript",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Développeur Full-Stack Senior",
        occupationLocation: { "@type": "City", name: "Lille, France" },
        skills: [
          "Full Stack Development",
          "Software Architecture",
          "Node.js",
          "React",
          "Vue.js",
          "TypeScript",
        ],
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Vincent Battez - Développement Full-Stack Freelance",
      url: siteUrl,
      description:
        "Développeur Full-Stack Senior freelance : création et architecture d'applications web robustes (Node.js, React, Vue.js, TypeScript).",
      provider: { "@id": `${siteUrl}/#person` },
      areaServed: { "@type": "Country", name: "France" },
      serviceType: [
        "Développement Full Stack",
        "Développement Web",
        "Architecture Logicielle",
        "Développement Node.js",
        "Développement Front-end",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lille",
        addressCountry: "FR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Vincent Battez - Développeur Full-Stack Senior Freelance",
      inLanguage: "fr-FR",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(schemaOrgGraph),
    },
  ],
});
</script>

<template>
  <main class="page flex flex-col">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </main>
</template>

<style lang="scss">
@use "~/ui/styles/main.scss";

body {
  @apply bg-page;
}

.page {
  @apply min-h-screen;
}

// Transition de page globale (fondu séquentiel out-in, ~200 ms).
.page-enter-active,
.page-leave-active {
  transition: opacity 200ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
