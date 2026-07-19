# Images Open Graph (statiques)

Images de partage social servies à la racine du site (`/og/<fichier>`).
Format recommandé : **1200×630 px**, PNG ou JPG.

## Fichiers attendus

| Fichier                     | Page                                   |
| --------------------------- | -------------------------------------- |
| `default.png`               | Défaut (toutes les pages, dont `/`)    |
| `go-cv.png`                 | `/go/cv`                               |
| `go-entretien.png`          | `/go/entretien`                        |
| `go-call.png`               | `/go/call`                            |
| `go-linkedin.png`           | `/go/linkedin`                         |
| `go-github.png`             | `/go/github`                          |
| `go-recommandation.png`     | `/go/recommandation`                   |
| `go-envoyer_message.png`    | `/go/envoyer_message`                  |
| `go-mail.png`               | `/go/mail`                            |

> Le nom de fichier des redirections suit `go-<redirectId>.png` (voir
> `utils/redirect.ts` → `lookupTable.redirectId`). Si un fichier manque, la balise
> `og:image` pointera vers un 404 — l'aperçu social affichera alors l'image par
> défaut du réseau (ou rien).
