// Carrousel horizontal à défilement infini.
// Auto-défilement + manuel (molette, glisser tactile/souris) pilotés par
// translate3d (composité GPU) : pas de scroll natif, donc ni saccade, ni saut
// de boucle, ni layout shift. Le contenu doit être dupliqué (>= 2 copies) pour
// que le wrap par modulo reste invisible.

import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

interface UseInfiniteMarqueeOptions {
  // Nombre d'éléments composant une copie (la période à répéter).
  itemsPerPeriod: MaybeRefOrGetter<number>;
  // Durée pour parcourir une copie, en secondes.
  secondsPerPeriod?: number;
  // Délai avant reprise de l'auto-défilement après une interaction, en ms.
  resumeDelay?: number;
}

interface UseInfiniteMarqueeReturn {
  containerRef: Ref<HTMLElement | null>;
  listRef: Ref<HTMLElement | null>;
  // À binder sur le conteneur via `v-on`.
  events: Record<string, (e: PointerEvent & WheelEvent) => void>;
}

export function useInfiniteMarquee(
  options: UseInfiniteMarqueeOptions,
): UseInfiniteMarqueeReturn {
  const { itemsPerPeriod, secondsPerPeriod = 30, resumeDelay = 600 } = options;

  const containerRef = ref<HTMLElement | null>(null);
  const listRef = ref<HTMLElement | null>(null);

  let offset = 0; // px ; le contenu est translaté de -offset
  let period = 0; // largeur d'une copie + son gap
  let rafId = 0;
  let lastTime = 0;
  let paused = false;
  let resumeTimeout: ReturnType<typeof setTimeout> | undefined;

  // Période réelle mesurée via offsetLeft (intègre largeurs ET gaps flex, à la
  // différence de scrollWidth/n qui laisserait un micro-saut de gap au wrap).
  function measurePeriod() {
    const list = listRef.value;
    if (!list) return;
    const first = list.children[0] as HTMLElement | undefined;
    const next = list.children[toValue(itemsPerPeriod)] as
      HTMLElement | undefined;
    if (first && next) period = next.offsetLeft - first.offsetLeft;
  }

  function apply() {
    if (period > 0) offset = ((offset % period) + period) % period;
    if (listRef.value)
      listRef.value.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  function tick(time: number) {
    if (!paused && period > 0) {
      const dt = lastTime ? (time - lastTime) / 1000 : 0;
      offset -= (period / secondsPerPeriod) * dt; // sens gauche→droite
      apply();
    }
    lastTime = time;
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    paused = true;
  }
  function resume() {
    paused = false;
  }
  function resumeSoon() {
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(resume, resumeDelay);
  }

  // Molette verticale → défilement horizontal (boucle infinie : toujours du rab).
  function onWheel(e: WheelEvent) {
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (delta === 0) return;
    e.preventDefault();
    offset += delta;
    apply();
    pause();
    resumeSoon();
  }

  // Glisser (tactile / souris).
  let dragging = false;
  let lastX = 0;
  function onPointerDown(e: PointerEvent) {
    dragging = true;
    lastX = e.clientX;
    pause();
    containerRef.value?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    offset -= e.clientX - lastX;
    lastX = e.clientX;
    apply();
  }
  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    resumeSoon();
  }
  function onPointerEnter() {
    if (!dragging) pause();
  }
  function onPointerLeave() {
    if (!dragging) resumeSoon();
  }

  function remeasure() {
    measurePeriod();
    apply();
  }

  onMounted(() => {
    measurePeriod();
    apply();
    rafId = requestAnimationFrame(tick);
    // Les polices (@nuxt/fonts) chargent après le mount et changent les largeurs.
    document.fonts?.ready.then(remeasure);
    window.addEventListener("resize", remeasure);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId);
    clearTimeout(resumeTimeout);
    window.removeEventListener("resize", remeasure);
  });

  return {
    containerRef,
    listRef,
    events: {
      pointerenter: onPointerEnter,
      pointerleave: onPointerLeave,
      pointerdown: onPointerDown,
      pointermove: onPointerMove,
      pointerup: onPointerUp,
      pointercancel: onPointerUp,
      wheel: onWheel,
    } as UseInfiniteMarqueeReturn["events"],
  };
}
