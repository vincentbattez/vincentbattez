// Récupère le prochain créneau réservable via la Netlify Function proxy.
// SSG : aucun créneau connu au build → fetch côté client après montage.
// Dégrade vers rien : 204, erreur, ou réponse inattendue laissent `start` à null
// et la ligne ne s'affiche jamais (cf. ADR 0001).
export function useNextSlot() {
  const start = ref<string | null>(null);

  onMounted(async () => {
    try {
      const response = await fetch("/.netlify/functions/next-slot");
      if (response.status !== 200) return;
      const data = (await response.json()) as { start?: unknown };
      if (typeof data.start === "string") start.value = data.start;
    } catch {
      // Rien à afficher.
    }
  });

  return { start };
}
