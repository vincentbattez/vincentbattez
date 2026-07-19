# Rapport de validation SEO — Tâche 8

_Généré le 2026-07-19 · branche `seo-v2` · validation via `nuxt dev` + inspection du HTML/headers rendus._

La validation se sépare en deux buckets :

- **Bucket A — vérifiable localement** (rendu des balises, JSON-LD, robots/sitemap/canonical, couverture mots-clés/géo). ✅ Fait ici.
- **Bucket B — nécessite le site déployé + soumission manuelle** (Google Rich Results Test, Facebook Sharing Debugger, Twitter Card Validator). ⏳ À faire par Vincent **après déploiement**. Ces cases ne sont PAS cochées.

> ⚠️ Rappel : `seo-v2` n'est pas mergée sur `master`. Tester les validateurs externes contre `vincentbattez.dev` (prod) validerait du contenu obsolète — attendre le déploiement de cette branche.

---

## 🚧 BLOQUANT — Images OG absentes du dépôt

`public/og/` ne contient que `README.md`. Aucune image livrée :

| Balise / fichier attendu            | Statut HTTP (dev) |
| ----------------------------------- | ----------------- |
| `/og/default.png`                   | **404**           |
| `/og/go-entretien.png` (et autres `go-*`) | **404**     |
| `/og/vincent-battez-photo.jpg`      | **404**           |

Conséquence : tous les `og:image` / `twitter:image` et le `Person.image` du JSON-LD
pointent vers un 404 → **aperçus de partage cassés** (LinkedIn/Twitter) et
**échec de Requirement 2**. La tâche 7 est marquée `[x]` mais son livrable (les
images) n'est pas dans le dépôt.

**Action requise avant de valider 8.1 :** déposer les fichiers listés dans
`public/og/README.md` (1200×630 px).

---

## 8.1 — Structured data & meta tags (bucket A)

Page d'accueil `/` :

| Vérification                                  | Résultat |
| --------------------------------------------- | -------- |
| `<title>` absolu (pas de doublon `%s \| …`)   | ✅ `Vincent Battez - IA Engineer & Développeur Full Stack Sénior` |
| `<html lang>`                                 | ⚠️ rend `fr` (config `htmlAttrs.lang: "fr-FR"` écrasée par site-config `defaultLocale: fr`) — cosmétique |
| `description`, `keywords`, `author`           | ✅ présents, ciblés IA/FR |
| `og:title` / `og:description`                 | ✅ |
| `og:type=profile`, `og:locale=fr_FR`, `og:url`, `og:site_name` | ✅ |
| `twitter:card=summary_large_image`, title/description/site/creator | ✅ |
| `geo.region=FR-59`, `geo.placename=Lille`, `geo.position` | ✅ |
| `<link rel=canonical>` → `https://vincentbattez.dev/` | ✅ |
| JSON-LD injecté et **parse** correctement      | ✅ `@graph` = `[Person, ProfessionalService, WebSite]` |
| `og:image` / `twitter:image` **résolvent**    | ❌ 404 (voir blocker) |

Pages `/go/[id]` (testé sur `/go/entretien`, sûr — la notif iOS ne se déclenche que pour `/go/call`) :

| Vérification                     | Résultat |
| -------------------------------- | -------- |
| Réponse SSR                      | ✅ `200 OK` (interstitiel lisible par crawlers) |
| Header `X-Robots-Tag`            | ✅ `noindex, nofollow` |
| `<meta name=robots>`             | ✅ `noindex, nofollow` |
| `<link rel=canonical>` → `/`     | ✅ |
| `og:image` override par redirect | ✅ pointe vers `/og/go-entretien.png` (mais 404, voir blocker) |

**Restant (bucket B, après déploiement) :** Rich Results Test, Facebook Sharing
Debugger, Twitter Card Validator.

---

## 8.2 — Search engine optimization (bucket A)

| Vérification                                       | Résultat |
| ------------------------------------------------- | -------- |
| Mots-clés FR (IA Engineer, RAG, LLM, Context Engineering…) | ✅ dans `description` + `keywords` home |
| Pertinence géo Lille / FR-59                       | ✅ balises `geo.*` + `addressLocality: Lille` (JSON-LD) |
| Positionnement AI Engineer cohérent (meta + JSON-LD) | ✅ `jobTitle`, `hasOccupation`, `ProfessionalService` |
| `robots.txt`                                       | ✅ `Allow: /`, `Disallow:` vide, `Sitemap:` déclaré |
| `sitemap.xml`                                      | ✅ contient `/`, **exclut** `/go/**` |

---

## Verdict

- **Bucket A : PASS** sur la config et le rendu — **sauf** les images OG (404).
- **Blocker à lever :** livrer les images `public/og/*` avant de considérer 8.1 comme validée.
- **Bucket B :** non exécutable ici — reste à soumettre par Vincent une fois `seo-v2`
  déployée sur `vincentbattez.dev`.
