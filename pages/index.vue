<script setup lang="ts">
import { vbButtonTypeEnum } from "~/ui/components/forms/VbButton.type";
import { vbButtonSizeEnum } from "~/ui/components/icon/VbIcon.type";
import { VbIconEnum } from "~/types/vb-icon";
import VbH2 from "~/ui/components/typography/h1/VbH2.vue";
import VbIcon from "~/ui/components/icon/VbIcon.vue";
import VbFooter from "~/components/footer/VbFooter.vue";
import VbButton from "~/ui/components/forms/VbButton.vue";
import VbNavbar from "~/components/footer/VbNavbar.vue";

const route = useRoute();
</script>

<template>
  <div>
    <!-- Nav -->
    <VbNavbar class="vb-container" />
    <!-- Content -->
    <div class="vb-container flex items-center flex-1">
      <!-- Start -->
      <div class="flex-[2]">
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
            <!-- entretien -->
            <VbButton
              href="/go/entretien?s=pf"
              :type="vbButtonTypeEnum.primary"
              class="mr-md"
            >
              <VbIcon
                class="mr-sm"
                :size="vbButtonSizeEnum.lg"
                :name="VbIconEnum.VbCalendar"
              />
              Prendre rendez-vous
            </VbButton>

            <!-- CV -->
            <VbButton href="/go/cv?s=pf" :type="vbButtonTypeEnum.secondary">
              Voir mon CV
            </VbButton>
          </div>
        </div>
      </div>

      <!-- End -->
      <div class="flex-[1]">
        <img class="w-full max-w-[20rem]" src="~/assets/img/face.svg" alt="" />
      </div>
    </div>

    <!-- Footer -->
    <VbFooter class="vb-container" />
  </div>
</template>
