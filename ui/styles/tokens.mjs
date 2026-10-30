// Lit le premier bloc :root de tokens.css, l'unique source des valeurs de
// design, pour que la config Tailwind et Nuxt en dérivent au lieu de les copier.
import { readFileSync } from "node:fs";

const css = readFileSync(
  new URL("./tokens.css", import.meta.url),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");
const root = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
const declared = Object.fromEntries(
  [...root.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);

/** Valeur de `--<name>`, ses var() résolus ; échoue si le token n'existe pas. */
export function token(name) {
  const value = declared[name];
  if (value === undefined) {
    throw new Error(`ui/styles/tokens.css : --${name} n'est pas déclaré`);
  }
  return value.replace(/var\(--([\w-]+)\)/g, (_, ref) => token(ref));
}

/** Les tokens `--<prefix>-<suffixe>`, indexés par suffixe. */
export function tokens(prefix) {
  return Object.fromEntries(
    Object.keys(declared)
      .filter((name) => name.startsWith(`${prefix}-`))
      .map((name) => [name.slice(prefix.length + 1), token(name)]),
  );
}

/** Première famille d'une pile `--font-*` : `"Zilla Slab", serif` → `Zilla Slab`. */
export function fontFamily(name) {
  return token(name)
    .split(",")[0]
    .trim()
    .replace(/^["']|["']$/g, "");
}
