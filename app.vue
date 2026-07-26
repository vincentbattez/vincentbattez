<script setup lang="ts">
import { seo } from "~/config/seo";

// OG image par défaut (statique) : URL absolue requise par les crawlers sociaux.
const ogImageUrl = `${seo.siteUrl}${seo.ogImage.path}`;
useSeoMeta({
  ogImage: ogImageUrl,
  ogImageAlt: seo.ogImage.alt,
  ogImageWidth: seo.ogImage.width,
  ogImageHeight: seo.ogImage.height,
  ogImageType: seo.ogImage.type,
  twitterImage: ogImageUrl,
  twitterImageAlt: seo.ogImage.alt,
});

// JSON-LD injecté à la main : sous-module schema-org désactivé (incompatible unhead 3).
const siteUrl = seo.siteUrl;
const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;
const webpageId = `${siteUrl}/#webpage`;
const serviceId = `${siteUrl}/#service`;
const portraitId = `${siteUrl}/#portrait`;

const schemaOrgGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: seo.author.name,
      givenName: seo.author.givenName,
      familyName: seo.author.familyName,
      url: siteUrl,
      image: { "@id": portraitId },
      description: seo.schema.personDescription,
      jobTitle: seo.jobTitle,
      email: seo.author.email,
      knowsLanguage: seo.knowsLanguage,
      sameAs: [seo.social.linkedin, seo.social.github],
      mainEntityOfPage: { "@id": webpageId },
      worksFor: { "@type": "Organization", name: seo.employment.label },
      address: {
        "@type": "PostalAddress",
        addressLocality: seo.location.city,
        addressRegion: seo.location.region,
        addressCountry: seo.location.countryCode,
      },
      knowsAbout: seo.schema.personKnowsAbout,
      hasOccupation: {
        "@type": "Occupation",
        name: seo.jobTitle,
        occupationLocation: {
          "@type": "City",
          name: `${seo.location.city}, ${seo.location.country}`,
        },
        skills: seo.schema.occupationSkills,
      },
    },
    {
      "@type": "ImageObject",
      "@id": portraitId,
      url: `${siteUrl}${seo.portrait}`,
      contentUrl: `${siteUrl}${seo.portrait}`,
      caption: seo.author.name,
    },
    {
      "@type": "ProfessionalService",
      "@id": serviceId,
      name: seo.schema.serviceName,
      url: siteUrl,
      description: seo.schema.serviceDescription,
      founder: { "@id": personId },
      provider: { "@id": personId },
      areaServed: { "@type": "Country", name: seo.location.country },
      knowsAbout: seo.schema.serviceKnowsAbout,
      address: {
        "@type": "PostalAddress",
        addressLocality: seo.location.city,
        addressRegion: seo.location.region,
        addressCountry: seo.location.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: seo.location.latitude,
        longitude: seo.location.longitude,
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: seo.name,
      description: seo.descriptionMeta,
      inLanguage: seo.language,
      publisher: { "@id": personId },
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: seo.siteUrlWithSlash,
      name: seo.title,
      description: seo.descriptionMeta,
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
      primaryImageOfPage: { "@id": portraitId },
      inLanguage: seo.language,
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
