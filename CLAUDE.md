## Agent skills

### The product
Read the `/docs/product.md` to understand the product and its context.

### Issue tracker

Issues tracked in GitHub Issues (`vincentbattez/vincentbattez`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Design

Système verrouillé dans `DESIGN.md`. `ui/styles/tokens.css` est la **seule**
source des valeurs (couleurs, polices, tailles, espacements, rayons) :
`tailwind.config.mjs` et `nuxt.config.ts` la lisent via `ui/styles/tokens.mjs`,
n'y recopier aucune valeur. Toute nouvelle UI passe par les rôles ; la section
`## Debt` liste ce que les pages actuelles enfreignent encore.

### Déploiement

La prod est un **site statique généré par Nuxt (SSG)** : `nuxt generate` → `dist`, déployé sur Netlify. **Pas de serveur au runtime.**

### Dev local

`pnpm dev` (port 3000) ne sert **ni les Netlify Functions ni les redirects de
`netlify.toml`** : `/api/recommendation` et `/.netlify/functions/*` répondent
404. Pour ces routes, lancer `pnpm dev:netlify` (port 8888) — en ayant arrêté
`pnpm dev` avant, sinon le lock du dev server Nuxt fait échouer le démarrage.

Vérif visuelle : `pnpm shot [chemins] [-v mobile|laptop|desktop|WxH]` (dev server
lancé) écrit fold + full-page dans `.shots/` — en-tête de `scripts/shot.mjs`.
