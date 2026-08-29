# L'Entretien de recommandation ne persiste nulle part

## Contexte

Le Collègue confie à Ruby des propos nominatifs sur une personne identifiée (son ex-collaborateur), depuis une page publique, en passant par un modèle tiers. La tentation naturelle est de tout conserver : récupérer la Recommandation même si le Collègue ne la colle jamais, relire les Entretiens abandonnés pour améliorer le prompt de Ruby.

Le site est en SSG sans base de données. `@netlify/blobs` aurait suffi, sans infrastructure.

## Décision

**Rien n'est écrit côté serveur.** Pas de base, pas de blob, pas de log d'Entretien. La Netlify Function relaie vers OpenRouter et oublie. La Recommandation et le fil de l'Entretien n'existent que dans l'onglet du Collègue, jusqu'à ce qu'il les copie.

Vincent reçoit une **notification Pushover sans contenu** (« quelqu'un vient de terminer une recommandation »), et des **compteurs PostHog anonymes** (`started`, `step`, `completed`, `copied`, `refined`). Aucun de ces canaux ne transporte les mots du Collègue.

## Considered Options

- **Netlify Blobs, écriture à chaque tour** — écarté : permettrait de lire les Entretiens abandonnés et de corriger la question qui fait fuir, mais conserve les propos d'un tiers sur son employeur sans qu'il l'ait demandé.
- **Notification Pushover contenant la Recommandation** — écarté : filet contre le Collègue qui ne colle rien, mais c'est la même conservation, déplacée sur un téléphone.
- **Aucune persistance** — retenu : rien à sécuriser, rien à purger, rien à déclarer.

## Consequences

- **Une Recommandation non copiée est perdue.** D'où deux garde-fous UI, non négociables : bouton de copie mis en avant à l'arrivée de la Recommandation, et bouton secondaire de copie de l'Entretien en Markdown pour que le Collègue reparte avec la matière s'il préfère rédiger lui-même.
- `recommendation_copied` devient la **vraie métrique de succès** — pas `completed`.
- Le prompt de Ruby ne peut plus être corrigé en relisant des Entretiens réels : seule la courbe d'abandon par `step` reste exploitable.
- Aucune mention d'information n'est affichée au Collègue : il n'y a pas de traitement à annoncer au-delà de l'appel à OpenRouter, le temps de la requête.
