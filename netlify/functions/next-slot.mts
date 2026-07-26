// Prochain créneau réservable, exposé sous le bouton "Consulter mes disponibilités".
// Proxy server-to-server vers l'API privée d'Openings (Fantastical) : le fetch
// navigateur direct est bloqué (CORS limité à fantastical.app). cf. ADR 0001.
//
// Best-effort et dégrade vers rien : toute erreur / absence de créneau => 204.
// Le client n'affiche la ligne que s'il reçoit un `start`. On ne montre jamais
// de créneau faux.

const API_BASE = "https://api.flexibits.com/v1";
const SLUG = "vincentbattez/entretien";
const DURATION = "P0DT00H30M00S"; // 30 min — durée réaliste d'un premier échange.
const BOOKAHEAD_DAYS = 15; // Fenêtre réservable côté Openings.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min : protège l'amont sans afficher un créneau périmé.
const UPSTREAM_TIMEOUT_MS = 4000;

type CacheEntry = { start: string | null; expiresAt: number };
let cache: CacheEntry | null = null;

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`upstream ${response.status}`);
  return response.json();
}

// Résout l'uuid de l'engagement depuis le slug : auto-adaptatif si l'engagement
// est recréé (l'uuid change, pas le slug).
async function resolveUuid(): Promise<string> {
  const data = await fetchJson(`${API_BASE}/openings/engagement/slug/${SLUG}`);
  const uuid = (data as { uuid?: unknown }).uuid;
  if (typeof uuid !== "string") throw new Error("uuid manquant");
  return uuid;
}

async function fetchFirstSlot(uuid: string): Promise<string | null> {
  const now = new Date();
  const end = new Date(now.getTime() + BOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    range_start: now.toISOString(),
    range_end: end.toISOString(),
    duration: DURATION,
  });
  const data = await fetchJson(
    `${API_BASE}/openings/engagement/${uuid}/availability?${params}`,
  );
  const slots = (data as { slots?: unknown }).slots;
  if (!Array.isArray(slots) || slots.length === 0) return null;
  const start = (slots[0] as { start?: unknown }).start;
  return typeof start === "string" ? start : null;
}

async function computeNextSlot(): Promise<string | null> {
  const uuid = await resolveUuid();
  return fetchFirstSlot(uuid);
}

export default async (): Promise<Response> => {
  if (cache && cache.expiresAt > Date.now()) {
    return respond(cache.start);
  }

  try {
    const start = await computeNextSlot();
    cache = { start, expiresAt: Date.now() + CACHE_TTL_MS };
    return respond(start);
  } catch {
    // Dégrade vers rien : on ne cache pas l'échec pour retenter au prochain hit.
    return new Response(null, { status: 204 });
  }
};

function respond(start: string | null): Response {
  if (!start) return new Response(null, { status: 204 });
  return new Response(JSON.stringify({ start }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
}
