<script setup lang="ts">
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";
import VbH2 from "~/ui/components/typography/h1/VbH2.vue";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbNavbar from "~/components/footer/VbNavbar.vue";

// SEO page d'accueil : mots-clés IA/Full Stack ciblant le marché français.
// Le titre est absolu (titleTemplate désactivé) car il contient déjà la marque,
// ce qui évite le doublon avec le template global défini dans nuxt.config.
useSeoMeta({
  title: "Vincent Battez - IA Engineer & Développeur Full Stack Sénior",
  description:
    "IA Engineer et Développeur Full Stack Sénior à Lille. Expert RAG (Retrieval-Augmented Generation), LLMs et Context Engineering. J'accompagne entreprises et CTOs dans l'intégration de l'intelligence artificielle et le développement d'applications Full Stack robustes (Node.js, React, Vue.js).",
  keywords:
    "IA Engineer, Développeur Full Stack, Expert RAG, Spécialiste LLM, Context Engineering, Prompt Engineering, Développeur IA freelance Lille, Consultant intelligence artificielle, Intégration IA entreprise, Architecture LLM",
});

useHead({
  titleTemplate: null,
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Nav -->
    <VbNavbar class="vb-container" />

    <!-- Content -->
    <div
      class="vb-container flex-1 flex flex-col lg:flex-row lg:items-center py-lg lg:py-0"
    >
      <!-- Content Section -->
      <div class="flex items-center justify-center flex-[2] lg:justify-start">
        <div class="lg:max-w-[30rem] mx-left lg:mx-0 text-center lg:text-left">
          <h1 class="h4 text-grey-200 uppercase mb-md">
            Développeur front-end freelance à lille
          </h1>
          <VbH2 class="mb-sm">Développeur Vue.js Sénior Freelance</VbH2>
          <p class="body-md mb-lg">
            Disponible dès maintenant pour
            <span class="font-extrabold">créer</span> ou
            <span class="font-extrabold">architecturer</span> un projet Vue 3
            avec passion
          </p>

          <!-- Buttons - Responsive Stack -->
          <div
            class="flex flex-col sm:flex-row gap-md justify-center lg:justify-start"
          >
            <!-- entretien -->
            <VbButton
              href="/go/entretien?s=pf"
              :type="vbButtonTypeEnum.primary"
              class="w-full sm:w-auto"
            >
              <VbIcon
                class="mr-sm"
                :size="vbButtonSizeEnum.lg"
                :name="VbIconEnum.VbCalendar"
              />
              Prendre rendez-vous
            </VbButton>

            <!-- CV -->
            <VbButton
              href="/go/cv?s=pf"
              :type="vbButtonTypeEnum.outline"
              class="w-full sm:w-auto"
            >
              Voir mon CV
            </VbButton>
          </div>
        </div>
      </div>

      <!-- Image Section -->
      <div class="flex-1 lg:flex-[1] order-1 lg:order-2 mb-lg lg:mb-0">
        <div class="flex justify-center">
          <img
            class="w-full max-w-[16rem] sm:max-w-[18rem] lg:max-w-[20rem]"
            src="~/assets/img/face.svg"
            alt="Portrait de Vincent Battez, développeur Vue.js freelance"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <VbFooter class="vb-container" />
  </div>
</template>
