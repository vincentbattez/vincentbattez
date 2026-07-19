import { definePerson } from "nuxt-schema-org/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/seo", "@nuxt/eslint"],

  // Site configuration for SEO modules
  site: {
    url: "https://vincentbattez.dev",
    name: "Vincent Battez - AI Engineer & Full Stack Developer",
    description:
      "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle à Lille, France.",
    defaultLocale: "fr",
    identity: {
      type: "Person",
    },
    twitter: "@vincentbattez",
    language: "fr-FR",
  },

  // Open Graph configuration
  ogImage: {
    enabled: true,
    defaults: {
      component: "OgImageBasic",
      props: {
        title: "Vincent Battez - AI Engineer & Full Stack Developer",
        description:
          "Expert RAG, LLMs, Node.js, React - Développeur IA à Lille",
        siteName: "Vincent Battez Portfolio",
      },
    },
  },

  // Global SEO defaults
  app: {
    head: {
      htmlAttrs: {
        lang: "fr-FR",
      },
      titleTemplate: "%s | Vincent Battez - AI Engineer & Full Stack Developer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle à Lille, France.",
        },
        {
          name: "keywords",
          content:
            "IA Engineer, Développeur Full Stack, Expert RAG, LLM, Context Engineering, Prompt Engineering, Intelligence Artificielle, Lille, France",
        },
        { name: "author", content: "Vincent Battez" },
        { name: "robots", content: "index, follow" },
        { name: "language", content: "French" },
        { name: "geo.region", content: "FR-59" },
        { name: "geo.placename", content: "Lille" },
        { name: "geo.position", content: "50.6292;3.0573" },
        { name: "ICBM", content: "50.6292, 3.0573" },
        // Open Graph meta tags
        {
          property: "og:title",
          content:
            "Vincent Battez - AI Engineer & Full Stack Developer | Expert RAG, LLMs, Node.js",
        },
        {
          property: "og:description",
          content:
            "Développeur Full Stack spécialisé en IA : Expert RAG (Retrieval-Augmented Generation), LLMs, Context Engineering. Technologies : Node.js, React, observabilité. Services IA à Lille, France.",
        },
        { property: "og:type", content: "profile" },
        { property: "og:locale", content: "fr_FR" },
        { property: "og:url", content: "https://vincentbattez.dev" },
        {
          property: "og:site_name",
          content: "Vincent Battez - AI Engineer Portfolio",
        },
      ],
    },
  },

  // SEO module configuration
  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  // Schema.org structured data configuration
  schemaOrg: {
    identity: definePerson({
      type: "Person",
      name: "Vincent Battez",
      url: "https://vincentbattez.dev",
      image: "https://vincentbattez.dev/vincent-battez-photo.jpg",
      description:
        "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle.",
      jobTitle: "AI Engineer & Full Stack Developer",
      email: "contact@vincentbattez.dev",
      sameAs: [
        "https://www.linkedin.com/in/vincentbattez",
        "https://github.com/vincentbattez",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Freelance",
      },
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
        occupationLocation: {
          "@type": "City",
          name: "Lille, France",
        },
        skills: [
          "Artificial Intelligence Development",
          "RAG Implementation",
          "LLM Integration",
          "Full Stack Development",
          "Software Architecture",
        ],
      },
    }),
    // Global schemas for professional services and local business
    global: [
      {
        "@type": "ProfessionalService",
        name: "Vincent Battez - Services IA & Développement",
        url: "https://vincentbattez.dev",
        description:
          "Services de conseil et développement en intelligence artificielle, spécialisé en RAG, LLMs et développement Full Stack.",
        provider: {
          "@type": "Person",
          name: "Vincent Battez",
        },
        areaServed: {
          "@type": "Country",
          name: "France",
        },
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
    ],
  },

  // Additional runtime configuration
  runtimeConfig: {
    public: {
      siteUrl: "https://vincentbattez.dev",
      siteName: "Vincent Battez - AI Engineer & Full Stack Developer",
      siteDescription:
        "Développeur Full Stack spécialisé en IA, expert RAG et LLMs. Services de conseil et développement en intelligence artificielle à Lille, France.",
      language: "fr-FR",
      author: {
        name: "Vincent Battez",
        email: "contact@vincentbattez.dev",
        url: "https://vincentbattez.dev",
      },
      location: {
        city: "Lille",
        country: "France",
      },
    },
  },
});
