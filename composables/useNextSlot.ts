// SSG : aucun créneau connu au build → fetch client après montage. Dégrade vers
// rien (204, erreur, réponse inattendue → `start` null). Cf. ADR 0001.
export function useNextSlot() {
  const start = ref<string | null>(null);

  onMounted(async () => {
    try {
      const response = await fetch("/.netlify/functions/next-slot");
      if (response.status !== 200) return;
      const data = (await response.json()) as { start?: unknown };
      if (typeof data.start === "string") start.value = data.start;
    } catch {
      // Dégrade vers rien.
    }
  });

  return { start };
}
