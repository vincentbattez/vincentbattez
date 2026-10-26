// Captures d'écran du site pour vérifier visuellement un changement d'UI.
// Usage : pnpm shot [chemins...] [-v mobile|laptop|desktop|WxH[@dpr]]... [--base url] [--reduced-motion]
// Défaut = rendu final des animations d'entrée ; --reduced-motion vérifie le mode
// réduit (sans le soulignement d'accent, gated `no-preference`).
// Prérequis (une fois par machine) : pnpm exec playwright install chromium-headless-shell
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "playwright";

const presets = {
  mobile: {
    viewport: { width: 393, height: 659 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  laptop: { viewport: { width: 1280, height: 720 } },
  desktop: { viewport: { width: 1440, height: 900 } },
};

const devtoolsSelector =
  "#nuxt-devtools-container, nuxt-devtools-inspect-panel, #vue-tracer-overlay";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    viewport: { type: "string", short: "v", multiple: true },
    base: { type: "string", short: "b" },
    out: { type: "string", short: "o", default: ".shots" },
    "reduced-motion": { type: "boolean", default: false },
  },
});

const base =
  values.base ?? process.env.SHOT_BASE_URL ?? "http://localhost:3000";
const paths = positionals.length ? positionals : ["/"];
const viewports = values.viewport ?? ["mobile", "desktop"];
const outDir = resolve(values.out);

function contextOptions(name) {
  if (presets[name]) return presets[name];
  const match = /^(\d+)x(\d+)(?:@(\d+(?:\.\d+)?))?$/.exec(name);
  if (!match) {
    throw new Error(
      `Viewport inconnu : ${name} (attendu ${Object.keys(presets).join("|")} ou WxH[@dpr])`,
    );
  }
  return {
    viewport: { width: Number(match[1]), height: Number(match[2]) },
    deviceScaleFactor: Number(match[3] ?? 1),
  };
}

// Attend la fin des animations d'entrée, puis annule les boucles infinies
// (flottement, pulse…) pour figer un rendu final déterministe.
// `cancel()` remplace `finished` par une promesse qui ne se résout jamais :
// on n'attend que les animations finies.
function settleAnimations() {
  const pending = [];
  for (const animation of document.getAnimations()) {
    if (animation.effect?.getTiming().iterations === Infinity) {
      animation.cancel();
    } else {
      pending.push(animation.finished.catch(() => {}));
    }
  }
  return Promise.all(pending);
}

const slug = (path) =>
  path.replace(/^\/+|\/+$/g, "").replace(/[^\w-]+/g, "_") || "index";

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const name of viewports) {
    const context = await browser.newContext({
      ...contextOptions(name),
      reducedMotion: values["reduced-motion"] ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    for (const path of paths) {
      await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(settleAnimations);
      await page.evaluate((selector) => {
        for (const element of document.querySelectorAll(selector)) {
          element.remove();
        }
      }, devtoolsSelector);
      for (const fullPage of [false, true]) {
        const file = `${outDir}/${slug(path)}-${name}-${fullPage ? "full" : "fold"}.png`;
        await page.screenshot({ path: file, fullPage });
        console.log(file);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
