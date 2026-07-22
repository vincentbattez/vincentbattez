<script setup lang="ts">
defineProps<{
  label: string;
  url: string;
  // Piloté par la page : passe à true à 1200 ms pour jouer le fade-out (300 ms) avant le replace() à 1500 ms — la redirection part juste après la sortie.
  exiting?: boolean;
}>();
</script>

<template>
  <div class="go-loader" :class="{ 'go-loader--exiting': exiting }">
    <div class="go-loader__card">
      <div
        class="go-loader__arc"
        role="progressbar"
        aria-label="Progression de la redirection"
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" />
        </svg>
        <div class="go-loader__flash" aria-hidden="true"></div>
        <div class="go-loader__medallion">
          <img
            src="/images/vincentbattez.webp"
            width="144"
            height="144"
            alt="Vincent Battez"
          />
        </div>
      </div>

      <p class="go-loader__brand">Vincent Battez</p>

      <p class="go-loader__label">
        Ouverture de {{ label
        }}<span class="go-loader__dots" aria-hidden="true">…</span>
      </p>

      <a class="go-loader__bypass" :href="url"> Continuer sans attendre </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.go-loader {
  @apply flex items-center justify-center flex-1;

  &--exiting {
    animation: go-loader-exit 300ms cubic-bezier(0.36, 0, 0.66, -0.4) forwards;
  }

  &__card {
    @apply flex flex-col items-center text-center px-md;
    animation: go-loader-enter 1640ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  &__arc {
    position: relative;
    display: grid;
    place-items: center;
    width: 124px;
    height: 124px;

    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      overflow: visible;
    }

    circle {
      fill: none;
      stroke: #f0910f;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 289;
      stroke-dashoffset: 289;
      animation: go-loader-arc 1200ms cubic-bezier(0.55, 0.055, 0.675, 0.19)
        forwards;
    }
  }

  &__flash {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(240, 145, 15, 0.55) 0%,
      rgba(240, 145, 15, 0) 70%
    );
    opacity: 0;
    pointer-events: none;
    // Se déclenche à la fin de l'arc (1200 ms).
    animation: go-loader-flash 520ms ease-out 1200ms both;
  }

  &__medallion {
    width: 96px;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
  }

  &__brand {
    @apply font-heading text-black mt-md;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.2;
  }

  &__label {
    @apply font-body text-grey-600 mt-xs;
    font-size: 1rem;
    font-weight: 700;
  }

  &__dots {
    display: inline-block;
    animation: go-loader-dots 1.4s steps(1, end) infinite;
    width: 1.1ch;
    text-align: left;
  }

  &__bypass {
    @apply font-body text-body-sm text-grey-600 mt-lg;
    text-decoration: none;
    letter-spacing: 0.01em;
    transition: color 160ms ease;

    &:hover {
      @apply text-primary;
    }
  }
}

@keyframes go-loader-enter {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes go-loader-exit {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(4px) scale(1.015);
  }
  100% {
    opacity: 0;
    transform: translateY(-16px) scale(0.94);
  }
}

@keyframes go-loader-arc {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes go-loader-flash {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  35% {
    opacity: 1;
    transform: scale(1.12);
  }
  100% {
    opacity: 0;
    transform: scale(1.28);
  }
}

@keyframes go-loader-dots {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  33% {
    clip-path: inset(0 66% 0 0);
  }
  66% {
    clip-path: inset(0 33% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}
</style>
