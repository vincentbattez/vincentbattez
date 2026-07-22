## Agent skills

### The product
Read the `/docs/product.md` to understand the product and its context.

### Issue tracker

Issues tracked in GitHub Issues (`vincentbattez/vincentbattez`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Déploiement

La prod est un **site statique généré par Nuxt (SSG)** : `nuxt generate` → `dist`, déployé sur Netlify. **Pas de serveur au runtime.** Le code sous `import.meta.server` s'exécute au build, pas à chaque visite. Pour de la logique par-requête, utiliser une **Netlify Function** (`netlify/functions/`).
