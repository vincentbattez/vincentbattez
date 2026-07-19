<script setup lang="ts">
// OG image par défaut, appliquée à toutes les pages (og-image v6)
defineOgImage("NuxtSeo.satori", {
  title: "Vincent Battez - AI Engineer & Full Stack Developer",
  description: "Expert RAG, LLMs, Node.js, React - Développeur IA à Lille",
});

// Données structurées Schema.org (JSON-LD) injectées manuellement.
// Le sous-module @nuxtjs/seo schema-org est désactivé (incompatible unhead 3.x / Nuxt 4.5),
// on émet donc un graphe brut via useHead, ce qui contourne le plugin cassé.
const siteUrl = "https://vincentbattez.dev";
const schemaOrgGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Vincent Battez",
      url: siteUrl,
      image: `${siteUrl}/vincent-battez-photo.jpg`,
      description:
        "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle.",
      jobTitle: "AI Engineer & Full Stack Developer",
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
        name: "AI Engineer",
        occupationLocation: { "@type": "City", name: "Lille, France" },
        skills: [
          "Artificial Intelligence Development",
          "RAG Implementation",
          "LLM Integration",
          "Full Stack Development",
          "Software Architecture",
        ],
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Vincent Battez - Services IA & Développement",
      url: siteUrl,
      description:
        "Services de conseil et développement en intelligence artificielle, spécialisé en RAG, LLMs et développement Full Stack.",
      provider: { "@id": `${siteUrl}/#person` },
      areaServed: { "@type": "Country", name: "France" },
      serviceType: [
        "Conseil en Intelligence Artificielle",
        "Développement RAG",
        "Intégration LLM",
        "Développement Full Stack",
        "Architecture Logicielle",
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
      name: "Vincent Battez - AI Engineer & Full Stack Developer",
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
  background: linear-gradient(180deg, #ffffff 0%, #f3f2ef 100%);
}

.page {
  @apply min-h-screen;
}
</style>
