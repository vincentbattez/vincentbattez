<template>
  <main class="page">
    <!-- Nav -->
    <!-- Content -->
    <div class="vb-container flex h-screen items-center">
      <!-- Start -->
      <div class="flex-[3]">
        <div class="max-w-[30rem]">
          <h1 class="h4 text-grey-200 uppercase mb-md">
            Développeur front-end freelance à lille
          </h1>
          <VbH2 class="mb-sm">Développeur Vue.js Sénior Freelance</VbH2>
          <p class="body-md">
            Disponible dès maintenant pour
            <span class="font-extrabold">créer</span> ou
            <span class="font-extrabold">architecturer</span> un projet Vue 3
            avec passion
          </p>
          <div class="flex mt-md">
            <VbButton type="primary" class="mr-md"
              >Prendre rendez-vous</VbButton
            >
            <VbButton type="secondary">Voir mon CV</VbButton>
          </div>
        </div>
      </div>

      <!-- End -->
      <div class="flex-[1]">
        <img src="~/assets/img/face.svg" alt="" />
      </div>
    </div>

    <!-- Footer -->
    <VbFooter />
  </main>
</template>

<script setup lang="ts">
import VbH2 from "~/ui/components/typography/h1/VbH2.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
</script>

<style lang="scss">
@use "~/ui/styles/main.scss";

body {
  background: linear-gradient(180deg, #ffffff 0%, #f3f2ef 100%);
}

.page {
  @apply min-h-screen;
}
</style>
