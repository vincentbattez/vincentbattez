// Défilement piloté en translate3d, pas en scroll natif (ni saccade ni saut de
// boucle). Le contenu doit être dupliqué (>= 2 copies) pour masquer le wrap.

import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

interface UseInfiniteMarqueeOptions {
  itemsPerPeriod: MaybeRefOrGetter<number>;
  secondsPerPeriod?: number;
}

interface UseInfiniteMarqueeReturn {
  containerRef: Ref<HTMLElement | null>;
  listRef: Ref<HTMLElement | null>;
  events: Record<string, (e: PointerEvent & WheelEvent) => void>;
}

export function useInfiniteMarquee(
  options: UseInfiniteMarqueeOptions,
): UseInfiniteMarqueeReturn {
  const { itemsPerPeriod, secondsPerPeriod = 60 } = options;

  const containerRef = ref<HTMLElement | null>(null);
  const listRef = ref<HTMLElement | null>(null);

  let offset = 0;
  let period = 0;
  let rafId = 0;
  let lastTime = 0;
  let hovering = false;
  let dragging = false;

  // offsetLeft intègre largeurs ET gaps flex, contrairement à scrollWidth/n.
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
    if (!hovering && !dragging && period > 0) {
      const dt = lastTime ? (time - lastTime) / 1000 : 0;
      offset += (period / secondsPerPeriod) * dt;
      apply();
    }
    lastTime = time;
    rafId = requestAnimationFrame(tick);
  }

  function onWheel(e: WheelEvent) {
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (delta === 0) return;
    e.preventDefault();
    offset += delta;
    apply();
  }

  let lastX = 0;
  function onPointerDown(e: PointerEvent) {
    dragging = true;
    lastX = e.clientX;
    containerRef.value?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    offset -= e.clientX - lastX;
    lastX = e.clientX;
    apply();
  }
  function onPointerUp() {
    dragging = false;
  }
  function onPointerEnter() {
    hovering = true;
  }
  function onPointerLeave() {
    hovering = false;
  }

  function remeasure() {
    measurePeriod();
    apply();
  }

  onMounted(() => {
    measurePeriod();
    apply();
    rafId = requestAnimationFrame(tick);
    // Les polices chargent après le mount et changent les largeurs.
    document.fonts?.ready.then(remeasure);
    window.addEventListener("resize", remeasure);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId);
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
