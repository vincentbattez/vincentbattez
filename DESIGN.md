# Design: vincentbattez.dev

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: editorial (inferred from the shipped site: a personal portfolio, French, warm and confident)
- Shape of the first page: kept (index: a framed hero card, headline and lead beside a portrait medallion, a skills marquee at its foot)
- Theme: brand (vincentbattez.dev, values read from `tailwind.config.mjs`, never from memory)
- Axes: light/slab-serif/warm · posture: full-palette
- Roles: field `--color-field` (the peach page) · paper `--color-paper` (the white card) · signal `--color-accent` (blue: every action) · seal `--color-accent-2` (orange: the brand, the highlighted head word, the portrait ring) · ink `--color-ink`
- Copy: verbatim. The site's wording is fixed input (hero lead, tooltips, punctuation, apparent typos included); a redesign stamps `copy: verbatim` and proposes wording changes separately.

## Tokens
`ui/styles/tokens.css` is the single source of truth: the only file that holds a design value. It is loaded globally by `nuxt.config.ts` (`css`), and `tailwind.config.mjs` and `nuxt.config.ts` read it at load time through `ui/styles/tokens.mjs` (`token("color-ink")`), so no value is copied anywhere else. Restart the dev server after editing it.
- Two layers: `--palette-*` (the raw brand scales, which the shipped pages use as Tailwind classes: `bg-secondary`, `text-grey-600`) and the roles `--color-*`, `--font-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-card`, which point at the palette. New code uses the roles: `var(--color-ink)` in CSS, or the `theme.extend` utilities (`bg-paper`, `text-ink`, `bg-accent`, `text-accent-2-ink`, `font-display`, `rounded-card`, `shadow-card`).
- Roles to palette: field = page · paper = white · paper-2 = #fffaf1 · paper-3 = orange-100 · paper-veil = #fffdf8 (sticky zones over the paper gradient) · ink = black · ink-2 = grey-700 · ink-raised = #2c1c08 (top of dark surfaces) · muted = grey-600 · rule = grey-200 · accent = secondary (blue-500) · accent-glow = #3b82f6 (the availability halo) · accent-2 = primary (orange-500) · accent-2-ink = orange-700 · focus = blue-500. `orange-750` (#9f560c) is the warm shadow and watermark tint.
- Components never write a colour literal: in `<style>`, `theme("colors.primary")` or `theme("colors.primary / 35%")` (resolved at build, so the CSS stays literal); in templates, the Tailwind classes. The only `#000` left are `mask-image` channels, not colours.
- Space is the project's own scale under Hallmark names (`--space-xs` to `--space-3xl` = Tailwind `xs` to `xxxl`). Type: Zilla Slab for heads, served at 600 and 700 only (`font-extrabold` on display renders at 700), Nunito 400 to 800 for the body, upright only (no italic files are served). Container 1440px.

## Controls
- Primary (`VbButton type="primary"`): `--color-accent` fill, white label, 4px radius, `pt-sm pb-sm ps-md pe-md`, body-md 800, lifts 2px on hover, 4px focus outline
- Outline: 1px `--color-accent` border and label, same radius and padding · Soft: white, `--color-rule` border, `--color-muted` label
- Square icon button: 42px, 12px radius

## Motion
- Character: calm, with one choreographed entrance on the index (`--vb-at-*` cascade in `ui/styles/base/_motion.scss`); page transitions fade at 200ms. Under reduced motion everything ends at once (`app.vue`).

## Debt
Known Floor findings in the shipped pages, left as they are until a `/hallmark redesign <page> polish` or an explicit fix:
- White on `--color-accent` is 2.7:1, under AA for the primary label; `--color-accent` as text on white is 2.7:1 too. Blue-700 (`#1260b2`, 6.3:1) passes.
- `transition-all` in `VbButton.vue`, a tracked-capitals eyebrow and a status dot in the hero.

## Exports
`ui/styles/tokens.css` in this project, read into Tailwind v3 as literal values (palette, spacing, type, and the roles under `theme.extend`), so opacity modifiers and `theme()` work on every name. DTCG or shadcn blocks are added here on request.
