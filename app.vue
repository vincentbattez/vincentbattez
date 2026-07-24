<script setup lang="ts">
// OG image par défaut (statique) : URL absolue requise par les crawlers sociaux.
const { url: siteUrlBase } = useSiteConfig();
const ogImageAlt =
  "Vincent Battez, Développeur Full-Stack Senior freelance à Lille";
useSeoMeta({
  ogImage: `${siteUrlBase}/og/default.png`,
  ogImageAlt,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: "image/png",
  twitterImage: `${siteUrlBase}/og/default.png`,
  twitterImageAlt: ogImageAlt,
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
        "Développeur Full-Stack Senior freelance à Lille. Je crée et j'architecture vos applications web robustes (Node.js, React, Vue.js, TypeScript).",
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
      founder: { "@id": `${siteUrl}/#person` },
      areaServed: { "@type": "Country", name: "France" },
      knowsAbout: [
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
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />

    <!-- Décor de fond hors carte : motifs géométriques dans les colonnes pêche
         (points à gauche, marque fantôme + hairlines à droite). Progressive
         enhancement ≥1440px, purement décoratif, masqué par la carte opaque. -->
    <div class="page-decor" aria-hidden="true">
      <div class="page-decor--dots"></div>
      <div class="page-decor--lines"></div>
      <span class="page-decor--mark">V</span>
    </div>

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

// Décor de fond hors carte. Fixé au viewport, derrière la carte (ordre DOM :
// la carte transformée peint au-dessus). Colonnes latérales exploitables
// seulement sur grand écran → activé ≥1440px. Chaque motif s'estompe pour
// laisser respirer les bords de la carte.
.page-decor {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  display: none;
}

@media (min-width: 1440px) {
  .page-decor {
    display: block;
  }
}

// Trame de points (gauche) : même grille 16px que dans la carte, en orange
// translucide sur le fond pêche. Dense près de la carte, estompée vers le bord.
.page-decor--dots {
  position: absolute;
  inset-block: 0;
  left: 0;
  width: calc(50vw - 560px);
  background: rgba(240, 145, 15, 0.35);
  --vb-dot: radial-gradient(circle at center, #000 1.3px, transparent 1.7px);
  --vb-fade: linear-gradient(to right, #000 0%, transparent 88%);
  -webkit-mask-image: var(--vb-dot), var(--vb-fade);
  mask-image: var(--vb-dot), var(--vb-fade);
  -webkit-mask-size:
    16px 16px,
    cover;
  mask-size:
    16px 16px,
    cover;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

// Hairlines diagonales « blueprint » (droite), très discrètes, plus marquées
// vers le bord du viewport.
.page-decor--lines {
  position: absolute;
  inset-block: 0;
  right: 0;
  width: calc(50vw - 560px);
  background: repeating-linear-gradient(
    -45deg,
    rgba(240, 145, 15, 0.35) 0 1px,
    transparent 1px 22px
  );
  -webkit-mask-image: linear-gradient(to right, transparent 12%, #000 100%);
  mask-image: linear-gradient(to right, transparent 12%, #000 100%);
}

// Marque fantôme « Vb » (slab serif) coupée par le bord droit : signature
// éditoriale en très bas contraste. Le centre est masqué par la carte opaque,
// seul le fragment de la colonne pêche droite reste visible.
.page-decor--mark {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(38%, -50%);
  font-family: "Zilla Slab", serif;
  font-weight: 700;
  font-size: clamp(28rem, 44vw, 58rem);
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: rgba(159, 86, 12, 0.07);
  user-select: none;
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

// Respecte la préférence système « réduire les animations » (WCAG 2.3.3).
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
